import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Briefcase,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Award,
  Bell,
  BarChart3,
  Globe,
  Settings,
  Shield,
  LogOut,
  Search,
  Menu,
  X,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase/config';
import {
  createNotification,
  deleteNotification,
  evaluateAssignmentSubmission,
  fetchAllAdmins,
  fetchAllAuditLogs,
  fetchAllQuizAttemptsAdmin,
  formatTimestamp,
  issueCertificate,
  markNotificationRead,
  provisionAdminUser,
  removeAdminUser,
  replySupportTicket,
  reviewEnrollmentRequest,
  saveInternship,
  saveWebsiteContent,
  subscribeAllCoursesAdmin,
  subscribeAllDepartmentsAdmin,
  subscribeAllInternshipsAdmin,
  timestampToMillis,
  toggleStudentAccountStatus,
  updateCertificateControl,
  updateInternshipApplicationStatus,
} from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { EmptyState, RmCrestMark, RmHeavenWordmark, StatusLabel } from '../../components/BrandAssets';
import { AdminCoursePanel } from './AdminCoursePanel';
import { seedAllCurriculumToFirestore } from '../../data/curriculum/seedService';
import type {
  AdminUser,
  AssignmentSubmission,
  AuditLog,
  Certificate,
  Course,
  Department,
  EnrollmentRequest,
  Internship,
  InternshipApplication,
  InternshipApplicationStatus,
  NotificationItem,
  QuizAttempt,
  StudentEnrollment,
  SupportTicket,
  UserProfile,
  WebsiteContent,
} from '../../types';

type AdminTab =
  | 'overview'
  | 'students'
  | 'courses'
  | 'enrollments'
  | 'internships'
  | 'materials'
  | 'assignments'
  | 'evaluation'
  | 'certificates'
  | 'notifications'
  | 'analytics'
  | 'cms'
  | 'settings'
  | 'profile';

