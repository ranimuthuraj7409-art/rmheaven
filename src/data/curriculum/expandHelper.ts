import type { SeedCourseDef, SeedLessonDef, SeedModuleDef } from './departments';

export interface ExtraModuleDef {
  id: 'mod-4' | 'mod-5';
  title: string;
  description: string;
  assessmentTitle: string;
  assessmentCriteria: string;
}

export interface ExtraLessonInput {
  moduleId: 'mod-1' | 'mod-2' | 'mod-3' | 'mod-4' | 'mod-5';
  title: string;
  summary: string;
  objectives: string[];
  contentBody: string;
  examples: string;
  exercisePrompt: string;
  durationMinutes?: number;
}

export interface CourseExpansionSpec {
  newModules: [ExtraModuleDef, ExtraModuleDef];
  extraLessons: ExtraLessonInput[];
}

/**
 * Expands a 3-module course into a full 5-module, 15-lesson structured curriculum
 * while preserving every existing module, lesson, study note, quiz, and assignment ID.
 */
export function expandCourseCurriculum(
  course: SeedCourseDef,
  spec: CourseExpansionSpec,
): SeedCourseDef {
  const existingModules = [...course.modules];
  const existingModuleIds = new Set(existingModules.map((m) => m.id));

  const addedModules: SeedModuleDef[] = spec.newModules
    .filter((m) => !existingModuleIds.has(m.id))
    .map((m, i) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      assessmentTitle: m.assessmentTitle,
      assessmentCriteria: m.assessmentCriteria,
      orderIndex: existingModules.length + i + 1,
    }));

  const mergedModules = [...existingModules, ...addedModules];

  const mergedLessons: SeedLessonDef[] = [...course.lessons];
  let nextNum = mergedLessons.length + 1;
  const usedIds = new Set(mergedLessons.map((l) => l.id));

  for (const item of spec.extraLessons) {
    while (usedIds.has(`les-${nextNum}`)) {
      nextNum += 1;
    }
    const id = `les-${nextNum}`;
    usedIds.add(id);
    mergedLessons.push({
      id,
      moduleId: item.moduleId,
      title: item.title,
      summary: item.summary,
      objectives: item.objectives,
      contentBody: item.contentBody,
      examples: item.examples,
      exercisePrompt: item.exercisePrompt,
      durationMinutes: item.durationMinutes ?? 25,
      orderIndex: mergedLessons.length + 1,
    });
    nextNum += 1;
  }

  // Order lessons module-by-module (mod-1 -> mod-5) with clean sequential orderIndex
  const modRank = new Map(mergedModules.map((m, idx) => [m.id, idx]));
  mergedLessons.sort((a, b) => {
    const rA = modRank.get(a.moduleId) ?? 99;
    const rB = modRank.get(b.moduleId) ?? 99;
    if (rA !== rB) return rA - rB;
    return a.orderIndex - b.orderIndex;
  });
  mergedLessons.forEach((l, idx) => {
    l.orderIndex = idx + 1;
  });

  const syllabusSummary = mergedModules.map(
    (m, i) => `Module ${i + 1}: ${m.title}`,
  );
  const moduleAssessments = mergedModules.map(
    (m, i) => `Module ${i + 1}: ${m.assessmentTitle}`,
  );

  return {
    ...course,
    modules: mergedModules,
    lessons: mergedLessons,
    syllabusSummary,
    moduleAssessments,
  };
}
