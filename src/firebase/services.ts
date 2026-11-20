import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, handleFirestoreError, OperationType, storage } from './config';
import type {
  AdminUser,
  AiTutorMessage,
  AiTutorSession,
  Assignment,
  AssignmentSubmission,
  AuditLog,
  Certificate,
  CertificateVerification,
  Course,
  CourseLesson,
  CourseModule,
  Department,
  EnrollmentRequest,
  Internship,
  InternshipApplication,
  InternshipApplicationStatus,
  LearningMaterial,
  NotificationItem,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  SavedAiNote,
  SavedAiNoteMode,
  StudentEnrollment,
  StudyNote,
  SupportTicket,
  SupportTicketStatus,
  UserProfile,
  WebsiteContent,
} from '../types';
import { DEFAULT_WEBSITE_CONTENT } from '../constants/legal';

export function timestampToMillis(ts: unknown): number {
  if (!ts) return 0;
  if (typeof ts === 'object' && ts !== null && 'toMillis' in ts && typeof (ts as { toMillis: () => number }).toMillis === 'function') {
    return (ts as { toMillis: () => number }).toMillis();
  }
  if (typeof ts === 'object' && ts !== null && 'seconds' in ts) {
    return Number((ts as { seconds: number }).seconds) * 1000;
  }
  if (ts instanceof Date) return ts.getTime();
  return 0;
}

export function formatTimestamp(ts: unknown): string {
  const ms = timestampToMillis(ts);
  if (!ms) return 'Just now';
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function cleanStr(val: string | undefined, max: number): string | undefined {
  if (!val) return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

// -----------------------------------------------------------------------------
// Notifications & Audit Logs
// -----------------------------------------------------------------------------
export async function createNotification(input: {
  recipientId: string;
  recipientRole: 'student' | 'admin';
  title: string;
  message: string;
  type: NotificationItem['type'];
  linkPath?: string;
}): Promise<void> {
  const colRef = collection(db, 'notifications');
  const docRef = doc(colRef);
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      recipientId: input.recipientId.slice(0, 128),
      recipientRole: input.recipientRole,
      title: input.title.trim().slice(0, 160),
      message: input.message.trim().slice(0, 600),
      type: input.type,
      read: false,
      createdAt: serverTimestamp(),
    };
    const link = cleanStr(input.linkPath, 200);
    if (link) payload.linkPath = link;
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `notifications/${docRef.id}`);
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `notifications/${notificationId}`);
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `notifications/${notificationId}`);
  }
}

export async function recordAuditLog(input: {
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: string;
}): Promise<void> {
  const docRef = doc(collection(db, 'audit_logs'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      actorId: input.actorId,
      actorEmail: input.actorEmail.slice(0, 160),
      action: input.action.slice(0, 120),
      targetType: input.targetType.slice(0, 80),
      targetId: input.targetId.slice(0, 256),
      createdAt: serverTimestamp(),
    };
    const details = cleanStr(input.details, 1000);
    if (details) payload.details = details;
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `audit_logs/${docRef.id}`);
  }
}

// -----------------------------------------------------------------------------
// Storage Uploads
// -----------------------------------------------------------------------------
export async function uploadFileToStorage(
  storagePath: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const storageRef = ref(storage, storagePath);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress && snap.totalBytes > 0) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      (error) => {
        reject(
          new Error(
            error.message.includes('storage/unauthorized')
              ? 'Permission denied uploading file. Ensure your account is verified and authorized.'
              : `Storage upload failed (${error.code}). Ensure Firebase Storage is activated in Firebase Console, or provide a secure document URL.`,
          ),
        );
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

// -----------------------------------------------------------------------------
// Website Content CMS
// -----------------------------------------------------------------------------
export function subscribeWebsiteContent(cb: (content: WebsiteContent) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'website_content', 'global'),
    (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as WebsiteContent;
        const email =
          !raw.contactEmail || raw.contactEmail === 'admissions@rmheaven.academy'
            ? DEFAULT_WEBSITE_CONTENT.contactEmail
            : raw.contactEmail;
        const phone =
          !raw.contactPhone || raw.contactPhone === '+91 44 0000 0000'
            ? DEFAULT_WEBSITE_CONTENT.contactPhone
            : raw.contactPhone;
        cb({
          ...(DEFAULT_WEBSITE_CONTENT as WebsiteContent),
          ...raw,
          contactEmail: email,
          contactPhone: phone,
        });
      } else {
        cb(DEFAULT_WEBSITE_CONTENT as WebsiteContent);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'website_content/global');
    },
  );
}

export async function saveWebsiteContent(
  input: Partial<WebsiteContent>,
  actor: { uid: string; email: string },
): Promise<void> {
  const path = 'website_content/global';
  try {
    const payload: Record<string, unknown> = {
      id: 'global',
      updatedAt: serverTimestamp(),
    };
    const fields: Array<[keyof WebsiteContent, number]> = [
      ['heroHeadline', 180],
      ['heroSubtext', 600],
      ['welcomeTitle', 160],
      ['welcomeBody', 2000],
      ['announcementBanner', 400],
      ['contactEmail', 160],
      ['contactPhone', 40],
      ['officeLocation', 240],
    ];
    for (const [key, max] of fields) {
      const val = input[key];
      if (typeof val === 'string') {
        payload[key] = val.trim().slice(0, max);
      }
    }
    await setDoc(doc(db, 'website_content', 'global'), payload, { merge: true });
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: 'Updated website content',
      targetType: 'website_content',
      targetId: 'global',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// -----------------------------------------------------------------------------
// Academic Departments
// -----------------------------------------------------------------------------
export function subscribeActiveDepartments(cb: (depts: Department[]) => void): Unsubscribe {
  const q = query(collection(db, 'departments'), where('status', '==', 'active'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Department)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'departments'),
  );
}

export function subscribeAllDepartmentsAdmin(cb: (depts: Department[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'departments'),
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Department)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'departments'),
  );
}

