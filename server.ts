import 'dotenv/config';
import http from 'http';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const BOOTSTRAP_ADMIN_EMAIL = 'ranimuthuraj7409@gmail.com';
const AI_MODEL = 'gemini-4-hydrogen';

app.use(express.json({ limit: '1.5mb' }));

interface FirebaseAppletConfig {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId: string;
}

function loadFirebaseConfig(): FirebaseAppletConfig | null {
  try {
    const cfgPath = path.resolve(__dirname, 'firebase-applet-config.json');
    if (!fs.existsSync(cfgPath)) return null;
    const raw = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as Partial<FirebaseAppletConfig>;
    if (!raw.projectId || !raw.apiKey || !raw.firestoreDatabaseId) return null;
    return {
      projectId: raw.projectId,
      apiKey: raw.apiKey,
      firestoreDatabaseId: raw.firestoreDatabaseId,
    };
  } catch {
    return null;
  }
}

const firebaseCfg = loadFirebaseConfig();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -----------------------------------------------------------------------------
// Per-User Sliding-Window Rate Limiter
// -----------------------------------------------------------------------------
const rateBuckets = new Map<string, number[]>();

function checkRateLimit(uid: string, bucket: string, maxRequests: number, windowMs: number): boolean {
  const key = `${uid}:${bucket}`;
  const now = Date.now();
  const timestamps = (rateBuckets.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    rateBuckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  rateBuckets.set(key, timestamps);
  return true;
}

// -----------------------------------------------------------------------------
// Starter-Tier Safe Firebase ID Token + Firestore REST Authorization
// -----------------------------------------------------------------------------
interface VerifiedCaller {
  uid: string;
  email: string;
  idToken: string;
  isAdmin: boolean;
}

interface FirestoreRestDoc {
  name?: string;
  fields?: Record<string, { stringValue?: string; booleanValue?: boolean; integerValue?: string }>;
}

async function fetchFirestoreDocWithToken(docPath: string, idToken: string): Promise<FirestoreRestDoc | null> {
  if (!firebaseCfg) return null;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firebaseCfg.projectId)}/databases/${encodeURIComponent(firebaseCfg.firestoreDatabaseId)}/documents/${docPath}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return null;
    const raw = await resp.text();
    if (!raw.trim()) return null;
    return JSON.parse(raw) as FirestoreRestDoc;
  } catch {
    return null;
  }
}

async function verifyCaller(
  req: Request,
  res: Response,
  options: { courseId?: string; requireAdmin?: boolean } = {},
): Promise<VerifiedCaller | null> {
  if (!firebaseCfg) {
    res.status(503).json({ error: 'Firebase project configuration is unavailable on the server.' });
    return null;
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    res.status(401).json({ error: 'Sign in with a verified RM HEAVEN account to use the AI Tutor.' });
    return null;
  }
  const idToken = match[1].trim();

  // Verify signature, expiry, and claims via Firebase Identity Toolkit REST endpoint
  let lookupResp: globalThis.Response;
  let lookupRaw = '';
  try {
    lookupResp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseCfg.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        signal: AbortSignal.timeout(10000),
      },
    );
    lookupRaw = await lookupResp.text();
  } catch {
    res.status(502).json({ error: 'Unable to reach authentication verification service. Please try again.' });
    return null;
  }

  if (!lookupResp.ok) {
    res.status(401).json({ error: 'Your session token is expired or invalid. Please sign in again.' });
    return null;
  }

  let lookupJson: {
    users?: Array<{ localId?: string; email?: string; emailVerified?: boolean; disabled?: boolean }>;
  };
  try {
    lookupJson = JSON.parse(lookupRaw) as {
      users?: Array<{ localId?: string; email?: string; emailVerified?: boolean; disabled?: boolean }>;
    };
  } catch {
    res.status(502).json({ error: 'Authentication verification service returned an unexpected response.' });
    return null;
  }
  const userRec = lookupJson.users?.[0];
  if (!userRec?.localId || !userRec.email || userRec.disabled) {
    res.status(401).json({ error: 'Unable to verify user identity.' });
    return null;
  }
  if (!userRec.emailVerified) {
    res.status(403).json({ error: 'Please verify your email address before accessing AI Tutor services.' });
    return null;
  }

  const uid = userRec.localId;
  const email = userRec.email;

  let isAdmin = email === BOOTSTRAP_ADMIN_EMAIL;
  if (!isAdmin) {
    const adminDoc = await fetchFirestoreDocWithToken(`admins/${encodeURIComponent(uid)}`, idToken);
    if (adminDoc?.fields?.role?.stringValue === 'admin') {
      isAdmin = true;
    }
  }

  if (options.requireAdmin && !isAdmin) {
    res.status(403).json({ error: 'Administrator privileges are required for this action.' });
    return null;
  }

  if (!isAdmin && options.courseId) {
    const safeCourseId = options.courseId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safeCourseId) {
      res.status(400).json({ error: 'Invalid course identifier.' });
      return null;
    }
    const [userProfileDoc, enrollmentDoc] = await Promise.all([
      fetchFirestoreDocWithToken(`users/${encodeURIComponent(uid)}`, idToken),
      fetchFirestoreDocWithToken(`student_enrollments/${encodeURIComponent(`${uid}_${safeCourseId}`)}`, idToken),
    ]);

    if (userProfileDoc?.fields?.accountStatus?.stringValue === 'suspended') {
      res.status(403).json({ error: 'Your student account is currently suspended.' });
      return null;
    }

    if (enrollmentDoc?.fields?.status?.stringValue !== 'active') {
      res.status(403).json({
        error: 'Access denied. You must be an actively approved student in this course to use the AI Tutor for it.',
      });
      return null;
    }
  }

  return { uid, email, idToken, isAdmin };
}

