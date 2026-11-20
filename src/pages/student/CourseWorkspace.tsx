import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Lock,
  Search,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  deletePersonalAiNote,
  fetchCourseAssignments,
  fetchCourseLessons,
  fetchCourseMaterials,
  fetchCourseModules,
  fetchCourseQuizzes,
  fetchCourseStudyNotes,
  fetchQuizQuestions,
  subscribeSavedAiNotes,
  submitQuizAttempt,
  toggleLessonCompletion,
  getCourseById,
} from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { LoadingState } from '../../components/BrandAssets';
import { RichContentRenderer, StudyNoteViewer } from '../../components/RichContentRenderer';
import { RmHeavenAiTutor } from '../../components/RmHeavenAiTutor';
import type {
  Assignment,
  Course,
  CourseLesson,
  CourseModule,
  LearningMaterial,
  Quiz,
  QuizQuestion,
  SavedAiNote,
  StudentEnrollment,
  StudyNote,
} from '../../types';

type WorkspaceTab = 'lesson' | 'study-notes' | 'pdfs' | 'quizzes' | 'ai-notes' | 'ai-tutor';

export function CourseWorkspace({
  enrollment,
  initialTab = 'lesson',
  initialMaterialId = null,
  onBack,
  onOpenAssignments,
}: {
  enrollment: StudentEnrollment;
  initialTab?: WorkspaceTab;
  initialMaterialId?: string | null;
  onBack: () => void;
  onOpenAssignments: () => void;
}) {
  const { user, profile } = useAuth();
  const { showToast, confirmAction } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [savedAiNotes, setSavedAiNotes] = useState<SavedAiNote[]>([]);

  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>(initialTab);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Study Notes navigation, search & completion tracking
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteSearch, setNoteSearch] = useState('');
  const [completedNoteIds, setCompletedNoteIds] = useState<string[]>([]);

  const [previewMaterial, setPreviewMaterial] = useState<LearningMaterial | null>(null);
  const [tutorMaterialId, setTutorMaterialId] = useState<string | null>(initialMaterialId);
  const [tutorNoteId, setTutorNoteId] = useState<string | null>(null);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null);

  // Interactive Course Quiz Runner
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    weakTopics: string[];
  } | null>(null);
  const [loadingQuizQuestions, setLoadingQuizQuestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getCourseById(enrollment.courseId),
      fetchCourseModules(enrollment.courseId),
      fetchCourseLessons(enrollment.courseId, false),
      fetchCourseStudyNotes(enrollment.courseId, false),
      fetchCourseMaterials(enrollment.courseId, false),
      fetchCourseQuizzes(enrollment.courseId, false),
      fetchCourseAssignments(enrollment.courseId),
    ])
      .then(([c, mods, less, notes, mats, qzs, assigns]) => {
        if (!active) return;
        setCourse(c);
        setModules(mods);
        setLessons(less);
        setStudyNotes(notes);
        setMaterials(mats);
        setQuizzes(qzs);
        setAssignments(assigns);
        if (less.length > 0) setActiveLesson(less[0]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enrollment.courseId]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeSavedAiNotes(user.uid, (all) => {
      setSavedAiNotes(all.filter((n) => n.courseId === enrollment.courseId));
    });
    return () => unsub();
  }, [user, enrollment.courseId]);

  useEffect(() => {
    if (!user) return;
    try {
      const storageKey = `rmheaven_completed_notes_${user.uid}_${enrollment.courseId}`;
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(parsed)) {
        setCompletedNoteIds(parsed.filter((v): v is string => typeof v === 'string'));
      } else {
        setCompletedNoteIds([]);
      }
    } catch {
      setCompletedNoteIds([]);
    }
  }, [user, enrollment.courseId]);

  const activeLessonIndex = useMemo(
    () => (activeLesson ? lessons.findIndex((l) => l.id === activeLesson.id) : -1),
    [lessons, activeLesson],
  );

  const orderedStudyNotes = useMemo(() => {
    if (!activeLesson) return studyNotes;
    const exactMatch = studyNotes.filter((n) => n.lessonId === activeLesson.id);
    const moduleMatch = studyNotes.filter((n) => n.moduleId === activeLesson.moduleId && !exactMatch.includes(n));
    const rest = studyNotes.filter((n) => !exactMatch.includes(n) && !moduleMatch.includes(n));
    return [...exactMatch, ...moduleMatch, ...rest];
  }, [studyNotes, activeLesson]);

  const filteredStudyNotes = useMemo(() => {
    const q = noteSearch.trim().toLowerCase();
    if (!q) return orderedStudyNotes;
    return orderedStudyNotes.filter((n) => {
      const modTitle = modules.find((m) => m.id === n.moduleId)?.title || '';
      const lesTitle = lessons.find((l) => l.id === n.lessonId)?.title || '';
      return (
        n.title.toLowerCase().includes(q) ||
        n.topicIntroduction.toLowerCase().includes(q) ||
        n.keyConcepts.toLowerCase().includes(q) ||
        modTitle.toLowerCase().includes(q) ||
        lesTitle.toLowerCase().includes(q)
      );
    });
  }, [orderedStudyNotes, noteSearch, modules, lessons]);

  useEffect(() => {
    if (filteredStudyNotes.length === 0) {
      setActiveNoteId(null);
      return;
    }
    if (!activeNoteId || !filteredStudyNotes.some((n) => n.id === activeNoteId)) {
      setActiveNoteId(filteredStudyNotes[0].id);
    }
  }, [filteredStudyNotes, activeNoteId]);

  const activeNoteIndex = useMemo(
    () => (activeNoteId ? filteredStudyNotes.findIndex((n) => n.id === activeNoteId) : -1),
    [filteredStudyNotes, activeNoteId],
  );

  const selectedStudyNote = useMemo(
    () => filteredStudyNotes.find((n) => n.id === activeNoteId) || filteredStudyNotes[0] || null,
    [filteredStudyNotes, activeNoteId],
  );

  const handleToggleNoteComplete = (note: StudyNote) => {
    const exists = completedNoteIds.includes(note.id);
    const next = exists ? completedNoteIds.filter((id) => id !== note.id) : [...completedNoteIds, note.id];
    setCompletedNoteIds(next);
    if (user) {
      try {
        localStorage.setItem(`rmheaven_completed_notes_${user.uid}_${enrollment.courseId}`, JSON.stringify(next));
      } catch {
        // non-fatal storage failure
      }
    }
    showToast(exists ? 'Marked study note as unread' : 'Study note marked completed', 'success');
  };

  const handleToggleComplete = async (lessonId: string) => {
    setUpdatingProgress(true);
    try {
      await toggleLessonCompletion(enrollment, lessonId, lessons.length);
      showToast('Progress Updated', 'success');
    } catch (err) {
      showToast('Update Failed', 'error', err instanceof Error ? err.message : 'Unable to update progress.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleOpenQuiz = async (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setLoadingQuizQuestions(true);
    try {
      const qs = await fetchQuizQuestions(enrollment.courseId, quiz.id);
      setQuizQuestions(qs);
    } catch (err) {
      showToast('Unable to load quiz', 'error', err instanceof Error ? err.message : 'Error loading questions.');
    } finally {
      setLoadingQuizQuestions(false);
    }
  };

  const handleSubmitCourseQuiz = async () => {
    if (!activeQuiz || quizQuestions.length === 0 || !user) return;
    let correctCount = 0;
    const weakSet = new Set<string>();

    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      } else if (q.topicTag) {
        weakSet.add(q.topicTag);
      }
    });

    const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
    const weakTopics = Array.from(weakSet);
    const passed = scorePercent >= activeQuiz.passingPercent;

    setQuizResult({
      scorePercent,
      correctCount,
      totalQuestions: quizQuestions.length,
      passed,
      weakTopics,
    });
    setQuizSubmitted(true);

    try {
      await submitQuizAttempt({
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        courseId: enrollment.courseId,
        moduleId: activeQuiz.moduleId,
        studentId: user.uid,
        studentName: profile?.fullName || user.displayName || 'Scholar',
        studentEmail: profile?.email || user.email || '',
        scorePercent,
        correctCount,
        totalQuestions: quizQuestions.length,
        weakTopics,
        answersJson: JSON.stringify(quizAnswers),
        source: 'course_quiz',
      });
      showToast(passed ? 'Assessment Passed' : 'Assessment Recorded', passed ? 'success' : 'info', `Score: ${scorePercent}%`);
    } catch {
      showToast('Score Calculated', 'info', 'Review your detailed answer breakdown below.');
    }
  };

  if (loading) return <LoadingState message="Loading course workspace..." />;

  const completedIds = enrollment.completedLessonIds || [];

  return (
    <div className="space-y-6">
      {/* Top Course Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#292323]/10 bg-white p-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#761D2D] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to My Courses
          </button>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#292323]">
            {course?.title || enrollment.courseTitle}
          </h2>
          {course && (
            <p className="mt-1 text-xs text-[#292323]/65">
              {course.departmentName || course.category} · {course.level} · {course.duration}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-[#292323]/65">Course Progress</p>
          <p className="font-mono text-2xl font-bold text-[#761D2D] tabular-nums">
            {enrollment.progressPercent}%
          </p>
          <div className="mt-1.5 h-2 w-40 overflow-hidden rounded-full bg-[#F8F4ED]">
            <div
              className="h-full bg-[#761D2D] transition-all duration-300"
              style={{ width: `${enrollment.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Mobile Syllabus Switcher */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-[#D5B77A]/40 bg-white px-4 py-3 text-sm font-semibold text-[#761D2D]"
        >
          <span>Course Modules &amp; Lessons ({lessons.length})</span>
          {mobileDrawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Curriculum Sidebar */}
        <aside className={`${mobileDrawerOpen ? 'block' : 'hidden'} space-y-4 lg:block lg:col-span-4`}>
          <div className="rounded-2xl border border-[#292323]/10 bg-white p-5">
            <h3 className="font-display text-xl font-semibold text-[#292323]">
              Modules &amp; Lessons
            </h3>
            {modules.length === 0 ? (
              <p className="mt-3 text-xs text-[#292323]/65">No modules published yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {modules.map((mod, idx) => {
                  const modLessons = lessons.filter((l) => l.moduleId === mod.id);
                  const modMaterials = materials.filter((m) => m.moduleId === mod.id);
                  return (
                    <div key={mod.id} className="border-t border-[#292323]/10 pt-3 first:border-t-0 first:pt-0">
                      <p className="text-xs font-semibold text-[#761D2D]">
                        Module {idx + 1}: {mod.title}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {modLessons.map((lesson) => {
                          const done = completedIds.includes(lesson.id);
                          const selected = activeLesson?.id === lesson.id;
                          return (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveLesson(lesson);
                                  setWorkspaceTab('lesson');
                                  setMobileDrawerOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                                  selected
                                    ? 'bg-[#761D2D] text-white font-semibold'
                                    : 'text-[#292323]/80 hover:bg-[#F8F4ED]'
                                }`}
                              >
                                {done ? (
                                  <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-[#D5B77A]' : 'text-emerald-700'}`} />
                                ) : (
                                  <Circle className="h-3.5 w-3.5 shrink-0 opacity-45" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </button>
                            </li>
                          );
                        })}
                        {modMaterials.map((mat) => (
                          <li key={mat.id}>
                            <button
                              type="button"
                              onClick={() => setPreviewMaterial(mat)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-[#761D2D] hover:bg-[#F8F4ED]"
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{mat.title} (PDF)</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Course Assignments Quick Panel */}
          <div className="rounded-2xl border border-[#292323]/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#292323]">Assignments</h3>
              <span className="font-mono text-xs text-[#292323]/60 tabular-nums">{assignments.length}</span>
            </div>
            {assignments.length === 0 ? (
              <p className="mt-2 text-xs text-[#292323]/65">No assignments assigned in this course yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {assignments.map((a) => (
                  <div key={a.id} className="rounded-lg border border-[#292323]/10 p-3 text-xs">
                    <p className="font-semibold text-[#292323]">{a.title}</p>
                    <p className="mt-1 text-[#292323]/65 tabular-nums">
                      Due: {a.dueDate} · Max Marks: {a.maxMarks}
                    </p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={onOpenAssignments}
                  className="mt-2 w-full rounded-lg bg-[#761D2D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  Open Assignments &amp; Submit Work
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Workspace Column */}
        <div className="space-y-5 lg:col-span-8 min-w-0">
          {/* Workspace Sub-Navigation */}
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#292323]/10 bg-white p-2">
            {[
              { id: 'lesson' as WorkspaceTab, label: 'Lesson Content', icon: BookOpen },
              { id: 'study-notes' as WorkspaceTab, label: `Official Study Notes (${studyNotes.length})`, icon: GraduationCap },
              { id: 'pdfs' as WorkspaceTab, label: `Course PDFs (${materials.length})`, icon: FileText },
              { id: 'quizzes' as WorkspaceTab, label: `Quizzes (${quizzes.length})`, icon: ClipboardCheck },
              { id: 'ai-notes' as WorkspaceTab, label: `My AI Notes (${savedAiNotes.length})`, icon: Bookmark },
              { id: 'ai-tutor' as WorkspaceTab, label: 'RM HEAVEN AI Tutor', icon: Sparkles },
            ].map((t) => {
              const Icon = t.icon;
              const active = workspaceTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setWorkspaceTab(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#761D2D] text-white'
                      : 'text-[#292323]/80 hover:bg-[#F8F4ED] hover:text-[#761D2D]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active && t.id === 'ai-tutor' ? 'text-[#D5B77A]' : ''}`} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* VIEW 1: LESSON CONTENT */}
          {workspaceTab === 'lesson' && (
            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 sm:p-8">
              {activeLesson ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#292323]/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-[#761D2D]">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>
                          Lesson {activeLessonIndex + 1} of {lessons.length}
                        </span>
                        {activeLesson.durationMinutes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{activeLesson.durationMinutes} min</span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-1 font-display text-3xl font-bold text-[#292323]">
                        {activeLesson.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTutorInitialPrompt(`Explain "${activeLesson.title}" simply and share a worked example.`);
                          setWorkspaceTab('ai-tutor');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#761D2D]/30 bg-[#F8F4ED] px-3.5 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#761D2D] hover:text-white transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Ask AI Tutor
                      </button>

                      <button
                        type="button"
                        disabled={updatingProgress}
                        onClick={() => handleToggleComplete(activeLesson.id)}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                          completedIds.includes(activeLesson.id)
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#761D2D] text-white hover:bg-[#8F2638]'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {completedIds.includes(activeLesson.id) ? 'Completed' : 'Mark Lesson Complete'}
                      </button>
                    </div>
                  </div>

                  {activeLesson.summary && (
                    <p className="mt-4 rounded-xl bg-[#F8F4ED]/70 p-4 text-sm italic text-[#292323]/85 border border-[#D5B77A]/25">
                      {activeLesson.summary}
                    </p>
                  )}

                  {activeLesson.objectives && activeLesson.objectives.length > 0 && (
                    <div className="mt-5 rounded-xl border border-[#292323]/8 bg-[#F8F4ED]/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                        Lesson Objectives
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-[#292323]/85">
                        {activeLesson.objectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#761D2D]" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6">
                    <RichContentRenderer content={activeLesson.contentBody} />
                  </div>

                  {activeLesson.examples && (
                    <div className="mt-6 rounded-xl border border-[#D5B77A]/35 bg-[#F8F4ED]/60 p-5">
                      <h4 className="mb-2 font-serif text-base font-semibold text-[#761D2D]">
                        Worked Practical Examples
                      </h4>
                      <RichContentRenderer content={activeLesson.examples} />
                    </div>
                  )}

                  {activeLesson.exercisePrompt && (
                    <div className="mt-5 rounded-xl border border-[#761D2D]/20 bg-[#761D2D]/5 p-5">
                      <h4 className="mb-1.5 font-serif text-base font-semibold text-[#761D2D]">
                        Hands-On Practice Exercise
                      </h4>
                      <RichContentRenderer content={activeLesson.exercisePrompt} />
                    </div>
                  )}

                  {/* Lesson Prev / Next + Quick Links */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#292323]/10 pt-5">
                    <button
                      type="button"
                      disabled={activeLessonIndex <= 0}
                      onClick={() => activeLessonIndex > 0 && setActiveLesson(lessons[activeLessonIndex - 1])}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/15 px-3.5 py-2 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED] disabled:opacity-40"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous Lesson
                    </button>

                    <button
                      type="button"
                      onClick={() => setWorkspaceTab('study-notes')}
                      className="text-xs font-semibold text-[#761D2D] hover:underline"
                    >
                      Open 11-Section Study Notes for This Topic →
                    </button>

                    <button
                      type="button"
                      disabled={activeLessonIndex === -1 || activeLessonIndex >= lessons.length - 1}
                      onClick={() =>
                        activeLessonIndex < lessons.length - 1 && setActiveLesson(lessons[activeLessonIndex + 1])
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-40"
                    >
                      Next Lesson
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-sm text-[#292323]/65">
                  Select a lesson from the curriculum modules on the left to begin studying.
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: OFFICIAL 11-SECTION STUDY NOTES */}
          {workspaceTab === 'study-notes' && (
            <div className="space-y-6">
              {studyNotes.length === 0 ? (
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 text-center text-sm text-[#292323]/70">
                  No official study notes have been published for this course yet. Use the RM HEAVEN AI Tutor tab to generate personal revision notes anytime.
                </div>
              ) : (
                <>
                  {/* Study Notes Navigator & Completion Tracker */}
                  <div className="rounded-2xl border border-[#D5B77A]/35 bg-white p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#761D2D]">
                          Course Study Notes Library
                        </p>
                        <h3 className="mt-0.5 font-display text-xl font-bold text-[#292323]">
                          {studyNotes.length} Complete Structured Study Notes
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg border border-[#D5B77A]/45 bg-[#F8F4ED] px-3 py-1.5 text-xs font-semibold text-[#761D2D]">
                          {completedNoteIds.filter((id) => studyNotes.some((n) => n.id === id)).length} of {studyNotes.length} Notes Completed
                        </span>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#292323]/45" />
                          <input
                            type="text"
                            value={noteSearch}
                            onChange={(e) => setNoteSearch(e.target.value)}
                            placeholder="Filter study notes..."
                            className="rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-1.5 pl-8 pr-3 text-xs text-[#292323] focus:border-[#761D2D] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {filteredStudyNotes.length === 0 ? (
                      <p className="py-3 text-xs text-[#292323]/65">
                        No study notes matched &ldquo;{noteSearch}&rdquo;. Clear the filter box to inspect all notes.
                      </p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {filteredStudyNotes.map((n, idx) => {
                          const isSelected = selectedStudyNote?.id === n.id;
                          const isDone = completedNoteIds.includes(n.id);
                          const modTitle = modules.find((m) => m.id === n.moduleId)?.title;
                          const lesTitle = lessons.find((l) => l.id === n.lessonId)?.title;
                          return (
                            <button
                              key={n.id}
                              type="button"
                              onClick={() => setActiveNoteId(n.id)}
                              className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                                isSelected
                                  ? 'border-[#761D2D] bg-[#F8F4ED] shadow-xs'
                                  : 'border-[#292323]/12 bg-white hover:border-[#D5B77A]'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#761D2D]" />
                              ) : (
                                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B77A]" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                                  Note {idx + 1}
                                  {modTitle ? ` · ${modTitle}` : ''}
                                </p>
                                <p className="mt-0.5 font-semibold text-sm text-[#292323] line-clamp-1">
                                  {n.title}
                                </p>
                                {lesTitle && (
                                  <p className="mt-0.5 text-[11px] text-[#292323]/65 line-clamp-1">
                                    Linked Lesson: {lesTitle}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Active Study Note Viewer + Previous / Next Note Controls */}
                  {selectedStudyNote && (
                    <div className="space-y-4">
                      <StudyNoteViewer
                        key={selectedStudyNote.id}
                        note={selectedStudyNote}
                        moduleTitle={modules.find((m) => m.id === selectedStudyNote.moduleId)?.title}
                        lessonTitle={lessons.find((l) => l.id === selectedStudyNote.lessonId)?.title}
                        isCompleted={completedNoteIds.includes(selectedStudyNote.id)}
                        onToggleComplete={handleToggleNoteComplete}
                        onAskAiAboutNote={(selectedNote) => {
                          setTutorNoteId(selectedNote.id);
                          setTutorInitialPrompt(
                            `Please explain the key concepts, practical examples, and common mistakes from the official study note "${selectedNote.title}" clearly.`,
                          );
                          setWorkspaceTab('ai-tutor');
                        }}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#292323]/10 bg-white px-5 py-3.5">
                        <button
                          type="button"
                          disabled={activeNoteIndex <= 0}
                          onClick={() =>
                            activeNoteIndex > 0 && setActiveNoteId(filteredStudyNotes[activeNoteIndex - 1].id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/15 px-3.5 py-2 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED] disabled:opacity-40"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Previous Note
                        </button>

                        <span className="text-xs font-medium text-[#292323]/70">
                          Viewing Note {activeNoteIndex + 1} of {filteredStudyNotes.length}
                        </span>

                        <button
                          type="button"
                          disabled={activeNoteIndex === -1 || activeNoteIndex >= filteredStudyNotes.length - 1}
                          onClick={() =>
                            activeNoteIndex < filteredStudyNotes.length - 1 &&
                            setActiveNoteId(filteredStudyNotes[activeNoteIndex + 1].id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-40"
                        >
                          Next Note
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* VIEW 3: ADMIN PDF DOCUMENTS & RESOURCES */}
          {workspaceTab === 'pdfs' && (
            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#292323]">
                  Official Uploaded PDFs &amp; Handbooks
                </h3>
                <p className="mt-1 text-xs text-[#292323]/70">
                  Uploaded directly by RM HEAVEN administrators. You can read documents inline or open them inside the AI Tutor to summarize, translate, or ask questions.
                </p>
              </div>

              {materials.length === 0 ? (
                <p className="py-6 text-sm text-[#292323]/65">
                  No PDF or file attachments have been uploaded for this course yet.
                </p>
              ) : (
                <div className="divide-y divide-[#292323]/10">
                  {materials.map((mat) => {
                    const mod = modules.find((m) => m.id === mat.moduleId);
                    const les = lessons.find((l) => l.id === mat.lessonId);
                    return (
                      <div key={mat.id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-xs font-semibold text-[#761D2D]">
                            {mod ? mod.title : 'Course Resource'}
                            {les ? ` · ${les.title}` : ''} · {mat.fileName}
                          </p>
                          <h4 className="mt-0.5 text-sm font-semibold text-[#292323]">{mat.title}</h4>
                          <p className="mt-1 text-xs text-[#292323]/75">{mat.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setTutorMaterialId(mat.id);
                              setWorkspaceTab('ai-tutor');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#D5B77A]/25 border border-[#D5B77A] px-3 py-1.5 text-xs font-semibold text-[#761D2D] hover:bg-[#D5B77A]/40"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Explain PDF with AI
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewMaterial(mat)}
                            className="rounded-lg border border-[#761D2D] px-3 py-1.5 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                          >
                            Preview PDF
                          </button>
                          {mat.downloadAllowed ? (
                            <a
                              href={mat.fileUrl}
                              download={mat.fileName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-[#292323]/55">
                              <Lock className="h-3.5 w-3.5" /> View Only
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: OFFICIAL COURSE QUIZZES & FINAL ASSESSMENTS */}
          {workspaceTab === 'quizzes' && (
            <div className="space-y-5">
              {!activeQuiz ? (
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#292323]">
                      Module Quizzes &amp; Final Assessment
                    </h3>
                    <p className="mt-1 text-xs text-[#292323]/70">
                      Evaluate your mastery of course concepts. Correct answers and rationales appear upon submission, and your attempts are saved automatically to your progress record.
                    </p>
                  </div>
                  {quizzes.length === 0 ? (
                    <p className="py-6 text-sm text-[#292323]/65">
                      No published quizzes available for this course yet. Use the Interactive Practice Test inside AI Tutor!
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {quizzes.map((qz) => (
                        <div key={qz.id} className="rounded-xl border border-[#D5B77A]/40 bg-[#F8F4ED]/55 p-5 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                              {qz.quizType === 'final' ? 'Final Assessment' : 'Module Quiz'} · Pass ≥ {qz.passingPercent}%
                            </p>
                            <h4 className="mt-1 font-display text-xl font-semibold text-[#292323]">{qz.title}</h4>
                            <p className="mt-1.5 text-xs text-[#292323]/75">{qz.description}</p>
                            <p className="mt-2 font-mono text-xs text-[#761D2D]">{qz.questionCount} Questions</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenQuiz(qz)}
                            className="mt-4 w-full rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                          >
                            Start Quiz
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#292323]/10 pb-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveQuiz(null)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#761D2D] hover:underline"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Quiz List
                      </button>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#292323]">{activeQuiz.title}</h3>
                    </div>
                    <span className="text-xs font-medium text-[#292323]/70">
                      Passing Benchmark: {activeQuiz.passingPercent}%
                    </span>
                  </div>

                  {quizSubmitted && quizResult && (
                    <div className="rounded-xl border border-[#D5B77A] bg-[#F8F4ED] p-5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                            {quizResult.passed ? 'Assessment Passed' : 'Keep Practicing'}
                          </p>
                          <h4 className="font-serif text-xl font-bold text-[#292323]">
                            {quizResult.scorePercent}% ({quizResult.correctCount} / {quizResult.totalQuestions} Correct)
                          </h4>
                        </div>
                        {quizResult.weakTopics.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setTutorInitialPrompt(
                                `I scored ${quizResult.scorePercent}% on "${activeQuiz.title}". Can you clarify these topics I missed: ${quizResult.weakTopics.join(', ')}?`,
                              );
                              setWorkspaceTab('ai-tutor');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-[#D5B77A]" />
                            Revise Weak Topics with AI Tutor
                          </button>
                        )}
                      </div>
                      {quizResult.weakTopics.length > 0 && (
                        <p className="text-xs text-[#292323]/80">
                          <strong>Topics to Revisit:</strong> {quizResult.weakTopics.join(' · ')}
                        </p>
                      )}
                    </div>
                  )}

                  {loadingQuizQuestions ? (
                    <LoadingState message="Loading assessment questions..." />
                  ) : (
                    <div className="space-y-4">
                      {quizQuestions.map((q, idx) => {
                        const chosen = quizAnswers[q.id];
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
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-[#292323]">
                                Q{idx + 1}. {q.questionText}
                              </p>
                              {q.topicTag && (
                                <span className="text-[11px] font-medium text-[#761D2D]/75">{q.topicTag}</span>
                              )}
                            </div>

                            <div className="space-y-2">
                              {q.options.map((opt, oIdx) => {
                                const checked = chosen === oIdx;
                                const showGood = quizSubmitted && oIdx === q.correctIndex;
                                const showBad = quizSubmitted && checked && oIdx !== q.correctIndex;
                                return (
                                  <label
                                    key={oIdx}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
                                      showGood
                                        ? 'border-[#761D2D] bg-[#761D2D]/10 font-medium text-[#292323]'
                                        : showBad
                                          ? 'border-[#B4434D] bg-[#B4434D]/10 text-[#B4434D]'
                                          : checked
                                            ? 'border-[#761D2D] bg-[#F8F4ED]'
                                            : 'border-[#292323]/12 hover:bg-[#F8F4ED]/50'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`quiz-${q.id}`}
                                      disabled={quizSubmitted}
                                      checked={checked}
                                      onChange={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                                      className="accent-[#761D2D]"
                                    />
                                    <span className="flex-1">{opt}</span>
                                    {showGood && <CheckCircle2 className="h-4 w-4 text-[#761D2D]" />}
                                    {showBad && <XCircle className="h-4 w-4 text-[#B4434D]" />}
                                  </label>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-3 rounded-lg bg-white p-3 text-xs text-[#292323]/85 border border-[#D5B77A]/30">
                                <strong className="text-[#761D2D]">Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {!quizSubmitted && quizQuestions.length > 0 && (
                        <button
                          type="button"
                          onClick={handleSubmitCourseQuiz}
                          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Submit Assessment ({Object.keys(quizAnswers).length}/{quizQuestions.length} Answered)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 5: SAVED PERSONAL AI NOTES (SEPARATE FROM OFFICIAL MATERIALS) */}
          {workspaceTab === 'ai-notes' && (
            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#292323]">
                    My Personal AI Study Notes
                  </h3>
                  <p className="mt-1 text-xs text-[#292323]/70">
                    Notes you saved from RM HEAVEN AI Tutor sessions for {course?.title || enrollment.courseTitle}. Official Admin PDFs and Curriculum Notes remain separate under their dedicated tabs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWorkspaceTab('ai-tutor')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#D5B77A]" />
                  Generate New AI Note
                </button>
              </div>

              {savedAiNotes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D5B77A]/50 bg-[#F8F4ED]/50 p-6 text-center text-sm text-[#292323]/70">
                  You haven&apos;t saved any AI-generated personal notes for this course yet. Use &ldquo;Save to My AI Notes&rdquo; inside the AI Tutor tab!
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAiNotes.map((n) => (
                    <div key={n.id} className="rounded-xl border border-[#D5B77A]/40 bg-[#F8F4ED]/40 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#292323]/10 pb-3">
                        <div>
                          <span className="inline-block rounded bg-[#D5B77A]/25 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                            AI-Generated Personal Note · {n.language}
                          </span>
                          <h4 className="mt-1 font-serif text-lg font-semibold text-[#292323]">{n.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await confirmAction({
                              title: 'Delete Personal AI Note?',
                              message: `Remove "${n.title}" from your personal saved AI notes?`,
                              confirmLabel: 'Delete Note',
                              destructive: true,
                            });
                            if (ok) await deletePersonalAiNote(n.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#B4434D] hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                      <div className="mt-3">
                        <RichContentRenderer content={n.content} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: RM HEAVEN AI TUTOR */}
          {workspaceTab === 'ai-tutor' && user && course && (
            <RmHeavenAiTutor
              studentId={user.uid}
              studentName={profile?.fullName || user.displayName || 'Scholar'}
              studentEmail={profile?.email || user.email || ''}
              course={course}
              lessons={lessons}
              activeLesson={activeLesson}
              studyNotes={studyNotes}
              materials={materials}
              preselectedMaterialId={tutorMaterialId}
              preselectedNoteId={tutorNoteId}
              initialPrompt={tutorInitialPrompt}
            />
          )}
        </div>
      </div>

      {/* Authorized PDF Material Preview Modal */}
      {previewMaterial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#292323]/15 bg-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292323]/10 px-6 py-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#292323]">
                  {previewMaterial.title}
                </h3>
                <p className="text-xs text-[#292323]/65">{previewMaterial.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setTutorMaterialId(previewMaterial.id);
                    setPreviewMaterial(null);
                    setWorkspaceTab('ai-tutor');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D5B77A]/30 border border-[#D5B77A] px-3 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#D5B77A]/50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Explain with AI Tutor
                </button>
                {previewMaterial.downloadAllowed ? (
                  <a
                    href={previewMaterial.fileUrl}
                    download={previewMaterial.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292323]/60">
                    <Lock className="h-3.5 w-3.5" />
                    View Only
                  </span>
                )}
                <a
                  href={previewMaterial.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#292323]/15 px-3 py-2 text-xs font-medium text-[#292323] hover:bg-[#F8F4ED]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Tab
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewMaterial(null)}
                  className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED]"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#F8F4ED] p-4 min-h-[420px]">
              <iframe
                src={previewMaterial.fileUrl}
                title={previewMaterial.title}
                className="h-[65vh] w-full rounded-lg border border-[#292323]/10 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
