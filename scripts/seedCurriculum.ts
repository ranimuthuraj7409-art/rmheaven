import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applicationDefault, deleteApp, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import {
  FieldValue,
  getFirestore,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type WriteBatch,
} from 'firebase-admin/firestore';
import {
  ALL_SEED_COURSES,
  RM_DEPARTMENTS,
  getCurriculumSummaryStats,
} from '../src/data/curriculum/curriculumCatalog';

const EXPECTED_PROJECT_ID = 'reflecting-rigging-gflln';
const EXPECTED_DATABASE_ID = 'ai-studio-575d9b61-516c-4484-93c8-07c439fdcb2c';
const ADMIN_EMAIL = 'ranimuthuraj7409@gmail.com';
const FALLBACK_ACTOR_ID = 'rmheaven_local_adc_seeder';
const BATCH_LIMIT = 350;
const MAX_BATCH_RETRIES = 4;

interface FirebaseAppletConfig {
  projectId: string;
  firestoreDatabaseId: string;
}

interface ExistingMaps {
  departments: Map<string, DocumentData>;
  courses: Map<string, DocumentData>;
  modules: Map<string, Map<string, DocumentData>>;
  lessons: Map<string, Map<string, DocumentData>>;
  studyNotes: Map<string, Map<string, DocumentData>>;
  quizzes: Map<string, Map<string, DocumentData>>;
  assignments: Map<string, Map<string, DocumentData>>;
  questions: Map<string, Map<string, DocumentData>>;
  totalModules: number;
  totalLessons: number;
  totalStudyNotes: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalAssignments: number;
  usersCount: number;
  adminsCount: number;
  enrollmentsCount: number;
  adminUid: string;
}

function loadAndVerifyConfig(): FirebaseAppletConfig {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configPath = path.resolve(__dirname, '..', 'firebase-applet-config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing firebase-applet-config.json at ${configPath}`);
  }

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Partial<FirebaseAppletConfig>;
  const projectId = (raw.projectId || '').trim();
  const firestoreDatabaseId = (raw.firestoreDatabaseId || '').trim();

  if (projectId !== EXPECTED_PROJECT_ID) {
    throw new Error(
      `SAFETY STOP: Configured projectId "${projectId}" does not match expected project "${EXPECTED_PROJECT_ID}".`,
    );
  }
  if (firestoreDatabaseId !== EXPECTED_DATABASE_ID) {
    throw new Error(
      `SAFETY STOP: Configured firestoreDatabaseId "${firestoreDatabaseId}" does not match expected database "${EXPECTED_DATABASE_ID}".`,
    );
  }

  const envProject =
    process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  if (envProject && envProject !== EXPECTED_PROJECT_ID) {
    throw new Error(
      `SAFETY STOP: Environment project "${envProject}" does not match expected project "${EXPECTED_PROJECT_ID}".`,
    );
  }

  const envDatabase = process.env.FIRESTORE_DATABASE_ID;
  if (envDatabase && envDatabase !== EXPECTED_DATABASE_ID) {
    throw new Error(
      `SAFETY STOP: Environment database "${envDatabase}" does not match expected database "${EXPECTED_DATABASE_ID}".`,
    );
  }

  return { projectId, firestoreDatabaseId };
}