// Strict outbound URL guard against SSRF / private IP fetching
function isAllowedPdfUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      host === '::1' ||
      host.startsWith('fe80:')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function buildDepartmentConstraint(departmentName?: string, courseTitle?: string): string {
  const combined = `${departmentName || ''} ${courseTitle || ''}`.toLowerCase();
  if (combined.includes('programming') || combined.includes('html') || combined.includes('java') || combined.includes('python')) {
    return 'IMPORTANT CURRICULUM RULE: Programming instruction at RM HEAVEN is strictly limited to HTML, Java, and Python. Never introduce, suggest, or write code examples in JavaScript, PHP, C++, C#, Ruby, Go, Rust, or any other language.';
  }
  if (combined.includes('artificial intelligence') || combined.includes('data science') || combined.includes('data analytics') || combined.includes('machine learning') || combined.includes('prompt')) {
    return 'IMPORTANT CURRICULUM RULE: Explain technical AI and Data concepts in clear, simple language. Whenever code examples help, use strictly Python or Java only.';
  }
  return '';
}

class GeminiApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type GeminiGenerateResponse = Awaited<ReturnType<InstanceType<typeof GoogleGenAI>['models']['generateContent']>>;

const BLOCKED_FINISH_REASONS = new Set([
  'SAFETY',
  'RECITATION',
  'PROHIBITED_CONTENT',
  'BLOCKLIST',
  'SPII',
  'IMAGE_SAFETY',
]);

function stripJsonCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function getFinishReason(response: GeminiGenerateResponse): string {
  return String(response.candidates?.[0]?.finishReason || '');
}

function ensureGeminiTextOrThrow(response: GeminiGenerateResponse, emptyFallback: string): string {
  const finishReason = getFinishReason(response);
  if (BLOCKED_FINISH_REASONS.has(finishReason)) {
    throw new GeminiApiError(
      422,
      'The AI model filtered this output due to content safety policies. Please rephrase your topic focus.',
    );
  }
  const text = (response.text || '').trim();
  if (!text) {
    if (finishReason === 'MAX_TOKENS') {
      throw new GeminiApiError(
        422,
        'The AI response exceeded the output token limit before producing text. Try selecting a shorter sub-topic.',
      );
    }
    throw new GeminiApiError(422, emptyFallback);
  }
  return text;
}

