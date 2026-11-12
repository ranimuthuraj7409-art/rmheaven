import React, { useState } from 'react';
import { 
  Course, 
  StudentProfile, 
  EnrollmentRequest, 
  PdfDocument, 
  Assignment, 
  AssignmentSubmission, 
  Internship, 
  InternshipApplication, 
  Announcement, 
  WebsiteCMS, 
  PolicyDocument, 
  NavigationTab 
} from '../types';
import { exportApplicationsToCSV } from '../utils/csvExport';
import { BrandLogo } from './BrandLogo';
import { 
  ShieldCheck, 
  PlusCircle, 
  Download, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Unlock, 
  Users, 
  BookOpen, 
  FileText, 
  Upload, 
  Briefcase, 
  Bell, 
  Settings, 
  Save, 
  X, 
  Eye, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardViewProps {
  cms: WebsiteCMS;
  onUpdateCMS: (updated: WebsiteCMS) => void;
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  students: StudentProfile[];
  onUpdateStudentStatus: (studentId: string, status: StudentProfile['status']) => void;
  enrollmentRequests: EnrollmentRequest[];
  onApproveEnrollment: (requestId: string, studentId: string, coursesToApprove: string[]) => void;
  onRejectEnrollment: (requestId: string, notes?: string) => void;
  pdfDocuments: PdfDocument[];
  onAddPdfDocument: (doc: PdfDocument) => void;
  onDeletePdfDocument: (id: string) => void;
  assignments: Assignment[];
  onAddAssignment: (asg: Assignment) => void;
  assignmentSubmissions: AssignmentSubmission[];
  onGradeAssignment: (submissionId: string, grade: string, points: number, feedback: string) => void;
  internships: Internship[];
  onAddInternship: (internship: Internship) => void;
  onDeleteInternship: (id: string) => void;
  internshipApplications: InternshipApplication[];
  onUpdateInternshipAppStatus: (appId: string, status: InternshipApplication['status'], feedback?: string) => void;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  policies: PolicyDocument[];
  onUpdatePolicy: (policyId: 'terms' | 'discipline' | 'privacy', newContent: string, newVersion: string, summary: string) => void;
  onSelectTab: (tab: NavigationTab) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  cms,
  onUpdateCMS,
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  students,
  onUpdateStudentStatus,
  enrollmentRequests,
  onApproveEnrollment,
  onRejectEnrollment,
  pdfDocuments,
  onAddPdfDocument,
  onDeletePdfDocument,
  assignments,
  onAddAssignment,
  assignmentSubmissions,
  onGradeAssignment,
  internships,
  onAddInternship,
  onDeleteInternship,
  internshipApplications,
  onUpdateInternshipAppStatus,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  policies,
  onUpdatePolicy,
  onSelectTab
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'students' | 'courses' | 'notes' | 'assignments' | 'internships' | 'announcements' | 'cms' | 'policies'>('overview');

  // CMS state for editing
  const [cmsDraft, setCmsDraft] = useState<WebsiteCMS>(cms);
  const [cmsSaveToast, setCmsSaveToast] = useState(false);

  // Policy editing state
  const [selectedPolicyId, setSelectedPolicyId] = useState<'terms' | 'discipline' | 'privacy'>('terms');
  const [policyContentDraft, setPolicyContentDraft] = useState('');
  const [policyVersionDraft, setPolicyVersionDraft] = useState('');
  const [policySummaryDraft, setPolicySummaryDraft] = useState('');
  const [policySaveToast, setPolicySaveToast] = useState(false);

  // New PDF modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('3.2 MB');
  const [pdfCourseId, setPdfCourseId] = useState('course-coding');
  const [pdfDesc, setPdfDesc] = useState('');

  // Grade modal
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeValue, setGradeValue] = useState('A+ (Distinction)');
  const [pointsValue, setPointsValue] = useState(95);
  const [feedbackValue, setFeedbackValue] = useState('');

  // New Internship modal
  const [isInternModalOpen, setIsInternModalOpen] = useState(false);
  const [intTitle, setIntTitle] = useState('');
  const [intDept, setIntDept] = useState('Software Engineering Laboratory');
  const [intDesc, setIntDesc] = useState('');
  const [intSkills, setIntSkills] = useState('TypeScript, Node.js, React');
  const [intDuration, setIntDuration] = useState('12 Weeks');
  const [intMode, setIntMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [intDeadline, setIntDeadline] = useState('2026-06-30');
  const [intPositions, setIntPositions] = useState(5);

  // Search & filter students
  const [studentSearch, setStudentSearch] = useState('');

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCMS(cmsDraft);
    setCmsSaveToast(true);
    setTimeout(() => setCmsSaveToast(false), 2000);
  };

  const handleOpenPolicyEditor = (id: 'terms' | 'discipline' | 'privacy') => {
    setSelectedPolicyId(id);
    const p = policies.find(x => x.id === id);
    if (p) {
      setPolicyContentDraft(p.content);
      setPolicyVersionDraft(p.version);
      setPolicySummaryDraft('');
    }
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyContentDraft.trim() || !policyVersionDraft.trim()) return;

    onUpdatePolicy(
      selectedPolicyId,
      policyContentDraft,
      policyVersionDraft,
      policySummaryDraft.trim() || 'Administrative policy content update'
    );
    setPolicySaveToast(true);
    setTimeout(() => setPolicySaveToast(false), 2000);
  };

  const handleCreatePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim() || !pdfFileName.trim()) return;

    const newDoc: PdfDocument = {
      id: `pdf-${Date.now().toString().slice(-4)}`,
      title: pdfTitle.trim(),
      fileName: pdfFileName.trim(),
      fileSize: pdfFileSize,
      uploadDate: new Date().toISOString().slice(0, 10),
      downloadUrl: `/assets/documents/${pdfFileName.trim()}`,
      published: true,
      courseId: pdfCourseId,
      moduleId: 'mod-c1',
      description: pdfDesc.trim() || 'Official study handbook and reference documentation.'
    };

    onAddPdfDocument(newDoc);
    setIsPdfModalOpen(false);
    setPdfTitle('');
    setPdfFileName('');
    setPdfDesc('');
  };

  const handleCreateInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle.trim() || !intDesc.trim()) return;

    const newInt: Internship = {
      id: `int-${Date.now().toString().slice(-4)}`,
      title: intTitle.trim(),
      department: intDept.trim(),
      description: intDesc.trim(),
      skills: intSkills.split(',').map(s => s.trim()).filter(Boolean),
      eligibility: 'Open to enrolled students with relevant prerequisite coursework completed.',
      duration: intDuration,
      workMode: intMode,
      deadline: intDeadline,
      availablePositions: intPositions,
      applicationInstructions: 'Submit updated academic resume and statement of intent.',
      published: true
    };

    onAddInternship(newInt);
    setIsInternModalOpen(false);
    setIntTitle('');
    setIntDesc('');
  };

  const handleConfirmGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingSubmission) {
      onGradeAssignment(gradingSubmission.id, gradeValue, pointsValue, feedbackValue.trim());
      setGradingSubmission(null);
    }
  };

  const pendingRequests = enrollmentRequests.filter(r => r.status === 'Pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FCFAF8] text-[#393333]">
      
      {/* Top Banner */}
      <div className="bg-[#702D3D] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-[#800020]">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-1.5 bg-white rounded-2xl border border-[#D6B878] shrink-0 hidden sm:block shadow-sm">
            <BrandLogo variant="emblem" size="md" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D6B878]" />
              <span className="text-xs uppercase tracking-widest text-[#D6B878] font-bold">
                {cms.brandName} Owner Console & CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Platform Administration Console
            </h1>
            <p className="text-xs text-white/80 max-w-xl">
              Control dynamic homepage content, approve student course access, manage protected study notes & PDFs, evaluate assignments, and publish policy amendments.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportApplicationsToCSV(internshipApplications)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-[#702D3D] rounded-xl hover:bg-[#F8F3EE] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-[#800020]" />
            <span>Export Applications CSV</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('enrollments');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#D6B878] text-[#393333] rounded-xl hover:bg-[#E8D4A6] transition-colors shadow-xs"
          >
            <span>Review Pending Requests ({pendingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#EAE1DD] rounded-xl overflow-x-auto shadow-2xs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'enrollments', label: `Enrollment Approvals (${pendingRequests.length})` },
          { id: 'students', label: `Students (${students.length})` },
          { id: 'courses', label: `Course Management (${courses.length})` },
          { id: 'notes', label: `Study Notes & PDFs (${pdfDocuments.length})` },
          { id: 'assignments', label: `Assignments (${assignmentSubmissions.length})` },
          { id: 'internships', label: `Internships (${internships.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'cms', label: 'Website CMS' },
          { id: 'policies', label: 'Governance & Policies' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'policies') {
                handleOpenPolicyEditor('terms');
              }
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#800020] text-white font-bold shadow-xs'
                : 'text-[#817779] hover:bg-[#F8F3EE] hover:text-[#393333]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#EAE1DD] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#817779] block">Total Registered Students</span>
              <span className="text-3xl font-bold font-heading text-[#393333] mt-1 block">{students.length}</span>
              <span className="text-[10px] text-emerald-800">Individual accounts verified</span>
            </div>

            <div className="bg-white border border-[#EAE1DD] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#817779] block">Pending Enrollments</span>
              <span className="text-3xl font-bold font-heading text-[#800020] mt-1 block">{pendingRequests.length}</span>
              <span className="text-[10px] text-[#817779]">Awaiting Owner review</span>
            </div>

            <div className="bg-white border border-[#EAE1DD] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#817779] block">Active Courses</span>
              <span className="text-3xl font-bold font-heading text-[#702D3D] mt-1 block">{courses.length}</span>
              <span className="text-[10px] text-[#817779]">Coding & Digital Marketing</span>
            </div>

            <div className="bg-white border border-[#EAE1DD] rounded-xl p-5 shadow-2xs">
              <span className="text-[11px] font-semibold text-[#817779] block">Platform Brand Name</span>
              <span className="text-sm font-bold text-[#393333] font-mono mt-2 block truncate">
                {cms.brandName}
              </span>
              <span className="text-[10px] text-[#702D3D]">Editable in Website CMS</span>
            </div>
          </div>

          {/* Quick Approvals Action Box */}
          <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE1DD]">
              <h3 className="text-base font-bold text-[#393333]">
                Pending Course Enrollment Requests ({pendingRequests.length})
              </h3>
              <button
                onClick={() => setActiveTab('enrollments')}
                className="text-xs font-semibold text-[#800020] hover:underline"
              >
                View Full Queue →
              </button>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#817779]">
                All enrollment requests have been evaluated. No pending items.
              </div>
            ) : (
              <div className="divide-y divide-[#EAE1DD] text-xs">
                {pendingRequests.map(req => (
                  <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-[#393333]">{req.studentName} ({req.studentCollege})</div>
                      <div className="text-[11px] text-[#817779]">
                        Requested: <strong className="text-[#800020]">{req.requestedCourses.join(', ')}</strong> · Submitted {req.requestDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveEnrollment(req.id, req.studentId, req.requestedCourses)}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#800020] text-white rounded-lg hover:bg-[#630018]"
                      >
                        Approve Access
                      </button>
                      <button
                        onClick={() => onRejectEnrollment(req.id, 'Prerequisites incomplete')}
                        className="px-3 py-1.5 text-xs font-medium text-[#817779] hover:bg-[#F8F3EE] rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ENROLLMENT APPROVALS QUEUE */}
      {activeTab === 'enrollments' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#393333]">
              Student Course Enrollment Approval Queue
            </h2>
            <p className="text-xs text-[#817779] mt-0.5">
              Review and grant access to Coding, Digital Marketing, or Both Courses. Approved students immediately unlock protected course study notes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F3EE] border-b border-[#EAE1DD] text-[#702D3D] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">Student Name & College</th>
                  <th className="py-3 px-3">Requested Courses</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Owner Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1DD]">
                {enrollmentRequests.map(req => (
                  <tr key={req.id} className="hover:bg-[#FCFAF8]">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#393333]">{req.studentName}</div>
                      <div className="text-[11px] text-[#817779]">{req.studentEmail} · {req.studentCollege}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#800020] bg-[#F8F3EE] px-2 py-0.5 rounded border border-[#EAE1DD]">
                        {req.requestedCourses.join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#817779]">{req.requestDate}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => onApproveEnrollment(req.id, req.studentId, req.requestedCourses)}
                            className="px-3 py-1 font-semibold bg-[#800020] text-white rounded hover:bg-[#630018]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRejectEnrollment(req.id)}
                            className="px-2.5 py-1 text-red-700 hover:underline"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-[#817779] italic">Evaluated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. STUDENTS MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Registered Student Accounts ({students.length})
              </h2>
              <p className="text-xs text-[#817779]">
                View student academic dossiers, enrolled courses, and manage account status.
              </p>
            </div>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#817779]" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or college..."
                className="w-full pl-8 pr-3 py-1.5 border border-[#EAE1DD] rounded-lg text-xs bg-[#FCFAF8]"
              />
            </div>
          </div>

          <div className="space-y-3">
            {students
              .filter(s => !studentSearch || s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || s.college.toLowerCase().includes(studentSearch.toLowerCase()))
              .map(student => (
                <div key={student.id} className="p-4 border border-[#EAE1DD] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#393333]">{student.fullName}</span>
                      <span className="font-mono text-[10px] text-[#800020] bg-[#F8F3EE] px-1.5 py-0.5 rounded border border-[#EAE1DD]">
                        {student.id}
                      </span>
                    </div>
                    <p className="text-[#817779] mt-0.5">
                      {student.college} · {student.department} ({student.academicYear})
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#702D3D]">
                      <span>Enrolled: <strong>{student.enrolledCourses.join(', ') || 'None'}</strong></span>
                      <span>·</span>
                      <span>Pending: <strong>{student.pendingCourseRequests.join(', ') || 'None'}</strong></span>
                      <span>·</span>
                      <span className="font-mono">Agreed: {student.agreedTermsVersion}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {student.status === 'Active' ? (
                      <button
                        onClick={() => onUpdateStudentStatus(student.id, 'Suspended')}
                        className="px-3 py-1 font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStudentStatus(student.id, 'Active')}
                        className="px-3 py-1 font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Course Curriculum & Modules Management
              </h2>
              <p className="text-xs text-[#817779]">
                Dynamic course offerings, module listings, and study note structures.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="p-6 border border-[#EAE1DD] rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE1DD]">
                  <div>
                    <span className="text-[10px] font-bold text-[#800020] uppercase">{course.category}</span>
                    <h3 className="text-base font-bold text-[#393333]">{course.title}</h3>
                  </div>
                  <span className="text-xs text-[#702D3D] font-mono">{course.modules.length} Modules</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#393333]">Module Outlines:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#817779]">
                    {course.modules.map(m => (
                      <div key={m.id} className="p-2.5 bg-[#FCFAF8] border border-[#EAE1DD] rounded-lg">
                        <span className="font-semibold text-[#393333] block">{m.title}</span>
                        <span className="text-[11px]">{m.lessons.length} Lesson(s) with Original Study Notes</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. NOTES & PDF UPLOADS */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Protected Study Notes & PDF Handbooks Manager
              </h2>
              <p className="text-xs text-[#817779]">
                Upload, manage, and distribute course-specific master manuals to approved students.
              </p>
            </div>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#800020] text-white rounded-xl hover:bg-[#630018]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New PDF</span>
            </button>
          </div>

          <div className="space-y-3">
            {pdfDocuments.map(doc => (
              <div key={doc.id} className="p-4 border border-[#EAE1DD] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-[#D6B878] shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#393333] text-sm">{doc.title}</h4>
                    <p className="text-[#817779] text-[11px] font-mono">{doc.fileName} · {doc.fileSize} · Uploaded {doc.uploadDate}</p>
                    <p className="text-[#817779] mt-1">{doc.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePdfDocument(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ASSIGNMENTS EVALUATION */}
      {activeTab === 'assignments' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#393333]">
              Assignment Submissions & Code Defense Reviews
            </h2>
            <p className="text-xs text-[#817779]">
              Evaluate student repos, assign academic distinction grades, and deliver qualitative feedback.
            </p>
          </div>

          <div className="space-y-4">
            {assignmentSubmissions.map(sub => (
              <div key={sub.id} className="p-5 border border-[#EAE1DD] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
                  <div>
                    <span className="font-bold text-[#393333] text-sm">{sub.assignmentTitle}</span>
                    <span className="text-[#817779] block">Student: <strong>{sub.studentName}</strong> ({sub.studentEmail})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {sub.status}
                    </span>
                    {sub.grade && (
                      <span className="font-bold text-[#702D3D] bg-[#EAD5D8] px-2 py-0.5 rounded">
                        Grade: {sub.grade} ({sub.pointsScored}/100)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[#393333] bg-[#FCFAF8] p-3 rounded border border-[#EAE1DD]">
                  {sub.submissionText}
                </p>

                {sub.attachedRepoUrl && (
                  <div>
                    <a
                      href={sub.attachedRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#800020] hover:underline font-mono"
                    >
                      Repository: {sub.attachedRepoUrl}
                    </a>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setGradingSubmission(sub);
                      setGradeValue(sub.grade || 'A+ (Distinction)');
                      setPointsValue(sub.pointsScored || 95);
                      setFeedbackValue(sub.mentorFeedback || 'Well executed solution.');
                    }}
                    className="px-4 py-1.5 font-semibold bg-[#702D3D] text-white rounded-lg hover:bg-[#800020]"
                  >
                    Grade & Leave Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. INTERNSHIPS MANAGEMENT */}
      {activeTab === 'internships' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Internship & Fellowship Listings Manager
              </h2>
              <p className="text-xs text-[#817779]">
                Publish and manage industry-aligned internship opportunities.
              </p>
            </div>
            <button
              onClick={() => setIsInternModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#800020] text-white rounded-xl hover:bg-[#630018]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish New Internship</span>
            </button>
          </div>

          <div className="space-y-3">
            {internships.map(item => (
              <div key={item.id} className="p-4 border border-[#EAE1DD] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#393333] text-sm">{item.title}</h4>
                  <p className="text-[#817779]">{item.department} · {item.duration} · {item.workMode} · Deadline: {item.deadline}</p>
                </div>
                <button
                  onClick={() => onDeleteInternship(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-lg font-bold font-heading text-[#393333]">
            Official Announcements Bulletin
          </h2>
          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 border border-[#EAE1DD] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#800020]">{ann.category} Notice · {ann.publishedDate}</span>
                  <h4 className="font-bold text-[#393333] text-sm mt-0.5">{ann.title}</h4>
                  <p className="text-[#817779] mt-1">{ann.content}</p>
                </div>
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. DYNAMIC WEBSITE CMS (CRITICAL REQUIREMENT) */}
      {activeTab === 'cms' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#393333]">
              Dynamic Website Content Management System (CMS)
            </h2>
            <p className="text-xs text-[#817779] mt-0.5">
              Edit homepage headlines, descriptions, platform brand name, mascot placement, and institutional copy without modifying code. Changes reflect instantly on the public website.
            </p>
          </div>

          {cmsSaveToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Website Content Updated & Published to Live Database!</span>
            </div>
          )}

          <form onSubmit={handleSaveCMS} className="space-y-6 text-xs text-[#393333]">
            {/* Official Brand Identity & Logo */}
            <div className="p-4 bg-white rounded-xl border-2 border-[#D6B878]/60 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EAE1DD] pb-3">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#800020]">
                    Official Platform Brand & Emblem Logo
                  </h3>
                  <p className="text-[11px] text-[#817779]">
                    Official brand identity and crest asset configuration
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#702D3D] bg-[#EAD5D8]/50 px-2 py-0.5 rounded border border-[#702D3D]/20">
                  Active Brand: RM Heaven
                </span>
              </div>

              {/* Logo Emblem Preview Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#FCFAF8] rounded-xl border border-[#EAE1DD]">
                <div className="p-2 bg-white rounded-xl border border-[#D6B878] shadow-xs shrink-0">
                  <BrandLogo variant="emblem" size="lg" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-heading font-extrabold text-base text-[#393333] block">
                    {cmsDraft.brandName || 'RM Heaven'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#800020] block">
                    Official Gold Regal Crest Logo
                  </span>
                  <p className="text-[11px] text-[#817779]">
                    Displayed across the top navigation bar, footer, student admission portal, and certificates.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs uppercase text-[#800020] mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={cmsDraft.brandName}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, brandName: e.target.value })}
                  placeholder="RM Heaven"
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-white font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-[#800020]"
                  required
                />
                <span className="text-[11px] text-[#817779] block mt-1">
                  Updates to the brand name immediately sync to the Navbar, Hero, Course Catalogs, Policies, and Footer across the entire site.
                </span>
              </div>
            </div>

            {/* Hero Section Headlines */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-1">
                Homepage Hero Section
              </h3>
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={cmsDraft.heroHeadline}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Hero Supporting Text</label>
                <textarea
                  rows={2}
                  value={cmsDraft.heroSubtext}
                  onChange={(e) => setCmsDraft({ ...cmsDraft, heroSubtext: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  required
                />
              </div>
            </div>

            {/* Mascot Placement Settings */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-1">
                Official Lion Mascot Placement Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsDraft.mascotSettings.visibleInHero}
                    onChange={(e) => setCmsDraft({
                      ...cmsDraft,
                      mascotSettings: { ...cmsDraft.mascotSettings, visibleInHero: e.target.checked }
                    })}
                    className="accent-[#800020]"
                  />
                  <span>Show Mascot in Hero Section</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsDraft.mascotSettings.visibleInDashboard}
                    onChange={(e) => setCmsDraft({
                      ...cmsDraft,
                      mascotSettings: { ...cmsDraft.mascotSettings, visibleInDashboard: e.target.checked }
                    })}
                    className="accent-[#800020]"
                  />
                  <span>Show Mascot in Student Dashboard</span>
                </label>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#702D3D] border-b border-[#EAE1DD] pb-1">
                Welcome & Institutional Introduction
              </h3>
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Section Heading</label>
                <input
                  type="text"
                  value={cmsDraft.welcomeSection.heading}
                  onChange={(e) => setCmsDraft({
                    ...cmsDraft,
                    welcomeSection: { ...cmsDraft.welcomeSection, heading: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={cmsDraft.welcomeSection.mission}
                    onChange={(e) => setCmsDraft({
                      ...cmsDraft,
                      welcomeSection: { ...cmsDraft.welcomeSection, mission: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Teaching Approach</label>
                  <textarea
                    rows={3}
                    value={cmsDraft.welcomeSection.teachingApproach}
                    onChange={(e) => setCmsDraft({
                      ...cmsDraft,
                      welcomeSection: { ...cmsDraft.welcomeSection, teachingApproach: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Learning Opportunities</label>
                  <textarea
                    rows={3}
                    value={cmsDraft.welcomeSection.learningOpportunities}
                    onChange={(e) => setCmsDraft({
                      ...cmsDraft,
                      welcomeSection: { ...cmsDraft.welcomeSection, learningOpportunities: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EAE1DD] flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 font-semibold text-xs bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish All CMS Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 10. POLICIES & GOVERNANCE CMS */}
      {activeTab === 'policies' && (
        <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading text-[#393333]">
              Terms, Discipline & Privacy Policy Management
            </h2>
            <p className="text-xs text-[#817779] mt-0.5">
              Edit the live policy documents, bump compliance version tags, and view the audit changelog.
            </p>
          </div>

          {policySaveToast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Policy Updated, Version Bumped & Saved to Audit Trail!</span>
            </div>
          )}

          <div className="flex gap-2">
            {[
              { id: 'terms', label: 'Terms & Conditions' },
              { id: 'discipline', label: 'Student Discipline Policy' },
              { id: 'privacy', label: 'Privacy Policy' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => handleOpenPolicyEditor(p.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  selectedPolicyId === p.id
                    ? 'border-[#800020] bg-[#F8F3EE] text-[#800020]'
                    : 'border-[#EAE1DD] text-[#817779] hover:bg-[#FCFAF8]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Policy Version Tag</label>
                <input
                  type="text"
                  value={policyVersionDraft}
                  onChange={(e) => setPolicyVersionDraft(e.target.value)}
                  placeholder="e.g. 2.5-ACAD"
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Changelog Summary (Audit Reason)</label>
                <input
                  type="text"
                  value={policySummaryDraft}
                  onChange={(e) => setPolicySummaryDraft(e.target.value)}
                  placeholder="e.g. Added note protection clause..."
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#393333] mb-1">Policy Full Legal Content</label>
              <textarea
                rows={12}
                value={policyContentDraft}
                onChange={(e) => setPolicyContentDraft(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] font-mono text-xs leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 font-semibold text-xs bg-[#800020] text-white rounded-xl hover:bg-[#630018]"
              >
                Publish Updated Policy Version
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Upload PDF */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE1DD] p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
              <h3 className="text-sm font-bold text-[#393333]">Upload Protected PDF Document</h3>
              <button onClick={() => setIsPdfModalOpen(false)} className="text-[#817779] hover:text-[#393333]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePdf} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Document Title *</label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Systems Reference Manual"
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">File Name *</label>
                <input
                  type="text"
                  value={pdfFileName}
                  onChange={(e) => setPdfFileName(e.target.value)}
                  placeholder="e.g. software_systems_manual_2026.pdf"
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Target Course</label>
                  <select
                    value={pdfCourseId}
                    onChange={(e) => setPdfCourseId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#EAE1DD] rounded-lg"
                  >
                    <option value="course-coding">Coding</option>
                    <option value="course-marketing">Digital Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">File Size</label>
                  <input
                    type="text"
                    value={pdfFileSize}
                    onChange={(e) => setPdfFileSize(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#EAE1DD] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={pdfDesc}
                  onChange={(e) => setPdfDesc(e.target.value)}
                  placeholder="Summary of handbook contents..."
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE1DD]">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE1DD] rounded-lg text-[#817779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#630018]"
                >
                  Publish PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE1DD] p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
              <h3 className="text-sm font-bold text-[#393333]">Faculty Assignment Evaluation</h3>
              <button onClick={() => setGradingSubmission(null)} className="text-[#817779] hover:text-[#393333]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmGrade} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Awarded Grade</label>
                <select
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                >
                  <option value="A+ (Distinction)">A+ (Distinction)</option>
                  <option value="A (High Honors)">A (High Honors)</option>
                  <option value="B+ (Commendable)">B+ (Commendable)</option>
                  <option value="Pass">Pass</option>
                  <option value="Revision Requested">Revision Requested</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Points Scored (Out of 100)</label>
                <input
                  type="number"
                  value={pointsValue}
                  onChange={(e) => setPointsValue(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Mentor Feedback & Rubric Notes</label>
                <textarea
                  rows={3}
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE1DD]">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 border border-[#EAE1DD] rounded-lg text-[#817779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#630018]"
                >
                  Save Grade & Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Internship */}
      {isInternModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE1DD] p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
              <h3 className="text-sm font-bold text-[#393333]">Publish New Research Internship</h3>
              <button onClick={() => setIsInternModalOpen(false)} className="text-[#817779] hover:text-[#393333]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInternship} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#393333] mb-1">Internship Title *</label>
                <input
                  type="text"
                  value={intTitle}
                  onChange={(e) => setIntTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Research Fellowship"
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Laboratory / Department *</label>
                <input
                  type="text"
                  value={intDept}
                  onChange={(e) => setIntDept(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Work Mode</label>
                  <select
                    value={intMode}
                    onChange={(e) => setIntMode(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#EAE1DD] rounded-lg"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Duration</label>
                  <input
                    type="text"
                    value={intDuration}
                    onChange={(e) => setIntDuration(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#EAE1DD] rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Deadline (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={intDeadline}
                    onChange={(e) => setIntDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#EAE1DD] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Positions Available</label>
                  <input
                    type="number"
                    value={intPositions}
                    onChange={(e) => setIntPositions(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-1.5 border border-[#EAE1DD] rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={intSkills}
                  onChange={(e) => setIntSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE1DD]">
                <button
                  type="button"
                  onClick={() => setIsInternModalOpen(false)}
                  className="px-4 py-2 border border-[#EAE1DD] rounded-lg text-[#817779]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#630018]"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
