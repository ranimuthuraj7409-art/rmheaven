import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  FileText,
  FileSpreadsheet,
  Briefcase,
  Send,
  Award,
  Bell,
  User,
  LifeBuoy,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Download,
  Lock,
  Menu,
  X,
  Upload,
  Sparkles,
  Bookmark,
  BarChart3,
  Trash2,
  Search,
} from 'lucide-react';
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import {
  applyForInternship,
  cancelEnrollmentRequest,
  deleteNotification,
  deletePersonalAiNote,
  fetchCourseAssignments,
  fetchCourseLessons,
  fetchCourseMaterials,
  fetchCourseModules,
  fetchCourseStudyNotes,
  fetchStudentQuizAttempts,
  formatTimestamp,
  getCourseById,
  markNotificationRead,
  subscribeSavedAiNotes,
  submitAssignmentWork,
  submitEnrollmentRequest,
  submitSupportTicket,
  timestampToMillis,
  uploadFileToStorage,
} from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { COURSE_INTEREST_OPTIONS } from '../../constants/legal';
import { EmptyState, LoadingState, RmCrestMark, RmHeavenWordmark, StatusLabel } from '../../components/BrandAssets';
import { CertificatePdfButton } from '../../components/CertificatePdfButton';
import { RichContentRenderer } from '../../components/RichContentRenderer';
import { RmHeavenAiTutor } from '../../components/RmHeavenAiTutor';
import { CourseWorkspace } from './CourseWorkspace';
import type {
  Assignment,
  AssignmentSubmission,
  Certificate,
  Course,
  CourseLesson,
  CourseModule,
  EnrollmentRequest,
  Internship,
  InternshipApplication,
  LearningMaterial,
  NotificationItem,
  QuizAttempt,
  SavedAiNote,
  StudentEnrollment,
  StudyNote,
  SupportTicket,
} from '../../types';

type StudentTab =
  | 'overview'
  | 'my-courses'
  | 'ai-tutor'
  | 'my-ai-notes'
  | 'quiz-results'
  | 'enrollment'
  | 'materials'
  | 'assignments'
  | 'internships'
  | 'applications'
  | 'certificates'
  | 'notifications'
  | 'profile'
  | 'support';