export function AdminDashboard({ content }: { content: WebsiteContent }) {
  const { user, logout } = useAuth();
  const { showToast, confirmAction } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live collections
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadedDepts, setLoadedDepts] = useState(false);
  const [loadedCourses, setLoadedCourses] = useState(false);
  const [autoSyncing, setAutoSyncing] = useState(false);
  const [autoSyncStage, setAutoSyncStage] = useState('');
  const [autoSyncProgress, setAutoSyncProgress] = useState(0);
  const [autoSyncError, setAutoSyncError] = useState('');
  const autoSyncAttemptedRef = useRef(false);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([]);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // Filters & interactive states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [inspectStudent, setInspectStudent] = useState<UserProfile | null>(null);

  const [requestFilter, setRequestFilter] = useState<'Pending' | 'All'>('Pending');
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});

  // Internship create state
  const [showInternForm, setShowInternForm] = useState(false);
  const [intTitle, setIntTitle] = useState('');
  const [intDept, setIntDept] = useState('');
  const [intDesc, setIntDesc] = useState('');
  const [intElig, setIntElig] = useState('');
  const [intSkills, setIntSkills] = useState('');
  const [intDuration, setIntDuration] = useState('');
  const [intOutcomes, setIntOutcomes] = useState('');
  const [intDeadline, setIntDeadline] = useState('');

  // Evaluation draft state
  const [evalMarks, setEvalMarks] = useState<Record<string, string>>({});
  const [evalFeedback, setEvalFeedback] = useState<Record<string, string>>({});

  // Certificate issuance form
  const [certStudentId, setCertStudentId] = useState('');
  const [certProgramType, setCertProgramType] = useState<'Course' | 'Internship'>('Course');
  const [certProgramId, setCertProgramId] = useState('');
  const [certDownloadAllowed, setCertDownloadAllowed] = useState(true);

  // CMS form
  const [cmsHeadline, setCmsHeadline] = useState(content.heroHeadline || '');
  const [cmsSubtext, setCmsSubtext] = useState(content.heroSubtext || '');
  const [cmsWelcomeTitle, setCmsWelcomeTitle] = useState(content.welcomeTitle || '');
  const [cmsWelcomeBody, setCmsWelcomeBody] = useState(content.welcomeBody || '');
  const [cmsBanner, setCmsBanner] = useState(content.announcementBanner || '');
  const [cmsEmail, setCmsEmail] = useState(content.contactEmail || '');
  const [cmsPhone, setCmsPhone] = useState(content.contactPhone || '');
  const [cmsOffice, setCmsOffice] = useState(content.officeLocation || '');

  // Broadcast notification form
  const [notifStudentId, setNotifStudentId] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // New Admin Provisioning form
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');

  useEffect(() => {
    setCmsHeadline(content.heroHeadline || '');
    setCmsSubtext(content.heroSubtext || '');
    setCmsWelcomeTitle(content.welcomeTitle || '');
    setCmsWelcomeBody(content.welcomeBody || '');
    setCmsBanner(content.announcementBanner || '');
    setCmsEmail(content.contactEmail || '');
    setCmsPhone(content.contactPhone || '');
    setCmsOffice(content.officeLocation || '');
  }, [content]);

  useEffect(() => {
    const uDepts = subscribeAllDepartmentsAdmin((list) => {
      setDepartments(list);
      setLoadedDepts(true);
    });
    const uCourses = subscribeAllCoursesAdmin((list) => {
      setCourses(list);
      setLoadedCourses(true);
    });
    const uInterns = subscribeAllInternshipsAdmin(setInternships);

    const uUsers = onSnapshot(
      collection(db, 'users'),
      (snap) =>
        setStudents(
          snap.docs
            .map((d) => d.data() as UserProfile)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'users'),
    );

    const uReqs = onSnapshot(
      collection(db, 'enrollment_requests'),
      (snap) =>
        setEnrollmentRequests(
          snap.docs
            .map((d) => d.data() as EnrollmentRequest)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'enrollment_requests'),
    );

    const uEnrs = onSnapshot(
      collection(db, 'student_enrollments'),
      (snap) => setEnrollments(snap.docs.map((d) => d.data() as StudentEnrollment)),
      (err) => handleFirestoreError(err, OperationType.LIST, 'student_enrollments'),
    );

    const uApps = onSnapshot(
      collection(db, 'internship_applications'),
      (snap) =>
        setApplications(
          snap.docs
            .map((d) => d.data() as InternshipApplication)
            .sort((a, b) => timestampToMillis(b.appliedAt) - timestampToMillis(a.appliedAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'internship_applications'),
    );

    const uSubs = onSnapshot(
      collection(db, 'assignment_submissions'),
      (snap) =>
        setSubmissions(
          snap.docs
            .map((d) => d.data() as AssignmentSubmission)
            .sort((a, b) => timestampToMillis(b.submittedAt) - timestampToMillis(a.submittedAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'assignment_submissions'),
    );

    const uCerts = onSnapshot(
      collection(db, 'certificates'),
      (snap) =>
        setCertificates(
          snap.docs
            .map((d) => d.data() as Certificate)
            .sort((a, b) => timestampToMillis(b.issuedAt) - timestampToMillis(a.issuedAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'),
    );

    const uNotifs = onSnapshot(
      query(collection(db, 'notifications'), where('recipientRole', '==', 'admin')),
      (snap) =>
        setNotifications(
          snap.docs
            .map((d) => d.data() as NotificationItem)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'),
    );

    const uTickets = onSnapshot(
      collection(db, 'support_tickets'),
      (snap) =>
        setTickets(
          snap.docs
            .map((d) => d.data() as SupportTicket)
            .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt)),
        ),
      (err) => handleFirestoreError(err, OperationType.LIST, 'support_tickets'),
    );

    void fetchAllAuditLogs().then(setAuditLogs);
    void fetchAllAdmins().then(setAdmins);
    void fetchAllQuizAttemptsAdmin().then(setQuizAttempts);

    return () => {
      uDepts();
      uCourses();
      uInterns();
      uUsers();
      uReqs();
      uEnrs();
      uApps();
      uSubs();
      uCerts();
      uNotifs();
      uTickets();
    };
  }, []);

  const triggerAutoCurriculumSync = async () => {
    if (!user || autoSyncing) return;
    const syncActor = { uid: user.uid, email: user.email || 'admin@rmheaven.academy' };
    setAutoSyncError('');
    setAutoSyncing(true);
    setAutoSyncProgress(4);
    setAutoSyncStage('Initializing RM HEAVEN 4-department, 31-course curriculum sync...');
    try {
      const result = await seedAllCurriculumToFirestore(syncActor, (stage, pct) => {
        setAutoSyncStage(stage);
        setAutoSyncProgress(pct);
      });
      showToast(
        'Master Curriculum Synced',
        'success',
        `${result.departments} Departments · ${result.courses} Courses · ${result.modules} Modules · ${result.lessons} Lessons · ${result.studyNotes} Study Notes live in Firestore.`,
      );
      void fetchAllAuditLogs().then(setAuditLogs);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to sync curriculum to Firestore.';
      setAutoSyncError(msg);
      showToast('Automatic Curriculum Sync Failed', 'error', msg);
    } finally {
      setAutoSyncing(false);
    }
  };

  useEffect(() => {
    if (!user || !loadedDepts || !loadedCourses || autoSyncAttemptedRef.current) return;
    if (departments.length < 4 || courses.length < 31) {
      autoSyncAttemptedRef.current = true;
      void triggerAutoCurriculumSync();
    } else {
      autoSyncAttemptedRef.current = true;
    }
  }, [user?.uid, loadedDepts, loadedCourses, departments.length, courses.length]);

  if (!user) return null;
  const actor = { uid: user.uid, email: user.email || 'admin@rmheaven.academy' };

  const activeStudentsCount = students.filter((s) => s.accountStatus === 'active').length;
  const pendingReqCount = enrollmentRequests.filter((r) => r.status === 'Pending').length;
  const approvedEnrollmentsCount = enrollments.filter((e) => e.status === 'active').length;
  const openInternshipsCount = internships.filter((i) => i.status === 'open').length;
  const pendingSubsCount = submissions.filter((s) => s.status !== 'Evaluated').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    return students.filter((s) => {
      const matchesStatus = studentStatusFilter === 'all' || s.accountStatus === studentStatusFilter;
      const matchesQ =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q);
      return matchesStatus && matchesQ;
    });
  }, [students, studentSearch, studentStatusFilter]);

  const displayedRequests =
    requestFilter === 'Pending'
      ? enrollmentRequests.filter((r) => r.status === 'Pending')
      : enrollmentRequests;

  const handleEnrollmentDecision = async (req: EnrollmentRequest, decision: 'Approved' | 'Rejected') => {
    const feedback = feedbackDrafts[req.id] || '';
    if (decision === 'Rejected' && !feedback.trim()) {
      showToast('Feedback Recommended', 'warning', 'Please enter brief rejection feedback for the student.');
      return;
    }
    try {
      await reviewEnrollmentRequest(req, decision, feedback, actor);
      showToast(`Request ${decision}`, 'success', `${req.studentName} — ${req.courseTitle}`);
      void fetchAllAuditLogs().then(setAuditLogs);
    } catch (err) {
      showToast('Error', 'error', err instanceof Error ? err.message : 'Unable to process request.');
    }
  };

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveInternship(
        {
          title: intTitle,
          department: intDept,
          description: intDesc,
          eligibility: intElig,
          skillsRequired: intSkills.split(',').map((s) => s.trim()).filter(Boolean),
          duration: intDuration,
          learningOutcomes: intOutcomes.split('\n').map((s) => s.trim()).filter(Boolean),
          deadline: intDeadline,
          status: 'open',
        },
        actor,
      );
      setShowInternForm(false);
      setIntTitle('');
      setIntDept('');
      setIntDesc('');
      setIntElig('');
      setIntSkills('');
      setIntDuration('');
      setIntOutcomes('');
      setIntDeadline('');
      showToast('Internship Programme Published', 'success');
    } catch (err) {
      showToast('Failed', 'error', err instanceof Error ? err.message : 'Unable to save internship.');
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find((s) => s.uid === certStudentId);
    const prog =
      certProgramType === 'Course'
        ? courses.find((c) => c.id === certProgramId)
        : internships.find((i) => i.id === certProgramId);

    if (!stu || !prog) {
      showToast('Selection Required', 'warning', 'Select both a registered student and a programme.');
      return;
    }

    try {
      const code = await issueCertificate(
        {
          studentId: stu.uid,
          studentName: stu.fullName,
          studentEmail: stu.email,
          programId: prog.id,
          programTitle: prog.title,
          programType: certProgramType,
          downloadAllowed: certDownloadAllowed,
        },
        actor,
      );
      showToast('Certificate Issued', 'success', `Verification ID: ${code}`);
      void fetchAllAuditLogs().then(setAuditLogs);
    } catch (err) {
      showToast('Issuance Failed', 'error', err instanceof Error ? err.message : 'Could not issue certificate.');
    }
  };

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Student Management', icon: Users, badge: students.length || undefined },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollment Requests', icon: ClipboardList, badge: pendingReqCount || undefined },
    { id: 'internships', label: 'Internship Management', icon: Briefcase },
    { id: 'materials', label: 'Learning Materials', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: FileSpreadsheet },
    { id: 'evaluation', label: 'Assignment Evaluation', icon: CheckSquare, badge: pendingSubsCount || undefined },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount || undefined },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'cms', label: 'Website Content CMS', icon: Globe },
    { id: 'settings', label: 'Settings & Admins', icon: Settings },
    { id: 'profile', label: 'Admin Profile', icon: Shield },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#292323]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#292323]/10 bg-[#292323] px-4 text-[#F8F4ED] sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((s) => !s)}
            className="rounded-lg border border-[#F8F4ED]/20 p-2 lg:hidden"
            aria-label="Toggle admin menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <RmCrestMark size={32} />
            <RmHeavenWordmark variant="dark" className="font-display text-xl font-bold" />
          </Link>
          <span className="hidden sm:inline text-xs text-[#D5B77A]">
            / Administrative Control Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:inline text-xs font-medium text-[#F8F4ED]/80 hover:text-[#D5B77A]"
          >
            Public Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F8F4ED]/25 px-3 py-1.5 text-xs font-semibold text-[#F8F4ED] hover:bg-[#761D2D]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Admin Sidebar */}
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
            <div className="mt-4 border-t border-[#292323]/10 pt-4">
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

        {/* Main Admin Content */}
        <main className="flex-1 p-5 sm:p-8 min-w-0">
          {(autoSyncing || autoSyncError) && (
            <div
              className={`mb-6 rounded-2xl border p-5 ${
                autoSyncError
                  ? 'border-[#B4434D]/35 bg-[#B4434D]/8 text-[#292323]'
                  : 'border-[#D5B77A]/60 bg-white shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {autoSyncing ? (
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#761D2D]" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 text-[#B4434D]" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#292323]">
                      {autoSyncing
                        ? 'Synchronizing Master Curriculum (4 Departments · 31 Courses · 155 Modules · 465 Lessons)'
                        : 'Curriculum Sync Needs Attention'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#292323]/75">
                      {autoSyncing ? autoSyncStage : autoSyncError}
                    </p>
                  </div>
                </div>
                {autoSyncing ? (
                  <span className="font-mono text-xs font-bold text-[#761D2D] tabular-nums">
                    {autoSyncProgress}%
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void triggerAutoCurriculumSync()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry Full Curriculum Sync
                  </button>
                )}
              </div>
              {autoSyncing && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F8F4ED]">
                  <div
                    className="h-full bg-[#761D2D] transition-all duration-300"
                    style={{ width: `${autoSyncProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 1. OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Administrative Overview
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Real-time operational metrics across students, enrollments, courses, internships, and evaluations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Students', value: students.length },
                  { label: 'Active Students', value: activeStudentsCount },
                  { label: 'Total Courses', value: courses.length },
                  { label: 'Pending Enrollment Requests', value: pendingReqCount },
                  { label: 'Approved Enrollments', value: approvedEnrollmentsCount },
                  { label: 'Active Internships', value: openInternshipsCount },
                  { label: 'Pending Assignment Evaluations', value: pendingSubsCount },
                  { label: 'Issued Certificates', value: certificates.length },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-[#292323]/10 bg-white p-5">
                    <p className="text-xs font-medium text-[#292323]/65">{kpi.label}</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-[#761D2D] tabular-nums">
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Pending Enrollment Requests
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('enrollments')}
                      className="text-xs font-semibold text-[#761D2D] hover:underline"
                    >
                      Review Queue
                    </button>
                  </div>
                  {pendingReqCount === 0 ? (
                    <p className="mt-4 text-sm text-[#292323]/65">No pending enrollment requests.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {enrollmentRequests
                        .filter((r) => r.status === 'Pending')
                        .slice(0, 5)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#292323]/10 p-3.5 text-xs"
                          >
                            <div>
                              <p className="font-semibold text-[#292323]">{r.studentName}</p>
                              <p className="text-[#292323]/70">{r.courseTitle}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTab('enrollments')}
                              className="rounded-lg bg-[#761D2D] px-3 py-1.5 font-semibold text-white"
                            >
                              Review
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Recent Administrative Activities
                  </h2>
                  {auditLogs.length === 0 ? (
                    <p className="mt-4 text-sm text-[#292323]/65">
                      Audit entries appear automatically whenever administrative actions occur.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {auditLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="border-b border-[#292323]/8 pb-2.5 text-xs last:border-b-0">
                          <div className="flex justify-between gap-2">
                            <span className="font-semibold text-[#292323]">{log.action}</span>
                            <span className="text-[#292323]/55 tabular-nums">
                              {formatTimestamp(log.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[#292323]/70">
                            {log.details || log.targetId}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENT MANAGEMENT */}
          {tab === 'students' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Student Management
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Search registered students, inspect profiles and enrollment histories, or manage account status.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#292323]/10 bg-white p-4">
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292323]/45" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name, email, or city..."
                    className="w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-2 pl-9 pr-3 text-xs focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-[#F8F4ED] p-1">
                  {(['all', 'active', 'suspended'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStudentStatusFilter(st)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                        studentStatusFilter === st ? 'bg-[#761D2D] text-white' : 'text-[#292323]/75'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <EmptyState
                  title="No Students Found"
                  description="Registered students will appear here once learners complete registration."
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#292323]/10 bg-white p-4">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                      <tr>
                        <th className="py-2.5 pr-4 font-semibold">Student</th>
                        <th className="py-2.5 pr-4 font-semibold">Qualification · City</th>
                        <th className="py-2.5 pr-4 font-semibold">Joined</th>
                        <th className="py-2.5 pr-4 font-semibold">Status</th>
                        <th className="py-2.5 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292323]/8">
                      {filteredStudents.map((s) => (
                        <tr key={s.uid}>
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-[#292323]">{s.fullName}</p>
                            <p className="text-[#292323]/65">{s.email}</p>
                          </td>
                          <td className="py-3 pr-4 text-[#292323]/80">
                            {s.qualification} · {s.city}
                          </td>
                          <td className="py-3 pr-4 font-mono tabular-nums text-[#292323]/65">
                            {formatTimestamp(s.createdAt)}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusLabel status={s.accountStatus} />
                          </td>
                          <td className="py-3 text-right space-x-3">
                            <button
                              type="button"
                              onClick={() => setInspectStudent(s)}
                              className="font-semibold text-[#761D2D] hover:underline"
                            >
                              Profile
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const next = s.accountStatus === 'active' ? 'suspended' : 'active';
                                const ok = await confirmAction({
                                  title: `${next === 'suspended' ? 'Suspend' : 'Activate'} ${s.fullName}?`,
                                  message:
                                    next === 'suspended'
                                      ? 'Suspended students cannot submit new enrollments or assignments.'
                                      : 'Restores full active student privileges.',
                                  destructive: next === 'suspended',
                                });
                                if (ok) {
                                  await toggleStudentAccountStatus(s, next, actor);
                                  showToast(`Account ${next}`, 'success');
                                }
                              }}
                              className="font-semibold text-[#292323]/75 hover:text-[#761D2D]"
                            >
                              {s.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3, 6, 7: COURSES, MATERIALS, ASSIGNMENTS */}
          {(tab === 'courses' || tab === 'materials' || tab === 'assignments') && (
            <AdminCoursePanel
              mode={tab}
              courses={courses}
              departments={departments}
              actor={actor}
              onSwitchMode={setTab}
            />
          )}

          {/* 4. ENROLLMENT REQUESTS */}
          {tab === 'enrollments' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#292323]">
                    Enrollment Requests
                  </h1>
                  <p className="mt-1 text-sm text-[#292323]/70">
                    Review student requests. Approving creates the authoritative enrollment record in Firestore.
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-white border border-[#292323]/10 p-1">
                  {(['Pending', 'All'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setRequestFilter(f)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                        requestFilter === f ? 'bg-[#761D2D] text-white' : 'text-[#292323]/75'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {displayedRequests.length === 0 ? (
                <EmptyState
                  title="No Enrollment Requests"
                  description="Student course enrollment requests will appear here for administrative review."
                />
              ) : (
                <div className="space-y-4">
                  {displayedRequests.map((req) => (
                    <div key={req.id} className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-[#761D2D]">
                            {req.courseTitle} · Requested {formatTimestamp(req.createdAt)}
                          </p>
                          <h2 className="mt-1 font-display text-2xl font-semibold text-[#292323]">
                            {req.studentName}
                          </h2>
                          <p className="text-xs text-[#292323]/65">{req.studentEmail}</p>
                        </div>
                        <StatusLabel status={req.status} />
                      </div>

                      {req.note && (
                        <p className="mt-3 rounded-lg bg-[#F8F4ED]/70 p-3 text-xs text-[#292323]/80">
                          Student note: {req.note}
                        </p>
                      )}

                      {req.status === 'Pending' ? (
                        <div className="mt-4 flex flex-col gap-3 border-t border-[#292323]/10 pt-4 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            maxLength={1000}
                            value={feedbackDrafts[req.id] || ''}
                            onChange={(e) =>
                              setFeedbackDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                            }
                            placeholder="Optional approval note or required rejection feedback..."
                            className="flex-1 rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                          />
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEnrollmentDecision(req, 'Approved')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEnrollmentDecision(req, 'Rejected')}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#B4434D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638]"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        req.adminFeedback && (
                          <p className="mt-3 text-xs text-[#292323]/75">
                            <span className="font-semibold">Admin Feedback:</span> {req.adminFeedback}
                          </p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. INTERNSHIP MANAGEMENT */}
          {tab === 'internships' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#292323]">
                    Internship Management
                  </h1>
                  <p className="mt-1 text-sm text-[#292323]/70">
                    Create internship programmes and review student applications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInternForm((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  <Plus className="h-4 w-4" />
                  {showInternForm ? 'Close Form' : 'Create Internship'}
                </button>
              </div>

              {showInternForm && (
                <form
                  onSubmit={handleCreateInternship}
                  className="space-y-4 rounded-2xl border border-[#292323]/12 bg-white p-6"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      required
                      placeholder="Internship Title *"
                      value={intTitle}
                      onChange={(e) => setIntTitle(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Department (e.g. Engineering) *"
                      value={intDept}
                      onChange={(e) => setIntDept(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Duration (e.g. 12 Weeks) *"
                      value={intDuration}
                      onChange={(e) => setIntDuration(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Eligibility Criteria *"
                      value={intElig}
                      onChange={(e) => setIntElig(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                    <input
                      type="date"
                      required
                      value={intDeadline}
                      onChange={(e) => setIntDeadline(e.target.value)}
                      className="rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Skills Required (comma-separated, e.g. TypeScript, SQL, Research) *"
                    value={intSkills}
                    onChange={(e) => setIntSkills(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Programme Description *"
                    value={intDesc}
                    onChange={(e) => setIntDesc(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 p-3 text-xs"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Learning Outcomes (one per line) *"
                    value={intOutcomes}
                    onChange={(e) => setIntOutcomes(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 p-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#761D2D] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                  >
                    Publish Internship Programme
                  </button>
                </form>
              )}

              {/* Programmes Table */}
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Internship Programmes ({internships.length})
                </h2>
                {internships.length === 0 ? (
                  <p className="mt-3 text-xs text-[#292323]/65">No internship programmes created yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {internships.map((item) => (
                      <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#292323]/10 p-4 text-xs">
                        <div>
                          <p className="font-semibold text-sm text-[#292323]">{item.title}</p>
                          <p className="text-[#292323]/70">
                            {item.department} · {item.duration} · Deadline {item.deadline}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusLabel status={item.status} />
                          <select
                            value={item.status}
                            onChange={async (e) => {
                              await saveInternship(
                                {
                                  ...item,
                                  status: e.target.value as Internship['status'],
                                },
                                actor,
                              );
                              showToast('Internship Status Updated', 'success');
                            }}
                            className="rounded-lg border border-[#292323]/15 px-2.5 py-1 text-xs"
                          >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Applications Review */}
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Student Applications ({applications.length})
                </h2>
                {applications.length === 0 ? (
                  <p className="mt-3 text-xs text-[#292323]/65">No internship applications received yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="rounded-xl border border-[#292323]/10 p-5 text-xs">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#761D2D]">{app.internshipTitle}</p>
                            <h3 className="mt-0.5 text-sm font-bold text-[#292323]">
                              {app.studentName} ({app.studentEmail})
                            </h3>
                          </div>
                          <StatusLabel status={app.status} />
                        </div>
                        <p className="mt-2 leading-relaxed text-[#292323]/80">{app.statementOfPurpose}</p>
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block font-semibold text-[#761D2D] underline"
                          >
                            View Portfolio
                          </a>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#292323]/10 pt-3">
                          <input
                            type="text"
                            placeholder="Reviewer feedback..."
                            value={feedbackDrafts[app.id] ?? app.adminFeedback ?? ''}
                            onChange={(e) =>
                              setFeedbackDrafts((prev) => ({ ...prev, [app.id]: e.target.value }))
                            }
                            className="flex-1 min-w-[200px] rounded-lg border border-[#292323]/15 px-3 py-1.5 text-xs"
                          />
                          {(['Under Review', 'Accepted', 'Rejected', 'Completed'] as InternshipApplicationStatus[]).map(
                            (st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={async () => {
                                  await updateInternshipApplicationStatus(
                                    app,
                                    st,
                                    feedbackDrafts[app.id] || '',
                                    actor,
                                  );
                                  showToast(`Application ${st}`, 'success');
                                }}
                                className="rounded-lg border border-[#292323]/15 px-3 py-1.5 font-semibold hover:bg-[#761D2D] hover:text-white transition-colors"
                              >
                                {st}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. ASSIGNMENT EVALUATION */}
          {tab === 'evaluation' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Assignment Evaluation
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Review submitted student work, assign marks, and publish evaluator feedback.
                </p>
              </div>

              {submissions.length === 0 ? (
                <EmptyState
                  title="No Submissions to Evaluate"
                  description="Student assignment submissions will appear here once enrolled students submit their work."
                />
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="rounded-2xl border border-[#292323]/10 bg-white p-6 text-xs">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#761D2D]">{sub.assignmentTitle}</p>
                          <h2 className="mt-0.5 text-sm font-bold text-[#292323]">
                            {sub.studentName} ({sub.studentEmail})
                          </h2>
                          <p className="mt-0.5 text-[#292323]/60 tabular-nums">
                            Submitted {formatTimestamp(sub.submittedAt)}
                          </p>
                        </div>
                        <StatusLabel status={sub.status} />
                      </div>

                      {sub.notes && (
                        <p className="mt-3 rounded-lg bg-[#F8F4ED]/70 p-3 text-[#292323]/85">
                          {sub.notes}
                        </p>
                      )}
                      {sub.fileUrl && (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block font-semibold text-[#761D2D] underline"
                        >
                          Open Attached File ({sub.fileName || 'Document'})
                        </a>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#292323]/10 pt-4">
                        <input
                          type="number"
                          min={0}
                          max={1000}
                          placeholder="Marks"
                          value={evalMarks[sub.id] ?? (sub.marks !== undefined ? String(sub.marks) : '')}
                          onChange={(e) =>
                            setEvalMarks((prev) => ({ ...prev, [sub.id]: e.target.value }))
                          }
                          className="w-28 rounded-lg border border-[#292323]/15 px-3 py-2 text-xs tabular-nums"
                        />
                        <input
                          type="text"
                          placeholder="Written evaluator feedback..."
                          value={evalFeedback[sub.id] ?? sub.feedback ?? ''}
                          onChange={(e) =>
                            setEvalFeedback((prev) => ({ ...prev, [sub.id]: e.target.value }))
                          }
                          className="flex-1 min-w-[200px] rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const marksRaw = evalMarks[sub.id];
                            await evaluateAssignmentSubmission(
                              sub,
                              {
                                status: 'Evaluated',
                                marks: marksRaw !== undefined && marksRaw !== '' ? Number(marksRaw) : sub.marks,
                                feedback: evalFeedback[sub.id] ?? sub.feedback ?? '',
                              },
                              actor,
                            );
                            showToast('Submission Evaluated', 'success');
                          }}
                          className="rounded-lg bg-[#761D2D] px-4 py-2 font-semibold text-white hover:bg-[#8F2638]"
                        >
                          Save Evaluation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 9. CERTIFICATES */}
          {tab === 'certificates' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <form
                onSubmit={handleIssueCertificate}
                className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5"
              >
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Issue Certificate
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Select Student *</label>
                  <select
                    required
                    value={certStudentId}
                    onChange={(e) => setCertStudentId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  >
                    <option value="">Choose student...</option>
                    {students.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Programme Type</label>
                  <select
                    value={certProgramType}
                    onChange={(e) => {
                      setCertProgramType(e.target.value as 'Course' | 'Internship');
                      setCertProgramId('');
                    }}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  >
                    <option value="Course">Course</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Select Programme *</label>
                  <select
                    required
                    value={certProgramId}
                    onChange={(e) => setCertProgramId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  >
                    <option value="">Choose programme...</option>
                    {(certProgramType === 'Course' ? courses : internships).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={certDownloadAllowed}
                    onChange={(e) => setCertDownloadAllowed(e.target.checked)}
                    className="accent-[#761D2D]"
                  />
                  <span>Allow student PDF download</span>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  Issue Verifiable Certificate
                </button>
              </form>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Issued Certificates ({certificates.length})
                </h2>
                {certificates.length === 0 ? (
                  <p className="mt-4 text-xs text-[#292323]/65">No certificates issued yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#292323]/10 p-4 text-xs">
                        <div>
                          <p className="font-mono font-semibold text-[#761D2D]">{cert.certificateCode}</p>
                          <p className="mt-0.5 font-semibold text-[#292323]">
                            {cert.studentName} — {cert.programTitle}
                          </p>
                          <p className="text-[#292323]/60">
                            {cert.programType} · Issued {formatTimestamp(cert.issuedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusLabel status={cert.status} />
                          <button
                            type="button"
                            onClick={() =>
                              updateCertificateControl(
                                cert,
                                { downloadAllowed: !cert.downloadAllowed },
                                actor,
                              )
                            }
                            className="rounded-lg border border-[#292323]/15 px-2.5 py-1 font-semibold"
                          >
                            {cert.downloadAllowed ? 'PDF On' : 'PDF Off'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateCertificateControl(
                                cert,
                                { status: cert.status === 'Valid' ? 'Revoked' : 'Valid' },
                                actor,
                              )
                            }
                            className="rounded-lg border border-[#B4434D]/40 px-2.5 py-1 font-semibold text-[#B4434D]"
                          >
                            {cert.status === 'Valid' ? 'Revoke' : 'Restore'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 10. NOTIFICATIONS & SUPPORT TICKETS */}
          {tab === 'notifications' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-5">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!notifStudentId) return;
                    await createNotification({
                      recipientId: notifStudentId,
                      recipientRole: 'student',
                      title: notifTitle,
                      message: notifMessage,
                      type: 'system',
                      linkPath: '/dashboard',
                    });
                    setNotifTitle('');
                    setNotifMessage('');
                    showToast('Notification Sent to Student', 'success');
                  }}
                  className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6"
                >
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Send Student Notification
                  </h2>
                  <select
                    required
                    value={notifStudentId}
                    onChange={(e) => setNotifStudentId(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  >
                    <option value="">Select recipient student...</option>
                    {students.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName} ({s.email})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    placeholder="Notification Title"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                  <textarea
                    required
                    rows={3}
                    maxLength={600}
                    placeholder="Notification message..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full rounded-lg border border-[#292323]/15 p-3 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Send Notification
                  </button>
                </form>

                {/* Support Tickets Queue */}
                <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 space-y-3">
                  <h2 className="font-display text-2xl font-semibold text-[#292323]">
                    Support Inquiries ({tickets.length})
                  </h2>
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-xl border border-[#292323]/10 p-4 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#292323]">{t.subject}</span>
                        <StatusLabel status={t.status} />
                      </div>
                      <p className="text-[#292323]/70">{t.name} ({t.email})</p>
                      <p className="text-[#292323]/85">{t.message}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Reply..."
                          value={feedbackDrafts[t.id] ?? t.adminReply ?? ''}
                          onChange={(e) =>
                            setFeedbackDrafts((prev) => ({ ...prev, [t.id]: e.target.value }))
                          }
                          className="flex-1 rounded-lg border border-[#292323]/15 px-2.5 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await replySupportTicket(t, 'Resolved', feedbackDrafts[t.id] || '', actor);
                            showToast('Ticket Resolved', 'success');
                          }}
                          className="rounded-lg bg-[#761D2D] px-3 py-1.5 font-semibold text-white"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Admin Alerts ({notifications.length})
                </h2>
                {notifications.length === 0 ? (
                  <p className="mt-4 text-xs text-[#292323]/65">No admin notifications.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start justify-between gap-3 rounded-xl border border-[#292323]/10 p-4 text-xs">
                        <div>
                          <p className="font-semibold text-[#292323]">
                            {n.title} {!n.read && <span className="text-[#761D2D]">· New</span>}
                          </p>
                          <p className="mt-1 text-[#292323]/75">{n.message}</p>
                          <p className="mt-1 text-[#292323]/55 tabular-nums">{formatTimestamp(n.createdAt)}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {!n.read && (
                            <button
                              type="button"
                              onClick={() => markNotificationRead(n.id)}
                              className="font-semibold text-[#761D2D]"
                            >
                              Read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteNotification(n.id)}
                            className="text-[#292323]/55 hover:text-[#B4434D]"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. REPORTS & ANALYTICS */}
          {tab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Reports & Analytics
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Live course enrollment distribution, completion averages, and assessment outcomes.
                </p>
              </div>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Course Enrollment & Completion Matrix
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                      <tr>
                        <th className="py-2.5 pr-4 font-semibold">Course</th>
                        <th className="py-2.5 pr-4 font-semibold">Status</th>
                        <th className="py-2.5 pr-4 font-semibold">Active Students</th>
                        <th className="py-2.5 pr-4 font-semibold">Pending Requests</th>
                        <th className="py-2.5 font-semibold">Avg Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292323]/8">
                      {courses.map((c) => {
                        const activeEnr = enrollments.filter((e) => e.courseId === c.id && e.status === 'active');
                        const pend = enrollmentRequests.filter((r) => r.courseId === c.id && r.status === 'Pending');
                        const avg =
                          activeEnr.length > 0
                            ? Math.round(activeEnr.reduce((a, b) => a + b.progressPercent, 0) / activeEnr.length)
                            : 0;
                        return (
                          <tr key={c.id}>
                            <td className="py-3 pr-4 font-semibold text-[#292323]">{c.title}</td>
                            <td className="py-3 pr-4"><StatusLabel status={c.status} /></td>
                            <td className="py-3 pr-4 font-mono tabular-nums">{activeEnr.length}</td>
                            <td className="py-3 pr-4 font-mono tabular-nums">{pend.length}</td>
                            <td className="py-3 font-mono tabular-nums text-[#761D2D]">{avg}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quiz Attempts & Weak Topics Analytics */}
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Student Quiz &amp; Practice Assessment Analytics ({quizAttempts.length})
                    </h2>
                    <p className="mt-0.5 text-xs text-[#292323]/65">
                      Recent official quiz submissions and AI Tutor practice test scores with flagged weak topics.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void fetchAllQuizAttemptsAdmin().then(setQuizAttempts)}
                    className="rounded-lg border border-[#292323]/15 px-3 py-1.5 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                  >
                    Refresh Quiz Results
                  </button>
                </div>

                {quizAttempts.length === 0 ? (
                  <p className="mt-4 text-xs text-[#292323]/65">
                    No student quiz or practice test attempts recorded yet.
                  </p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                        <tr>
                          <th className="py-2.5 pr-4 font-semibold">Student</th>
                          <th className="py-2.5 pr-4 font-semibold">Quiz / Assessment</th>
                          <th className="py-2.5 pr-4 font-semibold">Source</th>
                          <th className="py-2.5 pr-4 font-semibold">Score</th>
                          <th className="py-2.5 pr-4 font-semibold">Flagged Weak Topics</th>
                          <th className="py-2.5 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#292323]/8">
                        {quizAttempts.slice(0, 50).map((att) => (
                          <tr key={att.id}>
                            <td className="py-3 pr-4">
                              <p className="font-semibold text-[#292323]">{att.studentName}</p>
                              <p className="text-[#292323]/60">{att.studentEmail}</p>
                            </td>
                            <td className="py-3 pr-4 font-semibold text-[#292323]">{att.quizTitle}</td>
                            <td className="py-3 pr-4 text-[#292323]/75">
                              {att.source === 'ai_practice' ? 'AI Practice Test' : 'Official Quiz'}
                            </td>
                            <td className="py-3 pr-4 font-mono font-bold tabular-nums text-[#761D2D]">
                              {att.scorePercent}% ({att.correctCount}/{att.totalQuestions})
                            </td>
                            <td className="py-3 pr-4 text-[#292323]/80">
                              {att.weakTopics.length > 0 ? att.weakTopics.join(', ') : 'None flagged'}
                            </td>
                            <td className="py-3 font-mono tabular-nums text-[#292323]/60">
                              {formatTimestamp(att.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 12. WEBSITE CONTENT CMS */}
          {tab === 'cms' && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveWebsiteContent(
                  {
                    heroHeadline: cmsHeadline,
                    heroSubtext: cmsSubtext,
                    welcomeTitle: cmsWelcomeTitle,
                    welcomeBody: cmsWelcomeBody,
                    announcementBanner: cmsBanner,
                    contactEmail: cmsEmail,
                    contactPhone: cmsPhone,
                    officeLocation: cmsOffice,
                  },
                  actor,
                );
                showToast('Website Content Published', 'success');
              }}
              className="max-w-3xl space-y-5 rounded-2xl border border-[#292323]/10 bg-white p-6 sm:p-8"
            >
              <div>
                <h1 className="font-display text-3xl font-bold text-[#292323]">
                  Website Content Management
                </h1>
                <p className="mt-1 text-sm text-[#292323]/70">
                  Update public homepage text, announcements, and official contact details live.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Hero Headline</label>
                <input
                  type="text"
                  maxLength={180}
                  value={cmsHeadline}
                  onChange={(e) => setCmsHeadline(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Hero Supporting Text</label>
                <textarea
                  rows={2}
                  maxLength={600}
                  value={cmsSubtext}
                  onChange={(e) => setCmsSubtext(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Welcome Section Title</label>
                <input
                  type="text"
                  maxLength={160}
                  value={cmsWelcomeTitle}
                  onChange={(e) => setCmsWelcomeTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Welcome Section Body</label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={cmsWelcomeBody}
                  onChange={(e) => setCmsWelcomeBody(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Announcement Banner (Leave empty to hide)
                </label>
                <input
                  type="text"
                  maxLength={400}
                  value={cmsBanner}
                  onChange={(e) => setCmsBanner(e.target.value)}
                  placeholder="e.g. Admissions open for Winter Cohort 2026"
                  className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3.5 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Contact Email</label>
                  <input
                    type="email"
                    maxLength={160}
                    value={cmsEmail}
                    onChange={(e) => setCmsEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Contact Phone</label>
                  <input
                    type="text"
                    maxLength={40}
                    value={cmsPhone}
                    onChange={(e) => setCmsPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Office Location</label>
                  <input
                    type="text"
                    maxLength={240}
                    value={cmsOffice}
                    onChange={(e) => setCmsOffice(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-[#761D2D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638]"
              >
                Save & Publish Content
              </button>
            </form>
          )}

          {/* 13. SETTINGS & ADMIN PROVISIONING */}
          {tab === 'settings' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await provisionAdminUser(
                    { uid: newAdminUid, email: newAdminEmail, fullName: newAdminName },
                    actor,
                  );
                  setNewAdminUid('');
                  setNewAdminEmail('');
                  setNewAdminName('');
                  void fetchAllAdmins().then(setAdmins);
                  showToast('Administrator Provisioned', 'success');
                }}
                className="space-y-4 rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-5"
              >
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Provision Administrator
                </h2>
                <p className="text-xs leading-relaxed text-[#292323]/75">
                  Only verified existing administrators can grant administrative access by adding a verified Firebase Authentication UID to the trusted <span className="font-mono">/admins</span> registry.
                </p>
                <input
                  type="text"
                  required
                  placeholder="Firebase Auth UID"
                  value={newAdminUid}
                  onChange={(e) => setNewAdminUid(e.target.value)}
                  className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 font-mono text-xs"
                />
                <input
                  type="email"
                  required
                  placeholder="Admin Email Address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full rounded-lg border border-[#292323]/15 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#761D2D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8F2638]"
                >
                  Grant Admin Access
                </button>
              </form>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6 lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Authorized Administrators
                </h2>
                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border border-[#D5B77A]/50 bg-[#F8F4ED]/60 p-4">
                    <p className="font-semibold text-[#761D2D]">Root Bootstrap Administrator</p>
                    <p className="mt-1 font-mono text-[#292323]">ranimuthuraj7409@gmail.com (Email Verified Required)</p>
                  </div>
                  {admins.map((a) => (
                    <div key={a.uid} className="flex items-center justify-between rounded-xl border border-[#292323]/10 p-4">
                      <div>
                        <p className="font-semibold text-[#292323]">{a.fullName}</p>
                        <p className="text-[#292323]/70">{a.email} · <span className="font-mono">{a.uid}</span></p>
                      </div>
                      {a.uid !== user.uid && (
                        <button
                          type="button"
                          onClick={async () => {
                            await removeAdminUser(a.uid, actor);
                            void fetchAllAdmins().then(setAdmins);
                            showToast('Admin Removed', 'info');
                          }}
                          className="font-semibold text-[#B4434D] hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 14. ADMIN PROFILE & AUDIT LOGS */}
          {tab === 'profile' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h1 className="font-display text-3xl font-bold text-[#292323]">Admin Profile</h1>
                <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#292323]/60">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#292323]/60">Firebase UID</p>
                    <p className="font-mono text-xs">{user.uid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#292323]/60">Verification</p>
                    <StatusLabel status={user.emailVerified ? 'Verified' : 'Unverified'} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Immutable Audit Trail ({auditLogs.length})
                </h2>
                {auditLogs.length === 0 ? (
                  <p className="mt-3 text-xs text-[#292323]/65">No administrative logs recorded yet.</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#292323]/10 text-[#292323]/60">
                        <tr>
                          <th className="py-2 pr-4 font-semibold">Date</th>
                          <th className="py-2 pr-4 font-semibold">Actor</th>
                          <th className="py-2 pr-4 font-semibold">Action</th>
                          <th className="py-2 font-semibold">Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#292323]/8">
                        {auditLogs.slice(0, 40).map((log) => (
                          <tr key={log.id}>
                            <td className="py-2.5 pr-4 font-mono tabular-nums text-[#292323]/65">
                              {formatTimestamp(log.createdAt)}
                            </td>
                            <td className="py-2.5 pr-4">{log.actorEmail}</td>
                            <td className="py-2.5 pr-4 font-semibold text-[#292323]">{log.action}</td>
                            <td className="py-2.5 text-[#292323]/75">{log.details || log.targetId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Inspect Student Modal */}
      {inspectStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-2xl border border-[#292323]/15 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#292323]">
                  {inspectStudent.fullName}
                </h3>
                <p className="text-xs text-[#292323]/65">{inspectStudent.email}</p>
              </div>
              <StatusLabel status={inspectStudent.accountStatus} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-b border-[#292323]/10 py-4 text-xs">
              <div><span className="text-[#292323]/60">Mobile:</span> {inspectStudent.mobile}</div>
              <div><span className="text-[#292323]/60">City:</span> {inspectStudent.city}</div>
              <div><span className="text-[#292323]/60">Qualification:</span> {inspectStudent.qualification}</div>
              <div><span className="text-[#292323]/60">Institution:</span> {inspectStudent.institution || '—'}</div>
              <div className="col-span-2">
                <span className="text-[#292323]/60">Legal Acceptance:</span> Terms {inspectStudent.termsVersion} & Conduct {inspectStudent.conductVersion} ({formatTimestamp(inspectStudent.acceptedAt)})
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#761D2D] uppercase">Enrollment History</h4>
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-xs">
                {enrollmentRequests.filter((r) => r.studentId === inspectStudent.uid).length === 0 ? (
                  <p className="text-[#292323]/65">No enrollment requests yet.</p>
                ) : (
                  enrollmentRequests
                    .filter((r) => r.studentId === inspectStudent.uid)
                    .map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-lg bg-[#F8F4ED]/70 px-3 py-2">
                        <span>{r.courseTitle}</span>
                        <StatusLabel status={r.status} />
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
