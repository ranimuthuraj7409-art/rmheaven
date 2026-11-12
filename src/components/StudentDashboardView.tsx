import React, { useState } from 'react';
import { 
  StudentProfile, 
  Course, 
  StudyNote, 
  Assignment, 
  AssignmentSubmission, 
  Internship, 
  InternshipApplication, 
  Announcement, 
  NavigationTab,
  EnrollmentRequest 
} from '../types';
import { MascotCharacter } from './MascotCharacter';
import { BrandLogo } from './BrandLogo';
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Award, 
  Bell, 
  Settings, 
  LogOut, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Eye, 
  Send,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface StudentDashboardViewProps {
  profile: StudentProfile;
  courses: Course[];
  enrollmentRequests: EnrollmentRequest[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  internships: Internship[];
  internshipApplications: InternshipApplication[];
  announcements: Announcement[];
  onSelectTab: (tab: NavigationTab) => void;
  onRequestEnrollment: (courseTitle: string) => void;
  onSubmitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  brandName: string;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  profile,
  courses,
  enrollmentRequests,
  assignments,
  assignmentSubmissions,
  internships,
  internshipApplications,
  announcements,
  onSelectTab,
  onRequestEnrollment,
  onSubmitAssignment,
  brandName
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'profile' | 'courses' | 'notes' | 'assignments' | 'internships' | 'certificates' | 'announcements' | 'settings'>('overview');
  
  // Selected note for study reader
  const [activeNote, setActiveNote] = useState<{ note: StudyNote; courseTitle: string } | null>(null);
  
  // Assignment submission modal
  const [activeAssignmentForSubmission, setActiveAssignmentForSubmission] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionRepo, setSubmissionRepo] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Check enrollment permissions
  const isEnrolledInCourse = (courseSlugOrTitle: string) => {
    const lower = courseSlugOrTitle.toLowerCase();
    if (lower.includes('coding')) {
      return profile.enrolledCourses.includes('Coding');
    }
    if (lower.includes('marketing')) {
      return profile.enrolledCourses.includes('Digital Marketing');
    }
    return false;
  };

  const isPendingCourse = (courseTitle: string) => {
    return profile.pendingCourseRequests.some(p => p.toLowerCase().includes(courseTitle.toLowerCase()));
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignmentForSubmission || !submissionText.trim()) return;

    onSubmitAssignment({
      assignmentId: activeAssignmentForSubmission.id,
      assignmentTitle: activeAssignmentForSubmission.title,
      courseId: activeAssignmentForSubmission.courseId,
      studentId: profile.id,
      studentName: profile.fullName,
      studentEmail: profile.email,
      submissionText: submissionText.trim(),
      attachedRepoUrl: submissionRepo.trim() || undefined
    });

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setActiveAssignmentForSubmission(null);
      setSubmissionText('');
      setSubmissionRepo('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FCFAF8] text-[#393333]">
      
      {/* Top Welcome Bar with Mascot Assistant */}
      <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-1 bg-[#F8F3EE] rounded-xl border border-[#D6B878] shrink-0 hidden sm:block">
            <BrandLogo variant="emblem" size="sm" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#800020] bg-[#F8F3EE] px-2.5 py-0.5 rounded border border-[#EAE1DD]">
                {brandName} Student Portal
              </span>
              <span className="text-[11px] font-mono text-[#817779]">ID: {profile.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333]">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="text-xs text-[#817779] max-w-xl">
              {profile.college} · {profile.department} ({profile.academicYear})
            </p>
          </div>
        </div>

        {/* Friendly Dashboard Mascot Assistant */}
        <MascotCharacter variant="dashboard" className="max-w-md w-full" />
      </div>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-white border border-[#EAE1DD] rounded-2xl p-4 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#817779]">
            Academic Workstation
          </div>

          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'courses', label: 'My Courses', icon: BookOpen },
            { id: 'notes', label: 'Study Notes & PDFs', icon: FileText },
            { id: 'assignments', label: 'Assignments', icon: CheckCircle2 },
            { id: 'internships', label: 'Internships', icon: Briefcase },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#800020] text-white font-semibold shadow-xs'
                    : 'text-[#817779] hover:bg-[#F8F3EE] hover:text-[#393333]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6B878]' : 'text-[#817779]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#EAE1DD]">
            <button
              onClick={() => onSelectTab('home')}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-[#702D3D] hover:bg-[#F8F3EE] rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit to Public Portal</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* 1. OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EAE1DD] rounded-xl p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#817779] block">Enrolled Courses</span>
                  <span className="text-2xl font-bold text-[#800020] font-mono mt-1 block">
                    {profile.enrolledCourses.length}
                  </span>
                  <span className="text-[10px] text-[#817779]">{profile.enrolledCourses.join(', ') || 'Awaiting Approval'}</span>
                </div>

                <div className="bg-white border border-[#EAE1DD] rounded-xl p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#817779] block">Pending Requests</span>
                  <span className="text-2xl font-bold text-amber-800 font-mono mt-1 block">
                    {profile.pendingCourseRequests.length}
                  </span>
                  <span className="text-[10px] text-[#817779]">Owner Review in progress</span>
                </div>

                <div className="bg-white border border-[#EAE1DD] rounded-xl p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#817779] block">Assignments Done</span>
                  <span className="text-2xl font-bold text-[#702D3D] font-mono mt-1 block">
                    {assignmentSubmissions.length}
                  </span>
                  <span className="text-[10px] text-[#817779]">Graded & Reviewed</span>
                </div>

                <div className="bg-white border border-[#EAE1DD] rounded-xl p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-[#817779] block">Governance Status</span>
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    {profile.status}
                  </span>
                  <span className="text-[10px] text-[#817779] block mt-1">Terms v2.4 Verified</span>
                </div>
              </div>

              {/* Course Access Status Card */}
              <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE1DD]">
                  <h3 className="text-base font-bold text-[#393333]">
                    Course Access & Enrollment Approvals
                  </h3>
                  <span className="text-xs text-[#817779]">Strict Role-Based Protection Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Coding Card */}
                  <div className={`p-4 rounded-xl border ${
                    isEnrolledInCourse('Coding')
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-amber-300 bg-amber-50/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#393333]">Coding Curriculum</span>
                      {isEnrolledInCourse('Coding') ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          APPROVED & UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          PENDING APPROVAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#817779]">
                      Software Engineering, HTML, CSS, JavaScript, Python & Capstones.
                    </p>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      {isEnrolledInCourse('Coding') ? (
                        <button
                          onClick={() => setActiveSection('notes')}
                          className="font-semibold text-[#800020] hover:underline flex items-center gap-1"
                        >
                          <span>Open Study Notes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#817779] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected until Owner approves</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Digital Marketing Card */}
                  <div className={`p-4 rounded-xl border ${
                    isEnrolledInCourse('Marketing')
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-amber-300 bg-amber-50/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#393333]">Digital Marketing Curriculum</span>
                      {isEnrolledInCourse('Marketing') ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          APPROVED & UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          PENDING APPROVAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#817779]">
                      SEO, Social Media Marketing, Meta Ads, Google Ads & GA4 Analytics.
                    </p>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      {isEnrolledInCourse('Marketing') ? (
                        <button
                          onClick={() => setActiveSection('notes')}
                          className="font-semibold text-[#800020] hover:underline flex items-center gap-1"
                        >
                          <span>Open Study Notes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#817779] flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#800020]" />
                            <span>Awaiting Owner Review</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity / Announcements */}
              <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-[#393333]">
                  Latest Academic Announcements
                </h3>
                <div className="divide-y divide-[#EAE1DD] text-xs">
                  {announcements.slice(0, 3).map((ann) => (
                    <div key={ann.id} className="py-2.5 flex items-start justify-between gap-4">
                      <div>
                        <span className="font-bold text-[#393333] block">{ann.title}</span>
                        <p className="text-[#817779] mt-0.5 line-clamp-1">{ann.content}</p>
                      </div>
                      <span className="text-[11px] font-mono text-[#702D3D] shrink-0">{ann.publishedDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDY NOTES & PROTECTED PDF SECTION */}
          {activeSection === 'notes' && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold font-heading text-[#393333]">
                  Protected Study Notes & PDF Document Vault
                </h2>
                <p className="text-xs text-[#817779] mt-0.5">
                  Original module notes and reference handbooks. Protected by server-side authorization: you can only read notes for courses you are approved in.
                </p>
              </div>

              {/* Courses Accordion / Modules List */}
              <div className="space-y-6">
                {courses.map((course) => {
                  const hasAccess = isEnrolledInCourse(course.slug);

                  return (
                    <div key={course.id} className="border border-[#EAE1DD] rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020]">
                            {course.category}
                          </span>
                          <h3 className="text-base font-bold text-[#393333]">
                            {course.title}
                          </h3>
                        </div>
                        <div>
                          {hasAccess ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                              Access Granted
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Enrollment Pending Approval</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Modules & Lessons */}
                      <div className="space-y-3">
                        {course.modules.map((mod) => (
                          <div key={mod.id} className="p-3 bg-[#FCFAF8] border border-[#EAE1DD] rounded-lg">
                            <h4 className="text-xs font-bold text-[#393333] mb-1">
                              {mod.title}
                            </h4>
                            <p className="text-[11px] text-[#817779] mb-2">{mod.description}</p>
                            
                            <div className="space-y-2">
                              {mod.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="flex items-center justify-between p-2.5 bg-white border border-[#EAE1DD] rounded text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#800020]" />
                                    <span className="font-medium text-[#393333]">{les.studyNote.title}</span>
                                    <span className="text-[10px] text-[#817779]">({les.durationMinutes} min read)</span>
                                  </div>

                                  {hasAccess ? (
                                    <button
                                      onClick={() => setActiveNote({ note: les.studyNote, courseTitle: course.title })}
                                      className="px-3 py-1 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#630018] transition-colors"
                                    >
                                      Read Note
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-[#817779] flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-[#800020]" />
                                      <span>Locked</span>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ASSIGNMENTS SECTION */}
          {activeSection === 'assignments' && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold font-heading text-[#393333]">
                  Course Assignments & Practical Evaluations
                </h2>
                <p className="text-xs text-[#817779] mt-0.5">
                  Submit independent project code and review faculty grading feedback.
                </p>
              </div>

              <div className="space-y-4">
                {assignments.map((asg) => {
                  const submission = assignmentSubmissions.find(s => s.assignmentId === asg.id);

                  return (
                    <div key={asg.id} className="p-5 border border-[#EAE1DD] rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EAE1DD]">
                        <div>
                          <span className="text-[10px] font-bold text-[#800020] uppercase">{asg.courseTitle}</span>
                          <h3 className="text-base font-bold text-[#393333]">{asg.title}</h3>
                        </div>
                        <span className="text-xs font-mono text-[#817779]">
                          Deadline: {asg.deadline}
                        </span>
                      </div>

                      <p className="text-xs text-[#817779] leading-relaxed">
                        {asg.description}
                      </p>

                      <div className="p-3 bg-[#F8F3EE] rounded text-xs text-[#393333]">
                        <span className="font-semibold block mb-0.5">Instructions:</span>
                        {asg.instructions}
                      </div>

                      {submission ? (
                        <div className="pt-2 border-t border-[#EAE1DD] flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                              Status: {submission.status}
                            </span>
                            {submission.grade && (
                              <span className="font-bold text-[#702D3D] bg-[#EAD5D8] px-2 py-0.5 rounded">
                                Grade: {submission.grade} ({submission.pointsScored}/100)
                              </span>
                            )}
                          </div>
                          {submission.mentorFeedback && (
                            <span className="text-[#817779] italic">
                              "{submission.mentorFeedback}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => setActiveAssignmentForSubmission(asg)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-lg transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Assignment Work</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. INTERNSHIPS SECTION */}
          {activeSection === 'internships' && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold font-heading text-[#393333]">
                  Internship & Research Placement Tracking
                </h2>
                <p className="text-xs text-[#817779] mt-0.5">
                  View your submitted fellowship applications or discover open institutional calls.
                </p>
              </div>

              <div className="space-y-4">
                {internships.map((int) => (
                  <div key={int.id} className="p-5 border border-[#EAE1DD] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#800020]">{int.department}</span>
                      <span className="text-xs font-mono text-[#817779]">{int.duration} · {int.workMode}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#393333]">{int.title}</h3>
                    <p className="text-xs text-[#817779]">{int.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span>Available Positions: <strong className="text-[#393333]">{int.availablePositions}</strong></span>
                      <button
                        onClick={() => onSelectTab('internships')}
                        className="px-4 py-1.5 font-semibold text-xs bg-[#702D3D] text-white rounded-lg hover:bg-[#800020]"
                      >
                        Apply for Fellowship
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PROFILE & SETTINGS */}
          {(activeSection === 'profile' || activeSection === 'settings') && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Academic Student Record Dossier
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F3EE] rounded-xl border border-[#EAE1DD] text-xs">
                <div>
                  <span className="text-[#817779] block">Student ID:</span>
                  <span className="font-mono font-bold text-[#393333]">{profile.id}</span>
                </div>
                <div>
                  <span className="text-[#817779] block">Full Name:</span>
                  <span className="font-bold text-[#393333]">{profile.fullName}</span>
                </div>
                <div>
                  <span className="text-[#817779] block">Email Address:</span>
                  <span className="font-mono text-[#702D3D]">{profile.email}</span>
                </div>
                <div>
                  <span className="text-[#817779] block">Mobile:</span>
                  <span className="font-mono text-[#393333]">{profile.mobileNumber}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#817779]">
                <div>College: <strong className="text-[#393333]">{profile.college}</strong></div>
                <div>Department: <strong className="text-[#393333]">{profile.department}</strong> ({profile.academicYear})</div>
                <div>Location: <strong className="text-[#393333]">{profile.city}, {profile.state}</strong></div>
                <div>Terms Version Accepted: <span className="font-mono text-[#800020] font-bold">{profile.agreedTermsVersion}</span></div>
                <div>Discipline Policy Accepted: <span className="font-mono text-[#702D3D] font-bold">{profile.agreedDisciplineVersion}</span></div>
              </div>
            </div>
          )}

          {/* 6. ANNOUNCEMENTS & CERTIFICATES */}
          {activeSection === 'announcements' && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Official Institutional Notices
              </h2>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-[#FCFAF8] border border-[#EAE1DD] rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[#817779]">
                      <span className="font-semibold text-[#800020]">{ann.category} Notice</span>
                      <span className="font-mono">{ann.publishedDate}</span>
                    </div>
                    <h3 className="font-bold text-[#393333] text-sm">{ann.title}</h3>
                    <p className="text-[#817779] leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'certificates' && (
            <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-heading text-[#393333]">
                Academic Certificates of Completion
              </h2>
              <div className="p-6 border-2 border-dashed border-[#D6B878] rounded-2xl bg-[#FCFAF8] text-center space-y-3">
                <Award className="w-12 h-12 text-[#D6B878] mx-auto" />
                <h3 className="text-base font-bold text-[#393333]">
                  Full-Stack Software Engineering & Capstone Defense
                </h3>
                <p className="text-xs text-[#817779] max-w-md mx-auto">
                  Issued to <strong>{profile.fullName}</strong> following successful defense of Capstone module benchmarks and assignment completions.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-[#800020] font-bold">
                    Credential ID: RMH-ACAD-2026-8842
                  </span>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>

      {/* Modal: Interactive Study Note Reader */}
      {activeNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#EAE1DD] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#702D3D] text-white flex items-center justify-between border-b border-[#800020]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B878] block">
                  {activeNote.courseTitle}
                </span>
                <h3 className="text-base font-bold font-heading text-white">
                  {activeNote.note.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveNote(null)}
                className="p-1.5 text-white/70 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#393333] leading-relaxed">
              
              {/* Introduction */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] mb-1">
                  Introduction
                </h4>
                <p className="text-[#817779]">{activeNote.note.introduction}</p>
              </div>

              {/* Learning Objectives */}
              <div className="p-4 bg-[#F8F3EE] rounded-xl border border-[#EAE1DD] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#702D3D]">
                  Learning Objectives
                </h4>
                <ul className="space-y-1.5 text-xs text-[#393333]">
                  {activeNote.note.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#800020] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed Explanations */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] mb-1">
                  Detailed Academic Explanation
                </h4>
                <p className="text-[#393333] leading-relaxed whitespace-pre-line">
                  {activeNote.note.detailedExplanations}
                </p>
              </div>

              {/* Practical Examples */}
              <div className="p-4 bg-[#FCFAF8] rounded-xl border border-[#EAE1DD] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#702D3D]">
                  Practical Examples & Code Architecture
                </h4>
                <pre className="text-xs font-mono bg-white p-3 rounded border border-[#EAE1DD] overflow-x-auto text-[#393333]">
                  {activeNote.note.practicalExamples}
                </pre>
              </div>

              {/* Important Concepts & Key Takeaways */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020]">
                    Core Concepts
                  </h4>
                  <ul className="space-y-1 text-xs text-[#817779]">
                    {activeNote.note.importantConcepts.map((ic, idx) => (
                      <li key={idx}>• {ic}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#702D3D]">
                    Key Takeaways
                  </h4>
                  <ul className="space-y-1 text-xs text-[#817779]">
                    {activeNote.note.keyTakeaways.map((kt, idx) => (
                      <li key={idx}>✓ {kt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Practice Questions */}
              <div className="pt-2 border-t border-[#EAE1DD]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#800020] mb-2">
                  Practice Questions & Defense Topics
                </h4>
                <div className="space-y-1.5 text-xs text-[#817779]">
                  {activeNote.note.practiceQuestions.map((q, idx) => (
                    <div key={idx} className="p-2 bg-[#F8F3EE] rounded">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-[#F8F3EE] border-t border-[#EAE1DD] flex justify-end">
              <button
                onClick={() => setActiveNote(null)}
                className="px-5 py-2 text-xs font-semibold bg-[#702D3D] text-white rounded-lg hover:bg-[#800020]"
              >
                Close Note Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assignment Submission */}
      {activeAssignmentForSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE1DD] p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
              <div>
                <span className="text-[10px] font-bold text-[#800020] uppercase">Submit Work</span>
                <h3 className="text-sm font-bold text-[#393333]">{activeAssignmentForSubmission.title}</h3>
              </div>
              <button
                onClick={() => setActiveAssignmentForSubmission(null)}
                className="text-[#817779] hover:text-[#393333]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#393333]">Assignment Submitted</h4>
                <p className="text-xs text-[#817779]">Queued for faculty code review and grade assignment.</p>
              </div>
            ) : (
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">
                    Repository URL / Demonstration Link (GitHub/GitLab)
                  </label>
                  <input
                    type="url"
                    value={submissionRepo}
                    onChange={(e) => setSubmissionRepo(e.target.value)}
                    placeholder="https://github.com/adityaraman/module-project"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#393333] mb-1">
                    Technical Solution Summary & Notes *
                  </label>
                  <textarea
                    rows={4}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Summarize your implementation, key architectural decisions, and how you verified constraints..."
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE1DD]">
                  <button
                    type="button"
                    onClick={() => setActiveAssignmentForSubmission(null)}
                    className="px-4 py-2 border border-[#EAE1DD] rounded-lg text-[#817779] hover:bg-[#F8F3EE]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#630018]"
                  >
                    Confirm Submission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