export async function saveDepartment(
  input: {
    id?: string;
    slug: string;
    name: string;
    description: string;
    orderIndex: number;
    status: 'active' | 'archived';
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id ? doc(db, 'departments', input.id) : doc(collection(db, 'departments'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 100),
      name: input.name.trim().slice(0, 140),
      description: input.description.trim().slice(0, 1200),
      orderIndex: Math.max(0, Math.min(200, Math.round(input.orderIndex))),
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    if (!isEdit) {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated department' : 'Created department',
      targetType: 'department',
      targetId: docRef.id,
      details: input.name,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, `departments/${docRef.id}`);
  }
}

export async function deleteDepartment(departmentId: string, actor: { uid: string; email: string }): Promise<void> {
  try {
    await deleteDoc(doc(db, 'departments', departmentId));
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: 'Deleted department',
      targetType: 'department',
      targetId: departmentId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `departments/${departmentId}`);
  }
}

// -----------------------------------------------------------------------------
// Courses, Modules, Lessons, Study Notes, Materials, Quizzes
// -----------------------------------------------------------------------------
export function subscribePublishedCourses(cb: (courses: Course[]) => void): Unsubscribe {
  const q = query(collection(db, 'courses'), where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Course)
        .sort((a, b) => a.title.localeCompare(b.title));
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'courses'),
  );
}

export function subscribeAllCoursesAdmin(cb: (courses: Course[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'courses'),
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Course)
        .sort((a, b) => a.title.localeCompare(b.title));
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'courses'),
  );
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  try {
    const snap = await getDoc(doc(db, 'courses', courseId));
    return snap.exists() ? (snap.data() as Course) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `courses/${courseId}`);
  }
}

export async function createOrUpdateCourse(
  input: {
    id?: string;
    title: string;
    departmentId?: string;
    departmentName?: string;
    category: string;
    level: Course['level'];
    duration: string;
    shortDescription: string;
    fullDescription: string;
    introduction?: string;
    objectives?: string[];
    targetAudience?: string;
    prerequisites?: string;
    syllabusSummary?: string[];
    moduleAssessments?: string[];
    finalAssessmentTitle?: string;
    thumbnailUrl?: string;
    outcomes?: string[];
    status: Course['status'];
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id ? doc(db, 'courses', input.id) : doc(collection(db, 'courses'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      title: input.title.trim().slice(0, 160),
      category: input.category.trim().slice(0, 80),
      level: input.level,
      duration: input.duration.trim().slice(0, 64),
      shortDescription: input.shortDescription.trim().slice(0, 320),
      fullDescription: input.fullDescription.trim().slice(0, 4000),
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    const deptId = cleanStr(input.departmentId, 128);
    if (deptId) payload.departmentId = deptId;
    const deptName = cleanStr(input.departmentName, 140);
    if (deptName) payload.departmentName = deptName;
    const intro = cleanStr(input.introduction, 3000);
    if (intro) payload.introduction = intro;
    if (input.objectives && input.objectives.length > 0) {
      payload.objectives = input.objectives.map((o) => o.trim().slice(0, 240)).filter(Boolean).slice(0, 15);
    }
    const targetAudience = cleanStr(input.targetAudience, 1000);
    if (targetAudience) payload.targetAudience = targetAudience;
    const prerequisites = cleanStr(input.prerequisites, 1000);
    if (prerequisites) payload.prerequisites = prerequisites;
    if (input.syllabusSummary && input.syllabusSummary.length > 0) {
      payload.syllabusSummary = input.syllabusSummary.map((s) => s.trim().slice(0, 240)).filter(Boolean).slice(0, 24);
    }
    if (input.moduleAssessments && input.moduleAssessments.length > 0) {
      payload.moduleAssessments = input.moduleAssessments.map((s) => s.trim().slice(0, 240)).filter(Boolean).slice(0, 16);
    }
    const finalAssess = cleanStr(input.finalAssessmentTitle, 300);
    if (finalAssess) payload.finalAssessmentTitle = finalAssess;
    const thumb = cleanStr(input.thumbnailUrl, 500);
    if (thumb) payload.thumbnailUrl = thumb;
    if (input.outcomes && input.outcomes.length > 0) {
      payload.outcomes = input.outcomes
        .map((o) => o.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 15);
    }

    if (!isEdit) {
      payload.createdBy = actor.uid;
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }

    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated course' : 'Created course',
      targetType: 'course',
      targetId: docRef.id,
      details: `${input.title} (${input.status})`,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, `courses/${docRef.id}`);
  }
}

export async function deleteCourse(courseId: string, actor: { uid: string; email: string }): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId));
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: 'Deleted course',
      targetType: 'course',
      targetId: courseId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}`);
  }
}

export async function fetchCourseModules(courseId: string): Promise<CourseModule[]> {
  try {
    const snap = await getDocs(collection(db, 'courses', courseId, 'modules'));
    return snap.docs
      .map((d) => d.data() as CourseModule)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/modules`);
  }
}

export async function saveCourseModule(
  courseId: string,
  input: {
    id?: string;
    title: string;
    description?: string;
    assessmentTitle?: string;
    assessmentCriteria?: string;
    orderIndex: number;
  },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id
    ? doc(db, 'courses', courseId, 'modules', input.id)
    : doc(collection(db, 'courses', courseId, 'modules'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      courseId,
      title: input.title.trim().slice(0, 160),
      orderIndex: Math.max(0, Math.min(500, Math.round(input.orderIndex))),
      updatedAt: serverTimestamp(),
    };
    const desc = cleanStr(input.description, 1000);
    if (desc) payload.description = desc;
    const assessTitle = cleanStr(input.assessmentTitle, 200);
    if (assessTitle) payload.assessmentTitle = assessTitle;
    const assessCrit = cleanStr(input.assessmentCriteria, 1000);
    if (assessCrit) payload.assessmentCriteria = assessCrit;

    if (!isEdit) {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/modules/${docRef.id}`,
    );
  }
}

export async function deleteCourseModule(courseId: string, moduleId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId, 'modules', moduleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/modules/${moduleId}`);
  }
}

