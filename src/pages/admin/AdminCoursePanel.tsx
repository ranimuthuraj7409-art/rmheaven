import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  FileText,
  Upload,
  Lock,
  Unlock,
  Sparkles,
  Eye,
  CheckCircle2,
  Layers,
  HelpCircle,
  Loader2,
  RefreshCw,
  Search,
  X,
  Code2,
} from 'lucide-react';
import { auth } from '../../firebase/config';
import {
  createOrUpdateCourse,
  deleteCourse,
  deleteCourseLesson,
  deleteCourseModule,
  deleteDepartment,
  deleteLearningMaterial,
  deleteQuiz,
  deleteStudyNote,
  fetchCourseAssignments,
  fetchCourseLessons,
  fetchCourseMaterials,
  fetchCourseModules,
  fetchCourseQuizzes,
  fetchCourseStudyNotes,
  fetchQuizQuestions,
  fetchStudyNoteCountsByCourse,
  saveAssignment,
  saveCourseLesson,
  saveCourseModule,
  saveDepartment,
  saveLearningMaterial,
  saveQuizWithQuestions,
  saveStudyNote,
  uploadFileToStorage,
} from '../../firebase/services';
import { getCurriculumSummaryStats, seedAllCurriculumToFirestore } from '../../data/curriculum/seedService';
import { useToast } from '../../contexts/ToastContext';
import { BRAND_IMAGES } from '../../constants/legal';
import { EmptyState, StatusLabel } from '../../components/BrandAssets';
import { StudyNoteViewer } from '../../components/RichContentRenderer';
import type {
  Assignment,
  Course,
  CourseLesson,
  CourseModule,
  Department,
  LearningMaterial,
  Quiz,
  StudyNote,
} from '../../types';

type CourseStudioTab = 'curriculum' | 'notes' | 'quizzes';

interface DraftQuestionItem {
  id?: string;
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  topicTag: string;
}

const EMPTY_QUESTION = (): DraftQuestionItem => ({
  questionText: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
  topicTag: '',
});