function extractGeminiJsonOrThrow<T>(response: GeminiGenerateResponse, emptyFallback: string): T {
  const finishReason = getFinishReason(response);
  if (BLOCKED_FINISH_REASONS.has(finishReason)) {
    throw new GeminiApiError(
      422,
      'The AI model filtered this output due to content safety policies. Please rephrase your topic focus.',
    );
  }
  const rawText = (response.text || '').trim();
  if (!rawText) {
    if (finishReason === 'MAX_TOKENS') {
      throw new GeminiApiError(
        422,
        'The generated output exceeded the token limit. Please try a shorter sub-topic or Short Revision format.',
      );
    }
    throw new GeminiApiError(422, emptyFallback);
  }
  const cleaned = stripJsonCodeFences(rawText);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    if (finishReason === 'MAX_TOKENS') {
      throw new GeminiApiError(
        422,
        'The generated study note was cut off at the maximum token limit. Try narrowing the sub-topic focus or choosing Short Revision.',
      );
    }
    throw new GeminiApiError(422, 'The AI model returned an invalid structured response. Please try again.');
  }
}

function handleRouteError(res: Response, err: unknown, fallbackMessage: string): void {
  if (res.headersSent) return;
  if (err instanceof GeminiApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  const candidate = err as { status?: number; code?: number; message?: string; name?: string };
  const statusCode =
    typeof candidate?.status === 'number' && candidate.status >= 400 && candidate.status < 600
      ? candidate.status
      : typeof candidate?.code === 'number' && candidate.code >= 400 && candidate.code < 600
        ? candidate.code
        : 500;
  const rawMessage = candidate?.message || (err instanceof Error ? err.message : fallbackMessage);

  if (statusCode === 429 || /rate limit|quota|resource_exhausted/i.test(rawMessage)) {
    res.status(429).json({
      error: 'AI generation quota or rate limit was temporarily reached. Please wait a moment and try again.',
    });
    return;
  }
  if (statusCode === 401 || statusCode === 403 || /api key|permission_denied|unauthenticated/i.test(rawMessage)) {
    res.status(502).json({
      error: 'AI service authentication failed on the server. Please verify the Gemini API key configuration.',
    });
    return;
  }
  if (statusCode === 408 || statusCode === 504 || candidate?.name === 'AbortError' || /timeout|timed out/i.test(rawMessage)) {
    res.status(504).json({
      error: 'The AI request timed out while generating content. Please try again with a more focused topic.',
    });
    return;
  }
  if (rawMessage.trim().startsWith('<') || /unexpected token/i.test(rawMessage)) {
    res.status(502).json({ error: fallbackMessage });
    return;
  }

  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    error: rawMessage || fallbackMessage,
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'rm-heaven' });
});