export function StudentDashboard({
  courses,
  internships,
}: {
  courses: Course[];
  internships: Internship[];
}) {
  const {
    user,
    profile,
    isAdmin,
    logout,
    sendVerificationEmail,
    refreshAuthUser,
    refreshProfile,
  } = useAuth();
  const { showToast, confirmAction } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<StudentTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCourseEnrollment, setActiveCourseEnrollment] = useState<StudentEnrollment | null>(null);
  const [workspaceInitTab, setWorkspaceInitTab] = useState<'lesson' | 'ai-tutor'>('lesson');
  const [workspaceInitMatId, setWorkspaceInitMatId] = useState<string | null>(null);

  // Live Firestore collections for student
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [savedAiNotes, setSavedAiNotes] = useState<SavedAiNote[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Standalone Student Dashboard AI Tutor Course Selector
  const [tutorCourseId, setTutorCourseId] = useState<string>('');
  const [tutorCourseObj, setTutorCourseObj] = useState<Course | null>(null);
  const [tutorLessons, setTutorLessons] = useState<CourseLesson[]>([]);
  const [tutorStudyNotes, setTutorStudyNotes] = useState<StudyNote[]>([]);
  const [tutorMaterials, setTutorMaterials] = useState<LearningMaterial[]>([]);
  const [loadingTutorData, setLoadingTutorData] = useState(false);

  // Enroll Search/Dept filter inside Student Dashboard
  const [enrollSearch, setEnrollSearch] = useState('');
  const [enrollDept, setEnrollDept] = useState('All');

  // Derived enrolled course materials & assignments
  const [materialsByCourse, setMaterialsByCourse] = useState<
    Array<{ courseId: string; courseTitle: string; modules: CourseModule[]; materials: LearningMaterial[] }>
  >([]);
  const [allEnrolledAssignments, setAllEnrolledAssignments] = useState<Assignment[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Interactive states
  const [previewPdf, setPreviewPdf] = useState<LearningMaterial | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [assignFileUrl, setAssignFileUrl] = useState('');
  const [assignFileName, setAssignFileName] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assignUploading, setAssignUploading] = useState(false);

  const [applyingInternship, setApplyingInternship] = useState<Internship | null>(null);
  const [sop, setSop] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Profile form state
  const [profName, setProfName] = useState('');
  const [profMobile, setProfMobile] = useState('');
  const [profQual, setProfQual] = useState('');
  const [profInst, setProfInst] = useState('');
  const [profCity, setProfCity] = useState('');
  const [profInterests, setProfInterests] = useState<string[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);

  // Support ticket state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setProfName(profile.fullName);
      setProfMobile(profile.mobile);
      setProfQual(profile.qualification);
      setProfInst(profile.institution || '');
      setProfCity(profile.city);
      setProfInterests(profile.courseInterests || []);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    const u1 = onSnapshot(
      query(collection(db, 'student_enrollments'), where('studentId', '==', uid)),
      (snap) => setEnrollments(snap.docs.map((d) => d.data() as StudentEnrollment)),
      (err) => handleFirestoreError(err, OperationType.LIST, 'student_enrollments'),
    );

    const u2 = onSnapshot(
      query(collection(db, 'enrollment_requests'), where('studentId', '==', uid)),
      (snap) =>
        setRequests(
          snap.docs
            .map((d) => d.data() as EnrollmentRequest)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'enrollment_requests'),
    );

    const u3 = onSnapshot(
      query(collection(db, 'assignment_submissions'), where('studentId', '==', uid)),
      (snap) => setSubmissions(snap.docs.map((d) => d.data() as AssignmentSubmission)),
      (err) => handleFirestoreError(err, OperationType.LIST, 'assignment_submissions'),
    );

    const u4 = onSnapshot(
      query(collection(db, 'internship_applications'), where('studentId', '==', uid)),
      (snap) =>
        setApplications(
          snap.docs
            .map((d) => d.data() as InternshipApplication)
            .sort((a, b) => timestampToMillis(b.appliedAt) - timestampToMillis(a.appliedAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'internship_applications'),
    );

    const u5 = onSnapshot(
      query(collection(db, 'certificates'), where('studentId', '==', uid)),
      (snap) =>
        setCertificates(
          snap.docs
            .map((d) => d.data() as Certificate)
            .sort((a, b) => timestampToMillis(b.issuedAt) - timestampToMillis(a.issuedAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'),
    );

    const u6 = onSnapshot(
      query(collection(db, 'notifications'), where('recipientId', '==', uid)),
      (snap) =>
        setNotifications(
          snap.docs
            .map((d) => d.data() as NotificationItem)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'),
    );

    const u7 = onSnapshot(
      query(collection(db, 'support_tickets'), where('studentId', '==', uid)),
      (snap) =>
        setTickets(
          snap.docs
            .map((d) => d.data() as SupportTicket)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'support_tickets'),
    );

    const u8 = subscribeSavedAiNotes(uid, setSavedAiNotes);
    fetchStudentQuizAttempts(uid).then(setQuizAttempts).catch(() => {});

    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
      u6();
      u7();
      u8();
    };
  }, [user]);

  // Default AI Tutor course selector to first active enrollment
  useEffect(() => {
    const active = enrollments.filter((e) => e.status === 'active');
    if (active.length > 0 && (!tutorCourseId || !active.some((e) => e.courseId === tutorCourseId))) {
      setTutorCourseId(active[0].courseId);
    }
  }, [enrollments, tutorCourseId]);

  useEffect(() => {
    if (!tutorCourseId || tab !== 'ai-tutor') return;
    let active = true;
    setLoadingTutorData(true);
    Promise.all([
      getCourseById(tutorCourseId),
      fetchCourseLessons(tutorCourseId, false),
      fetchCourseStudyNotes(tutorCourseId, false),
      fetchCourseMaterials(tutorCourseId, false),
    ])
      .then(([c, less, notes, mats]) => {
        if (!active) return;
        setTutorCourseObj(c);
        setTutorLessons(less);
        setTutorStudyNotes(notes);
        setTutorMaterials(mats);
      })
      .finally(() => {
        if (active) setLoadingTutorData(false);
      });
    return () => {
      active = false;
    };
  }, [tutorCourseId, tab]);

  // Load materials & assignments for active enrollments
  useEffect(() => {
    const activeEnrollments = enrollments.filter((e) => e.status === 'active');
    if (activeEnrollments.length === 0) {
      setMaterialsByCourse([]);
      setAllEnrolledAssignments([]);
      return;
    }

    let cancelled = false;
    setLoadingMaterials(true);
    Promise.all(
      activeEnrollments.map(async (enr) => {
        const [mods, mats, assigns] = await Promise.all([
          fetchCourseModules(enr.courseId),
          fetchCourseMaterials(enr.courseId, false),
          fetchCourseAssignments(enr.courseId),
        ]);
        return {
          courseId: enr.courseId,
          courseTitle: enr.courseTitle,
          modules: mods,
          materials: mats,
          assignments: assigns,
        };
      }),
    )
      .then((results) => {
        if (cancelled) return;
        setMaterialsByCourse(
          results.map((r) => ({
            courseId: r.courseId,
            courseTitle: r.courseTitle,
            modules: r.modules,
            materials: r.materials,
          })),
        );
        setAllEnrolledAssignments(results.flatMap((r) => r.assignments));
      })
      .finally(() => {
        if (!cancelled) setLoadingMaterials(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enrollments]);

  if (!user) return null;

  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const pendingRequests = requests.filter((r) => r.status === 'Pending');
  const unreadCount = notifications.filter((n) => !n.read).length;
  const averageProgress =
    activeEnrollments.length > 0
      ? Math.round(
          activeEnrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) /
            activeEnrollments.length,
        )
      : 0;

  const handleRequestEnroll = async (course: Course) => {
    if (!user.emailVerified) {
      showToast('Verify Email First', 'warning', 'Verify your email address before requesting enrollment.');
      return;
    }
    if (!profile || profile.accountStatus === 'suspended') {
      showToast('Action Unavailable', 'error', 'Your student profile must be active to request enrollment.');
      return;
    }
    try {
      await submitEnrollmentRequest({
        studentId: user.uid,
        studentName: profile.fullName,
        studentEmail: profile.email,
        courseId: course.id,
        courseTitle: course.title,
      });
      showToast('Request Submitted', 'success', `Enrollment request for "${course.title}" is Pending Approval.`);
    } catch (err) {
      showToast('Request Failed', 'error', err instanceof Error ? err.message : 'Unable to submit request.');
    }
  };

  const handleCancelRequest = async (reqId: string) => {
    const ok = await confirmAction({
      title: 'Cancel Enrollment Request?',
      message: 'Are you sure you want to withdraw this pending enrollment request?',
      confirmLabel: 'Yes, Cancel Request',
      destructive: true,
    });
    if (!ok) return;
    try {
      await cancelEnrollmentRequest(reqId);
      showToast('Request Cancelled', 'info');
    } catch (err) {
      showToast('Error', 'error', err instanceof Error ? err.message : 'Unable to cancel request.');
    }
  };

  const handleAssignmentFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !submittingAssignment) return;
    setAssignUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const url = await uploadFileToStorage(
        `assignments/${submittingAssignment.courseId}/${submittingAssignment.id}/${user.uid}/${Date.now()}_${safeName}`,
        file,
      );
      setAssignFileUrl(url);
      setAssignFileName(file.name);
      showToast('File Uploaded', 'success', file.name);
    } catch (err) {
      showToast('Upload Notice', 'warning', err instanceof Error ? err.message : 'File upload failed.');
    } finally {
      setAssignUploading(false);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !profile) return;
    if (!assignFileUrl.trim() && !assignNotes.trim()) {
      showToast('Submission Required', 'error', 'Attach a file or provide written submission notes.');
      return;
    }
    const existingSub = submissions.find((s) => s.assignmentId === submittingAssignment.id);
    try {
      await submitAssignmentWork({
        assignment: submittingAssignment,
        studentId: user.uid,
        studentName: profile.fullName,
        studentEmail: profile.email,
        fileUrl: assignFileUrl,
        fileName: assignFileName || (assignFileUrl ? 'Submitted Document' : undefined),
        notes: assignNotes,
        isResubmit: Boolean(existingSub),
      });
      showToast('Assignment Submitted', 'success', `Submitted "${submittingAssignment.title}".`);
      setSubmittingAssignment(null);
      setAssignFileUrl('');
      setAssignFileName('');
      setAssignNotes('');
    } catch (err) {
      showToast('Submission Failed', 'error', err instanceof Error ? err.message : 'Unable to submit assignment.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSavingProfile(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: profName.trim().slice(0, 120),
        mobile: profMobile.trim().slice(0, 24),
        qualification: profQual.trim().slice(0, 120),
        city: profCity.trim().slice(0, 100),
        courseInterests: profInterests.slice(0, 12),
        updatedAt: serverTimestamp(),
      };
      if (profInst.trim()) payload.institution = profInst.trim().slice(0, 180);
      await updateDoc(doc(db, 'users', user.uid), payload);
      await refreshProfile();
      showToast('Profile Updated', 'success');
    } catch (err) {
      showToast('Update Failed', 'error', err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await submitSupportTicket({
        studentId: user.uid,
        name: profile.fullName,
        email: profile.email,
        subject: supportSubject,
        message: supportMessage,
      });
      setSupportSubject('');
      setSupportMessage('');
      showToast('Support Ticket Created', 'success', 'Administrators have been notified.');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to submit ticket.');
    }
  };

  const navItems: Array<{ id: StudentTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen, badge: activeEnrollments.length || undefined },
    { id: 'ai-tutor', label: 'RM HEAVEN AI Tutor', icon: Sparkles },
    { id: 'my-ai-notes', label: 'My AI Notes', icon: Bookmark, badge: savedAiNotes.length || undefined },
    { id: 'quiz-results', label: 'Quiz Results', icon: BarChart3, badge: quizAttempts.length || undefined },
    { id: 'enrollment', label: 'Course Enrollment', icon: ClipboardCheck },
    { id: 'materials', label: 'Learning Materials', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: FileSpreadsheet },
    { id: 'internships', label: 'Internship Opportunities', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: Send },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount || undefined },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#292323]">
      {/* Top Portal Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#292323]/10 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((s) => !s)}
            className="rounded-lg border border-[#292323]/15 p-2 lg:hidden"
            aria-label="Toggle dashboard sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <RmCrestMark size={32} />
            <RmHeavenWordmark className="font-display text-xl font-bold" />
          </Link>
          <span className="hidden sm:inline text-xs text-[#292323]/55">
            / Student Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-lg border border-[#761D2D] px-3 py-1.5 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
            >
              Switch to Admin Portal
            </Link>
          )}
          <span className="hidden md:inline text-xs font-medium text-[#292323]/75">
            {profile?.fullName || user.email}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/15 px-3 py-1.5 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'fixed inset-y-16 left-0 z-40 block' : 'hidden'
          } w-64 shrink-0 border-r border-[#292323]/10 bg-white p-4 lg:static lg:block min-h-[calc(100vh-4rem)]`}
        >
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setActiveCourseEnrollment(null);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#761D2D] text-white'
                      : 'text-[#292323]/80 hover:bg-[#F8F4ED] hover:text-[#761D2D]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-[#D5B77A]' : 'text-[#761D2D]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#292323]/10">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-xs font-semibold text-[#B4434D] hover:bg-[#F8F4ED]"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 p-5 sm:p-8 min-w-0">
          {/* Email Verification Gate Banner */}
          {!user.emailVerified && (
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
                <div>
                  <h2 className="text-sm font-semibold text-[#292323]">
                    Verify Your Email Address to Unlock Enrollments & Submissions
                  </h2>
                  <p className="mt-1 text-xs text-[#292323]/75">
                    We sent a verification link to {user.email}. Click the link in your inbox, then refresh your status.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await sendVerificationEmail();
                    showToast('Verification Email Sent', 'success', 'Check your inbox.');
                  }}
                  className="rounded-lg border border-[#292323]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#292323] hover:bg-[#F8F4ED]"
                >
                  Resend Email
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const verified = await refreshAuthUser();
                    if (verified) showToast('Email Verified', 'success');
                    else showToast('Not Verified Yet', 'warning', 'Click the link in your email first.');
                  }}
                  className="rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  I Have Verified
                </button>
              </div>
            </div>
          )}

          {/* Account Suspension Banner */}
          {profile?.accountStatus === 'suspended' && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#B4434D] bg-[#B4434D]/10 p-5 text-sm text-[#761D2D]">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Account Suspended</p>
                <p className="mt-1 text-xs text-[#292323]/80">
                  Your student account has been suspended by an administrator. Contact RM HEAVEN Support for review.
                </p>
              </div>
            </div>
          )}

          {/* Missing Profile Completion Notice (for Google sign-in users who landed directly here) */}
          {!profile && !isAdmin && (
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#761D2D]/30 bg-white p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#292323]">
                  Complete First-Time Student Registration
                </h2>
                <p className="mt-1 text-sm text-[#292323]/75">
                  Please review and accept our Terms & Code of Conduct and add your academic profile before enrolling.
                </p>
              </div>
              <Link
                to="/register"
                className="rounded-lg bg-[#761D2D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638] whitespace-nowrap"
              >
                Complete Registration
              </Link>
            </div>
          )}

          {/* 1. OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                  Student Workspace
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold text-[#292323] sm:text-4xl">
                  Welcome, {profile?.fullName || user.displayName || 'Scholar'}
                </h1>
                <p className="mt-2 text-sm text-[#292323]/70">
                  {profile
                    ? `${profile.qualification} · ${profile.city}`
                    : user.email}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Enrolled Courses', value: activeEnrollments.length },
                  { label: 'Pending Requests', value: pendingRequests.length },
                  { label: 'Internship Applications', value: applications.length },
                  { label: 'Average Course Progress', value: `${averageProgress}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[#292323]/10 bg-white p-5">
                    <p className="text-xs font-medium text-[#292323]/65">{stat.label}</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-[#761D2D] tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Enrolled Courses & Progress */}
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Enrolled Courses
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('my-courses')}
                      className="text-xs font-semibold text-[#761D2D] hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {activeEnrollments.length === 0 ? (
                    <p className="mt-4 text-sm text-[#292323]/65">
                      No approved courses yet. Request enrollment from Course Enrollment.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {activeEnrollments.slice(0, 4).map((enr) => (
                        <div
                          key={enr.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#292323]/10 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-[#292323] truncate">
                              {enr.courseTitle}
                            </p>
                            <p className="mt-1 font-mono text-xs text-[#761D2D] tabular-nums">
                              {enr.progressPercent}% complete
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setTab('my-courses');
                              setActiveCourseEnrollment(enr);
                            }}
                            className="rounded-lg bg-[#761D2D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#8F2638] whitespace-nowrap"
                          >
                            Continue
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Deadlines & Notifications */}
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Recent Notifications
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('notifications')}
                      className="text-xs font-semibold text-[#761D2D] hover:underline"
                    >
                      Open Inbox
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="mt-4 text-sm text-[#292323]/65">
                      You are all caught up. Updates on enrollment approvals, assignments, and certificates appear here.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {notifications.slice(0, 4).map((n) => (
                        <div
                          key={n.id}
                          className="rounded-xl border border-[#292323]/10 p-3.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#292323]">{n.title}</span>
                            <span className="text-[#292323]/55">{formatTimestamp(n.createdAt)}</span>
                          </div>
                          <p className="mt-1 text-[#292323]/75">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment Deadlines Snapshot */}
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Assignment Deadlines
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTab('assignments')}
                    className="text-xs font-semibold text-[#761D2D] hover:underline"
                  >
                    Manage Assignments
                  </button>
                </div>
                {allEnrolledAssignments.length === 0 ? (
                  <p className="mt-3 text-sm text-[#292323]/65">
                    No active course assignments at this time.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                        <tr>
                          <th className="py-2.5 pr-4 font-semibold">Assignment</th>
                          <th className="py-2.5 pr-4 font-semibold">Course</th>
                          <th className="py-2.5 pr-4 font-semibold">Due Date</th>
                          <th className="py-2.5 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#292323]/8">
                        {allEnrolledAssignments.slice(0, 5).map((a) => {
                          const sub = submissions.find((s) => s.assignmentId === a.id);
                          return (
                            <tr key={a.id}>
                              <td className="py-3 pr-4 font-medium text-[#292323]">{a.title}</td>
                              <td className="py-3 pr-4 text-[#292323]/75">{a.courseTitle}</td>
                              <td className="py-3 pr-4 font-mono tabular-nums">{a.dueDate}</td>
                              <td className="py-3">
                                <StatusLabel status={sub ? sub.status : 'Pending Submission'} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. MY COURSES */}
          {tab === 'my-courses' && (
            activeCourseEnrollment ? (
              <CourseWorkspace
                enrollment={activeCourseEnrollment}
                initialTab={workspaceInitTab}
                initialMaterialId={workspaceInitMatId}
                onBack={() => {
                  setActiveCourseEnrollment(null);
                  setWorkspaceInitTab('lesson');
                  setWorkspaceInitMatId(null);
                }}
                onOpenAssignments={() => {
                  setActiveCourseEnrollment(null);
                  setTab('assignments');
                }}
              />
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#292323]">My Courses</h1>
                  <p className="mt-1 text-sm text-[#292323]/70">
                    Courses approved by RM HEAVEN administrators for your account.
                  </p>
                </div>

                {activeEnrollments.length === 0 ? (
                  <EmptyState
                    title="No Approved Courses Yet"
                    description="Once an administrator approves your enrollment request, your courses, lessons, PDF materials, and assignments will unlock here."
                    actionLabel="Browse Courses to Enroll"
                    onAction={() => setTab('enrollment')}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeEnrollments.map((enr) => (
                      <div
                        key={enr.id}
                        className="flex flex-col rounded-2xl border border-[#292323]/10 bg-white p-6"
                      >
                        <StatusLabel status="Approved" />
                        <h2 className="mt-3 font-display text-2xl font-semibold text-[#292323]">
                          {enr.courseTitle}
                        </h2>
                        <p className="mt-1 text-xs text-[#292323]/60 tabular-nums">
                          Approved {formatTimestamp(enr.approvedAt)}
                        </p>
                        <div className="mt-4">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Progress</span>
                            <span className="font-mono tabular-nums text-[#761D2D]">
                              {enr.progressPercent}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#F8F4ED]">
                            <div
                              className="h-full bg-[#761D2D]"
                              style={{ width: `${enr.progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveCourseEnrollment(enr)}
                          className="mt-6 w-full rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                        >
                          Open Course Workspace
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* 2B. AI TUTOR DIRECT PORTAL */}
          {tab === 'ai-tutor' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#292323]">
                    <RmHeavenWordmark suffix="AI Tutor" />
                  </h1>
                  <p className="mt-1 text-sm text-[#292323]/70">
                    Personalized explanations, 12 teaching modes, Tamil/Hindi/Malayalam/Telugu translation, PDF explanation, and interactive practice quizzes for your approved courses.
                  </p>
                </div>
                {activeEnrollments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#761D2D]">Course:</span>
                    <select
                      value={tutorCourseId}
                      onChange={(e) => setTutorCourseId(e.target.value)}
                      className="rounded-lg border border-[#D5B77A]/50 bg-white px-3 py-2 text-xs font-semibold text-[#292323]"
                    >
                      {activeEnrollments.map((enr) => (
                        <option key={enr.courseId} value={enr.courseId}>
                          {enr.courseTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {activeEnrollments.length === 0 ? (
                <EmptyState
                  title="Enroll in a Course to Unlock AI Tutor"
                  description="Once an administrator approves your course enrollment, the RM HEAVEN AI Tutor unlocks full contextual tutoring, PDF reading, and practice testing for your enrolled courses."
                  actionLabel="Browse Course Enrollment"
                  onAction={() => setTab('enrollment')}
                />
              ) : loadingTutorData || !tutorCourseObj ? (
                <LoadingState message="Initializing course tutor workspace..." />
              ) : (
                <RmHeavenAiTutor
                  studentId={user.uid}
                  studentName={profile?.fullName || user.displayName || 'Scholar'}
                  studentEmail={profile?.email || user.email || ''}
                  course={tutorCourseObj}
                  lessons={tutorLessons}
                  activeLesson={tutorLessons[0] || null}
                  studyNotes={tutorStudyNotes}
                  materials={tutorMaterials}
                  onQuizAttemptSaved={() => {
                    fetchStudentQuizAttempts(user.uid).then(setQuizAttempts).catch(() => {});
                  }}
                />
              )}
            </div>
          )}

          {/* 2C. MY PERSONAL AI NOTES */}
          {tab === 'my-ai-notes' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#292323]">My Personal AI Study Notes</h1>
                  <p className="mt-1 text-sm text-[#292323]/70">
                    Your personal revision notes generated or saved from the AI Tutor. Official Admin PDFs and Curriculum Notes are kept strictly separate in Learning Materials and Course Workspaces.
                  </p>
                </div>
                {activeEnrollments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTab('ai-tutor')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D5B77A]" />
                    Open AI Tutor
                  </button>
                )}
              </div>

              {savedAiNotes.length === 0 ? (
                <EmptyState
                  title="No Personal AI Notes Saved Yet"
                  description="Open the RM HEAVEN AI Tutor to generate Simple Notes, Detailed Revision Guides, Translated Summaries, or save helpful explanations."
                  actionLabel={activeEnrollments.length > 0 ? 'Go to AI Tutor' : 'Browse Courses'}
                  onAction={() => setTab(activeEnrollments.length > 0 ? 'ai-tutor' : 'enrollment')}
                />
              ) : (
                <div className="space-y-4">
                  {savedAiNotes.map((note) => (
                    <div key={note.id} className="rounded-2xl border border-[#D5B77A]/45 bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#292323]/10 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#761D2D]">
                            <span className="rounded bg-[#D5B77A]/25 px-2 py-0.5">AI-Generated Personal Note</span>
                            <span>{note.courseTitle}</span>
                            <span>·</span>
                            <span>{note.language}</span>
                          </div>
                          <h2 className="mt-1.5 font-serif text-xl font-semibold text-[#292323]">{note.title}</h2>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await confirmAction({
                              title: 'Delete Personal AI Note?',
                              message: `Permanently delete "${note.title}"?`,
                              confirmLabel: 'Delete Note',
                              destructive: true,
                            });
                            if (ok) {
                              await deletePersonalAiNote(note.id);
                              showToast('Note Deleted', 'info');
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#B4434D] hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                      <div className="mt-4">
                        <RichContentRenderer content={note.content} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2D. QUIZ RESULTS & DIAGNOSTICS */}
          {tab === 'quiz-results' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">Quiz Results &amp; Practice History</h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Review your scores across official module assessments, final exams, and AI interactive practice tests.
                </p>
              </div>

              {quizAttempts.length === 0 ? (
                <EmptyState
                  title="No Quiz Attempts Recorded Yet"
                  description="Complete a module quiz inside My Courses or take an interactive Practice Test in the AI Tutor."
                  actionLabel={activeEnrollments.length > 0 ? 'Go to My Courses' : 'Enroll in a Course'}
                  onAction={() => setTab(activeEnrollments.length > 0 ? 'my-courses' : 'enrollment')}
                />
              ) : (
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                      <tr>
                        <th className="py-2.5 pr-4 font-semibold">Assessment</th>
                        <th className="py-2.5 pr-4 font-semibold">Type</th>
                        <th className="py-2.5 pr-4 font-semibold">Score</th>
                        <th className="py-2.5 pr-4 font-semibold">Weak Topics Flagged</th>
                        <th className="py-2.5 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292323]/8">
                      {quizAttempts.map((att) => (
                        <tr key={att.id}>
                          <td className="py-3 pr-4 font-semibold text-[#292323]">{att.quizTitle}</td>
                          <td className="py-3 pr-4 text-[#761D2D]">
                            {att.source === 'ai_practice' ? 'AI Practice Test' : 'Official Course Quiz'}
                          </td>
                          <td className="py-3 pr-4 font-mono font-bold text-[#292323] tabular-nums">
                            {att.scorePercent}% ({att.correctCount}/{att.totalQuestions})
                          </td>
                          <td className="py-3 pr-4 text-[#292323]/75">
                            {att.weakTopics.length > 0 ? att.weakTopics.join(' · ') : 'None (100% mastery)'}
                          </td>
                          <td className="py-3 font-mono text-[#292323]/60 tabular-nums">
                            {formatTimestamp(att.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. COURSE ENROLLMENT */}
          {tab === 'enrollment' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Course Enrollment
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Submit enrollment requests for published courses and track administrative approval status.
                </p>
              </div>

              {/* Request Status Table */}
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  My Enrollment Requests
                </h2>
                {requests.length === 0 ? (
                  <p className="mt-3 text-sm text-[#292323]/65">
                    You have not submitted any course enrollment requests yet.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                        <tr>
                          <th className="py-2.5 pr-4 font-semibold">Course</th>
                          <th className="py-2.5 pr-4 font-semibold">Submitted</th>
                          <th className="py-2.5 pr-4 font-semibold">Status</th>
                          <th className="py-2.5 pr-4 font-semibold">Admin Feedback</th>
                          <th className="py-2.5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#292323]/8">
                        {requests.map((req) => (
                          <tr key={req.id}>
                            <td className="py-3 pr-4 font-semibold text-[#292323]">{req.courseTitle}</td>
                            <td className="py-3 pr-4 font-mono tabular-nums text-[#292323]/70">
                              {formatTimestamp(req.createdAt)}
                            </td>
                            <td className="py-3 pr-4">
                              <StatusLabel status={req.status} />
                            </td>
                            <td className="py-3 pr-4 text-[#292323]/75">
                              {req.adminFeedback || '—'}
                            </td>
                            <td className="py-3 text-right">
                              {req.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelRequest(req.id)}
                                  className="text-xs font-semibold text-[#B4434D] hover:underline"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Available Courses */}
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Available Courses ({courses.length})
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#292323]/45" />
                      <input
                        type="text"
                        value={enrollSearch}
                        onChange={(e) => setEnrollSearch(e.target.value)}
                        placeholder="Filter courses..."
                        className="rounded-lg border border-[#292323]/15 bg-white py-1.5 pl-8 pr-3 text-xs text-[#292323] focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                    <select
                      value={enrollDept}
                      onChange={(e) => setEnrollDept(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 bg-white px-3 py-1.5 text-xs font-medium text-[#292323] focus:border-[#761D2D] focus:outline-none"
                    >
                      <option value="All">All Departments</option>
                      {Array.from(new Set(courses.map((c) => c.departmentName || c.category).filter(Boolean))).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {courses.length === 0 ? (
                  <EmptyState
                    title="No Published Courses Available"
                    description="Check back once administrators publish new courses."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {courses
                      .filter((c) => {
                        const deptName = c.departmentName || c.category;
                        const matchesDept = enrollDept === 'All' || deptName === enrollDept;
                        const q = enrollSearch.trim().toLowerCase();
                        const matchesQ = !q || c.title.toLowerCase().includes(q) || c.shortDescription.toLowerCase().includes(q);
                        return matchesDept && matchesQ;
                      })
                      .map((course) => {
                        const isEnrolled = activeEnrollments.some((e) => e.courseId === course.id);
                        const isPending = pendingRequests.some((r) => r.courseId === course.id);
                        return (
                          <div
                            key={course.id}
                            className="flex flex-col rounded-2xl border border-[#292323]/10 bg-white p-6"
                          >
                            <p className="text-xs font-medium text-[#761D2D]">
                              {course.departmentName || course.category} · {course.level} · {course.duration}
                            </p>
                            <h3 className="mt-2 font-display text-2xl font-semibold text-[#292323]">
                              {course.title}
                            </h3>
                            <p className="mt-2 flex-1 text-xs leading-relaxed text-[#292323]/75">
                              {course.shortDescription}
                            </p>
                            <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#292323]/10 pt-4">
                              <Link
                                to={`/courses/${course.id}`}
                                className="text-xs font-semibold text-[#292323]/75 hover:text-[#761D2D]"
                              >
                                View Syllabus
                              </Link>
                              {isEnrolled ? (
                                <StatusLabel status="Approved" />
                              ) : isPending ? (
                                <StatusLabel status="Pending Approval" />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRequestEnroll(course)}
                                  className="rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                                >
                                  Enroll Now
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. LEARNING MATERIALS */}
          {tab === 'materials' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Learning Materials
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Authorized study PDFs and documents organized by your approved courses and modules.
                </p>
              </div>

              {loadingMaterials ? (
                <LoadingState message="Loading authorized materials..." />
              ) : materialsByCourse.length === 0 ? (
                <EmptyState
                  title="No Course Materials Unlocked"
                  description="Learning materials appear here once your enrollment in a course is approved and resources are published."
                  actionLabel="Browse Course Enrollment"
                  onAction={() => setTab('enrollment')}
                />
              ) : (
                <div className="space-y-6">
                  {materialsByCourse.map((group) => (
                    <div
                      key={group.courseTitle}
                      className="rounded-2xl border border-[#292323]/10 bg-white p-6"
                    >
                      <h2 className="font-display text-2xl font-semibold text-[#292323]">
                        {group.courseTitle}
                      </h2>
                      {group.materials.length === 0 ? (
                        <p className="mt-3 text-xs text-[#292323]/65">
                          No materials uploaded for this course yet.
                        </p>
                      ) : (
                        <div className="mt-4 divide-y divide-[#292323]/10">
                          {group.materials.map((mat) => {
                            const mod = group.modules.find((m) => m.id === mat.moduleId);
                            return (
                              <div
                                key={mat.id}
                                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                              >
                                <div>
                                  <p className="text-xs font-medium text-[#761D2D]">
                                    {mod ? mod.title : 'Course Resource'} · {mat.fileName}
                                  </p>
                                  <h3 className="mt-0.5 text-sm font-semibold text-[#292323]">
                                    {mat.title}
                                  </h3>
                                  <p className="mt-1 text-xs text-[#292323]/75">{mat.description}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const enr = activeEnrollments.find((e) => e.courseId === group.courseId);
                                      if (enr) {
                                        setWorkspaceInitTab('ai-tutor');
                                        setWorkspaceInitMatId(mat.id);
                                        setActiveCourseEnrollment(enr);
                                        setTab('my-courses');
                                      }
                                    }}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#D5B77A]/25 border border-[#D5B77A] px-3 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#D5B77A]/45"
                                  >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Explain PDF with AI
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewPdf(mat)}
                                    className="rounded-lg border border-[#761D2D] px-3.5 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                                  >
                                    View Document
                                  </button>
                                  {mat.downloadAllowed ? (
                                    <a
                                      href={mat.fileUrl}
                                      download={mat.fileName}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      Download
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
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. ASSIGNMENTS */}
          {tab === 'assignments' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">Assignments</h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Review assignment instructions, deadlines, submit your work, and read evaluator feedback.
                </p>
              </div>

              {allEnrolledAssignments.length === 0 ? (
                <EmptyState
                  title="No Assignments Available"
                  description="Assignments for your approved courses will appear here when published by administrators."
                />
              ) : (
                <div className="space-y-4">
                  {allEnrolledAssignments.map((assign) => {
                    const sub = submissions.find((s) => s.assignmentId === assign.id);
                    return (
                      <div
                        key={assign.id}
                        className="rounded-2xl border border-[#292323]/10 bg-white p-6"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <p className="text-xs font-semibold text-[#761D2D]">
                              {assign.courseTitle} · Due {assign.dueDate} · Max Marks: {assign.maxMarks}
                            </p>
                            <h2 className="mt-1 font-display text-2xl font-semibold text-[#292323]">
                              {assign.title}
                            </h2>
                          </div>
                          <StatusLabel status={sub ? sub.status : assign.status === 'closed' ? 'Closed' : 'Open'} />
                        </div>

                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#292323]/80">
                          {assign.instructions}
                        </p>

                        {sub && (
                          <div className="mt-4 rounded-xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-4 text-xs space-y-1.5">
                            <p className="font-semibold text-[#292323]">
                              Your Submission ({formatTimestamp(sub.submittedAt)})
                            </p>
                            {sub.fileUrl && (
                              <p>
                                File:{' '}
                                <a
                                  href={sub.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-[#761D2D] underline"
                                >
                                  {sub.fileName || 'View Submitted File'}
                                </a>
                              </p>
                            )}
                            {sub.notes && <p className="text-[#292323]/80">Notes: {sub.notes}</p>}
                            {typeof sub.marks === 'number' && (
                              <p className="font-mono font-semibold text-[#761D2D]">
                                Evaluated Score: {sub.marks} / {assign.maxMarks}
                              </p>
                            )}
                            {sub.feedback && (
                              <p className="text-[#292323]/85">
                                <span className="font-semibold">Evaluator Feedback:</span> {sub.feedback}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-5 flex justify-end">
                          {(!sub || sub.status === 'Submitted') && assign.status === 'published' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSubmittingAssignment(assign);
                                setAssignFileUrl(sub?.fileUrl || '');
                                setAssignFileName(sub?.fileName || '');
                                setAssignNotes(sub?.notes || '');
                              }}
                              className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                            >
                              {sub ? 'Update Submission' : 'Submit Assignment'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. INTERNSHIP OPPORTUNITIES */}
          {tab === 'internships' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Internship Opportunities
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Explore open RM HEAVEN internship cohorts and submit your candidacy.
                </p>
              </div>

              {internships.filter((i) => i.status === 'open').length === 0 ? (
                <EmptyState
                  title="No Open Internships Right Now"
                  description="New internship opportunities created by administrators will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {internships
                    .filter((i) => i.status === 'open')
                    .map((item) => {
                      const alreadyApplied = applications.find((a) => a.internshipId === item.id);
                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-[#292323]/10 bg-white p-6"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-[#761D2D]">
                                {item.department} · {item.duration} · Deadline {item.deadline}
                              </p>
                              <h2 className="mt-1 font-display text-2xl font-bold text-[#292323]">
                                {item.title}
                              </h2>
                            </div>
                            {alreadyApplied ? (
                              <StatusLabel status={alreadyApplied.status} />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setApplyingInternship(item)}
                                className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                              >
                                Apply Now
                              </button>
                            )}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-[#292323]/80">
                            {item.description}
                          </p>
                          <p className="mt-3 text-xs text-[#292323]/70">
                            <span className="font-semibold">Eligibility:</span> {item.eligibility}
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* 7. MY APPLICATIONS */}
          {tab === 'applications' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  My Internship Applications
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Real-time status tracking for your submitted internship applications.
                </p>
              </div>

              {applications.length === 0 ? (
                <EmptyState
                  title="No Applications Submitted"
                  description="Browse Internship Opportunities to apply for an active cohort."
                  actionLabel="View Internships"
                  onAction={() => setTab('internships')}
                />
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-[#292323]/10 bg-white p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="font-display text-2xl font-semibold text-[#292323]">
                            {app.internshipTitle}
                          </h2>
                          <p className="mt-1 text-xs text-[#292323]/60 tabular-nums">
                            Applied {formatTimestamp(app.appliedAt)}
                          </p>
                        </div>
                        <StatusLabel status={app.status} />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-[#292323]/80">
                        {app.statementOfPurpose}
                      </p>
                      {app.adminFeedback && (
                        <div className="mt-4 rounded-xl bg-[#F8F4ED] p-3.5 text-xs text-[#292323]/85">
                          <span className="font-semibold text-[#761D2D]">Reviewer Feedback: </span>
                          {app.adminFeedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 8. CERTIFICATES */}
          {tab === 'certificates' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">Certificates</h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Official RM HEAVEN certificates issued to your verified account.
                </p>
              </div>

              {certificates.length === 0 ? (
                <EmptyState
                  title="No Certificates Issued Yet"
                  description="Certificates issued upon completing your courses or internships will appear here with verification IDs and authorized PDF downloads."
                />
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-2xl border border-[#D5B77A]/60 bg-white p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-semibold text-[#761D2D]">
                          {cert.certificateCode}
                        </span>
                        <StatusLabel status={cert.status} />
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-bold text-[#292323]">
                        {cert.programTitle}
                      </h2>
                      <p className="mt-1 text-xs text-[#292323]/70">
                        {cert.programType} Credential · Issued {formatTimestamp(cert.issuedAt)}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#292323]/10 pt-4">
                        <Link
                          to="/verify"
                          className="text-xs font-semibold text-[#761D2D] hover:underline"
                        >
                          Public Verification Portal
                        </Link>
                        <CertificatePdfButton certificate={cert} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 9. NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">Notifications</h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Updates on enrollment decisions, assignments, internships, and certificates.
                </p>
              </div>

              {notifications.length === 0 ? (
                <EmptyState
                  title="No Notifications"
                  description="Your notification inbox is currently empty."
                />
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex flex-col justify-between gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center ${
                        n.read
                          ? 'border-[#292323]/10 bg-white'
                          : 'border-[#761D2D]/35 bg-white shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-[#292323]">{n.title}</span>
                          {!n.read && (
                            <span className="font-semibold text-[#761D2D]">· Unread</span>
                          )}
                          <span className="text-[#292323]/55 tabular-nums">
                            · {formatTimestamp(n.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#292323]/80">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => markNotificationRead(n.id)}
                            className="text-xs font-semibold text-[#761D2D] hover:underline"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteNotification(n.id)}
                          className="text-xs font-medium text-[#292323]/55 hover:text-[#B4434D]"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 10. MY PROFILE */}
          {tab === 'profile' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">My Profile</h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Manage your student contact details and academic preferences.
                </p>
              </div>

              {profile ? (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-5 rounded-2xl border border-[#292323]/10 bg-white p-6 sm:p-8"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Full Name</label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Email (Verified)</label>
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED] px-3.5 py-2.5 text-sm text-[#292323]/65"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={24}
                        value={profMobile}
                        onChange={(e) => setProfMobile(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">City</label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={profCity}
                        onChange={(e) => setProfCity(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Qualification</label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={profQual}
                        onChange={(e) => setProfQual(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Institution</label>
                      <input
                        type="text"
                        maxLength={180}
                        value={profInst}
                        onChange={(e) => setProfInst(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Course Interests</label>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {COURSE_INTEREST_OPTIONS.map((topic) => (
                        <label
                          key={topic}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#292323]/12 px-3 py-2 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={profInterests.includes(topic)}
                            onChange={() =>
                              setProfInterests((prev) =>
                                prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic],
                              )
                            }
                            className="accent-[#761D2D]"
                          />
                          <span>{topic}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-4 text-xs text-[#292323]/75">
                    <p className="font-semibold text-[#292323]">Compliance Record</p>
                    <p className="mt-1">
                      Terms ({profile.termsVersion}) & Code of Conduct ({profile.conductVersion}) accepted on{' '}
                      {formatTimestamp(profile.acceptedAt)}.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-lg bg-[#761D2D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              ) : (
                <EmptyState
                  title="Profile Not Initialized"
                  description="Finish student registration to create your profile."
                  actionLabel="Complete Registration"
                  onAction={() => navigate('/register')}
                />
              )}
            </div>
          )}

          {/* 11. SUPPORT */}
          {tab === 'support' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <form
                  onSubmit={handleSubmitSupport}
                  className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6"
                >
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Contact Student Support
                  </h2>
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Subject</label>
                    <input
                      type="text"
                      required
                      maxLength={160}
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Message</label>
                    <textarea
                      required
                      rows={4}
                      maxLength={3000}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-sm focus:border-[#761D2D] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638]"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  My Support Tickets
                </h2>
                {tickets.length === 0 ? (
                  <EmptyState
                    title="No Support Tickets"
                    description="Questions submitted from your dashboard or Contact Us appear here with administrator responses."
                  />
                ) : (
                  tickets.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-[#292323]/10 bg-white p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-[#292323]">{t.subject}</h3>
                        <StatusLabel status={t.status} />
                      </div>
                      <p className="mt-2 text-xs text-[#292323]/80">{t.message}</p>
                      {t.adminReply && (
                        <div className="mt-3 rounded-xl bg-[#F8F4ED] p-3.5 text-xs text-[#292323]">
                          <span className="font-semibold text-[#761D2D]">Support Reply: </span>
                          {t.adminReply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Assignment Submission Modal */}
      {submittingAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#292323]/15 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-[#292323]">
              Submit: {submittingAssignment.title}
            </h3>
            <form onSubmit={handleSubmitAssignment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Upload Assignment File (PDF, ZIP, DOCX)
                </label>
                <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#761D2D]/40 bg-[#F8F4ED]/50 p-4 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]">
                  <Upload className="h-4 w-4" />
                  <span>{assignUploading ? 'Uploading...' : assignFileName || 'Choose File to Upload'}</span>
                  <input type="file" onChange={handleAssignmentFileSelect} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Or Provide Submission Document URL
                </label>
                <input
                  type="url"
                  maxLength={1000}
                  value={assignFileUrl}
                  onChange={(e) => setAssignFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Submission Notes / Written Response
                </label>
                <textarea
                  rows={4}
                  maxLength={3000}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Summarize your solution or include written answers..."
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="rounded-lg border border-[#292323]/15 px-4 py-2 text-xs font-semibold text-[#292323]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignUploading}
                  className="rounded-lg bg-[#761D2D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                >
                  Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internship Apply Modal inside Student Dashboard */}
      {applyingInternship && profile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#292323]/15 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-[#292323]">
              Apply: {applyingInternship.title}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await applyForInternship({
                    internship: applyingInternship,
                    student: profile,
                    statementOfPurpose: sop,
                    portfolioUrl,
                  });
                  showToast('Application Submitted', 'success');
                  setApplyingInternship(null);
                  setSop('');
                  setPortfolioUrl('');
                } catch (err) {
                  showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to apply.');
                }
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Statement of Purpose
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  maxLength={3000}
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  maxLength={500}
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingInternship(null)}
                  className="rounded-lg border border-[#292323]/15 px-4 py-2 text-xs font-semibold text-[#292323]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#761D2D] px-5 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Material Modal */}
      {previewPdf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292323]/10 px-6 py-4">
              <h3 className="font-display text-xl font-bold text-[#292323]">{previewPdf.title}</h3>
              <div className="flex items-center gap-3">
                {previewPdf.downloadAllowed && (
                  <a
                    href={previewPdf.fileUrl}
                    download={previewPdf.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewPdf(null)}
                  className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#F8F4ED] p-4">
              <iframe
                src={previewPdf.fileUrl}
                title={previewPdf.title}
                className="h-[65vh] w-full rounded-lg border border-[#292323]/10 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