export async function fetchCourseLessons(courseId: string, isAdminView = false): Promise<CourseLesson[]> {
  try {
    const colRef = collection(db, 'courses', courseId, 'lessons');
    if (isAdminView) {
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data() as CourseLesson).sort((a, b) => a.orderIndex - b.orderIndex);
    }
    const publishedSnap = await getDocs(query(colRef, where('status', '==', 'published')));
    if (publishedSnap.size > 0) {
      return publishedSnap.docs
        .map((d) => d.data() as CourseLesson)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    }
    // Safe fallback for legacy pre-LMS lessons without a status attribute
    try {
      const legacySnap = await getDocs(colRef);
      return legacySnap.docs
        .map((d) => d.data() as CourseLesson)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    } catch {
      return [];
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/lessons`);
  }
}

export async function saveCourseLesson(
  courseId: string,
  input: {
    id?: string;
    moduleId: string;
    title: string;
    summary?: string;
    objectives?: string[];
    contentBody: string;
    examples?: string;
    exercisePrompt?: string;
    status?: 'published' | 'draft';
    durationMinutes?: number;
    orderIndex: number;
  },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id
    ? doc(db, 'courses', courseId, 'lessons', input.id)
    : doc(collection(db, 'courses', courseId, 'lessons'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      courseId,
      moduleId: input.moduleId,
      title: input.title.trim().slice(0, 160),
      contentBody: input.contentBody.trim().slice(0, 20000),
      status: input.status ?? 'published',
      orderIndex: Math.max(0, Math.min(500, Math.round(input.orderIndex))),
      updatedAt: serverTimestamp(),
    };
    const summary = cleanStr(input.summary, 500);
    if (summary) payload.summary = summary;
    if (input.objectives && input.objectives.length > 0) {
      payload.objectives = input.objectives.map((o) => o.trim().slice(0, 200)).filter(Boolean).slice(0, 12);
    }
    const examples = cleanStr(input.examples, 10000);
    if (examples) payload.examples = examples;
    const exercise = cleanStr(input.exercisePrompt, 4000);
    if (exercise) payload.exercisePrompt = exercise;
    if (input.durationMinutes && input.durationMinutes >= 1) {
      payload.durationMinutes = Math.min(600, Math.round(input.durationMinutes));
    }
    if (!isEdit) {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/lessons/${docRef.id}`,
    );
  }
}

export async function deleteCourseLesson(courseId: string, lessonId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId, 'lessons', lessonId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/lessons/${lessonId}`);
  }
}

export async function fetchCourseStudyNotes(courseId: string, isAdminView = false): Promise<StudyNote[]> {
  try {
    const colRef = collection(db, 'courses', courseId, 'study_notes');
    const q = isAdminView ? colRef : query(colRef, where('status', '==', 'published'));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as StudyNote)
      .sort(
        (a, b) =>
          a.id.localeCompare(b.id, undefined, { numeric: true }) ||
          a.title.localeCompare(b.title),
      );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/study_notes`);
  }
}

export async function fetchStudyNoteCountsByCourse(courseIds: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    courseIds.map(async (courseId) => {
      try {
        const snap = await getCountFromServer(collection(db, 'courses', courseId, 'study_notes'));
        counts[courseId] = snap.data().count;
      } catch {
        counts[courseId] = 0;
      }
    }),
  );
  return counts;
}

export async function saveStudyNote(
  courseId: string,
  input: {
    id?: string;
    moduleId: string;
    lessonId?: string;
    title: string;
    sourceType: 'official' | 'ai_assisted_admin';
    status: 'published' | 'draft';
    topicIntroduction: string;
    simpleExplanation: string;
    detailedExplanation: string;
    keyConcepts: string;
    stepByStepExplanation: string;
    practicalExamples: string;
    realWorldApplications: string;
    importantPoints: string;
    commonMistakes: string;
    summary: string;
    practiceQuestions: string;
    domainSupplement?: string;
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id
    ? doc(db, 'courses', courseId, 'study_notes', input.id)
    : doc(collection(db, 'courses', courseId, 'study_notes'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      courseId,
      moduleId: input.moduleId,
      title: input.title.trim().slice(0, 180),
      sourceType: input.sourceType,
      status: input.status,
      topicIntroduction: input.topicIntroduction.trim().slice(0, 3000),
      simpleExplanation: input.simpleExplanation.trim().slice(0, 4000),
      detailedExplanation: input.detailedExplanation.trim().slice(0, 8000),
      keyConcepts: input.keyConcepts.trim().slice(0, 6000),
      stepByStepExplanation: input.stepByStepExplanation.trim().slice(0, 6000),
      practicalExamples: input.practicalExamples.trim().slice(0, 8000),
      realWorldApplications: input.realWorldApplications.trim().slice(0, 4000),
      importantPoints: input.importantPoints.trim().slice(0, 4000),
      commonMistakes: input.commonMistakes.trim().slice(0, 4000),
      summary: input.summary.trim().slice(0, 3000),
      practiceQuestions: input.practiceQuestions.trim().slice(0, 8000),
      updatedAt: serverTimestamp(),
    };
    const lessonId = cleanStr(input.lessonId, 128);
    if (lessonId) payload.lessonId = lessonId;
    const supplement = cleanStr(input.domainSupplement, 6000);
    if (supplement) payload.domainSupplement = supplement;

    if (!isEdit) {
      payload.createdBy = actor.uid;
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated official study note' : 'Created official study note',
      targetType: 'study_note',
      targetId: docRef.id,
      details: `${courseId}: ${input.title} (${input.status})`,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/study_notes/${docRef.id}`,
    );
  }
}

export async function deleteStudyNote(courseId: string, noteId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId, 'study_notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/study_notes/${noteId}`);
  }
}

export async function fetchCourseMaterials(courseId: string, isAdminView = false): Promise<LearningMaterial[]> {
  try {
    const colRef = collection(db, 'courses', courseId, 'materials');
    const q = isAdminView ? colRef : query(colRef, where('status', '==', 'active'));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as LearningMaterial)
      .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/materials`);
  }
}

export async function saveLearningMaterial(
  courseId: string,
  input: {
    id?: string;
    moduleId: string;
    lessonId?: string;
    title: string;
    description: string;
    fileUrl: string;
    fileName: string;
    fileType?: string;
    downloadAllowed: boolean;
    status: 'active' | 'draft' | 'archived';
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id
    ? doc(db, 'courses', courseId, 'materials', input.id)
    : doc(collection(db, 'courses', courseId, 'materials'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      courseId,
      moduleId: input.moduleId,
      title: input.title.trim().slice(0, 160),
      description: input.description.trim().slice(0, 1000),
      fileUrl: input.fileUrl.trim().slice(0, 1000),
      fileName: input.fileName.trim().slice(0, 200),
      downloadAllowed: input.downloadAllowed,
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    const lessonId = cleanStr(input.lessonId, 128);
    if (lessonId) payload.lessonId = lessonId;
    const fileType = cleanStr(input.fileType, 80);
    if (fileType) payload.fileType = fileType;

    if (!isEdit) {
      payload.uploadedBy = actor.uid;
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }

    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated learning material' : 'Uploaded learning material',
      targetType: 'learning_material',
      targetId: docRef.id,
      details: `${input.title} (${input.status}, downloadAllowed=${input.downloadAllowed})`,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/materials/${docRef.id}`,
    );
  }
}

