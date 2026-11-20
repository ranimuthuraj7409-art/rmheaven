import type { SeedStudyNoteDef } from './departments';

export interface KnowledgeCheckItem {
  question: string;
  answer: string;
}

export interface StudyNoteUpgradeSpec {
  intro: string;
  learningObjectives: string[];
  simpleExplanation?: string;
  detailedExplanation: string;
  keyConcepts: string;
  stepByStepExplanation: string;
  practicalExampleExtra?: string;
  realWorldApplications?: string;
  importantPoints?: string;
  commonMistakes?: string;
  summary: string;
  revisionChecklist: string[];
  practiceExerciseExtra?: string;
  fiveQuestions: [
    KnowledgeCheckItem,
    KnowledgeCheckItem,
    KnowledgeCheckItem,
    KnowledgeCheckItem,
    KnowledgeCheckItem,
  ];
}

export function applyStudyNoteUpgrade(
  note: SeedStudyNoteDef,
  upgrade: StudyNoteUpgradeSpec,
): SeedStudyNoteDef {
  const topicIntroduction = [
    upgrade.intro.trim(),
    '',
    '### Learning Objectives',
    ...upgrade.learningObjectives.map((obj) => `- ${obj.trim()}`),
  ]
    .join('\n')
    .slice(0, 3000);

  const practicalExamples = upgrade.practicalExampleExtra
    ? `${note.practicalExamples.trim()}\n\n### Extended Worked Walkthrough\n${upgrade.practicalExampleExtra.trim()}`.slice(
        0,
        8000,
      )
    : note.practicalExamples.slice(0, 8000);

  const summary = [
    upgrade.summary.trim(),
    '',
    '### Quick Revision Notes',
    ...upgrade.revisionChecklist.map((item) => `- ${item.trim()}`),
  ]
    .join('\n')
    .slice(0, 3000);

  const domainSupplement = upgrade.practiceExerciseExtra
    ? `${(note.domainSupplement || '').trim()}\n\n### Additional Guided Practice Exercises\n${upgrade.practiceExerciseExtra.trim()}`.slice(
        0,
        6000,
      )
    : note.domainSupplement?.slice(0, 6000);

  const formattedFiveQuestions = [
    '### Five Knowledge-Check Questions (With Answers)',
    ...upgrade.fiveQuestions.map(
      (item, idx) =>
        `${idx + 1}. **Question ${idx + 1}:** ${item.question.trim()}\n**Answer:** ${item.answer.trim()}`,
    ),
  ].join('\n\n');

  const combinedPractice = `${formattedFiveQuestions}\n\n${note.practiceQuestions.trim()}`.slice(0, 8000);

  return {
    ...note,
    topicIntroduction,
    simpleExplanation: (upgrade.simpleExplanation ?? note.simpleExplanation).trim().slice(0, 4000),
    detailedExplanation: upgrade.detailedExplanation.trim().slice(0, 8000),
    keyConcepts: upgrade.keyConcepts.trim().slice(0, 6000),
    stepByStepExplanation: upgrade.stepByStepExplanation.trim().slice(0, 6000),
    practicalExamples,
    realWorldApplications: (upgrade.realWorldApplications ?? note.realWorldApplications)
      .trim()
      .slice(0, 4000),
    importantPoints: (upgrade.importantPoints ?? note.importantPoints).trim().slice(0, 4000),
    commonMistakes: (upgrade.commonMistakes ?? note.commonMistakes).trim().slice(0, 4000),
    summary,
    practiceQuestions: combinedPractice,
    domainSupplement,
  };
}
