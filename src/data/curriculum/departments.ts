import type { CourseLevel } from '../../types';

export interface SeedModuleDef {
  id: string;
  title: string;
  description: string;
  assessmentTitle: string;
  assessmentCriteria: string;
  orderIndex: number;
}

export interface SeedLessonDef {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  objectives: string[];
  contentBody: string;
  examples: string;
  exercisePrompt: string;
  durationMinutes: number;
  orderIndex: number;
}

export interface SeedStudyNoteDef {
  id: string;
  moduleId: string;
  lessonId?: string;
  title: string;
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
}

export interface SeedQuizQuestionDef {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicTag: string;
  orderIndex: number;
}

export interface SeedQuizDef {
  id: string;
  moduleId?: string;
  quizType: 'module' | 'final';
  title: string;
  description: string;
  passingPercent: number;
  questions: SeedQuizQuestionDef[];
}

export interface SeedCourseDef {
  id: string;
  departmentId: string;
  departmentName: string;
  title: string;
  category: string;
  level: CourseLevel;
  duration: string;
  thumbnailUrl: string;
  shortDescription: string;
  fullDescription: string;
  introduction: string;
  objectives: string[];
  targetAudience: string;
  prerequisites: string;
  syllabusSummary: string[];
  outcomes: string[];
  moduleAssessments: string[];
  finalAssessmentTitle: string;
  modules: SeedModuleDef[];
  lessons: SeedLessonDef[];
  studyNotes: SeedStudyNoteDef[];
  quizzes: SeedQuizDef[];
  assignment: {
    id: string;
    title: string;
    instructions: string;
    dueDate: string;
    maxMarks: number;
  };
}

export interface SeedDepartmentDef {
  id: string;
  slug: string;
  name: string;
  description: string;
  orderIndex: number;
  status: 'active';
}

export const RM_DEPARTMENTS: SeedDepartmentDef[] = [
  {
    id: 'dept_programming_web',
    slug: 'programming-web-development',
    name: 'Programming & Web Development',
    description:
      'Foundational and advanced software engineering education focused strictly on semantic HTML web development, Java object-oriented and enterprise architecture, and Python programming, automation, and data applications.',
    orderIndex: 1,
    status: 'active',
  },
  {
    id: 'dept_ai_data',
    slug: 'artificial-intelligence-data',
    name: 'Artificial Intelligence & Data',
    description:
      'Clear, accessible education in Artificial Intelligence, Generative AI, Prompt Engineering, Machine Learning, Data Science, Analytics, and practical AI workflows supported by Python and Java illustrations.',
    orderIndex: 2,
    status: 'active',
  },
  {
    id: 'dept_design_creative',
    slug: 'design-creative-technology',
    name: 'Design & Creative Technology',
    description:
      'Project-driven training in visual hierarchy, UI/UX architecture, Figma prototyping, Canva production workflows, brand identity, photo manipulation, and social media visual communication.',
    orderIndex: 3,
    status: 'active',
  },
  {
    id: 'dept_business_digital',
    slug: 'business-digital-skills',
    name: 'Business & Digital Skills',
    description:
      'Practical strategy and execution training in digital marketing, SEO, social media marketing, Google Ads, Meta Ads, content strategy, e-commerce management, email marketing, and executive business communication.',
    orderIndex: 4,
    status: 'active',
  },
];