export async function deleteLearningMaterial(courseId: string, materialId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId, 'materials', materialId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/materials/${materialId}`);
  }
}

export async function fetchCourseQuizzes(courseId: string, isAdminView = false): Promise<Quiz[]> {
  try {
    const colRef = collection(db, 'courses', courseId, 'quizzes');
    const q = isAdminView ? colRef : query(colRef, where('status', '==', 'published'));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as Quiz)
      .sort((a, b) => (a.quizType === 'final' ? 1 : -1) - (b.quizType === 'final' ? 1 : -1));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/quizzes`);
  }
}

export async function fetchQuizQuestions(courseId: string, quizId: string): Promise<QuizQuestion[]> {
  try {
    const snap = await getDocs(collection(db, 'courses', courseId, 'quizzes', quizId, 'questions'));
    return snap.docs
      .map((d) => d.data() as QuizQuestion)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/quizzes/${quizId}/questions`);
  }
}

export async function saveQuizWithQuestions(
  courseId: string,
  input: {
    id?: string;
    moduleId?: string;
    quizType: 'module' | 'final' | 'practice';
    title: string;
    description: string;
    passingPercent: number;
    status: 'published' | 'draft';
    questions: Array<{
      id?: string;
      questionText: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      topicTag?: string;
      orderIndex: number;
    }>;
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const quizRef = input.id
    ? doc(db, 'courses', courseId, 'quizzes', input.id)
    : doc(collection(db, 'courses', courseId, 'quizzes'));
  try {
    const cleanQuestions = input.questions
      .filter((q) => q.questionText.trim().length >= 5 && q.options.length >= 2)
      .slice(0, 50);

    const quizPayload: Record<string, unknown> = {
      id: quizRef.id,
      courseId,
      quizType: input.quizType,
      title: input.title.trim().slice(0, 180),
      description: input.description.trim().slice(0, 1000),
      passingPercent: Math.max(1, Math.min(100, Math.round(input.passingPercent))),
      status: input.status,
      questionCount: cleanQuestions.length,
      updatedAt: serverTimestamp(),
    };
    const moduleId = cleanStr(input.moduleId, 128);
    if (moduleId) quizPayload.moduleId = moduleId;

    if (!isEdit) {
      quizPayload.createdBy = actor.uid;
      quizPayload.createdAt = serverTimestamp();
      await setDoc(quizRef, quizPayload);
    } else {
      await updateDoc(quizRef, quizPayload);
    }

    // Write question bank after parent quiz document exists on Firestore server
    const existingQSnap = isEdit
      ? await getDocs(collection(db, 'courses', courseId, 'quizzes', quizRef.id, 'questions'))
      : null;

    const batch = writeBatch(db);
    const nextIds = new Set<string>();

    cleanQuestions.forEach((q, idx) => {
      const qId = q.id && q.id.trim() ? q.id.trim() : `q-${idx + 1}-${Date.now()}`;
      nextIds.add(qId);
      const qRef = doc(db, 'courses', courseId, 'quizzes', quizRef.id, 'questions', qId);
      const opts = q.options.map((o) => o.trim().slice(0, 300)).filter(Boolean).slice(0, 6);
      const safeCorrect = Math.max(0, Math.min(opts.length - 1, Math.round(q.correctIndex)));
      const qPayload: Record<string, unknown> = {
        id: qId,
        courseId,
        quizId: quizRef.id,
        questionText: q.questionText.trim().slice(0, 1000),
        options: opts,
        correctIndex: safeCorrect,
        explanation: (q.explanation.trim() || 'Review the corresponding course lesson and study notes.').slice(0, 1500),
        orderIndex: q.orderIndex || idx + 1,
      };
      const tag = cleanStr(q.topicTag, 120);
      if (tag) qPayload.topicTag = tag;
      batch.set(qRef, qPayload);
    });

    if (existingQSnap) {
      existingQSnap.docs.forEach((d) => {
        if (!nextIds.has(d.id)) {
          batch.delete(d.ref);
        }
      });
    }

    await batch.commit();

    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated quiz' : 'Created quiz',
      targetType: 'quiz',
      targetId: quizRef.id,
      details: `${courseId}: ${input.title} (${cleanQuestions.length} questions)`,
    });
    return quizRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/quizzes/${quizRef.id}`,
    );
  }
}

export async function deleteQuiz(courseId: string, quizId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', courseId, 'quizzes', quizId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/quizzes/${quizId}`);
  }
}

export async function submitQuizAttempt(input: {
  quizId: string;
  quizTitle: string;
  courseId: string;
  moduleId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  weakTopics: string[];
  answersJson: string;
  source: 'course_quiz' | 'ai_practice';
}): Promise<string> {
  const docRef = doc(collection(db, 'quiz_attempts'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      quizId: input.quizId.slice(0, 128),
      quizTitle: input.quizTitle.trim().slice(0, 180),
      courseId: input.courseId,
      studentId: input.studentId,
      studentName: input.studentName.trim().slice(0, 120),
      studentEmail: input.studentEmail.trim().slice(0, 160),
      scorePercent: Math.max(0, Math.min(100, Math.round(input.scorePercent))),
      correctCount: Math.max(0, Math.min(200, Math.round(input.correctCount))),
      totalQuestions: Math.max(1, Math.min(200, Math.round(input.totalQuestions))),
      weakTopics: input.weakTopics.map((t) => t.trim().slice(0, 120)).filter(Boolean).slice(0, 20),
      answersJson: input.answersJson.slice(0, 10000),
      source: input.source,
      createdAt: serverTimestamp(),
    };
    const moduleId = cleanStr(input.moduleId, 128);
    if (moduleId) payload.moduleId = moduleId;
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `quiz_attempts/${docRef.id}`);
  }
}