// -----------------------------------------------------------------------------
// Legacy Study Companion Route (Now Token-Protected)
// -----------------------------------------------------------------------------
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const caller = await verifyCaller(req, res);
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'chat', 30, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Too many tutor requests in a short window. Please pause briefly and try again.' });
      return;
    }

    const { message, courseContext, history } = req.body as {
      message?: string;
      courseContext?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Please provide a question or topic.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'The RM HEAVEN AI Tutor is currently unavailable because GEMINI_API_KEY is not configured in environment secrets.',
      });
      return;
    }

    const systemInstruction = [
      'You are the RM HEAVEN AI Tutor inside the Student Dashboard.',
      'Your tone is refined, scholarly, encouraging, clear, and pedagogically rigorous.',
      'Help students understand course concepts, structure assignment outlines honestly without completing graded assessments dishonestly, and prepare for internships.',
      'Never fabricate RM HEAVEN policies, prices, grades, enrollment approvals, or facts missing from course materials.',
      courseContext ? `Current study context: ${courseContext.slice(0, 1200)}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-10).map((item) => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(item.text).slice(0, 2000) }],
          }))
        : []),
      {
        role: 'user',
        parts: [{ text: message.trim().slice(0, 2500) }],
      },
    ];

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents,
      config: { systemInstruction, maxOutputTokens: 4096 },
    });

    const reply = ensureGeminiTextOrThrow(
      response,
      'I could not generate a response for that prompt. Please rephrase your question.',
    );

    res.json({ reply });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Unable to reach AI Tutor.');
  }
});

// -----------------------------------------------------------------------------
// RM HEAVEN AI Tutor: Contextual Multi-Mode & Multilingual Chat
// -----------------------------------------------------------------------------
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const {
      courseId,
      courseTitle,
      departmentName,
      lessonTitle,
      lessonSummary,
      lessonBody,
      studyNoteText,
      mode,
      language,
      message,
      history,
    } = req.body as {
      courseId?: string;
      courseTitle?: string;
      departmentName?: string;
      lessonTitle?: string;
      lessonSummary?: string;
      lessonBody?: string;
      studyNoteText?: string;
      mode?: string;
      language?: string;
      message?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
    };

    if (!courseId || !message?.trim()) {
      res.status(400).json({ error: 'Course context and message are required.' });
      return;
    }

    const caller = await verifyCaller(req, res, { courseId });
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'chat', 30, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Rate limit reached (30 requests per 10 minutes). Please review your notes briefly before continuing.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'RM HEAVEN AI Tutor requires GEMINI_API_KEY in server environment secrets.' });
      return;
    }

    const targetLanguage = (language || 'English').trim().slice(0, 60);
    const activeMode = (mode || 'Simple Explanation').trim().slice(0, 60);

    const modeGuidance: Record<string, string> = {
      'Simple Explanation': 'Explain in warm, crystal-clear everyday analogies and beginner-friendly language.',
      'Detailed Explanation': 'Provide a thorough, well-structured explanation with headings, mechanisms, edge cases, and practical takeaways.',
      'Short Notes': 'Provide concise bullet-point notes highlighting definitions, formulas/rules, and fast takeaways.',
      'Detailed Notes': 'Provide comprehensive multi-section educational study notes (Introduction, Key Concepts, Step-by-Step, Examples, Common Mistakes, Summary).',
      'Step-by-Step Learning': 'Teach strictly sequentially Step 1 -> Step 2 -> Step 3, verifying understanding calmly at each stage.',
      'Real-World Examples': 'Focus heavily on industry applications, realistic scenarios, and hands-on examples.',
      'Important Questions': 'Provide high-value short-answer and long-answer exam/interview questions paired with model outlines.',
      'MCQ Generator': 'Create 4 thoughtful multiple-choice questions with options A-D, clear answers, and brief rationale at the bottom.',
      'Practice Test': 'Pose a challenge question without revealing the answer right away; guide the student with a hint if they try.',
      'Quick Revision': 'Deliver a rapid high-yield 60-second cheat sheet summarizing critical facts and pitfalls to avoid.',
      'Translate Notes': `Translate and naturally adapt the explanation and technical meaning clearly into ${targetLanguage}, keeping key technical terms clear.`,
      'Doubt Clarification': 'Address the exact confusion directly, pinpoint common misconceptions, and resolve them step-by-step.',
    };

    const deptRule = buildDepartmentConstraint(departmentName, courseTitle);

    const systemInstruction = [
      'You are the official RM HEAVEN AI Tutor serving verified enrolled learners.',
      `Active Teaching Mode: ${activeMode}. ${modeGuidance[activeMode] || ''}`,
      `Response Language: Write your full response clearly in ${targetLanguage}.`,
      deptRule,
      'HONESTY & ACCURACY RULE: Base explanations on the provided course, lesson, and official study note material alongside established domain fundamentals. Never claim to have read study notes, PDFs, or chapters that are absent from your active prompt context. If the student asks about specific RM HEAVEN administrative dates, fees, private grading decisions, or study note details missing from the provided context, state honestly what is and is not included rather than guessing or fabricating facts.',
      'Clean formatting: use Markdown headings (###), crisp bullet points, numbered steps, and properly fenced code blocks (only when appropriate to HTML/Java/Python). Never fabricate external citations.',
      `Course: ${(courseTitle || courseId).slice(0, 160)}${departmentName ? ` (${departmentName})` : ''}`,
      lessonTitle ? `Current Lesson: ${lessonTitle.slice(0, 160)}` : '',
      lessonSummary ? `Lesson Summary: ${lessonSummary.slice(0, 400)}` : '',
      lessonBody ? `Lesson Content Context:\n${lessonBody.slice(0, 4000)}` : '',
      studyNoteText ? `Official Study Note Context:\n${studyNoteText.slice(0, 12000)}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-10).map((item) => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(item.text).slice(0, 2200) }],
          }))
        : []),
      {
        role: 'user',
        parts: [{ text: message.trim().slice(0, 3000) }],
      },
    ];

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents,
      config: { systemInstruction, maxOutputTokens: 4096 },
    });

    const reply = ensureGeminiTextOrThrow(
      response,
      'No response was generated for this topic. Please try rephrasing your question.',
    );

    res.json({
      reply,
      mode: activeMode,
      language: targetLanguage,
    });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Unable to generate AI Tutor reply.');
  }
});

