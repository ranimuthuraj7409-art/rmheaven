import { collection, doc, getDocs, serverTimestamp, writeBatch, type WriteBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { recordAuditLog } from '../../firebase/services';
import {
  ALL_SEED_COURSES,
  DEPT1_COURSES,
  DEPT2_COURSES,
  DEPT3_COURSES,
  DEPT4_COURSES,
  RM_DEPARTMENTS,
  getCurriculumSummaryStats,
  getSeedCourseFallback,
} from './curriculumCatalog';

export {
  ALL_SEED_COURSES,
  DEPT1_COURSES,
  DEPT2_COURSES,
  DEPT3_COURSES,
  DEPT4_COURSES,
  RM_DEPARTMENTS,
  getCurriculumSummaryStats,
  getSeedCourseFallback,
};

class BatchQueue {
  private batch: WriteBatch = writeBatch(db);
  private count = 0;
  public totalOps = 0;

  async queueSet(ref: ReturnType<typeof doc>, data: Record<string, unknown>, merge = false) {
    if (merge) {
      this.batch.set(ref, data, { merge: true });
    } else {
      this.batch.set(ref, data);
    }
    this.count += 1;
    this.totalOps += 1;
    if (this.count >= 360) {
      await this.flush();
    }
  }

  async flush() {
    if (this.count > 0) {
      await this.batch.commit();
      this.batch = writeBatch(db);
      this.count = 0;
    }
  }
}

/**
 * Idempotently syncs all 4 RM HEAVEN Departments and all 31 complete Courses
 * (modules, lessons, 11-section study notes, quizzes, questions, and assignments)
 * into Firestore across 3 ordered passes so parent document `exists()` checks
 * inside firestore.rules succeed cleanly on both fresh seeds and repeat syncs.
 */
export async function seedAllCurriculumToFirestore(
  actor: { uid: string; email: string },
  onProgress?: (stage: string, pct: number) => void,
): Promise<{
  departments: number;
  courses: number;
  modules: number;
  lessons: number;
  studyNotes: number;
  quizzes: number;
  questions: number;
  assignments: number;
  totalWrites: number;
}> {
  const stats = getCurriculumSummaryStats();

  // Inspect existing top-level departments & courses so immutable createdAt / createdBy
  // fields are never overwritten on updates (which would violate firestore.rules).
  onProgress?.('Checking existing curriculum registry...', 5);
  const [existingDeptSnap, existingCoursesSnap] = await Promise.all([
    getDocs(collection(db, 'departments')),
    getDocs(collection(db, 'courses')),
  ]);

  const existingDepts = new Map<string, Record<string, unknown>>();
  existingDeptSnap.docs.forEach((d) => existingDepts.set(d.id, d.data()));

  const existingCourses = new Map<string, Record<string, unknown>>();
  existingCoursesSnap.docs.forEach((d) => existingCourses.set(d.id, d.data()));

  // PASS 1: Departments & Course root documents
  onProgress?.('Syncing 4 Departments & 31 Course definitions...', 18);
  const pass1 = new BatchQueue();

  for (const dept of RM_DEPARTMENTS) {
    const prev = existingDepts.get(dept.id);
    await pass1.queueSet(doc(db, 'departments', dept.id), {
      id: dept.id,
      slug: dept.slug,
      name: dept.name,
      description: dept.description,
      orderIndex: dept.orderIndex,
      status: dept.status,
      createdAt: prev?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const c of ALL_SEED_COURSES) {
    const prev = existingCourses.get(c.id);
    await pass1.queueSet(doc(db, 'courses', c.id), {
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
      createdBy: (prev?.createdBy as string | undefined) ?? actor.uid,
      createdAt: prev?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await pass1.flush();

  // PASS 2: Modules, Lessons, 11-Section Study Notes, Quizzes, and Capstone Assignments
  onProgress?.('Syncing Modules, Lessons, Detailed Study Notes & Quizzes...', 50);
  const pass2 = new BatchQueue();

  for (let i = 0; i < ALL_SEED_COURSES.length; i++) {
    const c = ALL_SEED_COURSES[i];
    const [modSnap, lesSnap, noteSnap, quizSnap, assignSnap] = await Promise.all([
      getDocs(collection(db, 'courses', c.id, 'modules')),
      getDocs(collection(db, 'courses', c.id, 'lessons')),
      getDocs(collection(db, 'courses', c.id, 'study_notes')),
      getDocs(collection(db, 'courses', c.id, 'quizzes')),
      getDocs(collection(db, 'courses', c.id, 'assignments')),
    ]);

    const prevMods = new Map(modSnap.docs.map((d) => [d.id, d.data()]));
    const prevLes = new Map(lesSnap.docs.map((d) => [d.id, d.data()]));
    const prevNotes = new Map(noteSnap.docs.map((d) => [d.id, d.data()]));
    const prevQuizzes = new Map(quizSnap.docs.map((d) => [d.id, d.data()]));
    const prevAssigns = new Map(assignSnap.docs.map((d) => [d.id, d.data()]));

    for (const m of c.modules) {
      const prev = prevMods.get(m.id);
      await pass2.queueSet(doc(db, 'courses', c.id, 'modules', m.id), {
        id: m.id,
        courseId: c.id,
        title: m.title.slice(0, 160),
        description: m.description.slice(0, 1000),
        assessmentTitle: m.assessmentTitle.slice(0, 200),
        assessmentCriteria: m.assessmentCriteria.slice(0, 1000),
        orderIndex: m.orderIndex,
        createdAt: prev?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const l of c.lessons) {
      const prev = prevLes.get(l.id);
      await pass2.queueSet(doc(db, 'courses', c.id, 'lessons', l.id), {
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
        createdAt: prev?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    for (const n of c.studyNotes) {
      const prev = prevNotes.get(n.id);
      const notePayload: Record<string, unknown> = {
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
        createdBy: (prev?.createdBy as string | undefined) ?? actor.uid,
        createdAt: prev?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (n.lessonId) notePayload.lessonId = n.lessonId;
      if (n.domainSupplement) notePayload.domainSupplement = n.domainSupplement.slice(0, 6000);

      await pass2.queueSet(doc(db, 'courses', c.id, 'study_notes', n.id), notePayload);
    }

    for (const qz of c.quizzes) {
      const prev = prevQuizzes.get(qz.id);
      const quizPayload: Record<string, unknown> = {
        id: qz.id,
        courseId: c.id,
        quizType: qz.quizType,
        title: qz.title.slice(0, 180),
        description: qz.description.slice(0, 1000),
        passingPercent: qz.passingPercent,
        status: 'published',
        questionCount: qz.questions.length,
        createdBy: (prev?.createdBy as string | undefined) ?? actor.uid,
        createdAt: prev?.createdAt ?? serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (qz.moduleId) quizPayload.moduleId = qz.moduleId;
      await pass2.queueSet(doc(db, 'courses', c.id, 'quizzes', qz.id), quizPayload);
    }

    const a = c.assignment;
    const prevA = prevAssigns.get(a.id);
    await pass2.queueSet(doc(db, 'courses', c.id, 'assignments', a.id), {
      id: a.id,
      courseId: c.id,
      courseTitle: c.title.slice(0, 160),
      title: a.title.slice(0, 160),
      instructions: a.instructions.slice(0, 5000),
      dueDate: a.dueDate.slice(0, 40),
      maxMarks: a.maxMarks,
      status: 'published',
      createdBy: (prevA?.createdBy as string | undefined) ?? actor.uid,
      createdAt: prevA?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await pass2.flush();

  // PASS 3: Quiz Questions (parent quizzes now committed cleanly on server)
  onProgress?.('Syncing Quiz Question banks...', 82);
  const pass3 = new BatchQueue();

  for (const c of ALL_SEED_COURSES) {
    for (const qz of c.quizzes) {
      for (const question of qz.questions) {
        await pass3.queueSet(doc(db, 'courses', c.id, 'quizzes', qz.id, 'questions', question.id), {
          id: question.id,
          courseId: c.id,
          quizId: qz.id,
          questionText: question.questionText.slice(0, 1000),
          options: question.options.map((opt) => opt.slice(0, 300)).slice(0, 6),
          correctIndex: question.correctIndex,
          explanation: question.explanation.slice(0, 1500),
          topicTag: question.topicTag.slice(0, 120),
          orderIndex: question.orderIndex,
        });
      }
    }
  }

  await pass3.flush();

  onProgress?.('Recording audit trail...', 96);
  await recordAuditLog({
    actorId: actor.uid,
    actorEmail: actor.email,
    action: 'Synced 4 Departments & 31 Complete Courses',
    targetType: 'curriculum',
    targetId: 'rm_heaven_31_courses',
    details: `${stats.departments} depts, ${stats.courses} courses, ${stats.modules} modules, ${stats.lessons} lessons, ${stats.studyNotes} study notes, ${stats.quizzes} quizzes`,
  });

  onProgress?.('Curriculum sync complete', 100);

  return {
    ...stats,
    totalWrites: pass1.totalOps + pass2.totalOps + pass3.totalOps,
  };
}