export async function fetchStudentQuizAttempts(studentId: string): Promise<QuizAttempt[]> {
  try {
    const q = query(collection(db, 'quiz_attempts'), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as QuizAttempt)
      .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'quiz_attempts');
  }
}

export async function fetchAllQuizAttemptsAdmin(): Promise<QuizAttempt[]> {
  try {
    const snap = await getDocs(collection(db, 'quiz_attempts'));
    return snap.docs
      .map((d) => d.data() as QuizAttempt)
      .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'quiz_attempts');
  }
}

// -----------------------------------------------------------------------------
// Personal AI Notes & RM HEAVEN AI Tutor Sessions
// -----------------------------------------------------------------------------
export function subscribeSavedAiNotes(studentId: string, cb: (notes: SavedAiNote[]) => void): Unsubscribe {
  const q = query(collection(db, 'saved_ai_notes'), where('studentId', '==', studentId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as SavedAiNote)
        .sort((a, b) => timestampToMillis(b.updatedAt) - timestampToMillis(a.updatedAt));
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'saved_ai_notes'),
  );
}

export async function savePersonalAiNote(input: {
  id?: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  noteMode: SavedAiNoteMode;
  language: string;
  title: string;
  content: string;
}): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id ? doc(db, 'saved_ai_notes', input.id) : doc(collection(db, 'saved_ai_notes'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      studentId: input.studentId,
      courseId: input.courseId,
      courseTitle: input.courseTitle.trim().slice(0, 160),
      noteMode: input.noteMode,
      language: (input.language.trim() || 'English').slice(0, 60),
      title: input.title.trim().slice(0, 180),
      content: input.content.trim().slice(0, 25000),
      isAiGenerated: true,
      updatedAt: serverTimestamp(),
    };
    const lessonId = cleanStr(input.lessonId, 128);
    if (lessonId) payload.lessonId = lessonId;
    const lessonTitle = cleanStr(input.lessonTitle, 180);
    if (lessonTitle) payload.lessonTitle = lessonTitle;

    if (!isEdit) {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `saved_ai_notes/${docRef.id}`,
    );
  }
}

export async function deletePersonalAiNote(noteId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'saved_ai_notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `saved_ai_notes/${noteId}`);
  }
}

export async function loadAiTutorSession(studentId: string, courseId: string): Promise<AiTutorSession | null> {
  const sessionId = `${studentId}_${courseId}`;
  try {
    const snap = await getDoc(doc(db, 'ai_tutor_sessions', sessionId));
    return snap.exists() ? (snap.data() as AiTutorSession) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `ai_tutor_sessions/${sessionId}`);
  }
}

export async function saveAiTutorSession(input: {
  studentId: string;
  courseId: string;
  lessonId?: string;
  language: string;
  mode: string;
  messages: AiTutorMessage[];
}): Promise<void> {
  const sessionId = `${input.studentId}_${input.courseId}`;
  const docRef = doc(db, 'ai_tutor_sessions', sessionId);
  try {
    const existing = await getDoc(docRef);
    const trimmed = input.messages.slice(-24);
    let json = JSON.stringify(trimmed);
    if (json.length > 44000) {
      json = JSON.stringify(trimmed.slice(-10));
    }
    const payload: Record<string, unknown> = {
      id: sessionId,
      studentId: input.studentId,
      courseId: input.courseId,
      language: (input.language.trim() || 'English').slice(0, 60),
      mode: (input.mode.trim() || 'Simple Explanation').slice(0, 60),
      messagesJson: json.slice(0, 45000),
      updatedAt: serverTimestamp(),
    };
    const lessonId = cleanStr(input.lessonId, 128);
    if (lessonId) payload.lessonId = lessonId;

    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `ai_tutor_sessions/${sessionId}`);
  }
}

export async function clearAiTutorSession(studentId: string, courseId: string): Promise<void> {
  const sessionId = `${studentId}_${courseId}`;
  try {
    await deleteDoc(doc(db, 'ai_tutor_sessions', sessionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `ai_tutor_sessions/${sessionId}`);
  }
}

// -----------------------------------------------------------------------------
// Enrollment Requests & Authoritative Student Enrollments
// -----------------------------------------------------------------------------
export async function submitEnrollmentRequest(input: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  note?: string;
}): Promise<string> {
  const existingQ = query(
    collection(db, 'enrollment_requests'),
    where('studentId', '==', input.studentId),
    where('courseId', '==', input.courseId),
  );
  try {
    const existingSnap = await getDocs(existingQ);
    const activeReq = existingSnap.docs.find((d) => {
      const st = (d.data() as EnrollmentRequest).status;
      return st === 'Pending' || st === 'Approved';
    });
    if (activeReq) {
      const status = (activeReq.data() as EnrollmentRequest).status;
      throw new Error(
        status === 'Approved'
          ? 'You are already enrolled in this course.'
          : 'You already have a pending enrollment request for this course.',
      );
    }

    const docRef = doc(collection(db, 'enrollment_requests'));
    const payload: Record<string, unknown> = {
      id: docRef.id,
      studentId: input.studentId,
      studentName: input.studentName.trim().slice(0, 120),
      studentEmail: input.studentEmail.trim().slice(0, 160),
      courseId: input.courseId,
      courseTitle: input.courseTitle.trim().slice(0, 160),
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const note = cleanStr(input.note, 600);
    if (note) payload.note = note;

    await setDoc(docRef, payload);

    await createNotification({
      recipientId: 'ADMIN',
      recipientRole: 'admin',
      title: 'New Course Enrollment Request',
      message: `${input.studentName} requested enrollment in "${input.courseTitle}".`,
      type: 'enrollment',
      linkPath: '/admin',
    });

    return docRef.id;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('already enrolled') || error.message.includes('already have'))) {
      throw error;
    }
    handleFirestoreError(error, OperationType.CREATE, 'enrollment_requests');
  }
}

