import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookmarkPlus,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Globe,
  HelpCircle,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { auth } from '../firebase/config';
import { fetchApiJson } from '../utils/apiClient';
import { RmHeavenWordmark } from './BrandAssets';
import {
  clearAiTutorSession,
  loadAiTutorSession,
  saveAiTutorSession,
  savePersonalAiNote,
  submitQuizAttempt,
} from '../firebase/services';
import type {
  AiTutorMessage,
  AiTutorMode,
  Course,
  CourseLesson,
  LearningMaterial,
  SavedAiNoteMode,
  StudyNote,
} from '../types';
import { RichContentRenderer } from './RichContentRenderer';

export const AI_TUTOR_MODES: AiTutorMode[] = [
  'Simple Explanation',
  'Detailed Explanation',
  'Short Notes',
  'Detailed Notes',
  'Step-by-Step Learning',
  'Real-World Examples',
  'Important Questions',
  'MCQ Generator',
  'Practice Test',
  'Quick Revision',
  'Translate Notes',
  'Doubt Clarification',
];

const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Malayalam', 'Telugu', 'Other'] as const;

type TutorTab = 'chat' | 'notes' | 'pdf' | 'practice';

interface PracticeQuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  topicTag: string;
}

interface RmHeavenAiTutorProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: Course;
  lessons: CourseLesson[];
  activeLesson: CourseLesson | null;
  studyNotes: StudyNote[];
  materials: LearningMaterial[];
  preselectedMaterialId?: string | null;
  preselectedNoteId?: string | null;
  initialPrompt?: string | null;
  onNoteSaved?: () => void;
  onQuizAttemptSaved?: () => void;
}