export function AdminCoursePanel({
  mode,
  courses,
  departments,
  actor,
  onSwitchMode,
}: {
  mode: 'courses' | 'materials' | 'assignments';
  courses: Course[];
  departments: Department[];
  actor: { uid: string; email: string };
  onSwitchMode?: (m: 'courses' | 'materials' | 'assignments') => void;
}) {
  const { showToast, confirmAction } = useToast();
  const curriculumStats = useMemo(() => getCurriculumSummaryStats(), []);

  // Curriculum One-Click Sync state
  const [syncingCurriculum, setSyncingCurriculum] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStage, setSyncStage] = useState('');

  // Department Manager state
  const [showDeptManager, setShowDeptManager] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [dName, setDName] = useState('');
  const [dSlug, setDSlug] = useState('');
  const [dDesc, setDDesc] = useState('');
  const [dOrder, setDOrder] = useState(1);
  const [dStatus, setDStatus] = useState<'active' | 'archived'>('active');

  // Course Directory filter & selection
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [studioTab, setStudioTab] = useState<CourseStudioTab>('curriculum');

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesDept = deptFilter === 'all' || c.departmentId === deptFilter;
      const matchesQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.departmentName || '').toLowerCase().includes(q);
      return matchesDept && matchesQ;
    });
  }, [courses, deptFilter, courseSearch]);

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || filteredCourses[0] || courses[0] || null;

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // Course Create / Edit form state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [cTitle, setCTitle] = useState('');
  const [cDeptId, setCDeptId] = useState('');
  const [cCategory, setCCategory] = useState('');
  const [cLevel, setCLevel] = useState<Course['level']>('Beginner');
  const [cDuration, setCDuration] = useState('');
  const [cShort, setCShort] = useState('');
  const [cFull, setCFull] = useState('');
  const [cIntro, setCIntro] = useState('');
  const [cObjectives, setCObjectives] = useState('');
  const [cAudience, setCAudience] = useState('');
  const [cPrereq, setCPrereq] = useState('');
  const [cSyllabus, setCSyllabus] = useState('');
  const [cModAssess, setCModAssess] = useState('');
  const [cFinalAssess, setCFinalAssess] = useState('');
  const [cThumb, setCThumb] = useState(BRAND_IMAGES.courseTech);
  const [cOutcomes, setCOutcomes] = useState('');
  const [cStatus, setCStatus] = useState<Course['status']>('published');

  // Sub-collections for selectedCourse
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Module form state
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modAssessTitle, setModAssessTitle] = useState('');
  const [modAssessCriteria, setModAssessCriteria] = useState('');

  // Lesson form state
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [lesModuleId, setLesModuleId] = useState('');
  const [lesTitle, setLesTitle] = useState('');
  const [lesSummary, setLesSummary] = useState('');
  const [lesObjectives, setLesObjectives] = useState('');
  const [lesBody, setLesBody] = useState('');
  const [lesExamples, setLesExamples] = useState('');
  const [lesExercise, setLesExercise] = useState('');
  const [lesStatus, setLesStatus] = useState<'published' | 'draft'>('published');
  const [lesDuration, setLesDuration] = useState(25);

  // Study Note (11-Section) form state
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [noteModuleId, setNoteModuleId] = useState('');
  const [noteLessonId, setNoteLessonId] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSourceType, setNoteSourceType] = useState<'official' | 'ai_assisted_admin'>('official');
  const [noteStatus, setNoteStatus] = useState<'published' | 'draft'>('published');
  const [nTopicIntro, setNTopicIntro] = useState('');
  const [nSimpleExp, setNSimpleExp] = useState('');
  const [nDetailedExp, setNDetailedExp] = useState('');
  const [nKeyConcepts, setNKeyConcepts] = useState('');
  const [nStepByStep, setNStepByStep] = useState('');
  const [nPracticalEx, setNPracticalEx] = useState('');
  const [nRealWorld, setNRealWorld] = useState('');
  const [nImportantPts, setNImportantPts] = useState('');
  const [nCommonMistakes, setNCommonMistakes] = useState('');
  const [nSummary, setNSummary] = useState('');
  const [nPracticeQ, setNPracticeQ] = useState('');
  const [nSupplement, setNSupplement] = useState('');
  const [draftingNoteWithAi, setDraftingNoteWithAi] = useState(false);
  const [previewNote, setPreviewNote] = useState<StudyNote | null>(null);

  // Quiz Builder form state
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [qzType, setQzType] = useState<'module' | 'final' | 'practice'>('module');
  const [qzModuleId, setQzModuleId] = useState('');
  const [qzTitle, setQzTitle] = useState('');
  const [qzDesc, setQzDesc] = useState('');
  const [qzPassing, setQzPassing] = useState(70);
  const [qzStatus, setQzStatus] = useState<'published' | 'draft'>('published');
  const [qzQuestions, setQzQuestions] = useState<DraftQuestionItem[]>([EMPTY_QUESTION()]);
  const [savingQuiz, setSavingQuiz] = useState(false);

  // Material form state
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [matModuleId, setMatModuleId] = useState('');
  const [matLessonId, setMatLessonId] = useState('');
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matFileName, setMatFileName] = useState('');
  const [matDownload, setMatDownload] = useState(false);
  const [matStatus, setMatStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [matUploading, setMatUploading] = useState(false);

  // Assignment form state
  const [assignTitle, setAssignTitle] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignDue, setAssignDue] = useState('');
  const [assignMaxMarks, setAssignMaxMarks] = useState(100);

  const loadCourseChildren = async (cid: string) => {
    const [mods, less, notes, qzs, mats, assigns] = await Promise.all([
      fetchCourseModules(cid),
      fetchCourseLessons(cid, true),
      fetchCourseStudyNotes(cid, true),
      fetchCourseQuizzes(cid, true),
      fetchCourseMaterials(cid, true),
      fetchCourseAssignments(cid),
    ]);
    setModules(mods);
    setLessons(less);
    setStudyNotes(notes);
    setQuizzes(qzs);
    setMaterials(mats);
    setAssignments(assigns);
    if (mods.length > 0) {
      setLesModuleId((prev) => (mods.some((m) => m.id === prev) ? prev : mods[0].id));
      setNoteModuleId((prev) => (mods.some((m) => m.id === prev) ? prev : mods[0].id));
      setMatModuleId((prev) => (mods.some((m) => m.id === prev) ? prev : mods[0].id));
      setQzModuleId((prev) => (mods.some((m) => m.id === prev) ? prev : mods[0].id));
    }
  };

  const refreshNoteCounts = async (targetCourses: Course[]) => {
    if (targetCourses.length === 0) {
      setNoteCounts({});
      return;
    }
    try {
      const counts = await fetchStudyNoteCountsByCourse(targetCourses.map((c) => c.id));
      setNoteCounts(counts);
    } catch {
      // Non-blocking UI count indicator
    }
  };

  useEffect(() => {
    void refreshNoteCounts(courses);
  }, [courses]);

  useEffect(() => {
    if (selectedCourse) {
      void loadCourseChildren(selectedCourse.id);
    } else {
      setModules([]);
      setLessons([]);
      setStudyNotes([]);
      setQuizzes([]);
      setMaterials([]);
      setAssignments([]);
    }
  }, [selectedCourse?.id]);

  // ---------------------------------------------------------------------------
  // Sync All 4 Departments & 31 Complete Courses
  // ---------------------------------------------------------------------------
  const handleSyncAllCurriculum = async () => {
    const ok = await confirmAction({
      title: 'Sync All 4 Departments & 31 Complete Courses?',
      message: `This will upsert ${curriculumStats.departments} Departments, ${curriculumStats.courses} Courses, ${curriculumStats.modules} Modules, ${curriculumStats.lessons} Lessons, ${curriculumStats.studyNotes} Detailed 11-Section Study Notes, and ${curriculumStats.quizzes} Quizzes (${curriculumStats.questions} Questions) into Firestore safely.`,
      confirmLabel: 'Run Full Curriculum Sync',
    });
    if (!ok) return;

    setSyncingCurriculum(true);
    setSyncProgress(2);
    setSyncStage('Initializing curriculum sync...');
    try {
      const result = await seedAllCurriculumToFirestore(actor, (stage, pct) => {
        setSyncStage(stage);
        setSyncProgress(pct);
      });
      if (selectedCourse) {
        await loadCourseChildren(selectedCourse.id);
      }
      await refreshNoteCounts(courses);
      showToast(
        'Curriculum Sync Complete',
        'success',
        `${result.departments} Depts · ${result.courses} Courses · ${result.lessons} Lessons · ${result.studyNotes} Study Notes synced (${result.totalWrites} operations).`,
      );
    } catch (err) {
      showToast('Sync Error', 'error', err instanceof Error ? err.message : 'Unable to sync curriculum.');
    } finally {
      setSyncingCurriculum(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Department Handlers
  // ---------------------------------------------------------------------------
  const resetDeptForm = () => {
    setEditingDept(null);
    setDName('');
    setDSlug('');
    setDDesc('');
    setDOrder(departments.length + 1);
    setDStatus('active');
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDepartment(
        {
          id: editingDept?.id,
          name: dName,
          slug: dSlug || dName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: dDesc,
          orderIndex: dOrder,
          status: dStatus,
        },
        actor,
      );
      resetDeptForm();
      showToast(editingDept ? 'Department Updated' : 'Department Created', 'success');
    } catch (err) {
      showToast('Department Error', 'error', err instanceof Error ? err.message : 'Unable to save department.');
    }
  };

  // ---------------------------------------------------------------------------
  // Course Handlers
  // ---------------------------------------------------------------------------
  const resetCourseForm = () => {
    setEditingCourse(null);
    setCTitle('');
    setCDeptId(departments[0]?.id || '');
    setCCategory('');
    setCLevel('Beginner');
    setCDuration('');
    setCShort('');
    setCFull('');
    setCIntro('');
    setCObjectives('');
    setCAudience('');
    setCPrereq('');
    setCSyllabus('');
    setCModAssess('');
    setCFinalAssess('');
    setCThumb(BRAND_IMAGES.courseTech);
    setCOutcomes('');
    setCStatus('published');
  };

  const openEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCTitle(c.title);
    setCDeptId(c.departmentId || '');
    setCCategory(c.category);
    setCLevel(c.level);
    setCDuration(c.duration);
    setCShort(c.shortDescription);
    setCFull(c.fullDescription);
    setCIntro(c.introduction || '');
    setCObjectives((c.objectives || []).join('\n'));
    setCAudience(c.targetAudience || '');
    setCPrereq(c.prerequisites || '');
    setCSyllabus((c.syllabusSummary || []).join('\n'));
    setCModAssess((c.moduleAssessments || []).join('\n'));
    setCFinalAssess(c.finalAssessmentTitle || '');
    setCThumb(c.thumbnailUrl || BRAND_IMAGES.courseTech);
    setCOutcomes((c.outcomes || []).join('\n'));
    setCStatus(c.status);
    setShowCourseForm(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedDept = departments.find((d) => d.id === cDeptId);
    try {
      const id = await createOrUpdateCourse(
        {
          id: editingCourse?.id,
          title: cTitle,
          departmentId: matchedDept?.id || cDeptId || undefined,
          departmentName: matchedDept?.name || editingCourse?.departmentName,
          category: cCategory,
          level: cLevel,
          duration: cDuration,
          shortDescription: cShort,
          fullDescription: cFull,
          introduction: cIntro,
          objectives: cObjectives.split('\n').map((s) => s.trim()).filter(Boolean),
          targetAudience: cAudience,
          prerequisites: cPrereq,
          syllabusSummary: cSyllabus.split('\n').map((s) => s.trim()).filter(Boolean),
          moduleAssessments: cModAssess.split('\n').map((s) => s.trim()).filter(Boolean),
          finalAssessmentTitle: cFinalAssess,
          thumbnailUrl: cThumb,
          outcomes: cOutcomes.split('\n').map((s) => s.trim()).filter(Boolean),
          status: cStatus,
        },
        actor,
      );
      setSelectedCourseId(id);
      setShowCourseForm(false);
      resetCourseForm();
      showToast(editingCourse ? 'Course Updated' : 'Course Created', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to save course.');
    }
  };

  const handleDeleteCourse = async (c: Course) => {
    const ok = await confirmAction({
      title: `Delete "${c.title}"?`,
      message: 'This permanently deletes the course document. To preserve history, consider archiving instead.',
      confirmLabel: 'Delete Course',
      destructive: true,
    });
    if (!ok) return;
    await deleteCourse(c.id, actor);
    showToast('Course Deleted', 'info');
  };

  // ---------------------------------------------------------------------------
  // Module & Lesson Handlers
  // ---------------------------------------------------------------------------
  const resetModuleForm = () => {
    setEditingModule(null);
    setModTitle('');
    setModDesc('');
    setModAssessTitle('');
    setModAssessCriteria('');
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      await saveCourseModule(selectedCourse.id, {
        id: editingModule?.id,
        title: modTitle,
        description: modDesc,
        assessmentTitle: modAssessTitle,
        assessmentCriteria: modAssessCriteria,
        orderIndex: editingModule ? editingModule.orderIndex : modules.length + 1,
      });
      resetModuleForm();
      await loadCourseChildren(selectedCourse.id);
      showToast(editingModule ? 'Module Updated' : 'Module Added', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Could not save module.');
    }
  };

  const resetLessonForm = () => {
    setEditingLesson(null);
    setLesTitle('');
    setLesSummary('');
    setLesObjectives('');
    setLesBody('');
    setLesExamples('');
    setLesExercise('');
    setLesStatus('published');
    setLesDuration(25);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !lesModuleId) {
      showToast('Module Required', 'warning', 'Create or select a module first.');
      return;
    }
    try {
      await saveCourseLesson(selectedCourse.id, {
        id: editingLesson?.id,
        moduleId: lesModuleId,
        title: lesTitle,
        summary: lesSummary,
        objectives: lesObjectives.split('\n').map((s) => s.trim()).filter(Boolean),
        contentBody: lesBody,
        examples: lesExamples,
        exercisePrompt: lesExercise,
        status: lesStatus,
        durationMinutes: lesDuration,
        orderIndex: editingLesson ? editingLesson.orderIndex : lessons.length + 1,
      });
      resetLessonForm();
      await loadCourseChildren(selectedCourse.id);
      showToast(editingLesson ? 'Lesson Updated' : 'Lesson Added', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Could not save lesson.');
    }
  };

  // ---------------------------------------------------------------------------
  // Study Notes (11-Section + AI Assisted Draft) Handlers
  // ---------------------------------------------------------------------------
  const resetNoteForm = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteLessonId('');
    setNoteSourceType('official');
    setNoteStatus('published');
    setNTopicIntro('');
    setNSimpleExp('');
    setNDetailedExp('');
    setNKeyConcepts('');
    setNStepByStep('');
    setNPracticalEx('');
    setNRealWorld('');
    setNImportantPts('');
    setNCommonMistakes('');
    setNSummary('');
    setNPracticeQ('');
    setNSupplement('');
  };

  const loadNoteIntoForm = (n: StudyNote) => {
    setEditingNote(n);
    setNoteModuleId(n.moduleId);
    setNoteLessonId(n.lessonId || '');
    setNoteTitle(n.title);
    setNoteSourceType(n.sourceType);
    setNoteStatus(n.status);
    setNTopicIntro(n.topicIntroduction);
    setNSimpleExp(n.simpleExplanation);
    setNDetailedExp(n.detailedExplanation);
    setNKeyConcepts(n.keyConcepts);
    setNStepByStep(n.stepByStepExplanation);
    setNPracticalEx(n.practicalExamples);
    setNRealWorld(n.realWorldApplications);
    setNImportantPts(n.importantPoints);
    setNCommonMistakes(n.commonMistakes);
    setNSummary(n.summary);
    setNPracticeQ(n.practiceQuestions);
    setNSupplement(n.domainSupplement || '');
  };

  const handleGenerateAiNoteDraft = async () => {
    if (!selectedCourse) return;
    const matchedLesson = lessons.find((l) => l.id === noteLessonId);
    const targetTitle = noteTitle.trim() || matchedLesson?.title || selectedCourse.title;

    setDraftingNoteWithAi(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication session expired. Please refresh or sign in again.');
      }
      const resp = await fetch('/api/tutor/admin-draft-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseTitle: selectedCourse.title,
          departmentName: selectedCourse.departmentName || selectedCourse.category,
          lessonTitle: targetTitle,
          lessonSummary: matchedLesson?.summary || selectedCourse.shortDescription,
          lessonContent: matchedLesson?.contentBody || selectedCourse.fullDescription,
        }),
      });
      const data = (await resp.json()) as { draft?: Record<string, string>; error?: string };
      if (!resp.ok || !data.draft) {
        throw new Error(data.error || 'Could not generate AI draft.');
      }

      const d = data.draft;
      setNoteTitle(d.title || `${targetTitle} — Study Notes`);
      setNoteSourceType('ai_assisted_admin');
      setNoteStatus('draft'); // Must be explicitly reviewed and published by Admin
      setNTopicIntro(d.topicIntroduction || '');
      setNSimpleExp(d.simpleExplanation || '');
      setNDetailedExp(d.detailedExplanation || '');
      setNKeyConcepts(d.keyConcepts || '');
      setNStepByStep(d.stepByStepExplanation || '');
      setNPracticalEx(d.practicalExamples || '');
      setNRealWorld(d.realWorldApplications || '');
      setNImportantPts(d.importantPoints || '');
      setNCommonMistakes(d.commonMistakes || '');
      setNSummary(d.summary || '');
      setNPracticeQ(d.practiceQuestions || '');
      setNSupplement(d.domainSupplement || '');

      showToast(
        'AI Draft Loaded as Draft',
        'success',
        'Review and edit all 11 sections below, preview, then change Status to Published when ready.',
      );
    } catch (err) {
      showToast('AI Draft Failed', 'error', err instanceof Error ? err.message : 'Unable to generate AI draft.');
    } finally {
      setDraftingNoteWithAi(false);
    }
  };

  const buildNoteObjectForPreview = (): StudyNote => ({
    id: editingNote?.id || 'preview',
    courseId: selectedCourse?.id || '',
    moduleId: noteModuleId,
    lessonId: noteLessonId || undefined,
    title: noteTitle || 'Untitled Study Note Preview',
    sourceType: noteSourceType,
    status: noteStatus,
    topicIntroduction: nTopicIntro || 'Pending topic introduction...',
    simpleExplanation: nSimpleExp || 'Pending simple explanation...',
    detailedExplanation: nDetailedExp || 'Pending detailed explanation...',
    keyConcepts: nKeyConcepts || 'Pending key concepts...',
    stepByStepExplanation: nStepByStep || 'Pending step-by-step explanation...',
    practicalExamples: nPracticalEx || 'Pending practical examples...',
    realWorldApplications: nRealWorld || 'Pending real-world applications...',
    importantPoints: nImportantPts || 'Pending important points...',
    commonMistakes: nCommonMistakes || 'Pending common mistakes...',
    summary: nSummary || 'Pending summary...',
    practiceQuestions: nPracticeQ || 'Pending practice questions...',
    domainSupplement: nSupplement || undefined,
    createdBy: actor.uid,
    createdAt: null,
    updatedAt: null,
  });

  const handleSaveStudyNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !noteModuleId) {
      showToast('Module Required', 'warning', 'Select a module before saving a study note.');
      return;
    }
    const requiredSections: Array<[string, string]> = [
      ['Topic Introduction', nTopicIntro],
      ['Simple Explanation', nSimpleExp],
      ['Detailed Explanation', nDetailedExp],
      ['Key Concepts', nKeyConcepts],
      ['Step-by-Step Explanation', nStepByStep],
      ['Practical Examples', nPracticalEx],
      ['Real-World Applications', nRealWorld],
      ['Important Points', nImportantPts],
      ['Common Mistakes', nCommonMistakes],
      ['Summary', nSummary],
      ['Practice Questions', nPracticeQ],
    ];
    const tooShort = requiredSections.find(([, val]) => val.trim().length < 10);
    if (tooShort) {
      showToast(
        'Section Too Short',
        'warning',
        `"${tooShort[0]}" requires at least 10 characters to satisfy RM HEAVEN note standards.`,
      );
      return;
    }

    try {
      await saveStudyNote(
        selectedCourse.id,
        {
          id: editingNote?.id,
          moduleId: noteModuleId,
          lessonId: noteLessonId || undefined,
          title: noteTitle,
          sourceType: noteSourceType,
          status: noteStatus,
          topicIntroduction: nTopicIntro,
          simpleExplanation: nSimpleExp,
          detailedExplanation: nDetailedExp,
          keyConcepts: nKeyConcepts,
          stepByStepExplanation: nStepByStep,
          practicalExamples: nPracticalEx,
          realWorldApplications: nRealWorld,
          importantPoints: nImportantPts,
          commonMistakes: nCommonMistakes,
          summary: nSummary,
          practiceQuestions: nPracticeQ,
          domainSupplement: nSupplement || undefined,
        },
        actor,
      );
      resetNoteForm();
      await loadCourseChildren(selectedCourse.id);
      setNoteCounts((prev) => ({
        ...prev,
        [selectedCourse.id]: editingNote ? prev[selectedCourse.id] ?? studyNotes.length : (prev[selectedCourse.id] ?? studyNotes.length) + 1,
      }));
      showToast(editingNote ? 'Study Note Updated' : '11-Section Study Note Saved', 'success');
    } catch (err) {
      showToast('Save Failed', 'error', err instanceof Error ? err.message : 'Unable to save study note.');
    }
  };

  // ---------------------------------------------------------------------------
  // Quiz & Question Bank Handlers
  // ---------------------------------------------------------------------------
  const resetQuizForm = () => {
    setEditingQuizId(null);
    setQzType('module');
    setQzTitle('');
    setQzDesc('');
    setQzPassing(70);
    setQzStatus('published');
    setQzQuestions([EMPTY_QUESTION()]);
  };

  const handleEditQuiz = async (qz: Quiz) => {
    if (!selectedCourse) return;
    setEditingQuizId(qz.id);
    setQzType(qz.quizType);
    setQzModuleId(qz.moduleId || '');
    setQzTitle(qz.title);
    setQzDesc(qz.description);
    setQzPassing(qz.passingPercent);
    setQzStatus(qz.status);
    const qs = await fetchQuizQuestions(selectedCourse.id, qz.id);
    if (qs.length > 0) {
      setQzQuestions(
        qs.map((item) => ({
          id: item.id,
          questionText: item.questionText,
          options: [
            item.options[0] || '',
            item.options[1] || '',
            item.options[2] || '',
            item.options[3] || '',
          ],
          correctIndex: item.correctIndex,
          explanation: item.explanation,
          topicTag: item.topicTag || '',
        })),
      );
    } else {
      setQzQuestions([EMPTY_QUESTION()]);
    }
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    const validQs = qzQuestions.filter(
      (q) => q.questionText.trim().length >= 5 && q.options.filter((o) => o.trim()).length >= 2,
    );
    if (validQs.length === 0) {
      showToast('Question Required', 'warning', 'Add at least 1 complete multiple-choice question.');
      return;
    }
    setSavingQuiz(true);
    try {
      await saveQuizWithQuestions(
        selectedCourse.id,
        {
          id: editingQuizId || undefined,
          moduleId: qzType === 'module' ? qzModuleId || undefined : undefined,
          quizType: qzType,
          title: qzTitle,
          description: qzDesc,
          passingPercent: qzPassing,
          status: qzStatus,
          questions: validQs.map((q, idx) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options.map((o) => o.trim()).filter(Boolean),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            topicTag: q.topicTag,
            orderIndex: idx + 1,
          })),
        },
        actor,
      );
      resetQuizForm();
      await loadCourseChildren(selectedCourse.id);
      showToast(editingQuizId ? 'Quiz Updated' : 'Quiz Published', 'success');
    } catch (err) {
      showToast('Quiz Error', 'error', err instanceof Error ? err.message : 'Unable to save quiz.');
    } finally {
      setSavingQuiz(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Material Handlers
  // ---------------------------------------------------------------------------
  const resetMaterialForm = () => {
    setEditingMaterial(null);
    setMatLessonId('');
    setMatTitle('');
    setMatDesc('');
    setMatUrl('');
    setMatFileName('');
    setMatDownload(false);
    setMatStatus('active');
  };

  const handleMaterialFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;
    setMatUploading(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const url = await uploadFileToStorage(
        `courses/${selectedCourse.id}/materials/${Date.now()}_${safe}`,
        file,
      );
      setMatUrl(url);
      setMatFileName(file.name);
      showToast('PDF Uploaded to Storage', 'success');
    } catch (err) {
      showToast('Upload Notice', 'warning', err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setMatUploading(false);
    }
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !matModuleId) {
      showToast('Module Required', 'warning', 'Create a course module before attaching materials.');
      return;
    }
    try {
      await saveLearningMaterial(
        selectedCourse.id,
        {
          id: editingMaterial?.id,
          moduleId: matModuleId,
          lessonId: matLessonId || undefined,
          title: matTitle,
          description: matDesc,
          fileUrl: matUrl,
          fileName: matFileName || 'document.pdf',
          fileType: 'application/pdf',
          downloadAllowed: matDownload,
          status: matStatus,
        },
        actor,
      );
      resetMaterialForm();
      await loadCourseChildren(selectedCourse.id);
      showToast(editingMaterial ? 'Material Updated' : 'Learning Material Saved', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to save material.');
    }
  };

  const handleToggleDownloadPermission = async (mat: LearningMaterial) => {
    if (!selectedCourse) return;
    await saveLearningMaterial(
      selectedCourse.id,
      {
        id: mat.id,
        moduleId: mat.moduleId,
        lessonId: mat.lessonId,
        title: mat.title,
        description: mat.description,
        fileUrl: mat.fileUrl,
        fileName: mat.fileName,
        fileType: mat.fileType,
        downloadAllowed: !mat.downloadAllowed,
        status: mat.status,
      },
      actor,
    );
    await loadCourseChildren(selectedCourse.id);
    showToast('Download Permission Updated', 'success');
  };

  // ---------------------------------------------------------------------------
  // Assignment Handlers
  // ---------------------------------------------------------------------------
  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      await saveAssignment(
        selectedCourse.id,
        selectedCourse.title,
        {
          title: assignTitle,
          instructions: assignInstructions,
          dueDate: assignDue,
          maxMarks: assignMaxMarks,
          status: 'published',
        },
        actor,
      );
      setAssignTitle('');
      setAssignInstructions('');
      setAssignDue('');
      await loadCourseChildren(selectedCourse.id);
      showToast('Assignment Published', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to save assignment.');
    }
  };

  const moduleLessonsForMat = useMemo(
    () => lessons.filter((l) => l.moduleId === matModuleId),
    [lessons, matModuleId],
  );
  const moduleLessonsForNote = useMemo(
    () => lessons.filter((l) => l.moduleId === noteModuleId),
    [lessons, noteModuleId],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#292323]">
            {mode === 'courses'
              ? 'Curriculum & Course Management'
              : mode === 'materials'
                ? 'Official PDF & Material Management'
                : 'Assignment Management'}
          </h1>
          <p className="mt-1 text-sm text-[#292323]/70">
            {mode === 'courses'
              ? 'Manage the 4 departments, 31 courses, modules, lessons, 11-section study notes, and quiz banks.'
              : mode === 'materials'
                ? 'Upload PDF resources, map to module & lesson, replace files, and control download permissions.'
                : 'Publish course assignments with instructions, deadlines, and maximum marks.'}
          </p>
        </div>
        {mode === 'courses' && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                resetDeptForm();
                setShowDeptManager((s) => !s);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/20 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D]"
            >
              <Layers className="h-4 w-4" />
              {showDeptManager ? 'Close Departments' : `Departments (${departments.length})`}
            </button>
            <button
              type="button"
              onClick={() => {
                resetCourseForm();
                setShowCourseForm((s) => !s);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
            >
              <Plus className="h-4 w-4" />
              {showCourseForm ? 'Close Form' : 'Create Course'}
            </button>
          </div>
        )}
      </div>

      {/* ONE-CLICK FULL CURRICULUM SEED / SYNC BANNER */}
      {mode === 'courses' && (
        <div className="rounded-2xl border border-[#D5B77A]/50 bg-white p-5 shadow-xs">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#761D2D]">
                RM HEAVEN Master Curriculum Registry
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold text-[#292323]">
                {curriculumStats.departments} Departments · {curriculumStats.courses} Complete Courses Ready to Sync
              </h2>
              <p className="mt-1 text-xs text-[#292323]/75">
                Includes {curriculumStats.modules} Modules · {curriculumStats.lessons} Lessons ·{' '}
                {curriculumStats.studyNotes} 11-Section Study Notes · {curriculumStats.quizzes} Quizzes (
                {curriculumStats.questions} Questions) · {curriculumStats.assignments} Capstone Assignments.
              </p>
            </div>
            <button
              type="button"
              disabled={syncingCurriculum}
              onClick={handleSyncAllCurriculum}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#761D2D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8F2638] disabled:opacity-60"
            >
              {syncingCurriculum ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {syncingCurriculum
                ? `Syncing (${syncProgress}%)`
                : 'Sync All 4 Departments & 31 Complete Courses'}
            </button>
          </div>
          {syncingCurriculum && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-[#761D2D]">
                <span>{syncStage}</span>
                <span className="font-mono tabular-nums">{syncProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F8F4ED]">
                <div
                  className="h-full bg-[#761D2D] transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEPARTMENTS MANAGER PANEL */}
      {mode === 'courses' && showDeptManager && (
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#292323]/12 bg-white p-6 lg:grid-cols-12">
          <form onSubmit={handleSaveDepartment} className="space-y-3 lg:col-span-5">
            <h2 className="font-display text-xl font-bold text-[#292323]">
              {editingDept ? `Edit Department: ${editingDept.name}` : 'Create Academic Department'}
            </h2>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Department Name *</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={140}
                value={dName}
                onChange={(e) => setDName(e.target.value)}
                placeholder="Programming & Web Development"
                className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#292323]/80">URL Slug</label>
                <input
                  type="text"
                  maxLength={100}
                  value={dSlug}
                  onChange={(e) => setDSlug(e.target.value)}
                  placeholder="programming-web-development"
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Order</label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={dOrder}
                  onChange={(e) => setDOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Status</label>
              <select
                value={dStatus}
                onChange={(e) => setDStatus(e.target.value as 'active' | 'archived')}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Description *</label>
              <textarea
                required
                minLength={5}
                maxLength={1200}
                rows={3}
                value={dDesc}
                onChange={(e) => setDDesc(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
              />
            </div>
            <div className="flex gap-2">
              {editingDept && (
                <button
                  type="button"
                  onClick={resetDeptForm}
                  className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
              >
                {editingDept ? 'Save Department' : 'Create Department'}
              </button>
            </div>
          </form>

          <div className="space-y-3 lg:col-span-7">
            <h3 className="font-display text-xl font-bold text-[#292323]">
              Departments Directory ({departments.length})
            </h3>
            {departments.length === 0 ? (
              <p className="text-xs text-[#292323]/65">
                No departments stored yet. Click Sync above or create one on the left.
              </p>
            ) : (
              <div className="space-y-2.5">
                {departments.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[#292323]/10 p-3.5 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#761D2D] font-bold">#{d.orderIndex}</span>
                        <span className="font-semibold text-sm text-[#292323]">{d.name}</span>
                        <StatusLabel status={d.status} />
                      </div>
                      <p className="mt-1 text-[#292323]/75">{d.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDept(d);
                          setDName(d.name);
                          setDSlug(d.slug);
                          setDDesc(d.description);
                          setDOrder(d.orderIndex);
                          setDStatus(d.status);
                        }}
                        className="text-[#292323]/75 hover:text-[#761D2D]"
                        aria-label="Edit department"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = await confirmAction({
                            title: `Delete "${d.name}"?`,
                            message: 'Courses linked to this department ID will remain until reassigned.',
                            destructive: true,
                          });
                          if (ok) {
                            await deleteDepartment(d.id, actor);
                            showToast('Department Deleted', 'info');
                          }
                        }}
                        className="text-[#B4434D] hover:text-[#761D2D]"
                        aria-label="Delete department"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Course Form */}
      {mode === 'courses' && showCourseForm && (
        <form
          onSubmit={handleSaveCourse}
          className="space-y-4 rounded-2xl border border-[#292323]/12 bg-white p-6"
        >
          <h2 className="font-display text-2xl font-semibold text-[#292323]">
            {editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Course'}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#292323]/80">Course Title *</label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={160}
                value={cTitle}
                onChange={(e) => setCTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Department</label>
              <select
                value={cDeptId}
                onChange={(e) => setCDeptId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select department...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Category *</label>
              <input
                type="text"
                required
                maxLength={80}
                value={cCategory}
                onChange={(e) => setCCategory(e.target.value)}
                placeholder="Java Programming"
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Duration *</label>
              <input
                type="text"
                required
                maxLength={64}
                value={cDuration}
                onChange={(e) => setCDuration(e.target.value)}
                placeholder="6 Weeks"
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Level</label>
              <select
                value={cLevel}
                onChange={(e) => setCLevel(e.target.value as Course['level'])}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-white px-3 py-2 text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Publication Status</label>
              <select
                value={cStatus}
                onChange={(e) => setCStatus(e.target.value as Course['status'])}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-white px-3 py-2 text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Thumbnail Preset</label>
              <select
                value={cThumb}
                onChange={(e) => setCThumb(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-white px-3 py-2 text-sm"
              >
                <option value={BRAND_IMAGES.courseProgramming}>Programming &amp; Web Development</option>
                <option value={BRAND_IMAGES.courseAiData}>Artificial Intelligence &amp; Data</option>
                <option value={BRAND_IMAGES.courseDesignStudio}>Design &amp; Creative Technology</option>
                <option value={BRAND_IMAGES.courseBusiness}>Business, Marketing &amp; Career</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Short Description (10–320 chars) *</label>
              <input
                type="text"
                required
                minLength={10}
                maxLength={320}
                value={cShort}
                onChange={(e) => setCShort(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Final Assessment Title</label>
              <input
                type="text"
                maxLength={300}
                value={cFinalAssess}
                onChange={(e) => setCFinalAssess(e.target.value)}
                placeholder="Comprehensive Capstone Examination"
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Full Description *</label>
              <textarea
                required
                rows={3}
                minLength={10}
                maxLength={4000}
                value={cFull}
                onChange={(e) => setCFull(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-xs focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Course Introduction</label>
              <textarea
                rows={3}
                maxLength={3000}
                value={cIntro}
                onChange={(e) => setCIntro(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-xs focus:border-[#761D2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Who Should Learn (Target Audience)</label>
              <input
                type="text"
                maxLength={1000}
                value={cAudience}
                onChange={(e) => setCAudience(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Prerequisites</label>
              <input
                type="text"
                maxLength={1000}
                value={cPrereq}
                onChange={(e) => setCPrereq(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Course Objectives (one per line)</label>
              <textarea
                rows={3}
                value={cObjectives}
                onChange={(e) => setCObjectives(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Learning Outcomes (one per line)</label>
              <textarea
                rows={3}
                value={cOutcomes}
                onChange={(e) => setCOutcomes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Syllabus Summary Topics (one per line)</label>
              <textarea
                rows={2}
                value={cSyllabus}
                onChange={(e) => setCSyllabus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Module Assessments (one per line)</label>
              <textarea
                rows={2}
                value={cModAssess}
                onChange={(e) => setCModAssess(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCourseForm(false);
                resetCourseForm();
              }}
              className="rounded-lg border border-[#292323]/15 px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#761D2D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
            >
              {editingCourse ? 'Save Course Changes' : 'Publish / Save Course'}
            </button>
          </div>
        </form>
      )}

      {/* Course Directory Table in Courses Mode */}
      {mode === 'courses' && (
        <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-[#292323]">
              Course Catalogue ({filteredCourses.length} of {courses.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#292323]/45" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-1.5 pl-8 pr-3 text-xs focus:border-[#761D2D] focus:outline-none"
                />
              </div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="rounded-lg border border-[#292323]/15 bg-white px-3 py-1.5 text-xs"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <EmptyState
              title="No Courses Match Filter"
              description="Click 'Sync All 4 Departments & 31 Complete Courses' above or clear filters to view courses."
            />
          ) : (
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white border-b border-[#292323]/10 text-[#292323]/60">
                  <tr>
                    <th className="py-2.5 pr-4 font-semibold">Course</th>
                    <th className="py-2.5 pr-4 font-semibold">Department</th>
                    <th className="py-2.5 pr-4 font-semibold">Level · Duration</th>
                    <th className="py-2.5 pr-4 font-semibold">Study Notes</th>
                    <th className="py-2.5 pr-4 font-semibold">Status</th>
                    <th className="py-2.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292323]/8">
                  {filteredCourses.map((c) => (
                    <tr
                      key={c.id}
                      className={selectedCourse?.id === c.id ? 'bg-[#F8F4ED]/85' : 'hover:bg-[#F8F4ED]/35'}
                    >
                      <td className="py-3 pr-4 font-semibold text-[#292323]">{c.title}</td>
                      <td className="py-3 pr-4 text-[#292323]/75">{c.departmentName || c.category}</td>
                      <td className="py-3 pr-4 text-[#292323]/75">
                        {c.level} · {c.duration}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-[#761D2D]">
                        {noteCounts[c.id] !== undefined ? `${noteCounts[c.id]} Notes` : '...'}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusLabel status={c.status} />
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseId(c.id)}
                            className="font-semibold text-[#761D2D] hover:underline"
                          >
                            Manage Studio
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditCourse(c)}
                            className="text-[#292323]/75 hover:text-[#761D2D]"
                            aria-label="Edit course"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c)}
                            className="text-[#B4434D] hover:text-[#761D2D]"
                            aria-label="Delete course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Selected Course Context Bar */}
      {courses.length > 0 && selectedCourse && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#292323]/10 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#761D2D]">
              <BookOpen className="h-4 w-4" />
              <span>Active Course Studio:</span>
            </div>
            <select
              value={selectedCourse.id}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                resetModuleForm();
                resetLessonForm();
                resetNoteForm();
                resetQuizForm();
                resetMaterialForm();
              }}
              className="rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/50 px-3 py-1.5 text-sm font-semibold text-[#292323] max-w-full"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.departmentName ? `[${c.departmentName}] ` : ''}
                  {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>

          {/* COURSE STUDIO SUB-TABS */}
          {mode === 'courses' && (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-[#292323]/10 pb-2">
                <button
                  type="button"
                  onClick={() => setStudioTab('curriculum')}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    studioTab === 'curriculum'
                      ? 'bg-[#761D2D] text-white'
                      : 'bg-white text-[#292323]/80 border border-[#292323]/12 hover:text-[#761D2D]'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Modules &amp; Lessons ({modules.length} / {lessons.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab('notes')}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    studioTab === 'notes'
                      ? 'bg-[#761D2D] text-white'
                      : 'bg-white text-[#292323]/80 border border-[#292323]/12 hover:text-[#761D2D]'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  11-Section Study Notes ({studyNotes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab('quizzes')}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    studioTab === 'quizzes'
                      ? 'bg-[#761D2D] text-white'
                      : 'bg-white text-[#292323]/80 border border-[#292323]/12 hover:text-[#761D2D]'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Quizzes &amp; Assessments ({quizzes.length})
                </button>
              </div>

              {/* SUB-TAB 1: MODULES & LESSONS */}
              {studioTab === 'curriculum' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Modules Column */}
                  <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold text-[#292323]">
                        Modules ({modules.length})
                      </h3>
                      {editingModule && (
                        <button
                          type="button"
                          onClick={resetModuleForm}
                          className="text-xs font-semibold text-[#761D2D] hover:underline"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <form onSubmit={handleSaveModule} className="space-y-3 border-b border-[#292323]/10 pb-4">
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={160}
                        value={modTitle}
                        onChange={(e) => setModTitle(e.target.value)}
                        placeholder="Module title *"
                        className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        maxLength={1000}
                        value={modDesc}
                        onChange={(e) => setModDesc(e.target.value)}
                        placeholder="Brief module summary"
                        className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        maxLength={200}
                        value={modAssessTitle}
                        onChange={(e) => setModAssessTitle(e.target.value)}
                        placeholder="Module assessment title (optional)"
                        className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        maxLength={1000}
                        value={modAssessCriteria}
                        onChange={(e) => setModAssessCriteria(e.target.value)}
                        placeholder="Assessment criteria (optional)"
                        className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                      >
                        {editingModule ? 'Save Module Changes' : 'Add Module'}
                      </button>
                    </form>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {modules.map((m, idx) => (
                        <div key={m.id} className="flex items-start justify-between gap-2 rounded-lg border border-[#292323]/10 p-3 text-xs">
                          <div>
                            <p className="font-semibold text-[#292323]">
                              {idx + 1}. {m.title}
                            </p>
                            {m.description && <p className="mt-0.5 text-[#292323]/65">{m.description}</p>}
                            {m.assessmentTitle && (
                              <p className="mt-1 text-[11px] font-medium text-[#761D2D]">
                                Assessment: {m.assessmentTitle}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingModule(m);
                                setModTitle(m.title);
                                setModDesc(m.description || '');
                                setModAssessTitle(m.assessmentTitle || '');
                                setModAssessCriteria(m.assessmentCriteria || '');
                              }}
                              className="text-[#292323]/75 hover:text-[#761D2D]"
                              aria-label="Edit module"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteCourseModule(selectedCourse.id, m.id);
                                await loadCourseChildren(selectedCourse.id);
                                showToast('Module Deleted', 'info');
                              }}
                              className="text-[#B4434D] hover:text-[#761D2D]"
                              aria-label="Delete module"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lessons Column */}
                  <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold text-[#292323]">
                        Lessons ({lessons.length})
                      </h3>
                      {editingLesson && (
                        <button
                          type="button"
                          onClick={resetLessonForm}
                          className="text-xs font-semibold text-[#761D2D] hover:underline"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <form onSubmit={handleSaveLesson} className="space-y-3 border-b border-[#292323]/10 pb-4">
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={lesModuleId}
                          onChange={(e) => setLesModuleId(e.target.value)}
                          className="col-span-2 rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          {modules.length === 0 && <option value="">Create a module first</option>}
                          {modules.map((m) => (
                            <option key={m.id} value={m.id}>
                              Module: {m.title}
                            </option>
                          ))}
                        </select>
                        <select
                          value={lesStatus}
                          onChange={(e) => setLesStatus(e.target.value as 'published' | 'draft')}
                          className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          minLength={2}
                          maxLength={160}
                          value={lesTitle}
                          onChange={(e) => setLesTitle(e.target.value)}
                          placeholder="Lesson title *"
                          className="col-span-2 rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        />
                        <input
                          type="number"
                          min={1}
                          max={600}
                          value={lesDuration}
                          onChange={(e) => setLesDuration(Number(e.target.value))}
                          placeholder="Min"
                          className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        maxLength={500}
                        value={lesSummary}
                        onChange={(e) => setLesSummary(e.target.value)}
                        placeholder="Lesson summary"
                        className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                      <textarea
                        rows={2}
                        value={lesObjectives}
                        onChange={(e) => setLesObjectives(e.target.value)}
                        placeholder="Lesson objectives (one per line, optional)"
                        className="w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
                      />
                      <textarea
                        required
                        minLength={2}
                        rows={4}
                        maxLength={20000}
                        value={lesBody}
                        onChange={(e) => setLesBody(e.target.value)}
                        placeholder="Full lesson content (Markdown headings & code blocks supported)..."
                        className="w-full rounded-lg border border-[#292323]/15 p-3 text-xs"
                      />
                      <textarea
                        rows={2}
                        maxLength={10000}
                        value={lesExamples}
                        onChange={(e) => setLesExamples(e.target.value)}
                        placeholder="Practical worked examples (optional)"
                        className="w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
                      />
                      <textarea
                        rows={2}
                        maxLength={4000}
                        value={lesExercise}
                        onChange={(e) => setLesExercise(e.target.value)}
                        placeholder="Hands-on exercise prompt (optional)"
                        className="w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={modules.length === 0}
                        className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                      >
                        {editingLesson ? 'Save Lesson Changes' : 'Add Lesson'}
                      </button>
                    </form>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {lessons.map((l) => (
                        <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg border border-[#292323]/10 p-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#292323]">{l.title}</p>
                              <StatusLabel status={l.status || 'published'} />
                            </div>
                            <p className="text-[#292323]/60">
                              {modules.find((m) => m.id === l.moduleId)?.title || 'Module'} ·{' '}
                              {l.durationMinutes || 15} min
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLesson(l);
                                setLesModuleId(l.moduleId);
                                setLesTitle(l.title);
                                setLesSummary(l.summary || '');
                                setLesObjectives((l.objectives || []).join('\n'));
                                setLesBody(l.contentBody);
                                setLesExamples(l.examples || '');
                                setLesExercise(l.exercisePrompt || '');
                                setLesStatus(l.status || 'published');
                                setLesDuration(l.durationMinutes || 25);
                              }}
                              className="text-[#292323]/75 hover:text-[#761D2D]"
                              aria-label="Edit lesson"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteCourseLesson(selectedCourse.id, l.id);
                                await loadCourseChildren(selectedCourse.id);
                                showToast('Lesson Deleted', 'info');
                              }}
                              className="text-[#B4434D] hover:text-[#761D2D]"
                              aria-label="Delete lesson"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: 11-SECTION STUDY NOTES + AI ASSISTED ADMIN DRAFT */}
              {studioTab === 'notes' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <form
                    onSubmit={handleSaveStudyNote}
                    className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-[#292323]">
                          {editingNote ? `Edit Note: ${editingNote.title}` : 'Create 11-Section Study Note'}
                        </h3>
                        <p className="text-xs text-[#292323]/65">
                          Official curriculum study notes must contain substantive educational content across all 11 sections.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={draftingNoteWithAi || modules.length === 0}
                          onClick={handleGenerateAiNoteDraft}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D5B77A] bg-[#F8F4ED] px-3 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#761D2D] hover:text-white disabled:opacity-50"
                        >
                          {draftingNoteWithAi ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          {draftingNoteWithAi ? 'Drafting 11 Sections...' : 'Generate AI Draft for Review'}
                        </button>
                        {onSwitchMode && (
                          <button
                            type="button"
                            onClick={() => onSwitchMode('materials')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/20 bg-white px-3 py-2 text-xs font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D]"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload PDF Note
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewNote(buildNoteObjectForPreview())}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/20 px-3 py-2 text-xs font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview Draft
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Target Module *</label>
                        <select
                          value={noteModuleId}
                          onChange={(e) => {
                            setNoteModuleId(e.target.value);
                            setNoteLessonId('');
                          }}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          {modules.length === 0 && <option value="">Create a module first</option>}
                          {modules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Linked Lesson (Optional)</label>
                        <select
                          value={noteLessonId}
                          onChange={(e) => setNoteLessonId(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="">Module-level study note</option>
                          {moduleLessonsForNote.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#292323]/80">Note Title *</label>
                        <input
                          type="text"
                          required
                          minLength={3}
                          maxLength={180}
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Authorship Tag</label>
                        <select
                          value={noteSourceType}
                          onChange={(e) =>
                            setNoteSourceType(e.target.value as 'official' | 'ai_assisted_admin')
                          }
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="official">Official Curriculum</option>
                          <option value="ai_assisted_admin">AI-Assisted (Verified)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Publication Status</label>
                        <select
                          value={noteStatus}
                          onChange={(e) => setNoteStatus(e.target.value as 'published' | 'draft')}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft (Hidden from Students)</option>
                        </select>
                      </div>
                    </div>

                    {/* Formatting helper strip */}
                    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[#F8F4ED] px-3 py-2 text-[11px] text-[#292323]/80">
                      <Code2 className="h-3.5 w-3.5 text-[#761D2D]" />
                      <span className="font-semibold">Markdown Helpers:</span>
                      <button
                        type="button"
                        onClick={() => setNPracticalEx((prev) => `${prev}\n\`\`\`python\n# Example\nprint("RM HEAVEN")\n\`\`\`\n`)}
                        className="rounded border border-[#292323]/15 bg-white px-2 py-0.5 font-mono hover:border-[#761D2D]"
                      >
                        + Python Block
                      </button>
                      <button
                        type="button"
                        onClick={() => setNPracticalEx((prev) => `${prev}\n\`\`\`java\npublic class Example {\n  public static void main(String[] args) {\n    System.out.println("RM HEAVEN");\n  }\n}\n\`\`\`\n`)}
                        className="rounded border border-[#292323]/15 bg-white px-2 py-0.5 font-mono hover:border-[#761D2D]"
                      >
                        + Java Block
                      </button>
                      <button
                        type="button"
                        onClick={() => setNPracticalEx((prev) => `${prev}\n\`\`\`html\n<section>\n  <h2>RM HEAVEN</h2>\n</section>\n\`\`\`\n`)}
                        className="rounded border border-[#292323]/15 bg-white px-2 py-0.5 font-mono hover:border-[#761D2D]"
                      >
                        + HTML Block
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: '01. Topic Introduction *', val: nTopicIntro, set: setNTopicIntro, rows: 2, max: 3000 },
                        { label: '02. Simple Explanation *', val: nSimpleExp, set: setNSimpleExp, rows: 3, max: 4000 },
                        { label: '03. Detailed Explanation *', val: nDetailedExp, set: setNDetailedExp, rows: 4, max: 8000 },
                        { label: '04. Key Concepts & Terminology *', val: nKeyConcepts, set: setNKeyConcepts, rows: 3, max: 6000 },
                        { label: '05. Step-by-Step Explanation *', val: nStepByStep, set: setNStepByStep, rows: 3, max: 6000 },
                        { label: '06. Practical Examples *', val: nPracticalEx, set: setNPracticalEx, rows: 4, max: 8000 },
                        { label: '07. Real-World Applications *', val: nRealWorld, set: setNRealWorld, rows: 2, max: 4000 },
                        { label: '08. Important Points to Remember *', val: nImportantPts, set: setNImportantPts, rows: 2, max: 4000 },
                        { label: '09. Common Mistakes & How to Avoid Them *', val: nCommonMistakes, set: setNCommonMistakes, rows: 2, max: 4000 },
                        { label: '10. Topic Summary *', val: nSummary, set: setNSummary, rows: 2, max: 3000 },
                        { label: '11. Practice Questions & Answers *', val: nPracticeQ, set: setNPracticeQ, rows: 4, max: 8000 },
                        { label: 'Applied Curriculum / Domain Lab Supplement (Optional)', val: nSupplement, set: setNSupplement, rows: 2, max: 6000, optional: true },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs font-semibold text-[#292323]/80">{field.label}</label>
                          <textarea
                            required={!field.optional}
                            minLength={field.optional ? undefined : 10}
                            maxLength={field.max}
                            rows={field.rows}
                            value={field.val}
                            onChange={(e) => field.set(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs focus:border-[#761D2D] focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 pt-2">
                      {editingNote && (
                        <button
                          type="button"
                          onClick={resetNoteForm}
                          className="rounded-lg border border-[#292323]/15 px-4 py-2 text-xs font-semibold"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewNote(buildNoteObjectForPreview())}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/20 bg-[#F8F4ED] px-4 py-2 text-xs font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D]"
                      >
                        <Eye className="h-4 w-4" />
                        Preview Draft
                      </button>
                      <button
                        type="submit"
                        disabled={modules.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {editingNote ? 'Save Study Note Changes' : 'Save 11-Section Study Note'}
                      </button>
                    </div>
                  </form>

                  {/* Study Notes List */}
                  <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5 space-y-4">
                    <h3 className="font-display text-2xl font-semibold text-[#292323]">
                      Course Study Notes ({studyNotes.length})
                    </h3>
                    {studyNotes.length === 0 ? (
                      <p className="text-xs text-[#292323]/65">
                        No official study notes created for this course yet. Use the form on the left or run Curriculum Sync.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[820px] overflow-y-auto">
                        {studyNotes.map((n) => (
                          <div key={n.id} className="rounded-xl border border-[#292323]/10 p-4 text-xs space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-sm text-[#292323]">{n.title}</p>
                                <p className="text-[#292323]/65">
                                  {modules.find((m) => m.id === n.moduleId)?.title || 'Module'}
                                  {n.sourceType === 'ai_assisted_admin' ? ' · AI-Assisted Draft' : ' · Official'}
                                </p>
                              </div>
                              <StatusLabel status={n.status} />
                            </div>
                            <p className="line-clamp-2 text-[#292323]/75">{n.topicIntroduction}</p>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <button
                                type="button"
                                onClick={() => setPreviewNote(n)}
                                className="inline-flex items-center gap-1 font-semibold text-[#761D2D] hover:underline"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => loadNoteIntoForm(n)}
                                className="inline-flex items-center gap-1 font-semibold text-[#292323]/80 hover:text-[#761D2D]"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  const nextStatus = n.status === 'published' ? 'draft' : 'published';
                                  await saveStudyNote(
                                    selectedCourse.id,
                                    {
                                      ...n,
                                      status: nextStatus,
                                    },
                                    actor,
                                  );
                                  await loadCourseChildren(selectedCourse.id);
                                  showToast(
                                    nextStatus === 'published' ? 'Study Note Published' : 'Study Note Moved to Draft',
                                    'success',
                                  );
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-[#761D2D] hover:underline"
                              >
                                {n.status === 'published' ? (
                                  <>
                                    <Lock className="h-3.5 w-3.5" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-3.5 w-3.5" />
                                    Publish
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await deleteStudyNote(selectedCourse.id, n.id);
                                  await loadCourseChildren(selectedCourse.id);
                                  setNoteCounts((prev) => ({
                                    ...prev,
                                    [selectedCourse.id]: Math.max(0, (prev[selectedCourse.id] ?? 1) - 1),
                                  }));
                                  showToast('Study Note Deleted', 'info');
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-[#B4434D] hover:text-[#761D2D]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: QUIZZES & QUESTION BANK BUILDER */}
              {studioTab === 'quizzes' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <form
                    onSubmit={handleSaveQuiz}
                    className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-semibold text-[#292323]">
                        {editingQuizId ? 'Edit Quiz & Question Bank' : 'Create Course Quiz'}
                      </h3>
                      {editingQuizId && (
                        <button
                          type="button"
                          onClick={resetQuizForm}
                          className="text-xs font-semibold text-[#761D2D] hover:underline"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Quiz Type</label>
                        <select
                          value={qzType}
                          onChange={(e) => setQzType(e.target.value as 'module' | 'final' | 'practice')}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="module">Module Assessment</option>
                          <option value="final">Final Assessment</option>
                          <option value="practice">Practice Quiz</option>
                        </select>
                      </div>
                      {qzType === 'module' && (
                        <div>
                          <label className="block text-xs font-semibold text-[#292323]/80">Module</label>
                          <select
                            value={qzModuleId}
                            onChange={(e) => setQzModuleId(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                          >
                            {modules.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Passing %</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={qzPassing}
                          onChange={(e) => setQzPassing(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#292323]/80">Status</label>
                        <select
                          value={qzStatus}
                          onChange={(e) => setQzStatus(e.target.value as 'published' | 'draft')}
                          className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Quiz Title *</label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={180}
                        value={qzTitle}
                        onChange={(e) => setQzTitle(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Instructions / Description *</label>
                      <textarea
                        required
                        rows={2}
                        maxLength={1000}
                        value={qzDesc}
                        onChange={(e) => setQzDesc(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
                      />
                    </div>

                    <div className="space-y-3 border-t border-[#292323]/10 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#761D2D]">
                          Question Bank ({qzQuestions.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => setQzQuestions((prev) => [...prev, EMPTY_QUESTION()])}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#761D2D]/30 px-2.5 py-1 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Question
                        </button>
                      </div>

                      {qzQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-2.5 rounded-xl border border-[#292323]/12 bg-[#F8F4ED]/50 p-4 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#761D2D]">Question {qIdx + 1}</span>
                            {qzQuestions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setQzQuestions((prev) => prev.filter((_, i) => i !== qIdx))}
                                className="text-[#B4434D] hover:text-[#761D2D]"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            required
                            minLength={5}
                            maxLength={1000}
                            value={q.questionText}
                            onChange={(e) =>
                              setQzQuestions((prev) =>
                                prev.map((item, i) => (i === qIdx ? { ...item, questionText: e.target.value } : item)),
                              )
                            }
                            placeholder="Question text *"
                            className="w-full rounded-lg border border-[#292323]/15 bg-white px-3 py-2 text-xs"
                          />
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIdx}`}
                                  checked={q.correctIndex === oIdx}
                                  onChange={() =>
                                    setQzQuestions((prev) =>
                                      prev.map((item, i) => (i === qIdx ? { ...item, correctIndex: oIdx } : item)),
                                    )
                                  }
                                  className="accent-[#761D2D]"
                                  aria-label={`Mark option ${oIdx + 1} correct`}
                                />
                                <input
                                  type="text"
                                  required={oIdx < 2}
                                  maxLength={300}
                                  value={opt}
                                  onChange={(e) =>
                                    setQzQuestions((prev) =>
                                      prev.map((item, i) => {
                                        if (i !== qIdx) return item;
                                        const nextOpts: [string, string, string, string] = [...item.options] as [
                                          string,
                                          string,
                                          string,
                                          string,
                                        ];
                                        nextOpts[oIdx] = e.target.value;
                                        return { ...item, options: nextOpts };
                                      }),
                                    )
                                  }
                                  placeholder={`Option ${String.fromCharCode(65 + oIdx)}${oIdx < 2 ? ' *' : ''}`}
                                  className="flex-1 rounded-lg border border-[#292323]/15 bg-white px-2.5 py-1.5 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <input
                              type="text"
                              maxLength={120}
                              value={q.topicTag}
                              onChange={(e) =>
                                setQzQuestions((prev) =>
                                  prev.map((item, i) => (i === qIdx ? { ...item, topicTag: e.target.value } : item)),
                                )
                              }
                              placeholder="Topic tag (for weak-topic analysis)"
                              className="rounded-lg border border-[#292323]/15 bg-white px-2.5 py-1.5 text-xs"
                            />
                            <input
                              type="text"
                              maxLength={1500}
                              value={q.explanation}
                              onChange={(e) =>
                                setQzQuestions((prev) =>
                                  prev.map((item, i) => (i === qIdx ? { ...item, explanation: e.target.value } : item)),
                                )
                              }
                              placeholder="Answer explanation shown after submit"
                              className="sm:col-span-2 rounded-lg border border-[#292323]/15 bg-white px-2.5 py-1.5 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={savingQuiz}
                      className="rounded-lg bg-[#761D2D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                    >
                      {savingQuiz ? 'Saving Quiz...' : editingQuizId ? 'Update Quiz & Questions' : 'Publish Quiz'}
                    </button>
                  </form>

                  <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5 space-y-4">
                    <h3 className="font-display text-2xl font-semibold text-[#292323]">
                      Course Quizzes ({quizzes.length})
                    </h3>
                    {quizzes.length === 0 ? (
                      <p className="text-xs text-[#292323]/65">No quizzes created for this course yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {quizzes.map((qz) => (
                          <div key={qz.id} className="rounded-xl border border-[#292323]/10 p-4 text-xs space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-sm text-[#292323]">{qz.title}</p>
                                <p className="text-[#292323]/65 uppercase tracking-wider text-[10px] font-semibold text-[#761D2D]">
                                  {qz.quizType} · {qz.questionCount} Questions · Pass {qz.passingPercent}%
                                </p>
                              </div>
                              <StatusLabel status={qz.status} />
                            </div>
                            <p className="text-[#292323]/75">{qz.description}</p>
                            <div className="flex items-center gap-3 pt-1">
                              <button
                                type="button"
                                onClick={() => void handleEditQuiz(qz)}
                                className="inline-flex items-center gap-1 font-semibold text-[#761D2D] hover:underline"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Edit Questions
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await deleteQuiz(selectedCourse.id, qz.id);
                                  await loadCourseChildren(selectedCourse.id);
                                  showToast('Quiz Deleted', 'info');
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-[#B4434D] hover:text-[#761D2D]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* LEARNING MATERIALS MANAGEMENT */}
          {mode === 'materials' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <form
                onSubmit={handleSaveMaterial}
                className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    {editingMaterial ? 'Edit Learning Material' : 'Upload / Attach PDF Material'}
                  </h2>
                  {editingMaterial && (
                    <button
                      type="button"
                      onClick={resetMaterialForm}
                      className="text-xs font-semibold text-[#761D2D] hover:underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Target Module *</label>
                    <select
                      value={matModuleId}
                      onChange={(e) => {
                        setMatModuleId(e.target.value);
                        setMatLessonId('');
                      }}
                      className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    >
                      {modules.length === 0 && <option value="">Create a module first</option>}
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Linked Lesson (Optional)</label>
                    <select
                      value={matLessonId}
                      onChange={(e) => setMatLessonId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    >
                      <option value="">Module-wide PDF</option>
                      {moduleLessonsForMat.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Document Title *</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Description</label>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={matDesc}
                    onChange={(e) => setMatDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Upload / Replace PDF in Storage</label>
                  <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#761D2D]/40 bg-[#F8F4ED]/50 p-3 text-xs font-semibold text-[#761D2D]">
                    <Upload className="h-4 w-4" />
                    <span>{matUploading ? 'Uploading...' : matFileName || 'Select PDF / Resource'}</span>
                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onChange={handleMaterialFile} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Document HTTPS URL *</label>
                  <input
                    type="url"
                    required
                    maxLength={1000}
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Status</label>
                    <select
                      value={matStatus}
                      onChange={(e) => setMatStatus(e.target.value as 'active' | 'draft' | 'archived')}
                      className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    >
                      <option value="active">Active (Visible to Enrolled)</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 pt-5 text-xs font-medium text-[#292323]">
                    <input
                      type="checkbox"
                      checked={matDownload}
                      onChange={(e) => setMatDownload(e.target.checked)}
                      className="accent-[#761D2D]"
                    />
                    <span>Allow student download</span>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={modules.length === 0 || matUploading}
                  className="w-full rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                >
                  {editingMaterial ? 'Save Material Changes' : 'Save Learning Material'}
                </button>
              </form>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Official PDF &amp; Course Resources ({materials.length})
                </h2>
                {materials.length === 0 ? (
                  <p className="mt-4 text-xs text-[#292323]/65">No PDF resources uploaded for this course yet.</p>
                ) : (
                  <div className="mt-4 divide-y divide-[#292323]/10">
                    {materials.map((m) => (
                      <div key={m.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#761D2D]">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{modules.find((mod) => mod.id === m.moduleId)?.title || 'Module'}</span>
                            {m.lessonId && (
                              <span className="text-[#292323]/60">
                                · {lessons.find((l) => l.id === m.lessonId)?.title || 'Lesson'}
                              </span>
                            )}
                            <StatusLabel status={m.status} />
                          </div>
                          <p className="mt-1 text-sm font-semibold text-[#292323]">{m.title}</p>
                          <p className="text-xs text-[#292323]/70">{m.description}</p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleDownloadPermission(m)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#292323]/15 px-3 py-1.5 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED]"
                          >
                            {m.downloadAllowed ? (
                              <>
                                <Unlock className="h-3.5 w-3.5 text-emerald-700" /> Downloadable
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5 text-amber-700" /> View Only
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMaterial(m);
                              setMatModuleId(m.moduleId);
                              setMatLessonId(m.lessonId || '');
                              setMatTitle(m.title);
                              setMatDesc(m.description);
                              setMatUrl(m.fileUrl);
                              setMatFileName(m.fileName);
                              setMatDownload(m.downloadAllowed);
                              setMatStatus(m.status);
                            }}
                            className="text-[#292323]/75 hover:text-[#761D2D]"
                            aria-label="Edit material"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await deleteLearningMaterial(selectedCourse.id, m.id);
                              await loadCourseChildren(selectedCourse.id);
                              showToast('Material Deleted', 'info');
                            }}
                            className="text-[#B4434D] hover:text-[#761D2D]"
                            aria-label="Delete material"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS CREATION */}
          {mode === 'assignments' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <form
                onSubmit={handleAddAssignment}
                className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5"
              >
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Create Assignment
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Title *</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={assignDue}
                      onChange={(e) => setAssignDue(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Max Marks</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      value={assignMaxMarks}
                      onChange={(e) => setAssignMaxMarks(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Instructions *</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={5000}
                    value={assignInstructions}
                    onChange={(e) => setAssignInstructions(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 p-3 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  Publish Assignment
                </button>
              </form>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Course Assignments ({assignments.length})
                </h2>
                {assignments.length === 0 ? (
                  <p className="mt-4 text-xs text-[#292323]/65">No assignments published for this course yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {assignments.map((a) => (
                      <div key={a.id} className="rounded-xl border border-[#292323]/10 p-4 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-[#292323]">{a.title}</span>
                          <StatusLabel status={a.status} />
                        </div>
                        <p className="mt-1 font-mono text-[#761D2D] tabular-nums">
                          Due: {a.dueDate} · Max Marks: {a.maxMarks}
                        </p>
                        <p className="mt-2 text-[#292323]/80">{a.instructions}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIVE STUDY NOTE PREVIEW MODAL */}
      {previewNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F8F4ED] p-4 sm:p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                Student View Preview (11-Section Structured Study Note)
              </span>
              <button
                type="button"
                onClick={() => setPreviewNote(null)}
                className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#292323]/15 px-3 py-1.5 text-xs font-semibold text-[#292323]"
              >
                <X className="h-3.5 w-3.5" />
                Close Preview
              </button>
            </div>
            <StudyNoteViewer note={previewNote} />
          </div>
        </div>
      )}
    </div>
  );
}