export async function cancelEnrollmentRequest(requestId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'enrollment_requests', requestId), {
      status: 'Cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `enrollment_requests/${requestId}`);
  }
}

export async function reviewEnrollmentRequest(
  request: EnrollmentRequest,
  decision: 'Approved' | 'Rejected',
  feedback: string,
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    const batch = writeBatch(db);
    const reqRef = doc(db, 'enrollment_requests', request.id);
    const updateData: Record<string, unknown> = {
      status: decision,
      reviewedBy: admin.uid,
      updatedAt: serverTimestamp(),
    };
    const fb = cleanStr(feedback, 1000);
    if (fb) updateData.adminFeedback = fb;
    batch.update(reqRef, updateData);

    if (decision === 'Approved') {
      const enrollmentId = `${request.studentId}_${request.courseId}`;
      const enrollmentRef = doc(db, 'student_enrollments', enrollmentId);
      batch.set(enrollmentRef, {
        id: enrollmentId,
        studentId: request.studentId,
        courseId: request.courseId,
        courseTitle: request.courseTitle.slice(0, 160),
        status: 'active',
        completedLessonIds: [],
        progressPercent: 0,
        approvedBy: admin.uid,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();

    await createNotification({
      recipientId: request.studentId,
      recipientRole: 'student',
      title: decision === 'Approved' ? 'Course Enrollment Approved' : 'Course Enrollment Update',
      message:
        decision === 'Approved'
          ? `Your enrollment in "${request.courseTitle}" has been approved. You may now access lessons and materials in My Courses.`
          : `Your enrollment request for "${request.courseTitle}" was not approved.${fb ? ` Feedback: ${fb}` : ''}`,
      type: 'enrollment',
      linkPath: '/dashboard',
    });

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: `${decision} enrollment request`,
      targetType: 'enrollment_request',
      targetId: request.id,
      details: `${request.studentEmail} -> ${request.courseTitle}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `enrollment_requests/${request.id}`);
  }
}

export async function toggleLessonCompletion(
  enrollment: StudentEnrollment,
  lessonId: string,
  totalLessons: number,
): Promise<void> {
  const current = enrollment.completedLessonIds || [];
  const exists = current.includes(lessonId);
  const next = exists ? current.filter((id) => id !== lessonId) : [...current, lessonId];
  const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((next.length / totalLessons) * 100)) : 0;

  try {
    await updateDoc(doc(db, 'student_enrollments', enrollment.id), {
      completedLessonIds: next.slice(0, 200),
      progressPercent,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `student_enrollments/${enrollment.id}`);
  }
}

// -----------------------------------------------------------------------------
// Assignments & Submissions
// -----------------------------------------------------------------------------
export async function fetchCourseAssignments(courseId: string): Promise<Assignment[]> {
  try {
    const snap = await getDocs(collection(db, 'courses', courseId, 'assignments'));
    return snap.docs
      .map((d) => d.data() as Assignment)
      .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/assignments`);
  }
}

export async function saveAssignment(
  courseId: string,
  courseTitle: string,
  input: {
    id?: string;
    title: string;
    instructions: string;
    dueDate: string;
    maxMarks: number;
    status: 'published' | 'closed';
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id
    ? doc(db, 'courses', courseId, 'assignments', input.id)
    : doc(collection(db, 'courses', courseId, 'assignments'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      courseId,
      courseTitle: courseTitle.slice(0, 160),
      title: input.title.trim().slice(0, 160),
      instructions: input.instructions.trim().slice(0, 5000),
      dueDate: input.dueDate.trim().slice(0, 40),
      maxMarks: Math.max(1, Math.min(1000, Math.round(input.maxMarks))),
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    if (!isEdit) {
      payload.createdBy = actor.uid;
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated assignment' : 'Created assignment',
      targetType: 'assignment',
      targetId: docRef.id,
      details: `${courseTitle}: ${input.title}`,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(
      error,
      isEdit ? OperationType.UPDATE : OperationType.CREATE,
      `courses/${courseId}/assignments/${docRef.id}`,
    );
  }
}

export async function submitAssignmentWork(input: {
  assignment: Assignment;
  studentId: string;
  studentName: string;
  studentEmail: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  isResubmit?: boolean;
}): Promise<void> {
  const subId = `${input.assignment.id}_${input.studentId}`;
  const docRef = doc(db, 'assignment_submissions', subId);
  try {
    if (input.isResubmit) {
      const updateData: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
      };
      const fileUrl = cleanStr(input.fileUrl, 1000);
      const fileName = cleanStr(input.fileName, 200);
      const notes = cleanStr(input.notes, 3000);
      if (fileUrl) updateData.fileUrl = fileUrl;
      if (fileName) updateData.fileName = fileName;
      if (notes) updateData.notes = notes;
      await updateDoc(docRef, updateData);
    } else {
      const payload: Record<string, unknown> = {
        id: subId,
        assignmentId: input.assignment.id,
        courseId: input.assignment.courseId,
        assignmentTitle: input.assignment.title.slice(0, 160),
        studentId: input.studentId,
        studentName: input.studentName.slice(0, 120),
        studentEmail: input.studentEmail.slice(0, 160),
        status: 'Submitted',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const fileUrl = cleanStr(input.fileUrl, 1000);
      const fileName = cleanStr(input.fileName, 200);
      const notes = cleanStr(input.notes, 3000);
      if (fileUrl) payload.fileUrl = fileUrl;
      if (fileName) payload.fileName = fileName;
      if (notes) payload.notes = notes;
      await setDoc(docRef, payload);

      await createNotification({
        recipientId: 'ADMIN',
        recipientRole: 'admin',
        title: 'Assignment Submitted',
        message: `${input.studentName} submitted "${input.assignment.title}" (${input.assignment.courseTitle}).`,
        type: 'assignment',
        linkPath: '/admin',
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `assignment_submissions/${subId}`);
  }
}

export async function evaluateAssignmentSubmission(
  submission: AssignmentSubmission,
  input: { status: 'Under Review' | 'Evaluated'; marks?: number; feedback?: string },
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    if (typeof input.marks === 'number' && !Number.isNaN(input.marks)) {
      updateData.marks = Math.max(0, Math.min(1000, input.marks));
    }
    const fb = cleanStr(input.feedback, 2000);
    if (fb) updateData.feedback = fb;
    if (input.status === 'Evaluated') {
      updateData.evaluatedAt = serverTimestamp();
    }
    await updateDoc(doc(db, 'assignment_submissions', submission.id), updateData);

    await createNotification({
      recipientId: submission.studentId,
      recipientRole: 'student',
      title: input.status === 'Evaluated' ? 'Assignment Evaluated' : 'Assignment Under Review',
      message:
        input.status === 'Evaluated'
          ? `Your submission for "${submission.assignmentTitle}" has been evaluated.${typeof input.marks === 'number' ? ` Score: ${input.marks}.` : ''}`
          : `Your submission for "${submission.assignmentTitle}" is currently under review.`,
      type: 'assignment',
      linkPath: '/dashboard',
    });

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: `Evaluated submission (${input.status})`,
      targetType: 'assignment_submission',
      targetId: submission.id,
      details: `${submission.studentEmail} - ${submission.assignmentTitle}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `assignment_submissions/${submission.id}`);
  }
}

// -----------------------------------------------------------------------------
// Internships & Applications
// -----------------------------------------------------------------------------
export function subscribePublicInternships(cb: (list: Internship[]) => void): Unsubscribe {
  const q = query(collection(db, 'internships'), where('status', 'in', ['open', 'closed']));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Internship)
        .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'internships'),
  );
}

export function subscribeAllInternshipsAdmin(cb: (list: Internship[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'internships'),
    (snap) => {
      const list = snap.docs
        .map((d) => d.data() as Internship)
        .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
      cb(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, 'internships'),
  );
}

export async function saveInternship(
  input: {
    id?: string;
    title: string;
    department: string;
    description: string;
    eligibility: string;
    skillsRequired: string[];
    duration: string;
    learningOutcomes: string[];
    deadline: string;
    thumbnailUrl?: string;
    status: Internship['status'];
  },
  actor: { uid: string; email: string },
): Promise<string> {
  const isEdit = Boolean(input.id);
  const docRef = input.id ? doc(db, 'internships', input.id) : doc(collection(db, 'internships'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      title: input.title.trim().slice(0, 160),
      department: input.department.trim().slice(0, 100),
      description: input.description.trim().slice(0, 4000),
      eligibility: input.eligibility.trim().slice(0, 1000),
      skillsRequired: input.skillsRequired.map((s) => s.trim().slice(0, 80)).filter(Boolean).slice(0, 20),
      duration: input.duration.trim().slice(0, 64),
      learningOutcomes: input.learningOutcomes.map((s) => s.trim().slice(0, 200)).filter(Boolean).slice(0, 15),
      deadline: input.deadline.trim().slice(0, 40),
      status: input.status,
      updatedAt: serverTimestamp(),
    };
    const thumb = cleanStr(input.thumbnailUrl, 500);
    if (thumb) payload.thumbnailUrl = thumb;

    if (!isEdit) {
      payload.createdBy = actor.uid;
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    } else {
      await updateDoc(docRef, payload);
    }
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: isEdit ? 'Updated internship' : 'Created internship',
      targetType: 'internship',
      targetId: docRef.id,
      details: input.title,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, isEdit ? OperationType.UPDATE : OperationType.CREATE, `internships/${docRef.id}`);
  }
}

export async function applyForInternship(input: {
  internship: Internship;
  student: UserProfile;
  statementOfPurpose: string;
  portfolioUrl?: string;
}): Promise<void> {
  const appId = `${input.internship.id}_${input.student.uid}`;
  const docRef = doc(db, 'internship_applications', appId);
  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      throw new Error('You have already submitted an application for this internship programme.');
    }
    const payload: Record<string, unknown> = {
      id: appId,
      internshipId: input.internship.id,
      internshipTitle: input.internship.title.slice(0, 160),
      studentId: input.student.uid,
      studentName: input.student.fullName.slice(0, 120),
      studentEmail: input.student.email.slice(0, 160),
      mobile: input.student.mobile.slice(0, 24),
      qualification: input.student.qualification.slice(0, 120),
      statementOfPurpose: input.statementOfPurpose.trim().slice(0, 3000),
      status: 'Applied',
      appliedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const portfolio = cleanStr(input.portfolioUrl, 500);
    if (portfolio) payload.portfolioUrl = portfolio;

    await setDoc(docRef, payload);

    await createNotification({
      recipientId: 'ADMIN',
      recipientRole: 'admin',
      title: 'New Internship Application',
      message: `${input.student.fullName} applied for "${input.internship.title}".`,
      type: 'internship',
      linkPath: '/admin',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already submitted')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.CREATE, `internship_applications/${appId}`);
  }
}

export async function updateInternshipApplicationStatus(
  application: InternshipApplication,
  status: InternshipApplicationStatus,
  feedback: string,
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };
    const fb = cleanStr(feedback, 1000);
    if (fb) updateData.adminFeedback = fb;
    await updateDoc(doc(db, 'internship_applications', application.id), updateData);

    await createNotification({
      recipientId: application.studentId,
      recipientRole: 'student',
      title: 'Internship Application Updated',
      message: `Your application for "${application.internshipTitle}" is now marked "${status}".`,
      type: 'internship',
      linkPath: '/dashboard',
    });

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: `Updated internship application (${status})`,
      targetType: 'internship_application',
      targetId: application.id,
      details: `${application.studentEmail} - ${application.internshipTitle}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `internship_applications/${application.id}`);
  }
}

// -----------------------------------------------------------------------------
// Certificates & Public Verification
// -----------------------------------------------------------------------------
export function generateCertificateCode(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RMH-${year}-${rand}`;
}

export async function issueCertificate(
  input: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    programId: string;
    programTitle: string;
    programType: 'Course' | 'Internship';
    downloadAllowed: boolean;
  },
  admin: { uid: string; email: string },
): Promise<string> {
  const certRef = doc(collection(db, 'certificates'));
  const certificateCode = generateCertificateCode();
  const verifyRef = doc(db, 'certificate_verifications', certificateCode);

  try {
    const batch = writeBatch(db);
    batch.set(certRef, {
      id: certRef.id,
      certificateCode,
      studentId: input.studentId,
      studentName: input.studentName.trim().slice(0, 120),
      studentEmail: input.studentEmail.trim().slice(0, 160),
      programId: input.programId,
      programTitle: input.programTitle.trim().slice(0, 160),
      programType: input.programType,
      downloadAllowed: input.downloadAllowed,
      status: 'Valid',
      issuedBy: admin.uid,
      issuedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    batch.set(verifyRef, {
      certificateCode,
      recipientName: input.studentName.trim().slice(0, 120),
      programTitle: input.programTitle.trim().slice(0, 160),
      programType: input.programType,
      status: 'Valid',
      issuedAt: serverTimestamp(),
    });

    await batch.commit();

    await createNotification({
      recipientId: input.studentId,
      recipientRole: 'student',
      title: 'Certificate Issued',
      message: `Your ${input.programType} certificate for "${input.programTitle}" (${certificateCode}) has been issued.`,
      type: 'certificate',
      linkPath: '/dashboard',
    });

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: 'Issued certificate',
      targetType: 'certificate',
      targetId: certRef.id,
      details: `${certificateCode} -> ${input.studentEmail} (${input.programTitle})`,
    });

    return certificateCode;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `certificates/${certRef.id}`);
  }
}

export async function updateCertificateControl(
  certificate: Certificate,
  updates: { status?: 'Valid' | 'Revoked'; downloadAllowed?: boolean },
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    const batch = writeBatch(db);
    const certRef = doc(db, 'certificates', certificate.id);
    const nextStatus = updates.status ?? certificate.status;
    const nextDownload = updates.downloadAllowed ?? certificate.downloadAllowed;
    batch.update(certRef, {
      status: nextStatus,
      downloadAllowed: nextDownload,
      updatedAt: serverTimestamp(),
    });
    if (updates.status) {
      batch.update(doc(db, 'certificate_verifications', certificate.certificateCode), {
        status: nextStatus,
      });
    }
    await batch.commit();

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: 'Updated certificate control',
      targetType: 'certificate',
      targetId: certificate.id,
      details: `${certificate.certificateCode}: status=${nextStatus}, downloadAllowed=${nextDownload}`,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `certificates/${certificate.id}`);
  }
}

export async function verifyCertificateByCode(code: string): Promise<CertificateVerification | null> {
  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!cleanCode || cleanCode.length < 6) return null;
  try {
    const snap = await getDoc(doc(db, 'certificate_verifications', cleanCode));
    return snap.exists() ? (snap.data() as CertificateVerification) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `certificate_verifications/${cleanCode}`);
  }
}

// -----------------------------------------------------------------------------
// Support Tickets & Student / Admin Management
// -----------------------------------------------------------------------------
export async function submitSupportTicket(input: {
  studentId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const docRef = doc(collection(db, 'support_tickets'));
  try {
    const payload: Record<string, unknown> = {
      id: docRef.id,
      name: input.name.trim().slice(0, 120),
      email: input.email.trim().slice(0, 160),
      subject: input.subject.trim().slice(0, 160),
      message: input.message.trim().slice(0, 3000),
      status: 'Open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.studentId) payload.studentId = input.studentId;
    await setDoc(docRef, payload);

    await createNotification({
      recipientId: 'ADMIN',
      recipientRole: 'admin',
      title: 'New Support Inquiry',
      message: `${input.name}: ${input.subject}`,
      type: 'system',
      linkPath: '/admin',
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `support_tickets/${docRef.id}`);
  }
}

export async function replySupportTicket(
  ticket: SupportTicket,
  status: SupportTicketStatus,
  adminReply: string,
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };
    const reply = cleanStr(adminReply, 2000);
    if (reply) updateData.adminReply = reply;
    await updateDoc(doc(db, 'support_tickets', ticket.id), updateData);

    if (ticket.studentId) {
      await createNotification({
        recipientId: ticket.studentId,
        recipientRole: 'student',
        title: 'Support Ticket Updated',
        message: `Your inquiry "${ticket.subject}" is now ${status}.`,
        type: 'system',
        linkPath: '/dashboard',
      });
    }

    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: `Updated support ticket (${status})`,
      targetType: 'support_ticket',
      targetId: ticket.id,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `support_tickets/${ticket.id}`);
  }
}

export async function toggleStudentAccountStatus(
  student: UserProfile,
  nextStatus: 'active' | 'suspended',
  admin: { uid: string; email: string },
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', student.uid), {
      accountStatus: nextStatus,
      updatedAt: serverTimestamp(),
    });
    await recordAuditLog({
      actorId: admin.uid,
      actorEmail: admin.email,
      action: nextStatus === 'suspended' ? 'Suspended student account' : 'Activated student account',
      targetType: 'user',
      targetId: student.uid,
      details: student.email,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${student.uid}`);
  }
}

export async function provisionAdminUser(
  input: { uid: string; email: string; fullName: string },
  actor: { uid: string; email: string },
): Promise<void> {
  const cleanUid = input.uid.trim();
  try {
    await setDoc(doc(db, 'admins', cleanUid), {
      uid: cleanUid,
      email: input.email.trim().slice(0, 160),
      fullName: input.fullName.trim().slice(0, 120),
      role: 'admin',
      createdBy: actor.uid,
      createdAt: serverTimestamp(),
    });
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: 'Provisioned administrator account',
      targetType: 'admin',
      targetId: cleanUid,
      details: input.email,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `admins/${cleanUid}`);
  }
}

export async function removeAdminUser(adminUid: string, actor: { uid: string; email: string }): Promise<void> {
  try {
    await deleteDoc(doc(db, 'admins', adminUid));
    await recordAuditLog({
      actorId: actor.uid,
      actorEmail: actor.email,
      action: 'Removed administrator account',
      targetType: 'admin',
      targetId: adminUid,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${adminUid}`);
  }
}

export async function fetchAllAuditLogs(): Promise<AuditLog[]> {
  try {
    const snap = await getDocs(collection(db, 'audit_logs'));
    return snap.docs
      .map((d) => d.data() as AuditLog)
      .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'audit_logs');
  }
}

export async function fetchAllAdmins(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, 'admins'));
    return snap.docs.map((d) => d.data() as AdminUser);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'admins');
  }
}