// -----------------------------------------------------------------------------
// RM HEAVEN AI Tutor: Personal Study Note Generator
// -----------------------------------------------------------------------------
app.post('/api/tutor/generate-notes', async (req, res) => {
  try {
    const {
      courseId,
      courseTitle,
      departmentName,
      lessonTitle,
      lessonContent,
      noteStyle,
      language,
      customTopic,
    } = req.body as {
      courseId?: string;
      courseTitle?: string;
      departmentName?: string;
      lessonTitle?: string;
      lessonContent?: string;
      noteStyle?: 'simple' | 'detailed' | 'short_revision' | 'step_by_step' | 'practice_questions' | 'translation';
      language?: string;
      customTopic?: string;
    };

    if (!courseId) {
      res.status(400).json({ error: 'courseId is required.' });
      return;
    }

    const caller = await verifyCaller(req, res, { courseId });
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'generate', 15, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Generation rate limit reached (15 per 10 minutes). Please wait a few minutes.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured in server secrets.' });
      return;
    }

    const style = noteStyle || 'simple';
    const lang = (language || 'English').trim().slice(0, 60);
    const deptRule = buildDepartmentConstraint(departmentName, courseTitle);

    const styleMap: Record<string, string> = {
      simple: 'Create beginner-friendly personal study notes using everyday analogies, clear headings, and plain terminology.',
      detailed: 'Create comprehensive personal study notes covering Concept Overview, Deep Breakdown, Key Takeaways, Worked Examples, Pitfalls, and Summary.',
      short_revision: 'Create a tight high-yield 1-page Revision Sheet using bullet lists, key rules, and fast memory hooks.',
      step_by_step: 'Create a sequential Step-by-Step Study Guide (Step 1, Step 2, Step 3...) showing how to apply the topic cleanly.',
      practice_questions: 'Create a Personal Self-Check Question Pack (5 Short Answer, 2 Applied Scenarios, 4 MCQs with Answer Key at the very bottom).',
      translation: `Translate and clearly adapt the full lesson concepts into ${lang}, keeping critical domain terms recognizable alongside clear explanations.`,
    };

    const prompt = [
      `Course: ${courseTitle || courseId}`,
      lessonTitle ? `Lesson: ${lessonTitle}` : '',
      customTopic ? `Focus Request: ${customTopic.slice(0, 600)}` : '',
      lessonContent ? `Reference Lesson & Official Study Note Material:\n${lessonContent.slice(0, 12000)}` : '',
      `Task: ${styleMap[style] || styleMap.simple}`,
      `Write the entire output cleanly formatted in Markdown in ${lang}.`,
      deptRule,
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You generate personalized AI study notes for RM HEAVEN students. Return valid JSON matching the schema, with Markdown-formatted study note body inside the content field. Never fabricate external grades or policies.',
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ['title', 'content'],
        },
      },
    });

    const parsed = extractGeminiJsonOrThrow<{ title?: string; content?: string }>(
      response,
      'The AI model returned an empty study note.',
    );
    const content = (parsed.content || '').trim();
    if (!content) {
      throw new GeminiApiError(422, 'The AI model returned an empty study note body. Please try again.');
    }

    const styleLabelMap: Record<string, string> = {
      simple: 'Simple Notes',
      detailed: 'Detailed Notes',
      short_revision: 'Quick Revision Sheet',
      step_by_step: 'Step-by-Step Guide',
      practice_questions: 'Practice Q&A Pack',
      translation: `${lang} Translated Notes`,
    };

    res.json({
      title: parsed.title?.trim() || `${lessonTitle || courseTitle || 'Course'} — ${styleLabelMap[style] || 'AI Study Note'}`,
      content,
      noteMode: style,
      language: lang,
      isAiGenerated: true,
    });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Failed to generate personal study notes.');
  }
});