function validateLocalCurriculum(): void {
  const stats = getCurriculumSummaryStats();
  const errors: string[] = [];

  if (RM_DEPARTMENTS.length !== 4) errors.push(`Expected 4 departments, got ${RM_DEPARTMENTS.length}`);
  if (ALL_SEED_COURSES.length !== 31) errors.push(`Expected 31 courses, got ${ALL_SEED_COURSES.length}`);

  const seenCourseIds = new Set<string>();
  const seenCourseTitles = new Set<string>();

  for (const c of ALL_SEED_COURSES) {
    if (seenCourseIds.has(c.id)) errors.push(`Duplicate seed course ID: ${c.id}`);
    seenCourseIds.add(c.id);

    const normTitle = c.title.trim().toLowerCase();
    if (seenCourseTitles.has(normTitle)) errors.push(`Duplicate seed course title: ${c.title}`);
    seenCourseTitles.add(normTitle);

    if (c.modules.length < 5) errors.push(`${c.id}: expected >= 5 modules, found ${c.modules.length}`);
    if (c.lessons.length < 15) errors.push(`${c.id}: expected >= 15 lessons, found ${c.lessons.length}`);
    if (c.studyNotes.length < 2) errors.push(`${c.id}: expected >= 2 study notes, found ${c.studyNotes.length}`);

    const modLessonCounts = new Map<string, number>(c.modules.map((m) => [m.id, 0]));
    const lessonModuleById = new Map<string, string>();

    for (const l of c.lessons) {
      if (!modLessonCounts.has(l.moduleId)) {
        errors.push(`${c.id}: lesson ${l.id} references unknown module ${l.moduleId}`);
      } else {
        modLessonCounts.set(l.moduleId, (modLessonCounts.get(l.moduleId) || 0) + 1);
      }
      lessonModuleById.set(l.id, l.moduleId);
    }

    for (const [mId, cnt] of modLessonCounts.entries()) {
      if (cnt < 3) errors.push(`${c.id}: module ${mId} has only ${cnt} lessons (minimum 3 required)`);
    }

    for (const n of c.studyNotes) {
      if (!modLessonCounts.has(n.moduleId)) {
        errors.push(`${c.id}: study note ${n.id} references unknown module ${n.moduleId}`);
      }
      if (n.lessonId && lessonModuleById.get(n.lessonId) !== n.moduleId) {
        errors.push(`${c.id}: study note ${n.id} lessonId ${n.lessonId} does not belong to module ${n.moduleId}`);
      }
      if (!n.topicIntroduction.includes('### Learning Objectives')) {
        errors.push(`${c.id}/${n.id}: missing ### Learning Objectives section`);
      }
      if (n.detailedExplanation.length < 500) {
        errors.push(`${c.id}/${n.id}: detailedExplanation shorter than 500 chars`);
      }
      if (n.keyConcepts.length < 300) {
        errors.push(`${c.id}/${n.id}: keyConcepts shorter than 300 chars`);
      }
      if (!n.summary.includes('### Quick Revision Notes')) {
        errors.push(`${c.id}/${n.id}: missing ### Quick Revision Notes section`);
      }
      if (!n.practiceQuestions.includes('### Five Knowledge-Check Questions (With Answers)')) {
        errors.push(`${c.id}/${n.id}: missing ### Five Knowledge-Check Questions (With Answers)`);
      }
      const qCount = (n.practiceQuestions.match(/^\d+\.\s/gm) || []).length;
      if (qCount < 5) {
        errors.push(`${c.id}/${n.id}: expected 5 numbered knowledge-check questions, got ${qCount}`);
      }
      const fieldBounds: Array<[string, string, number, number]> = [
        ['topicIntroduction', n.topicIntroduction, 10, 3000],
        ['simpleExplanation', n.simpleExplanation, 10, 4000],
        ['detailedExplanation', n.detailedExplanation, 10, 8000],
        ['keyConcepts', n.keyConcepts, 10, 6000],
        ['stepByStepExplanation', n.stepByStepExplanation, 10, 6000],
        ['practicalExamples', n.practicalExamples, 10, 8000],
        ['realWorldApplications', n.realWorldApplications, 10, 4000],
        ['importantPoints', n.importantPoints, 10, 4000],
        ['commonMistakes', n.commonMistakes, 10, 4000],
        ['summary', n.summary, 10, 3000],
        ['practiceQuestions', n.practiceQuestions, 10, 8000],
      ];
      for (const [label, val, minLen, maxLen] of fieldBounds) {
        if (val.length < minLen || val.length > maxLen) {
          errors.push(`${c.id}/${n.id}: ${label} length ${val.length} outside [${minLen}, ${maxLen}]`);
        }
      }
      if (n.domainSupplement && n.domainSupplement.length > 6000) {
        errors.push(`${c.id}/${n.id}: domainSupplement exceeds 6000 chars (${n.domainSupplement.length})`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Curriculum pre-flight validation failed (${errors.length} issues):\n- ${errors.join('\n- ')}`);
  }

  console.log(
    `[OK] Local curriculum pre-flight verified: ${stats.departments} depts, ${stats.courses} courses, ${stats.modules} modules, ${stats.lessons} lessons, ${stats.studyNotes} study notes, ${stats.quizzes} quizzes, ${stats.questions} questions, ${stats.assignments} assignments.`,
  );
}

function isRetryableFirestoreError(err: unknown): boolean {
  const code = (err as { code?: string | number } | null)?.code;
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return (
    code === 4 ||
    code === 10 ||
    code === 14 ||
    code === 8 ||
    msg.includes('deadline') ||
    msg.includes('unavailable') ||
    msg.includes('aborted') ||
    msg.includes('resource_exhausted') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface QueuedSetOp {
  ref: DocumentReference<DocumentData>;
  data: DocumentData;
}

class AdminBatchWriter {
  private ops: QueuedSetOp[] = [];
  public committedWrites = 0;

  constructor(private readonly db: Firestore) {}

  queue(ref: DocumentReference<DocumentData>, data: DocumentData): void {
    this.ops.push({ ref, data });
  }

  async commitAll(label: string): Promise<void> {
    if (this.ops.length === 0) {
      console.log(`  [${label}] No pending operations.`);
      return;
    }

    const totalChunks = Math.ceil(this.ops.length / BATCH_LIMIT);
    for (let i = 0; i < totalChunks; i++) {
      const slice = this.ops.slice(i * BATCH_LIMIT, (i + 1) * BATCH_LIMIT);
      let attempt = 0;

      while (true) {
        attempt += 1;
        try {
          const batch: WriteBatch = this.db.batch();
          for (const op of slice) {
            batch.set(op.ref, op.data);
          }
          await batch.commit();
          this.committedWrites += slice.length;
          console.log(
            `  [${label}] Committed batch ${i + 1}/${totalChunks} (${slice.length} docs, cumulative ${this.committedWrites} writes)`,
          );
          break;
        } catch (err) {
          if (attempt < MAX_BATCH_RETRIES && isRetryableFirestoreError(err)) {
            const backoffMs = 800 * 2 ** (attempt - 1);
            console.warn(
              `  [${label}] Transient error on batch ${i + 1}/${totalChunks} (attempt ${attempt}/${MAX_BATCH_RETRIES}). Retrying in ${backoffMs}ms...`,
            );
            await sleep(backoffMs);
            continue;
          }
          throw err;
        }
      }
    }
    this.ops = [];
  }
}

async function inspectExistingDatabase(db: Firestore): Promise<ExistingMaps> {
  console.log('\n[Step 2/5] Inspecting existing Firestore documents (read-only)...');

  const [deptSnap, coursesSnap, usersSnap, adminsSnap, enrollSnap] = await Promise.all([
    db.collection('departments').get(),
    db.collection('courses').get(),
    db.collection('users').count().get(),
    db.collection('admins').get(),
    db.collection('student_enrollments').count().get(),
  ]);

  let adminUid = FALLBACK_ACTOR_ID;
  for (const d of adminsSnap.docs) {
    const data = d.data();
    if (typeof data.email === 'string' && data.email.toLowerCase() === ADMIN_EMAIL) {
      adminUid = d.id;
      break;
    }
  }

  const departments = new Map<string, DocumentData>();
  deptSnap.docs.forEach((d) => departments.set(d.id, d.data()));

  const courses = new Map<string, DocumentData>();
  coursesSnap.docs.forEach((d) => courses.set(d.id, d.data()));

  const modules = new Map<string, Map<string, DocumentData>>();
  const lessons = new Map<string, Map<string, DocumentData>>();
  const studyNotes = new Map<string, Map<string, DocumentData>>();
  const quizzes = new Map<string, Map<string, DocumentData>>();
  const assignments = new Map<string, Map<string, DocumentData>>();
  const questions = new Map<string, Map<string, DocumentData>>();

  let totalModules = 0;
  let totalLessons = 0;
  let totalStudyNotes = 0;
  let totalQuizzes = 0;
  let totalQuestions = 0;
  let totalAssignments = 0;

  for (const seedCourse of ALL_SEED_COURSES) {
    const cRef = db.collection('courses').doc(seedCourse.id);
    const [mSnap, lSnap, nSnap, qzSnap, aSnap] = await Promise.all([
      cRef.collection('modules').get(),
      cRef.collection('lessons').get(),
      cRef.collection('study_notes').get(),
      cRef.collection('quizzes').get(),
      cRef.collection('assignments').get(),
    ]);

    const mMap = new Map<string, DocumentData>();
    mSnap.docs.forEach((d) => mMap.set(d.id, d.data()));
    modules.set(seedCourse.id, mMap);
    totalModules += mSnap.size;

    const lMap = new Map<string, DocumentData>();
    lSnap.docs.forEach((d) => lMap.set(d.id, d.data()));
    lessons.set(seedCourse.id, lMap);
    totalLessons += lSnap.size;

    const nMap = new Map<string, DocumentData>();
    nSnap.docs.forEach((d) => nMap.set(d.id, d.data()));
    studyNotes.set(seedCourse.id, nMap);
    totalStudyNotes += nSnap.size;

    const qzMap = new Map<string, DocumentData>();
    qzSnap.docs.forEach((d) => qzMap.set(d.id, d.data()));
    quizzes.set(seedCourse.id, qzMap);
    totalQuizzes += qzSnap.size;

    const aMap = new Map<string, DocumentData>();
    aSnap.docs.forEach((d) => aMap.set(d.id, d.data()));
    assignments.set(seedCourse.id, aMap);
    totalAssignments += aSnap.size;

    for (const qz of seedCourse.quizzes) {
      const qqSnap = await cRef.collection('quizzes').doc(qz.id).collection('questions').get();
      const qqMap = new Map<string, DocumentData>();
      qqSnap.docs.forEach((d) => qqMap.set(d.id, d.data()));
      questions.set(`${seedCourse.id}/${qz.id}`, qqMap);
      totalQuestions += qqSnap.size;
    }
  }

  return {
    departments,
    courses,
    modules,
    lessons,
    studyNotes,
    quizzes,
    assignments,
    questions,
    totalModules,
    totalLessons,
    totalStudyNotes,
    totalQuizzes,
    totalQuestions,
    totalAssignments,
    usersCount: usersSnap.data().count,
    adminsCount: adminsSnap.size,
    enrollmentsCount: enrollSnap.data().count,
    adminUid,
  };
}

function summarizePlan(existing: ExistingMaps) {
  const seedDeptIds = new Set(RM_DEPARTMENTS.map((d) => d.id));
  const seedCourseIds = new Set(ALL_SEED_COURSES.map((c) => c.id));
  const seedTitleSet = new Set(ALL_SEED_COURSES.map((c) => c.title.trim().toLowerCase()));

  const unrelatedDepts = Array.from(existing.departments.keys()).filter((id) => !seedDeptIds.has(id));
  const unrelatedCourses = Array.from(existing.courses.keys()).filter((id) => !seedCourseIds.has(id));

  const titleDuplicates: string[] = [];
  for (const [docId, docData] of existing.courses.entries()) {
    if (!seedCourseIds.has(docId) && typeof docData.title === 'string') {
      if (seedTitleSet.has(docData.title.trim().toLowerCase())) {
        titleDuplicates.push(`${docId} ("${docData.title}")`);
      }
    }
  }

  const plan = {
    departments: { create: 0, update: 0 },
    courses: { create: 0, update: 0 },
    modules: { create: 0, update: 0 },
    lessons: { create: 0, update: 0 },
    studyNotes: { create: 0, update: 0 },
    quizzes: { create: 0, update: 0 },
    questions: { create: 0, update: 0 },
    assignments: { create: 0, update: 0 },
  };

  for (const d of RM_DEPARTMENTS) {
    if (existing.departments.has(d.id)) plan.departments.update += 1;
    else plan.departments.create += 1;
  }

  for (const c of ALL_SEED_COURSES) {
    if (existing.courses.has(c.id)) plan.courses.update += 1;
    else plan.courses.create += 1;

    const mMap = existing.modules.get(c.id);
    for (const m of c.modules) {
      if (mMap?.has(m.id)) plan.modules.update += 1;
      else plan.modules.create += 1;
    }

    const lMap = existing.lessons.get(c.id);
    for (const l of c.lessons) {
      if (lMap?.has(l.id)) plan.lessons.update += 1;
      else plan.lessons.create += 1;
    }

    const nMap = existing.studyNotes.get(c.id);
    for (const n of c.studyNotes) {
      if (nMap?.has(n.id)) plan.studyNotes.update += 1;
      else plan.studyNotes.create += 1;
    }

    const qzMap = existing.quizzes.get(c.id);
    for (const qz of c.quizzes) {
      if (qzMap?.has(qz.id)) plan.quizzes.update += 1;
      else plan.quizzes.create += 1;

      const qqMap = existing.questions.get(`${c.id}/${qz.id}`);
      for (const q of qz.questions) {
        if (qqMap?.has(q.id)) plan.questions.update += 1;
        else plan.questions.create += 1;
      }
    }

    const aMap = existing.assignments.get(c.id);
    if (aMap?.has(c.assignment.id)) plan.assignments.update += 1;
    else plan.assignments.create += 1;
  }

  console.log('\n--- Existing Firestore State ---');
  console.log(`  Departments:          ${existing.departments.size}`);
  console.log(`  Courses:              ${existing.courses.size}`);
  console.log(`  Seed-ID Modules:      ${existing.totalModules}`);
  console.log(`  Seed-ID Lessons:      ${existing.totalLessons}`);
  console.log(`  Seed-ID Study Notes:  ${existing.totalStudyNotes}`);
  console.log(`  Seed-ID Quizzes:      ${existing.totalQuizzes} (${existing.totalQuestions} questions)`);
  console.log(`  Seed-ID Assignments:  ${existing.totalAssignments}`);
  console.log(
    `  Protected Accounts:   ${existing.usersCount} student users · ${existing.adminsCount} admin docs · ${existing.enrollmentsCount} enrollments (NEVER modified)`,
  );

  if (unrelatedDepts.length > 0 || unrelatedCourses.length > 0) {
    console.log(
      `  Preserved Unrelated:  ${unrelatedDepts.length} custom departments, ${unrelatedCourses.length} custom courses (untouched)`,
    );
  }
  if (titleDuplicates.length > 0) {
    console.warn(
      `  [DUPLICATE NOTICE] Found custom course docs sharing a seed title (preserved, not deleted): ${titleDuplicates.join(', ')}`,
    );
  }

  console.log('\n--- Proposed Idempotent Sync Plan ---');
  console.log(`  Departments:   +${plan.departments.create} create, ~${plan.departments.update} update`);
  console.log(`  Courses:       +${plan.courses.create} create, ~${plan.courses.update} update`);
  console.log(`  Modules:       +${plan.modules.create} create, ~${plan.modules.update} update`);
  console.log(`  Lessons:       +${plan.lessons.create} create, ~${plan.lessons.update} update`);
  console.log(`  Study Notes:   +${plan.studyNotes.create} create, ~${plan.studyNotes.update} update`);
  console.log(`  Quizzes:       +${plan.quizzes.create} create, ~${plan.quizzes.update} update`);
  console.log(`  Questions:     +${plan.questions.create} create, ~${plan.questions.update} update`);
  console.log(`  Assignments:   +${plan.assignments.create} create, ~${plan.assignments.update} update`);
}

async function verifySeededDatabase(db: Firestore): Promise<boolean> {
  console.log('\n[Step 5/5] Reading documents back from Firestore to verify integrity & relationships...');
  const issues: string[] = [];

  const [deptSnap, coursesSnap] = await Promise.all([
    db.collection('departments').where('status', '==', 'active').get(),
    db.collection('courses').where('status', '==', 'published').get(),
  ]);

  const activeDeptIds = new Set(deptSnap.docs.map((d) => d.id));
  const publishedCourseMap = new Map(coursesSnap.docs.map((d) => [d.id, d.data()]));

  let verifiedDepts = 0;
  for (const d of RM_DEPARTMENTS) {
    if (activeDeptIds.has(d.id)) verifiedDepts += 1;
    else issues.push(`Missing or inactive department: ${d.id}`);
  }

  let verifiedCourses = 0;
  let verifiedModules = 0;
  let verifiedLessons = 0;
  let verifiedStudyNotes = 0;
  let verifiedQuizzes = 0;
  let verifiedQuestions = 0;
  let verifiedAssignments = 0;

  for (const seedCourse of ALL_SEED_COURSES) {
    const courseDoc = publishedCourseMap.get(seedCourse.id);
    if (!courseDoc) {
      issues.push(`Course missing or not published: ${seedCourse.id}`);
      continue;
    }
    if (!activeDeptIds.has(courseDoc.departmentId as string)) {
      issues.push(`Course ${seedCourse.id} references invalid departmentId: ${String(courseDoc.departmentId)}`);
    }
    if (!courseDoc.createdAt || !courseDoc.updatedAt) {
      issues.push(`Course ${seedCourse.id} missing createdAt/updatedAt timestamp`);
    }
    verifiedCourses += 1;

    const cRef = db.collection('courses').doc(seedCourse.id);
    const [mSnap, lSnap, nSnap, qzSnap, aSnap] = await Promise.all([
      cRef.collection('modules').get(),
      cRef.collection('lessons').get(),
      cRef.collection('study_notes').get(),
      cRef.collection('quizzes').get(),
      cRef.collection('assignments').get(),
    ]);

    const modIds = new Set(mSnap.docs.map((d) => d.id));
    if (mSnap.size < 5) {
      issues.push(`Course ${seedCourse.id} has ${mSnap.size} modules (expected >= 5)`);
    }
    verifiedModules += mSnap.size;

    const lesModMap = new Map<string, string>();
    const modLessonCounts = new Map<string, number>();
    for (const d of lSnap.docs) {
      const data = d.data();
      const modId = data.moduleId as string;
      if (!modIds.has(modId)) {
        issues.push(`Course ${seedCourse.id} lesson ${d.id} points to missing module ${modId}`);
      }
      if (data.status !== 'published') {
        issues.push(`Course ${seedCourse.id} lesson ${d.id} is not published`);
      }
      lesModMap.set(d.id, modId);
      modLessonCounts.set(modId, (modLessonCounts.get(modId) || 0) + 1);
    }
    for (const mId of modIds) {
      if ((modLessonCounts.get(mId) || 0) < 3) {
        issues.push(`Course ${seedCourse.id} module ${mId} has < 3 lessons`);
      }
    }
    verifiedLessons += lSnap.size;

    for (const d of nSnap.docs) {
      const data = d.data();
      if (data.status !== 'published') {
        issues.push(`Course ${seedCourse.id} study note ${d.id} is not published`);
      }
      if (!modIds.has(data.moduleId as string)) {
        issues.push(`Course ${seedCourse.id} study note ${d.id} has invalid moduleId`);
      }
      if (data.lessonId && lesModMap.get(data.lessonId as string) !== data.moduleId) {
        issues.push(`Course ${seedCourse.id} study note ${d.id} lessonId link mismatch`);
      }
    }
    if (nSnap.size < 2) {
      issues.push(`Course ${seedCourse.id} has ${nSnap.size} study notes (expected >= 2)`);
    }
    verifiedStudyNotes += nSnap.size;

    for (const qzDoc of qzSnap.docs) {
      const qqSnap = await cRef.collection('quizzes').doc(qzDoc.id).collection('questions').get();
      verifiedQuestions += qqSnap.size;
    }
    verifiedQuizzes += qzSnap.size;
    verifiedAssignments += aSnap.size;
  }

  console.log('\n=== FIRESTORE LIVE READBACK VERIFICATION REPORT ===');
  console.log(`  Departments verified:         ${verifiedDepts}/4`);
  console.log(`  Published courses verified:   ${verifiedCourses}/31`);
  console.log(`  Modules verified:             ${verifiedModules}/155`);
  console.log(`  Lessons verified:             ${verifiedLessons}/465`);
  console.log(`  Study notes verified:         ${verifiedStudyNotes}/62`);
  console.log(`  Quizzes verified:             ${verifiedQuizzes}/62`);
  console.log(`  Quiz questions verified:      ${verifiedQuestions}/248`);
  console.log(`  Capstone assignments:         ${verifiedAssignments}/31`);

  if (issues.length > 0) {
    console.error(`\n[VERIFICATION FAILED] Found ${issues.length} issue(s):`);
    issues.forEach((msg) => console.error(`  - ${msg}`));
    return false;
  }

  console.log('\n[VERIFICATION PASSED] All departments, courses, modules, lessons, study notes, quizzes, and assignments are live in Firestore.');
  return true;
}

function printAdcHelp(err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('\n[AUTH / PERMISSION ERROR]');
  console.error(msg);
  console.error('\nTo authorize your local Google account via Application Default Credentials (ADC), run:');
  console.error('  gcloud auth application-default login');
  console.error(`  gcloud config set project ${EXPECTED_PROJECT_ID}`);
  console.error('Then re-run:');
  console.error('  npm run seed:curriculum:check');
  console.error('  npm run seed:curriculum');
}

async function main(): Promise<number> {
  const args = new Set(process.argv.slice(2));
  const isDryRun = args.has('--dry-run');

  console.log('================================================================');
  console.log(`RM HEAVEN Curriculum Seeder (${isDryRun ? 'DRY RUN CHECK MODE' : 'LIVE WRITE MODE'})`);
  console.log('================================================================');

  console.log('[Step 1/5] Verifying Firebase project, database ID, and curriculum bundle...');
  const config = loadAndVerifyConfig();
  console.log(`  Target Project ID:  ${config.projectId}`);
  console.log(`  Target Database ID: ${config.firestoreDatabaseId}`);
  validateLocalCurriculum();

  let app: App | undefined;
  let db: Firestore | undefined;
  try {
    app = getApps().length
      ? getApp()
      : initializeApp({
          credential: applicationDefault(),
          projectId: config.projectId,
        });

    db =
      config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
        ? getFirestore(app, config.firestoreDatabaseId)
        : getFirestore(app);

    const existing = await inspectExistingDatabase(db);
    summarizePlan(existing);

    if (isDryRun) {
      console.log('\n[DRY RUN COMPLETE] Target verified and plan computed. Zero documents were written or modified.');
      return 0;
    }

    const writer = new AdminBatchWriter(db);
    const actorUid = existing.adminUid;

    console.log('\n[Step 3/5] Writing Pass 1/3: 4 Departments & 31 Published Courses...');
    for (const dept of RM_DEPARTMENTS) {
      const prev = existing.departments.get(dept.id);
      writer.queue(db.collection('departments').doc(dept.id), {
        id: dept.id,
        slug: dept.slug,
        name: dept.name,
        description: dept.description,
        orderIndex: dept.orderIndex,
        status: dept.status,
        createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    for (const c of ALL_SEED_COURSES) {
      const prev = existing.courses.get(c.id);
      writer.queue(db.collection('courses').doc(c.id), {
        id: c.id,
        title: c.title.slice(0, 160),
        departmentId: c.departmentId,
        departmentName: c.departmentName.slice(0, 140),
        category: c.category.slice(0, 80),
        level: c.level,
        duration: c.duration.slice(0, 64),
        shortDescription: c.shortDescription.slice(0, 320),
        fullDescription: c.fullDescription.slice(0, 4000),
        introduction: c.introduction.slice(0, 3000),
        objectives: c.objectives.map((o) => o.slice(0, 240)).slice(0, 15),
        targetAudience: c.targetAudience.slice(0, 1000),
        prerequisites: c.prerequisites.slice(0, 1000),
        syllabusSummary: c.syllabusSummary.map((s) => s.slice(0, 240)).slice(0, 24),
        moduleAssessments: c.moduleAssessments.map((m) => m.slice(0, 240)).slice(0, 16),
        finalAssessmentTitle: c.finalAssessmentTitle.slice(0, 300),
        thumbnailUrl: c.thumbnailUrl.slice(0, 500),
        outcomes: c.outcomes.map((o) => o.slice(0, 200)).slice(0, 15),
        status: 'published',
        createdBy: (prev?.createdBy as string | undefined) ?? actorUid,
        createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    await writer.commitAll('Pass 1/3 Depts & Courses');

    console.log('\n[Step 4/5] Writing Pass 2/3: 155 Modules, 465 Lessons, 62 Study Notes, 62 Quizzes & 31 Assignments...');
    for (const c of ALL_SEED_COURSES) {
      const cRef = db.collection('courses').doc(c.id);
      const prevMods = existing.modules.get(c.id);
      const prevLess = existing.lessons.get(c.id);
      const prevNotes = existing.studyNotes.get(c.id);
      const prevQuizzes = existing.quizzes.get(c.id);
      const prevAssigns = existing.assignments.get(c.id);

      for (const m of c.modules) {
        const prev = prevMods?.get(m.id);
        writer.queue(cRef.collection('modules').doc(m.id), {
          id: m.id,
          courseId: c.id,
          title: m.title.slice(0, 160),
          description: m.description.slice(0, 1000),
          assessmentTitle: m.assessmentTitle.slice(0, 200),
          assessmentCriteria: m.assessmentCriteria.slice(0, 1000),
          orderIndex: m.orderIndex,
          createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      for (const l of c.lessons) {
        const prev = prevLess?.get(l.id);
        writer.queue(cRef.collection('lessons').doc(l.id), {
          id: l.id,
          courseId: c.id,
          moduleId: l.moduleId,
          title: l.title.slice(0, 160),
          summary: l.summary.slice(0, 500),
          objectives: l.objectives.map((o) => o.slice(0, 200)).slice(0, 12),
          contentBody: l.contentBody.slice(0, 20000),
          examples: l.examples.slice(0, 10000),
          exercisePrompt: l.exercisePrompt.slice(0, 4000),
          status: 'published',
          durationMinutes: l.durationMinutes,
          orderIndex: l.orderIndex,
          createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      for (const n of c.studyNotes) {
        const prev = prevNotes?.get(n.id);
        const notePayload: DocumentData = {
          id: n.id,
          courseId: c.id,
          moduleId: n.moduleId,
          title: n.title.slice(0, 180),
          sourceType: 'official',
          status: 'published',
          topicIntroduction: n.topicIntroduction.slice(0, 3000),
          simpleExplanation: n.simpleExplanation.slice(0, 4000),
          detailedExplanation: n.detailedExplanation.slice(0, 8000),
          keyConcepts: n.keyConcepts.slice(0, 6000),
          stepByStepExplanation: n.stepByStepExplanation.slice(0, 6000),
          practicalExamples: n.practicalExamples.slice(0, 8000),
          realWorldApplications: n.realWorldApplications.slice(0, 4000),
          importantPoints: n.importantPoints.slice(0, 4000),
          commonMistakes: n.commonMistakes.slice(0, 4000),
          summary: n.summary.slice(0, 3000),
          practiceQuestions: n.practiceQuestions.slice(0, 8000),
          createdBy: (prev?.createdBy as string | undefined) ?? actorUid,
          createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };
        if (n.lessonId) notePayload.lessonId = n.lessonId;
        if (n.domainSupplement) notePayload.domainSupplement = n.domainSupplement.slice(0, 6000);
        writer.queue(cRef.collection('study_notes').doc(n.id), notePayload);
      }

      for (const qz of c.quizzes) {
        const prev = prevQuizzes?.get(qz.id);
        const quizPayload: DocumentData = {
          id: qz.id,
          courseId: c.id,
          quizType: qz.quizType,
          title: qz.title.slice(0, 180),
          description: qz.description.slice(0, 1000),
          passingPercent: qz.passingPercent,
          status: 'published',
          questionCount: qz.questions.length,
          createdBy: (prev?.createdBy as string | undefined) ?? actorUid,
          createdAt: prev?.createdAt ?? FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };
        if (qz.moduleId) quizPayload.moduleId = qz.moduleId;
        writer.queue(cRef.collection('quizzes').doc(qz.id), quizPayload);
      }

      const a = c.assignment;
      const prevA = prevAssigns?.get(a.id);
      writer.queue(cRef.collection('assignments').doc(a.id), {
        id: a.id,
        courseId: c.id,
        courseTitle: c.title.slice(0, 160),
        title: a.title.slice(0, 160),
        instructions: a.instructions.slice(0, 5000),
        dueDate: a.dueDate.slice(0, 40),
        maxMarks: a.maxMarks,
        status: 'published',
        createdBy: (prevA?.createdBy as string | undefined) ?? actorUid,
        createdAt: prevA?.createdAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    await writer.commitAll('Pass 2/3 Curriculum Content');

    console.log('\nWriting Pass 3/3: 248 Quiz Questions & Audit Record...');
    for (const c of ALL_SEED_COURSES) {
      const cRef = db.collection('courses').doc(c.id);
      for (const qz of c.quizzes) {
        for (const question of qz.questions) {
          writer.queue(
            cRef.collection('quizzes').doc(qz.id).collection('questions').doc(question.id),
            {
              id: question.id,
              courseId: c.id,
              quizId: qz.id,
              questionText: question.questionText.slice(0, 1000),
              options: question.options.map((opt) => opt.slice(0, 300)).slice(0, 6),
              correctIndex: question.correctIndex,
              explanation: question.explanation.slice(0, 1500),
              topicTag: question.topicTag.slice(0, 120),
              orderIndex: question.orderIndex,
            },
          );
        }
      }
    }

    const auditId = `adc_seed_${Date.now()}`;
    writer.queue(db.collection('audit_logs').doc(auditId), {
      id: auditId,
      actorId: actorUid,
      actorEmail: ADMIN_EMAIL,
      action: 'Local ADC Curriculum Seed',
      targetType: 'curriculum',
      targetId: 'rm_heaven_31_courses',
      details: 'Idempotent Admin SDK ADC seed across 4 departments, 31 courses, 155 modules, 465 lessons, 62 study notes.',
      createdAt: FieldValue.serverTimestamp(),
    });

    await writer.commitAll('Pass 3/3 Questions & Audit');

    const ok = await verifySeededDatabase(db);
    console.log(`\nTotal Firestore document writes committed: ${writer.committedWrites}`);
    return ok ? 0 : 1;
  } catch (err) {
    printAdcHelp(err);
    return 1;
  } finally {
    if (db) {
      await db.terminate().catch(() => undefined);
    }
    if (app) {
      await deleteApp(app).catch(() => undefined);
    }
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