export function RmHeavenAiTutor({
  studentId,
  studentName,
  studentEmail,
  course,
  lessons,
  activeLesson,
  studyNotes,
  materials,
  preselectedMaterialId,
  preselectedNoteId,
  initialPrompt,
  onNoteSaved,
  onQuizAttemptSaved,
}: RmHeavenAiTutorProps) {
  const [activeTab, setActiveTab] = useState<TutorTab>(preselectedMaterialId ? 'pdf' : 'chat');
  const [mode, setMode] = useState<AiTutorMode>('Simple Explanation');
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [customLanguage, setCustomLanguage] = useState<string>('');
  const [contextLessonId, setContextLessonId] = useState<string>(activeLesson?.id || 'all');
  const [contextNoteId, setContextNoteId] = useState<string>(
    preselectedNoteId ||
      studyNotes.find((n) => (activeLesson ? n.lessonId === activeLesson.id : false))?.id ||
      studyNotes[0]?.id ||
      'none',
  );

  // Chat state
  const [messages, setMessages] = useState<AiTutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  // Personal Note Generator state
  const [noteStyle, setNoteStyle] = useState<Exclude<SavedAiNoteMode, 'tutor_saved'>>('simple');
  const [noteFocus, setNoteFocus] = useState('');
  const [generatedNote, setGeneratedNote] = useState<{ title: string; content: string; noteMode: SavedAiNoteMode; language: string } | null>(null);
  const [generatingNote, setGeneratingNote] = useState(false);
  const [noteSavedSuccess, setNoteSavedSuccess] = useState(false);

  // PDF Explain state
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(preselectedMaterialId || materials[0]?.id || '');
  const [pdfAction, setPdfAction] = useState<'full_explanation' | 'section_focus' | 'summarize' | 'translate' | 'vocabulary' | 'practice_questions'>('full_explanation');
  const [pdfSectionHint, setPdfSectionHint] = useState('');
  const [pdfExplanation, setPdfExplanation] = useState<{ materialTitle: string; content: string; language: string } | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSavedSuccess, setPdfSavedSuccess] = useState(false);

  // Interactive Practice Test state (no spoiled answers!)
  const [quizDifficulty, setQuizDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [quizCount, setQuizCount] = useState<number>(5);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestionItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizWeakTopics, setQuizWeakTopics] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState<{ pct: number; correct: number; total: number } | null>(null);

  const effectiveLanguage = selectedLang === 'Other' ? customLanguage.trim() || 'English' : selectedLang;

  useEffect(() => {
    if (activeLesson?.id) {
      setContextLessonId(activeLesson.id);
      if (!preselectedNoteId) {
        const linked = studyNotes.find((n) => n.lessonId === activeLesson.id);
        if (linked) setContextNoteId(linked.id);
      }
    }
  }, [activeLesson?.id, preselectedNoteId, studyNotes]);

  useEffect(() => {
    if (preselectedNoteId && studyNotes.some((n) => n.id === preselectedNoteId)) {
      setContextNoteId(preselectedNoteId);
      setActiveTab('chat');
    } else if ((contextNoteId === 'none' || !studyNotes.some((n) => n.id === contextNoteId)) && studyNotes.length > 0) {
      setContextNoteId(studyNotes[0].id);
    }
  }, [preselectedNoteId, studyNotes, contextNoteId]);

  useEffect(() => {
    if (preselectedMaterialId) {
      setSelectedMaterialId(preselectedMaterialId);
      setActiveTab('pdf');
    } else if (!selectedMaterialId && materials.length > 0) {
      setSelectedMaterialId(materials[0].id);
    }
  }, [preselectedMaterialId, materials, selectedMaterialId]);

  useEffect(() => {
    if (initialPrompt) {
      setActiveTab('chat');
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  // Load persisted session from Firestore when course changes
  useEffect(() => {
    let active = true;
    setSessionLoading(true);
    loadAiTutorSession(studentId, course.id)
      .then((session) => {
        if (!active) return;
        if (session) {
          try {
            const parsed = JSON.parse(session.messagesJson) as AiTutorMessage[];
            if (Array.isArray(parsed)) setMessages(parsed);
          } catch {
            setMessages([]);
          }
          if (session.language) {
            if ((LANGUAGES as readonly string[]).includes(session.language)) {
              setSelectedLang(session.language);
            } else {
              setSelectedLang('Other');
              setCustomLanguage(session.language);
            }
          }
          if (session.mode && (AI_TUTOR_MODES as string[]).includes(session.mode)) {
            setMode(session.mode as AiTutorMode);
          }
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        if (active) setMessages([]);
      })
      .finally(() => {
        if (active) setSessionLoading(false);
      });
    return () => {
      active = false;
    };
  }, [studentId, course.id]);

  const selectedLessonObj = useMemo(
    () => lessons.find((l) => l.id === contextLessonId) || null,
    [lessons, contextLessonId],
  );

  const selectedStudyNoteObj = useMemo(
    () => (contextNoteId === 'none' ? null : studyNotes.find((n) => n.id === contextNoteId) || null),
    [studyNotes, contextNoteId],
  );

  const selectedStudyNoteSummary = useMemo(() => {
    const noteCatalog =
      studyNotes.length > 0
        ? `Available Course Study Notes (${studyNotes.length}): ${studyNotes.map((n, i) => `Note ${i + 1}: ${n.title}`).join(' | ')}`
        : 'No published official study notes in this course.';
    if (!selectedStudyNoteObj) return noteCatalog;
    return [
      noteCatalog,
      `ACTIVE SELECTED STUDY NOTE: ${selectedStudyNoteObj.title}`,
      `Introduction & Objectives:\n${selectedStudyNoteObj.topicIntroduction}`,
      `Simple Explanation:\n${selectedStudyNoteObj.simpleExplanation}`,
      `Detailed Explanation:\n${selectedStudyNoteObj.detailedExplanation}`,
      `Definitions & Key Concepts:\n${selectedStudyNoteObj.keyConcepts}`,
      `Step-by-Step Guide:\n${selectedStudyNoteObj.stepByStepExplanation}`,
      `Practical Examples:\n${selectedStudyNoteObj.practicalExamples}`,
      `Real-World Applications:\n${selectedStudyNoteObj.realWorldApplications}`,
      `Important Points:\n${selectedStudyNoteObj.importantPoints}`,
      `Common Mistakes:\n${selectedStudyNoteObj.commonMistakes}`,
      `Summary & Revision:\n${selectedStudyNoteObj.summary}`,
    ]
      .join('\n\n')
      .slice(0, 11800);
  }, [studyNotes, selectedStudyNoteObj]);

  const starterPrompts = useMemo(() => {
    const topic = selectedStudyNoteObj?.title || selectedLessonObj?.title || course.title;
    return [
      `Explain "${topic}" simply with an everyday analogy`,
      `Give me a step-by-step walkthrough of "${topic}"`,
      `What are the most common mistakes covered in "${topic}"?`,
      `Quiz me with 5 knowledge-check questions on "${topic}"`,
    ];
  }, [selectedStudyNoteObj, selectedLessonObj, course.title]);

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error('Please ensure you are signed in with a verified account.');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  const persistMessages = async (nextMessages: AiTutorMessage[], activeMode = mode, lang = effectiveLanguage) => {
    try {
      await saveAiTutorSession({
        studentId,
        courseId: course.id,
        lessonId: selectedLessonObj?.id,
        language: lang,
        mode: activeMode,
        messages: nextMessages,
      });
    } catch {
      // Non-fatal persistence error; chat remains visible in UI
    }
  };

  const handleSendChat = async (overrideText?: string, overrideMode?: AiTutorMode) => {
    const text = (overrideText ?? input).trim();
    if (!text || chatLoading) return;
    const activeMode = overrideMode ?? mode;

    setErrorMsg(null);
    const userMsg: AiTutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      mode: activeMode,
      language: effectiveLanguage,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!overrideText) setInput('');
    setChatLoading(true);

    try {
      const headers = await getAuthHeaders();
      const data = await fetchApiJson<{ reply?: string; error?: string }>('/api/tutor/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          departmentName: course.departmentName || course.category,
          lessonTitle: selectedLessonObj?.title,
          lessonSummary: selectedLessonObj?.summary,
          lessonBody: selectedLessonObj
            ? `${selectedLessonObj.contentBody}\n\nExamples:\n${selectedLessonObj.examples || ''}`
            : course.fullDescription,
          studyNoteText: selectedStudyNoteSummary,
          mode: activeMode,
          language: effectiveLanguage,
          message: text,
          history: updatedHistory.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      if (!data.reply) {
        throw new Error(data.error || 'Unable to receive reply from RM HEAVEN AI Tutor.');
      }

      const modelMsg: AiTutorMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        mode: activeMode,
        language: effectiveLanguage,
        createdAt: new Date().toISOString(),
      };
      const finalMsgs = [...updatedHistory, modelMsg];
      setMessages(finalMsgs);
      await persistMessages(finalMsgs, activeMode, effectiveLanguage);
      setTimeout(() => scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to reach AI Tutor.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleRegenerateLast = async () => {
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1 || chatLoading) return;
    const realIdx = messages.length - 1 - lastUserIdx;
    const lastUserMsg = messages[realIdx];
    const trimmed = messages.slice(0, realIdx);
    setMessages(trimmed);
    await handleSendChat(lastUserMsg.text, lastUserMsg.mode || mode);
  };

  const handleClearChat = async () => {
    setMessages([]);
    setErrorMsg(null);
    try {
      await clearAiTutorSession(studentId, course.id);
    } catch {
      // ignore
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveReplyToNotes = async (msg: AiTutorMessage) => {
    if (savingId) return;
    setSavingId(msg.id);
    try {
      await savePersonalAiNote({
        studentId,
        courseId: course.id,
        courseTitle: course.title,
        lessonId: selectedLessonObj?.id,
        lessonTitle: selectedLessonObj?.title,
        noteMode: 'tutor_saved',
        language: msg.language || effectiveLanguage,
        title: `${selectedLessonObj?.title || course.title} (${msg.mode || 'AI Tutor Note'})`,
        content: msg.text,
      });
      setSavedIds((prev) => ({ ...prev, [msg.id]: true }));
      onNoteSaved?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save personal AI note.');
    } finally {
      setSavingId(null);
    }
  };

  const handleGeneratePersonalNote = async () => {
    if (generatingNote) return;
    setGeneratingNote(true);
    setErrorMsg(null);
    setNoteSavedSuccess(false);
    try {
      const headers = await getAuthHeaders();
      const data = await fetchApiJson<{
        title?: string;
        content?: string;
        noteMode?: SavedAiNoteMode;
        language?: string;
        error?: string;
      }>('/api/tutor/generate-notes', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          departmentName: course.departmentName || course.category,
          lessonTitle: selectedLessonObj?.title,
          lessonContent: selectedLessonObj
            ? `${selectedLessonObj.contentBody}\n\n${selectedStudyNoteSummary}`
            : `${course.fullDescription}\n\n${selectedStudyNoteSummary}`,
          noteStyle,
          language: effectiveLanguage,
          customTopic: noteFocus,
        }),
      });
      if (!data.content) {
        throw new Error(data.error || 'Failed to generate personal study note.');
      }
      setGeneratedNote({
        title: data.title || `${course.title} Study Note`,
        content: data.content,
        noteMode: data.noteMode || noteStyle,
        language: data.language || effectiveLanguage,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to generate study note.');
    } finally {
      setGeneratingNote(false);
    }
  };

  const handleSaveGeneratedNote = async () => {
    if (!generatedNote) return;
    try {
      await savePersonalAiNote({
        studentId,
        courseId: course.id,
        courseTitle: course.title,
        lessonId: selectedLessonObj?.id,
        lessonTitle: selectedLessonObj?.title,
        noteMode: generatedNote.noteMode,
        language: generatedNote.language,
        title: generatedNote.title,
        content: generatedNote.content,
      });
      setNoteSavedSuccess(true);
      onNoteSaved?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save generated note.');
    }
  };

  const handleExplainPdf = async () => {
    if (!selectedMaterialId || pdfLoading) return;
    setPdfLoading(true);
    setErrorMsg(null);
    setPdfSavedSuccess(false);
    try {
      const headers = await getAuthHeaders();
      const data = await fetchApiJson<{ explanation?: string; materialTitle?: string; language?: string; error?: string }>(
        '/api/tutor/explain-pdf',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            courseId: course.id,
            materialId: selectedMaterialId,
            action: pdfAction,
            language: effectiveLanguage,
            sectionHint: pdfSectionHint,
          }),
        },
      );
      if (!data.explanation) {
        throw new Error(data.error || 'Unable to explain document.');
      }
      setPdfExplanation({
        materialTitle: data.materialTitle || 'Course Document',
        content: data.explanation,
        language: data.language || effectiveLanguage,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not analyze course PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleStartPracticeTest = async () => {
    if (quizLoading) return;
    setQuizLoading(true);
    setErrorMsg(null);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setRevealedHints({});
    setQuizScore(null);
    setQuizWeakTopics([]);
    try {
      const headers = await getAuthHeaders();
      const data = await fetchApiJson<{ questions?: PracticeQuestionItem[]; error?: string }>('/api/tutor/practice-quiz', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          departmentName: course.departmentName || course.category,
          lessonTitle: selectedLessonObj?.title,
          lessonContent: selectedLessonObj
            ? `${selectedLessonObj.contentBody}\n\n${selectedStudyNoteSummary}`
            : `${course.fullDescription}\n\n${selectedStudyNoteSummary}`,
          difficulty: quizDifficulty,
          language: effectiveLanguage,
          questionCount: quizCount,
        }),
      });
      if (!data.questions || data.questions.length === 0) {
        throw new Error(data.error || 'Could not generate interactive practice questions.');
      }
      setPracticeQuestions(data.questions);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to create practice test.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitPracticeTest = async () => {
    if (practiceQuestions.length === 0 || quizSubmitted) return;
    let correct = 0;
    const weakSet = new Set<string>();

    practiceQuestions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (chosen === q.correctIndex) {
        correct += 1;
      } else if (q.topicTag) {
        weakSet.add(q.topicTag);
      }
    });

    const pct = Math.round((correct / practiceQuestions.length) * 100);
    const weakTopics = Array.from(weakSet);
    setQuizScore({ pct, correct, total: practiceQuestions.length });
    setQuizWeakTopics(weakTopics);
    setQuizSubmitted(true);

    try {
      await submitQuizAttempt({
        quizId: `ai_practice_${selectedLessonObj?.id || 'course'}`,
        quizTitle: `AI Practice (${quizDifficulty}): ${selectedLessonObj?.title || course.title}`,
        courseId: course.id,
        moduleId: selectedLessonObj?.moduleId,
        studentId,
        studentName,
        studentEmail,
        scorePercent: pct,
        correctCount: correct,
        totalQuestions: practiceQuestions.length,
        weakTopics,
        answersJson: JSON.stringify(selectedAnswers),
        source: 'ai_practice',
      });
      onQuizAttemptSaved?.();
    } catch {
      // keep feedback displayed even if attempt log write warns
    }
  };

  return (
    <div className="rounded-2xl border border-[#D5B77A]/40 bg-white shadow-sm overflow-hidden">
      {/* Top Identity & Global Language/Context Bar */}
      <div className="border-b border-[#D5B77A]/30 bg-[#761D2D] px-5 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-[#D5B77A]/40">
              <Sparkles className="h-5 w-5 text-[#D5B77A]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wide">
                <RmHeavenWordmark variant="dark" suffix="AI Tutor" />
              </h3>
              <p className="text-xs text-[#F8F4ED]/80">
                Active Course: {course.title} {selectedLessonObj ? `· ${selectedLessonObj.title}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#292323]/40 px-2.5 py-1.5 text-xs border border-white/15">
              <Globe className="h-3.5 w-3.5 text-[#D5B77A]" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                aria-label="Tutor response language"
                className="bg-transparent text-xs font-medium text-white focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#292323] text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            {selectedLang === 'Other' && (
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder="Type language (e.g., Kannada)"
                className="w-40 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-white/60 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: 'chat' as TutorTab, label: 'AI Tutor Chat (12 Modes)', icon: MessageSquare },
            { id: 'notes' as TutorTab, label: 'Generate Personal Notes', icon: BookOpen },
            { id: 'pdf' as TutorTab, label: `Explain Course PDF (${materials.length})`, icon: FileText },
            { id: 'practice' as TutorTab, label: 'Practice Test', icon: ClipboardCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-[#D5B77A] text-[#292323] shadow-sm'
                    : 'bg-white/10 text-[#F8F4ED] hover:bg-white/20'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson & Study Note Context Bar */}
      <div className="border-b border-[#D5B77A]/20 bg-[#F8F4ED] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-[#292323]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#761D2D]">Lesson Focus:</span>
            <select
              value={contextLessonId}
              onChange={(e) => setContextLessonId(e.target.value)}
              className="rounded-lg border border-[#D5B77A]/40 bg-white px-2.5 py-1 text-xs text-[#292323] focus:border-[#761D2D] focus:outline-none max-w-[230px]"
            >
              <option value="all">Full Course Overview ({course.title})</option>
              {lessons.map((l, i) => (
                <option key={l.id} value={l.id}>
                  Lesson {i + 1}: {l.title}
                </option>
              ))}
            </select>
          </div>
          {studyNotes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#761D2D]">Study Note Focus:</span>
              <select
                value={contextNoteId}
                onChange={(e) => setContextNoteId(e.target.value)}
                className="rounded-lg border border-[#D5B77A]/40 bg-white px-2.5 py-1 text-xs text-[#292323] focus:border-[#761D2D] focus:outline-none max-w-[250px]"
              >
                <option value="none">No specific note pinned</option>
                {studyNotes.map((n, i) => (
                  <option key={n.id} value={n.id}>
                    Note {i + 1}: {n.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <span className="text-[11px] text-[#292323]/65">
          AI responses support revision &amp; are distinct from Official Curriculum Study Notes.
        </span>
      </div>

      {errorMsg && (
        <div className="mx-5 mt-4 flex items-center justify-between rounded-xl border border-[#B4434D]/35 bg-[#B4434D]/10 px-4 py-2.5 text-xs text-[#761D2D]">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: CHAT */}
      {activeTab === 'chat' && (
        <div className="p-5 space-y-4">
          {/* Learning Mode Picker */}
          <div className="rounded-xl border border-[#D5B77A]/30 bg-[#F8F4ED]/60 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                Select Learning Mode ({mode})
              </span>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B4434D] hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear Chat
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
              {AI_TUTOR_MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    mode === m
                      ? 'border-[#761D2D] bg-[#761D2D] text-white'
                      : 'border-[#D5B77A]/30 bg-white text-[#292323] hover:border-[#761D2D]/40'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {selectedStudyNoteObj && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#D5B77A]/25 pt-2.5">
                <span className="text-[11px] font-semibold text-[#761D2D] mr-1">
                  Quick Note Actions:
                </span>
                {[
                  {
                    label: 'Simplify Note',
                    modeVal: 'Simple Explanation' as AiTutorMode,
                    prompt: `Simplify the study note "${selectedStudyNoteObj.title}" using beginner-friendly analogies.`,
                  },
                  {
                    label: 'Step-by-Step',
                    modeVal: 'Step-by-Step Learning' as AiTutorMode,
                    prompt: `Walk me step-by-step through "${selectedStudyNoteObj.title}".`,
                  },
                  {
                    label: 'Revision Cheat Sheet',
                    modeVal: 'Quick Revision' as AiTutorMode,
                    prompt: `Give me a crisp quick revision cheat sheet for "${selectedStudyNoteObj.title}".`,
                  },
                  {
                    label: '5 Check Questions',
                    modeVal: 'Practice Test' as AiTutorMode,
                    prompt: `Test me with 5 interactive check questions on "${selectedStudyNoteObj.title}" without giving away answers first.`,
                  },
                  {
                    label: `Translate (${effectiveLanguage})`,
                    modeVal: 'Translate Notes' as AiTutorMode,
                    prompt: `Translate the key points of "${selectedStudyNoteObj.title}" clearly into ${effectiveLanguage} while keeping essential technical keywords in English.`,
                  },
                ].map((act) => (
                  <button
                    key={act.label}
                    type="button"
                    disabled={chatLoading}
                    onClick={() => {
                      setMode(act.modeVal);
                      handleSendChat(act.prompt, act.modeVal);
                    }}
                    className="rounded-md border border-[#761D2D]/20 bg-white px-2.5 py-1 text-[11px] font-medium text-[#761D2D] transition hover:bg-[#761D2D] hover:text-white disabled:opacity-50"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Starter Prompts */}
          {messages.length === 0 && !sessionLoading && (
            <div className="rounded-xl border border-dashed border-[#D5B77A] bg-[#F8F4ED]/40 p-4">
              <p className="mb-2.5 text-xs font-semibold text-[#761D2D]">
                Suggested Prompts for {selectedLessonObj?.title || course.title} ({effectiveLanguage}):
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {starterPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChat(p)}
                    className="rounded-lg border border-[#D5B77A]/35 bg-white px-3 py-2 text-left text-xs text-[#292323] transition hover:border-[#761D2D] hover:text-[#761D2D]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Feed */}
          <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
            {sessionLoading ? (
              <div className="flex items-center justify-center py-8 text-xs text-[#292323]/60">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#761D2D]" />
                Loading saved course conversation...
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isLastModel =
                  msg.role === 'model' &&
                  idx === messages.length - 1;
                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-4 ${
                      msg.role === 'user'
                        ? 'ml-6 border border-[#761D2D]/20 bg-[#761D2D]/5'
                        : 'mr-2 border border-[#D5B77A]/35 bg-white shadow-xs'
                    }`}
                  >
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#292323]/60">
                      <span>
                        {msg.role === 'user' ? studentName : 'RM HEAVEN AI Tutor'}
                        {msg.mode ? ` · ${msg.mode}` : ''}
                        {msg.language ? ` · ${msg.language}` : ''}
                      </span>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-2 normal-case font-medium">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-[#292323]/75 hover:bg-[#F8F4ED]"
                          >
                            {copiedId === msg.id ? <Check className="h-3 w-3 text-[#761D2D]" /> : <Copy className="h-3 w-3" />}
                            {copiedId === msg.id ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveReplyToNotes(msg)}
                            disabled={savingId === msg.id || savedIds[msg.id]}
                            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-[#761D2D] hover:bg-[#F8F4ED] disabled:opacity-60"
                          >
                            {savedIds[msg.id] ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" /> Saved to AI Notes
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="h-3 w-3" /> Save to My AI Notes
                              </>
                            )}
                          </button>
                          {isLastModel && (
                            <button
                              type="button"
                              onClick={handleRegenerateLast}
                              disabled={chatLoading}
                              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-[#292323]/75 hover:bg-[#F8F4ED]"
                            >
                              <RefreshCw className="h-3 w-3" /> Regenerate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {msg.role === 'model' ? (
                      <RichContentRenderer content={msg.text} />
                    ) : (
                      <p className="text-sm text-[#292323] whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                );
              })
            )}
            {chatLoading && (
              <div className="flex items-center gap-2 rounded-xl border border-[#D5B77A]/30 bg-[#F8F4ED] px-4 py-3 text-xs text-[#761D2D]">
                <Loader2 className="h-4 w-4 animate-spin" />
                RM HEAVEN AI Tutor is preparing your {mode} response in {effectiveLanguage}...
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask any doubt in ${effectiveLanguage} (${mode})...`}
              className="flex-1 rounded-xl border border-[#D5B77A]/50 bg-[#F8F4ED]/50 px-4 py-2.5 text-sm text-[#292323] focus:border-[#761D2D] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading || !input.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Ask Tutor
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: PERSONAL AI NOTE GENERATOR */}
      {activeTab === 'notes' && (
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-[#D5B77A]/35 bg-[#F8F4ED]/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-base font-semibold text-[#292323]">Personal AI Study Note Generator</h4>
                <p className="text-xs text-[#292323]/70">
                  Create personal AI-generated study notes saved to your private account. Official instructor materials and uploaded PDFs remain untouched.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#292323]">Note Format</label>
                <select
                  value={noteStyle}
                  onChange={(e) => setNoteStyle(e.target.value as Exclude<SavedAiNoteMode, 'tutor_saved'>)}
                  className="w-full rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                >
                  <option value="simple">Simple Beginner Explanation Notes</option>
                  <option value="detailed">Detailed Comprehensive Study Notes</option>
                  <option value="short_revision">Short Quick-Revision Cheat Sheet</option>
                  <option value="step_by_step">Step-by-Step Guide</option>
                  <option value="practice_questions">Practice Questions & Answers</option>
                  <option value="translation">Translate Topic into {effectiveLanguage}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#292323]">Specific Sub-Topic Focus (Optional)</label>
                <input
                  type="text"
                  value={noteFocus}
                  onChange={(e) => setNoteFocus(e.target.value)}
                  placeholder="e.g., Inheritance vs Composition, or Key Formulas"
                  className="w-full rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneratePersonalNote}
              disabled={generatingNote}
              className="inline-flex items-center gap-2 rounded-xl bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-50"
            >
              {generatingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-[#D5B77A]" />}
              Generate Personal Note ({effectiveLanguage})
            </button>
          </div>

          {generatedNote && (
            <div className="rounded-xl border border-[#D5B77A]/40 bg-white p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292323]/10 pb-3">
                <div>
                  <span className="inline-block rounded bg-[#D5B77A]/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                    AI-Generated Personal Note · {generatedNote.language}
                  </span>
                  <h5 className="mt-1 font-serif text-lg font-semibold text-[#292323]">{generatedNote.title}</h5>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy('gen-note', generatedNote.content)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#D5B77A]/40 px-3 py-1.5 text-xs font-medium text-[#292323] hover:bg-[#F8F4ED]"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGeneratedNote}
                    disabled={noteSavedSuccess}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-60"
                  >
                    {noteSavedSuccess ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
                    {noteSavedSuccess ? 'Saved to My AI Notes' : 'Save to My AI Notes'}
                  </button>
                </div>
              </div>
              <RichContentRenderer content={generatedNote.content} />
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXPLAIN UPLOADED COURSE PDF */}
      {activeTab === 'pdf' && (
        <div className="p-5 space-y-4">
          {materials.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D5B77A]/50 bg-[#F8F4ED]/60 p-6 text-center text-sm text-[#292323]/75">
              No PDF or document files have been uploaded by the course administrator yet. Use AI Tutor Chat or Personal Notes tabs above for instant curriculum explanations.
            </div>
          ) : (
            <div className="rounded-xl border border-[#D5B77A]/35 bg-[#F8F4ED]/70 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#292323]">Select Authorized Course PDF / Document</label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => setSelectedMaterialId(e.target.value)}
                    className="w-full rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                  >
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.title} ({mat.fileName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#292323]">Document Analysis Action</label>
                  <select
                    value={pdfAction}
                    onChange={(e) =>
                      setPdfAction(
                        e.target.value as
                          | 'full_explanation'
                          | 'section_focus'
                          | 'summarize'
                          | 'translate'
                          | 'vocabulary'
                          | 'practice_questions',
                      )
                    }
                    className="w-full rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                  >
                    <option value="full_explanation">Explain Entire Document Clearly</option>
                    <option value="section_focus">Explain a Specific Topic / Section</option>
                    <option value="summarize">Summarize Key Takeaways</option>
                    <option value="translate">Translate Meaning to {effectiveLanguage}</option>
                    <option value="vocabulary">Define Key Terms & Vocabulary</option>
                    <option value="practice_questions">Generate Practice Questions from PDF</option>
                  </select>
                </div>
              </div>

              {pdfAction === 'section_focus' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#292323]">Topic or Section Inside Document</label>
                  <input
                    type="text"
                    value={pdfSectionHint}
                    onChange={(e) => setPdfSectionHint(e.target.value)}
                    placeholder="e.g., Chapter 2 Examples, Formula Table, or Page 3 Definition"
                    className="w-full rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleExplainPdf}
                disabled={pdfLoading || !selectedMaterialId}
                className="inline-flex items-center gap-2 rounded-xl bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-50"
              >
                {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-[#D5B77A]" />}
                Analyze Document in {effectiveLanguage}
              </button>
            </div>
          )}

          {pdfExplanation && (
            <div className="rounded-xl border border-[#D5B77A]/40 bg-white p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292323]/10 pb-3">
                <div>
                  <span className="inline-block rounded bg-[#761D2D]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                    AI PDF Study Guide · {pdfExplanation.language}
                  </span>
                  <h5 className="mt-1 font-serif text-lg font-semibold text-[#292323]">
                    {pdfExplanation.materialTitle}
                  </h5>
                </div>
                <button
                  type="button"
                  disabled={pdfSavedSuccess}
                  onClick={async () => {
                    await savePersonalAiNote({
                      studentId,
                      courseId: course.id,
                      courseTitle: course.title,
                      lessonId: selectedLessonObj?.id,
                      lessonTitle: selectedLessonObj?.title,
                      noteMode: 'tutor_saved',
                      language: pdfExplanation.language,
                      title: `PDF Guide: ${pdfExplanation.materialTitle}`,
                      content: pdfExplanation.content,
                    });
                    setPdfSavedSuccess(true);
                    onNoteSaved?.();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-60"
                >
                  {pdfSavedSuccess ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
                  {pdfSavedSuccess ? 'Saved to My AI Notes' : 'Save Explanation to My AI Notes'}
                </button>
              </div>
              <RichContentRenderer content={pdfExplanation.content} />
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INTERACTIVE PRACTICE TEST */}
      {activeTab === 'practice' && (
        <div className="p-5 space-y-5">
          <div className="rounded-xl border border-[#D5B77A]/35 bg-[#F8F4ED]/70 p-4 space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#292323]">Interactive AI Practice Test</h4>
            <p className="text-xs text-[#292323]/75">
              Test your mastery actively. Hints are available if you get stuck—answers and detailed diagnostics appear only after you submit.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#292323]">Difficulty</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                  className="rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#292323]">Questions</label>
                <select
                  value={quizCount}
                  onChange={(e) => setQuizCount(Number(e.target.value))}
                  className="rounded-lg border border-[#D5B77A]/45 bg-white px-3 py-2 text-sm text-[#292323]"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleStartPracticeTest}
                disabled={quizLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#761D2D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-50"
              >
                {quizLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4 text-[#D5B77A]" />}
                {practiceQuestions.length > 0 ? 'Generate New Practice Set' : 'Start Practice Test'}
              </button>
            </div>
          </div>

          {quizSubmitted && quizScore && (
            <div className="rounded-xl border border-[#761D2D]/25 bg-[#F8F4ED] p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">Practice Results Recorded</p>
                  <h5 className="font-serif text-xl font-semibold text-[#292323]">
                    Score: {quizScore.pct}% ({quizScore.correct} / {quizScore.total} Correct)
                  </h5>
                </div>
                {quizWeakTopics.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('chat');
                      setMode('Doubt Clarification');
                      handleSendChat(
                        `In my practice quiz on "${selectedLessonObj?.title || course.title}", I missed questions on these topics: ${quizWeakTopics.join(', ')}. Please re-explain those concepts clearly and give me a quick revision plan.`,
                        'Doubt Clarification',
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D5B77A]" />
                    Explain My Weak Topics in AI Chat
                  </button>
                )}
              </div>
              {quizWeakTopics.length > 0 ? (
                <p className="text-xs text-[#292323]/80">
                  <strong>Topics to revisit:</strong> {quizWeakTopics.join(' · ')}
                </p>
              ) : (
                <p className="text-xs text-[#761D2D] font-medium">
                  Excellent! You answered every topic accurately on this practice run.
                </p>
              )}
            </div>
          )}

          {practiceQuestions.length > 0 && (
            <div className="space-y-4">
              {practiceQuestions.map((q, idx) => {
                const chosen = selectedAnswers[q.id];
                const isCorrect = quizSubmitted && chosen === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 ${
                      quizSubmitted
                        ? isCorrect
                          ? 'border-[#D5B77A] bg-[#F8F4ED]/60'
                          : 'border-[#B4434D]/40 bg-[#B4434D]/5'
                        : 'border-[#292323]/12 bg-white'
                    }`}
                  >
                    <div className="mb-2.5 flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#292323]">
                        Q{idx + 1}. {q.questionText}
                      </p>
                      <span className="shrink-0 text-[11px] font-medium text-[#761D2D]/80">{q.topicTag}</span>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const checked = chosen === optIdx;
                        const highlightCorrect = quizSubmitted && optIdx === q.correctIndex;
                        const highlightWrong = quizSubmitted && checked && optIdx !== q.correctIndex;
                        return (
                          <label
                            key={optIdx}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
                              highlightCorrect
                                ? 'border-[#761D2D] bg-[#761D2D]/10 font-medium text-[#292323]'
                                : highlightWrong
                                  ? 'border-[#B4434D] bg-[#B4434D]/10 text-[#B4434D]'
                                  : checked
                                    ? 'border-[#761D2D] bg-[#F8F4ED]'
                                    : 'border-[#292323]/12 hover:bg-[#F8F4ED]/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`practice-${q.id}`}
                              disabled={quizSubmitted}
                              checked={checked}
                              onChange={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className="accent-[#761D2D]"
                            />
                            <span className="flex-1">{opt}</span>
                            {highlightCorrect && <CheckCircle2 className="h-4 w-4 text-[#761D2D]" />}
                            {highlightWrong && <XCircle className="h-4 w-4 text-[#B4434D]" />}
                          </label>
                        );
                      })}
                    </div>

                    {!quizSubmitted && q.hint && (
                      <div className="mt-2.5">
                        {revealedHints[q.id] ? (
                          <p className="rounded-lg bg-[#F8F4ED] px-3 py-2 text-xs text-[#292323]/80">
                            <strong className="text-[#761D2D]">Hint:</strong> {q.hint}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRevealedHints((prev) => ({ ...prev, [q.id]: true }))}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#761D2D] hover:underline"
                          >
                            <HelpCircle className="h-3.5 w-3.5" /> Show Hint
                          </button>
                        )}
                      </div>
                    )}

                    {quizSubmitted && (
                      <div className="mt-3 rounded-lg bg-white/80 p-3 text-xs text-[#292323]/85 border border-[#D5B77A]/30">
                        <strong className="text-[#761D2D]">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted && (
                <button
                  type="button"
                  onClick={handleSubmitPracticeTest}
                  disabled={Object.keys(selectedAnswers).length < practiceQuestions.length}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-50"
                >
                  Submit Practice Test &amp; Reveal Explanations
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