// -----------------------------------------------------------------------------
// RM HEAVEN AI Tutor: Interactive Practice Test Generator (No Spoiled Answers)
// -----------------------------------------------------------------------------
app.post('/api/tutor/practice-quiz', async (req, res) => {
  try {
    const { courseId, courseTitle, departmentName, lessonTitle, lessonContent, difficulty, language, questionCount } = req.body as {
      courseId?: string;
      courseTitle?: string;
      departmentName?: string;
      lessonTitle?: string;
      lessonContent?: string;
      difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
      language?: string;
      questionCount?: number;
    };

    if (!courseId) {
      res.status(400).json({ error: 'courseId is required.' });
      return;
    }

    const caller = await verifyCaller(req, res, { courseId });
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'generate', 15, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Quiz generation limit reached (15 per 10 minutes). Try taking your current quiz or waiting briefly.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured in server secrets.' });
      return;
    }

    const safeCount = Math.max(3, Math.min(8, Math.round(questionCount || 5)));
    const lang = (language || 'English').trim().slice(0, 60);
    const deptRule = buildDepartmentConstraint(departmentName, courseTitle);

    const prompt = [
      `Generate ${safeCount} high-quality multiple-choice practice questions at ${difficulty || 'Intermediate'} difficulty in ${lang}.`,
      `Course: ${courseTitle || courseId}`,
      lessonTitle ? `Lesson Focus: ${lessonTitle}` : '',
      lessonContent ? `Reference Curriculum & Official Study Note:\n${lessonContent.slice(0, 12000)}` : '',
      deptRule,
      'Include a short helpful hint (which guides thinking WITHOUT giving away the answer letter) and a thorough post-submit explanation plus topicTag.',
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 4096,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              hint: { type: Type.STRING },
              explanation: { type: Type.STRING },
              topicTag: { type: Type.STRING },
            },
            required: ['questionText', 'options', 'correctIndex', 'hint', 'explanation', 'topicTag'],
          },
        },
      },
    });

    const parsed = extractGeminiJsonOrThrow<
      Array<{
        questionText: string;
        options: string[];
        correctIndex: number;
        hint: string;
        explanation: string;
        topicTag: string;
      }>
    >(response, 'Could not generate practice questions from the AI model.');

    if (!Array.isArray(parsed)) {
      throw new GeminiApiError(422, 'Practice quiz response did not match expected question list format.');
    }

    const normalized = parsed
      .filter((q) => q.questionText && Array.isArray(q.options) && q.options.length >= 2)
      .slice(0, safeCount)
      .map((q, idx) => ({
        id: `ai-q-${idx + 1}`,
        questionText: q.questionText,
        options: q.options.slice(0, 4),
        correctIndex: Math.max(0, Math.min(q.options.slice(0, 4).length - 1, q.correctIndex)),
        hint: q.hint,
        explanation: q.explanation,
        topicTag: q.topicTag || 'Core Concept',
      }));

    if (normalized.length === 0) {
      throw new GeminiApiError(422, 'No valid practice questions could be generated for this topic. Please try again.');
    }

    res.json({ questions: normalized });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Unable to create practice test.');
  }
});

