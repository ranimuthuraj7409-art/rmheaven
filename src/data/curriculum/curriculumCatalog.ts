import { RM_DEPARTMENTS, type SeedCourseDef } from './departments';
import { DEPT1_PROGRAMMING_COURSES } from './dept1Programming';
import { DEPT2_AI_DATA_COURSES } from './dept2AiData';
import { DEPT3_DESIGN_COURSES } from './dept3Design';
import { DEPT4_COURSES as DEPT4_RAW_COURSES } from './dept4Business';
import { expandCourseCurriculum, type CourseExpansionSpec } from './expandHelper';
import { DEPT1_EXPANSIONS } from './expandDept1';
import { DEPT2_EXPANSIONS } from './expandDept2';
import { DEPT3_EXPANSIONS } from './expandDept3';
import { DEPT4_EXPANSIONS } from './expandDept4';
import { applyStudyNoteUpgrade, type StudyNoteUpgradeSpec } from './noteUpgradeHelper';
import { DEPT1_NOTE_UPGRADES } from './noteUpgradesDept1';
import { DEPT2_NOTE_UPGRADES } from './noteUpgradesDept2';
import { DEPT3_NOTE_UPGRADES } from './noteUpgradesDept3';
import { DEPT4_NOTE_UPGRADES } from './noteUpgradesDept4';

const ALL_EXPANSIONS: Record<string, CourseExpansionSpec> = {
  ...DEPT1_EXPANSIONS,
  ...DEPT2_EXPANSIONS,
  ...DEPT3_EXPANSIONS,
  ...DEPT4_EXPANSIONS,
};

export const ALL_NOTE_UPGRADES: Record<string, StudyNoteUpgradeSpec> = {
  ...DEPT1_NOTE_UPGRADES,
  ...DEPT2_NOTE_UPGRADES,
  ...DEPT3_NOTE_UPGRADES,
  ...DEPT4_NOTE_UPGRADES,
};

function enrichCourses(courses: SeedCourseDef[]): SeedCourseDef[] {
  return courses.map((rawCourse) => {
    const spec = ALL_EXPANSIONS[rawCourse.id];
    const expanded = spec ? expandCourseCurriculum(rawCourse, spec) : rawCourse;
    const upgradedNotes = expanded.studyNotes.map((note) => {
      const upgrade = ALL_NOTE_UPGRADES[`${expanded.id}:${note.id}`];
      return upgrade ? applyStudyNoteUpgrade(note, upgrade) : note;
    });
    return {
      ...expanded,
      studyNotes: upgradedNotes,
    };
  });
}

export const DEPT1_COURSES: SeedCourseDef[] = enrichCourses(DEPT1_PROGRAMMING_COURSES);
export const DEPT2_COURSES: SeedCourseDef[] = enrichCourses(DEPT2_AI_DATA_COURSES);
export const DEPT3_COURSES: SeedCourseDef[] = enrichCourses(DEPT3_DESIGN_COURSES);
export const DEPT4_COURSES: SeedCourseDef[] = enrichCourses(DEPT4_RAW_COURSES);

export { RM_DEPARTMENTS };

export const ALL_SEED_COURSES: SeedCourseDef[] = [
  ...DEPT1_COURSES,
  ...DEPT2_COURSES,
  ...DEPT3_COURSES,
  ...DEPT4_COURSES,
];

export function getSeedCourseFallback(courseId: string): SeedCourseDef | undefined {
  return ALL_SEED_COURSES.find((c) => c.id === courseId);
}

export function getCurriculumSummaryStats() {
  const modules = ALL_SEED_COURSES.reduce((acc, c) => acc + c.modules.length, 0);
  const lessons = ALL_SEED_COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
  const studyNotes = ALL_SEED_COURSES.reduce((acc, c) => acc + c.studyNotes.length, 0);
  const quizzes = ALL_SEED_COURSES.reduce((acc, c) => acc + c.quizzes.length, 0);
  const questions = ALL_SEED_COURSES.reduce(
    (acc, c) => acc + c.quizzes.reduce((qAcc, q) => qAcc + q.questions.length, 0),
    0,
  );
  const assignments = ALL_SEED_COURSES.length;
  return {
    departments: RM_DEPARTMENTS.length,
    courses: ALL_SEED_COURSES.length,
    modules,
    lessons,
    studyNotes,
    quizzes,
    questions,
    assignments,
  };
}