// -----------------------------------------------------------------------------
// RM HEAVEN AI Tutor: Explain Authorized Course PDF / Document
// -----------------------------------------------------------------------------
app.post('/api/tutor/explain-pdf', async (req, res) => {
  try {
    const { courseId, materialId, action, language, sectionHint } = req.body as {
      courseId?: string;
      materialId?: string;
      action?: 'full_explanation' | 'section_focus' | 'summarize' | 'translate' | 'vocabulary' | 'practice_questions';
      language?: string;
      sectionHint?: string;
    };

    if (!courseId || !materialId) {
      res.status(400).json({ error: 'courseId and materialId are required.' });
      return;
    }

    const caller = await verifyCaller(req, res, { courseId });
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'chat', 30, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Rate limit reached (30 requests per 10 minutes). Please try again shortly.' });
      return;
    }

    const safeMatId = materialId.replace(/[^a-zA-Z0-9_-]/g, '');
    const matDoc = await fetchFirestoreDocWithToken(
      `courses/${encodeURIComponent(courseId)}/materials/${encodeURIComponent(safeMatId)}`,
      caller.idToken,
    );

    if (!matDoc?.fields) {
      res.status(404).json({ error: 'Document not found or you are not authorized to access this course resource.' });
      return;
    }

    const status = matDoc.fields.status?.stringValue;
    if (!caller.isAdmin && status !== 'active') {
      res.status(403).json({ error: 'This learning material is not currently published for student access.' });
      return;
    }

    const fileUrl = matDoc.fields.fileUrl?.stringValue || '';
    const matTitle = matDoc.fields.title?.stringValue || 'Course Document';
    const matDesc = matDoc.fields.description?.stringValue || '';
    const fileName = matDoc.fields.fileName?.stringValue || 'document.pdf';

    if (!isAllowedPdfUrl(fileUrl)) {
      res.status(400).json({ error: 'Only secure HTTPS document URLs can be analyzed by the AI Tutor.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured in server secrets.' });
      return;
    }

    const lang = (language || 'English').trim().slice(0, 60);
    const chosenAction = action || 'full_explanation';
    const taskInstructions: Record<string, string> = {
      full_explanation: `Explain this entire course document clearly step-by-step in ${lang}, organizing concepts from simple overview to detailed takeaways.`,
      section_focus: `Focus specifically on explaining this topic/section inside the document: "${(sectionHint || 'Key Sections').slice(0, 300)}". If that exact section does not appear in the document, state so honestly.`,
      summarize: `Provide a concise, well-organized executive summary and high-yield bullet takeaways of this document in ${lang}.`,
      translate: `Translate and clearly explain the main ideas and technical meanings of this document into ${lang}.`,
      vocabulary: `Extract and define the important technical terms, definitions, and concepts introduced in this document in ${lang}.`,
      practice_questions: `Create 5 important practice questions (with an Answer Key at the bottom) grounded strictly in this document, written in ${lang}.`,
    };

    const fileResp = await fetch(fileUrl, { signal: AbortSignal.timeout(15000) });
    if (!fileResp.ok) {
      res.status(422).json({
        error: `Could not download document bytes (HTTP ${fileResp.status}). Verify the PDF link allows direct access.`,
      });
      return;
    }

    const contentLength = Number(fileResp.headers.get('content-length') || '0');
    if (contentLength > 12 * 1024 * 1024) {
      res.status(413).json({ error: 'Document exceeds the 12 MB AI Tutor reading limit. Ask about a specific pasted excerpt instead.' });
      return;
    }

    const contentType = (fileResp.headers.get('content-type') || '').toLowerCase();
    const arrayBuffer = await fileResp.arrayBuffer();
    if (arrayBuffer.byteLength > 12 * 1024 * 1024) {
      res.status(413).json({ error: 'Document exceeds the 12 MB AI Tutor reading limit.' });
      return;
    }

    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    if (contentType.includes('application/pdf') || fileName.toLowerCase().endsWith('.pdf')) {
      const b64 = Buffer.from(arrayBuffer).toString('base64');
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: b64,
        },
      });
    } else if (contentType.includes('text/') || fileName.toLowerCase().endsWith('.txt') || fileName.toLowerCase().endsWith('.md')) {
      const textBody = Buffer.from(arrayBuffer).toString('utf-8').slice(0, 45000);
      parts.push({ text: `Document Content (${fileName}):\n${textBody}` });
    } else {
      res.status(422).json({
        error: `The linked URL (${contentType || 'web page'}) does not return direct PDF or text document bytes. Upload a PDF to Firebase Storage or link a direct .pdf file.`,
      });
      return;
    }

    parts.push({
      text: [
        `Document Title: ${matTitle}`,
        matDesc ? `Admin Description: ${matDesc}` : '',
        taskInstructions[chosenAction] || taskInstructions.full_explanation,
        'Strict Integrity Rule: Ground every claim strictly in the attached document. If asked for something absent from the document, state clearly that the document does not mention it.',
      ]
        .filter(Boolean)
        .join('\n\n'),
    });

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: 'You are the RM HEAVEN Document Study Tutor reading an authorized curriculum file for an enrolled student.',
        maxOutputTokens: 4096,
      },
    });

    const explanation = ensureGeminiTextOrThrow(
      response,
      'Unable to extract an explanation from this document.',
    );

    res.json({
      explanation,
      materialTitle: matTitle,
      action: chosenAction,
      language: lang,
    });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Unable to analyze course PDF.');
  }
});

// -----------------------------------------------------------------------------
// RM HEAVEN Admin Helper: Draft Structured 11-Section Study Note JSON
// -----------------------------------------------------------------------------
async function handleAdminGenerateNotes(req: Request, res: Response) {
  try {
    const caller = await verifyCaller(req, res, { requireAdmin: true });
    if (!caller) return;

    if (!checkRateLimit(caller.uid, 'admin-generate', 20, 10 * 60 * 1000)) {
      res.status(429).json({ error: 'Admin note generation rate limit reached (20 per 10 minutes). Please wait briefly.' });
      return;
    }

    const { courseTitle, departmentName, lessonTitle, lessonSummary, lessonContent, noteStyle, language, customTopic } =
      req.body as {
        courseTitle?: string;
        departmentName?: string;
        lessonTitle?: string;
        lessonSummary?: string;
        lessonContent?: string;
        noteStyle?: string;
        language?: string;
        customTopic?: string;
      };

    if (!courseTitle || !lessonTitle) {
      res.status(400).json({ error: 'courseTitle and lessonTitle are required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured in server secrets.' });
      return;
    }

    const lang = (language || 'English').trim().slice(0, 60);
    const deptRule = buildDepartmentConstraint(departmentName, courseTitle);
    const prompt = [
      `Draft a thorough 11-section RM HEAVEN Study Note JSON in ${lang} for Admin editorial review (this will be reviewed by an instructor before publishing).`,
      `Department: ${departmentName || 'General'}`,
      `Course: ${courseTitle}`,
      `Lesson Title: ${lessonTitle}`,
      noteStyle ? `Requested Note Style: ${noteStyle.slice(0, 60)}` : '',
      customTopic ? `Specific Sub-Topic Focus: ${customTopic.slice(0, 500)}` : '',
      lessonSummary ? `Summary: ${lessonSummary}` : '',
      lessonContent ? `Lesson Content:\n${lessonContent.slice(0, 4000)}` : '',
      deptRule,
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You draft structured 11-section official RM HEAVEN study notes as valid JSON matching the schema. Write clear, accurate educational material.',
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topicIntroduction: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            detailedExplanation: { type: Type.STRING },
            keyConcepts: { type: Type.STRING },
            stepByStepExplanation: { type: Type.STRING },
            practicalExamples: { type: Type.STRING },
            realWorldApplications: { type: Type.STRING },
            importantPoints: { type: Type.STRING },
            commonMistakes: { type: Type.STRING },
            summary: { type: Type.STRING },
            practiceQuestions: { type: Type.STRING },
            domainSupplement: { type: Type.STRING },
          },
          required: [
            'title',
            'topicIntroduction',
            'simpleExplanation',
            'detailedExplanation',
            'keyConcepts',
            'stepByStepExplanation',
            'practicalExamples',
            'realWorldApplications',
            'importantPoints',
            'commonMistakes',
            'summary',
            'practiceQuestions',
          ],
        },
      },
    });

    const draft = extractGeminiJsonOrThrow<Record<string, string>>(
      response,
      'The AI model returned an empty study note draft.',
    );
    if (!draft || typeof draft !== 'object' || Object.keys(draft).length === 0) {
      throw new GeminiApiError(422, 'The AI model returned an empty study note draft. Please try again.');
    }

    res.json({ draft, isAiGenerated: true });
  } catch (err: unknown) {
    handleRouteError(res, err, 'Unable to generate study note draft.');
  }
}

app.post('/api/ai/admin/generate-notes', handleAdminGenerateNotes);
app.post('/api/tutor/admin-draft-note', handleAdminGenerateNotes);

// Ensure unmatched /api/* routes and Express body/middleware errors always return JSON
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Requested API endpoint was not found.' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (req.path.startsWith('/api')) {
    const bodyErr = err as { status?: number; type?: string; message?: string };
    if (bodyErr?.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Invalid JSON request body.' });
      return;
    }
    if (bodyErr?.type === 'entity.too.large') {
      res.status(413).json({ error: 'Request payload is too large.' });
      return;
    }
    const status =
      typeof bodyErr?.status === 'number' && bodyErr.status >= 400 && bodyErr.status < 600
        ? bodyErr.status
        : 500;
    res.status(status).json({
      error: err instanceof Error ? err.message : 'Unexpected server error.',
    });
    return;
  }
  next(err);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`RM HEAVEN server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
