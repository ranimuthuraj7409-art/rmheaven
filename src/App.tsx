/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserRole, 
  WebsiteCMS, 
  Course, 
  StudentProfile, 
  EnrollmentRequest, 
  PdfDocument, 
  Assignment, 
  AssignmentSubmission, 
  Internship, 
  InternshipApplication, 
  Announcement, 
  PolicyDocument 
} from './types';
import { 
  INITIAL_CMS, 
  INITIAL_COURSES, 
  INITIAL_PDF_DOCUMENTS, 
  INITIAL_POLICIES, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_ENROLLMENT_REQUESTS, 
  INITIAL_INTERNSHIPS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_ASSIGNMENT_SUBMISSIONS, 
  INITIAL_ANNOUNCEMENTS 
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { CoursesView } from './components/CoursesView';
import { InternshipsView } from './components/InternshipsView';
import { ResourcesView } from './components/ResourcesView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ContactView } from './components/ContactView';
import { TermsView } from './components/TermsView';
import { DisciplineView } from './components/DisciplineView';
import { PrivacyView } from './components/PrivacyView';
import { RegisterView } from './components/RegisterView';
import { LoginView } from './components/LoginView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('guest');

  // Persistence Helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // 1. CMS State (Brand name, Headlines, Mascot settings)
  const [cms, setCms] = useState<WebsiteCMS>(() => {
    const stored = loadStored('plat_cms_v2', INITIAL_CMS);
    if (!stored.brandName || stored.brandName === '[PLATFORM BRAND NAME]') {
      return { ...stored, brandName: 'RM Heaven' };
    }
    return stored;
  });

  // 2. Courses State (Coding & Digital Marketing)
  const [courses, setCourses] = useState<Course[]>(() => 
    loadStored('plat_courses_v2', INITIAL_COURSES)
  );

  // 3. Students Registry & Current Active Student
  const [students, setStudents] = useState<StudentProfile[]>(() => 
    loadStored('plat_students_v2', [INITIAL_STUDENT_PROFILE])
  );
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => 
    loadStored('plat_current_student_v2', INITIAL_STUDENT_PROFILE)
  );

  // 4. Enrollment Requests (Approval Mechanism)
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>(() => 
    loadStored('plat_enrollments_v2', INITIAL_ENROLLMENT_REQUESTS)
  );

  // 5. PDF Documents
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>(() => 
    loadStored('plat_pdfs_v2', INITIAL_PDF_DOCUMENTS)
  );

  // 6. Assignments & Submissions
  const [assignments, setAssignments] = useState<Assignment[]>(() => 
    loadStored('plat_assignments_v2', INITIAL_ASSIGNMENTS)
  );
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => 
    loadStored('plat_submissions_v2', INITIAL_ASSIGNMENT_SUBMISSIONS)
  );

  // 7. Internships & Applications
  const [internships, setInternships] = useState<Internship[]>(() => 
    loadStored('plat_internships_v2', INITIAL_INTERNSHIPS)
  );
  const [internshipApplications, setInternshipApplications] = useState<InternshipApplication[]>(() => 
    loadStored('plat_intern_apps_v2', [])
  );

  // 8. Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    loadStored('plat_announcements_v2', INITIAL_ANNOUNCEMENTS)
  );

  // 9. Policies (Terms, Discipline, Privacy)
  const [policies, setPolicies] = useState<PolicyDocument[]>(() => 
    loadStored('plat_policies_v2', INITIAL_POLICIES)
  );

  // Sync to LocalStorage
  useEffect(() => {
    try { localStorage.setItem('plat_cms_v2', JSON.stringify(cms)); } catch (e) { console.error(e); }
  }, [cms]);

  useEffect(() => {
    try { localStorage.setItem('plat_courses_v2', JSON.stringify(courses)); } catch (e) { console.error(e); }
  }, [courses]);

  useEffect(() => {
    try { localStorage.setItem('plat_students_v2', JSON.stringify(students)); } catch (e) { console.error(e); }
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem('plat_current_student_v2', JSON.stringify(currentStudent)); } catch (e) { console.error(e); }
  }, [currentStudent]);

  useEffect(() => {
    try { localStorage.setItem('plat_enrollments_v2', JSON.stringify(enrollmentRequests)); } catch (e) { console.error(e); }
  }, [enrollmentRequests]);

  useEffect(() => {
    try { localStorage.setItem('plat_pdfs_v2', JSON.stringify(pdfDocuments)); } catch (e) { console.error(e); }
  }, [pdfDocuments]);

  useEffect(() => {
    try { localStorage.setItem('plat_assignments_v2', JSON.stringify(assignments)); } catch (e) { console.error(e); }
  }, [assignments]);

  useEffect(() => {
    try { localStorage.setItem('plat_submissions_v2', JSON.stringify(assignmentSubmissions)); } catch (e) { console.error(e); }
  }, [assignmentSubmissions]);

  useEffect(() => {
    try { localStorage.setItem('plat_internships_v2', JSON.stringify(internships)); } catch (e) { console.error(e); }
  }, [internships]);

  useEffect(() => {
    try { localStorage.setItem('plat_intern_apps_v2', JSON.stringify(internshipApplications)); } catch (e) { console.error(e); }
  }, [internshipApplications]);

  useEffect(() => {
    try { localStorage.setItem('plat_announcements_v2', JSON.stringify(announcements)); } catch (e) { console.error(e); }
  }, [announcements]);

  useEffect(() => {
    try { localStorage.setItem('plat_policies_v2', JSON.stringify(policies)); } catch (e) { console.error(e); }
  }, [policies]);

  // Tab switch scroll
  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Course selection navigation
  const handleSelectCourse = (course: Course) => {
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enrollment request handler
  const handleRequestEnrollment = (courseOption: string) => {
    const coursesArray = courseOption === 'Both Courses' ? ['Coding', 'Digital Marketing'] : [courseOption];

    const newReq: EnrollmentRequest = {
      id: `enr-${Date.now().toString().slice(-4)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentEmail: currentStudent.email,
      studentCollege: currentStudent.college,
      requestedCourses: coursesArray,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      reviewerNotes: 'Self-service request from Student Dashboard'
    };

    setEnrollmentRequests(prev => [newReq, ...prev]);

    // Update current student's pending list
    setCurrentStudent(prev => ({
      ...prev,
      pendingCourseRequests: Array.from(new Set([...prev.pendingCourseRequests, ...coursesArray]))
    }));
  };

  // Owner approves enrollment request
  const handleApproveEnrollment = (requestId: string, studentId: string, coursesToApprove: string[]) => {
    // 1. Update enrollment request status
    setEnrollmentRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Approved',
          decisionDate: new Date().toISOString().slice(0, 10),
          reviewerNotes: 'Approved by Owner. Access granted.'
        };
      }
      return req;
    }));

    // 2. Update student profile in registry
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedEnrolled = Array.from(new Set([...s.enrolledCourses, ...coursesToApprove]));
        const updatedPending = s.pendingCourseRequests.filter(c => !coursesToApprove.includes(c));
        return {
          ...s,
          enrolledCourses: updatedEnrolled,
          pendingCourseRequests: updatedPending,
          status: 'Active'
        };
      }
      return s;
    }));

    // 3. Update current student if matched
    if (currentStudent.id === studentId) {
      setCurrentStudent(prev => ({
        ...prev,
        enrolledCourses: Array.from(new Set([...prev.enrolledCourses, ...coursesToApprove])),
        pendingCourseRequests: prev.pendingCourseRequests.filter(c => !coursesToApprove.includes(c)),
        status: 'Active'
      }));
    }
  };

  // Owner rejects enrollment
  const handleRejectEnrollment = (requestId: string, notes?: string) => {
    setEnrollmentRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Rejected',
          decisionDate: new Date().toISOString().slice(0, 10),
          reviewerNotes: notes || 'Application prerequisites incomplete.'
        };
      }
      return req;
    }));
  };

  // Registration handler
  const handleRegisterSuccess = (newProfile: StudentProfile, requestedCourses: string[]) => {
    setStudents(prev => [newProfile, ...prev]);
    setCurrentStudent(newProfile);
    setUserRole('student');

    // Automatically create the pending enrollment request for owner review!
    const newReq: EnrollmentRequest = {
      id: `enr-${Date.now().toString().slice(-4)}`,
      studentId: newProfile.id,
      studentName: newProfile.fullName,
      studentEmail: newProfile.email,
      studentCollege: newProfile.college,
      requestedCourses,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      reviewerNotes: 'Submitted during initial student account registration.'
    };
    setEnrollmentRequests(prev => [newReq, ...prev]);
  };

  // Login handler
  const handleLoginSuccess = (email: string, role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      const found = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentStudent(found);
      }
    }
  };

  // Assignment handlers
  const handleSubmitAssignment = (subData: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: AssignmentSubmission = {
      ...subData,
      id: `sub-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
      mentorFeedback: 'Under review by course mentor.'
    };
    setAssignmentSubmissions(prev => [newSub, ...prev]);
  };

  const handleGradeAssignment = (submissionId: string, grade: string, points: number, feedback: string) => {
    setAssignmentSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          grade,
          pointsScored: points,
          mentorFeedback: feedback,
          status: 'Graded'
        };
      }
      return sub;
    }));
  };

  // Internship application handler
  const handleApplyInternship = (appData: Omit<InternshipApplication, 'id' | 'appliedDate' | 'status'>) => {
    const newApp: InternshipApplication = {
      ...appData,
      id: `ia-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
      feedback: 'Application queued for admissions review.'
    };
    setInternshipApplications(prev => [newApp, ...prev]);
  };

  const handleUpdateInternshipAppStatus = (appId: string, status: InternshipApplication['status'], feedback?: string) => {
    setInternshipApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status,
          feedback: feedback !== undefined ? feedback : app.feedback
        };
      }
      return app;
    }));
  };

  // Policy update handler
  const handleUpdatePolicy = (policyId: 'terms' | 'discipline' | 'privacy', newContent: string, newVersion: string, summary: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          content: newContent,
          version: newVersion,
          lastUpdated: new Date().toISOString().slice(0, 10),
          changelog: [
            { version: newVersion, date: new Date().toISOString().slice(0, 10), summary },
            ...p.changelog
          ]
        };
      }
      return p;
    }));
  };

  // Active Policy Documents
  const termsPolicy = policies.find(p => p.id === 'terms') || policies[0];
  const disciplinePolicy = policies.find(p => p.id === 'discipline') || policies[1];
  const privacyPolicy = policies.find(p => p.id === 'privacy') || policies[2];

  const pendingRequestsCount = enrollmentRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF8] text-[#393333]">
      
      {/* SECTION 1 – STICKY RESPONSIVE WHITE NAVIGATION BAR */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        brandName={cms.brandName}
        userRole={userRole}
        onSelectRole={setUserRole}
        studentName={currentStudent.fullName}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Viewport Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            cms={cms}
            courses={courses}
            internships={internships}
            pdfDocuments={pdfDocuments}
            onSelectTab={handleSelectTab}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === 'about' && (
          <AboutView cms={cms} onSelectTab={handleSelectTab} />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            courses={courses}
            onSelectTab={handleSelectTab}
            onRequestEnrollment={handleRequestEnrollment}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'internships' && (
          <InternshipsView
            internships={internships}
            onApplyInternship={handleApplyInternship}
            onSelectTab={handleSelectTab}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            pdfDocuments={pdfDocuments}
            courses={courses}
            studentProfile={currentStudent}
            onSelectTab={handleSelectTab}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView announcements={announcements} brandName={cms.brandName} />
        )}

        {activeTab === 'contact' && (
          <ContactView cms={cms} />
        )}

        {activeTab === 'terms' && (
          <TermsView policy={termsPolicy} onSelectTab={handleSelectTab} brandName={cms.brandName} />
        )}

        {activeTab === 'discipline' && (
          <DisciplineView policy={disciplinePolicy} onSelectTab={handleSelectTab} brandName={cms.brandName} />
        )}

        {activeTab === 'privacy' && (
          <PrivacyView policy={privacyPolicy} onSelectTab={handleSelectTab} brandName={cms.brandName} />
        )}

        {activeTab === 'register' && (
          <RegisterView
            onRegisterSuccess={handleRegisterSuccess}
            onSelectTab={handleSelectTab}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onSelectTab={handleSelectTab}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'student-dashboard' && (
          <StudentDashboardView
            profile={currentStudent}
            courses={courses}
            enrollmentRequests={enrollmentRequests}
            assignments={assignments}
            assignmentSubmissions={assignmentSubmissions}
            internships={internships}
            internshipApplications={internshipApplications}
            announcements={announcements}
            onSelectTab={handleSelectTab}
            onRequestEnrollment={handleRequestEnrollment}
            onSubmitAssignment={handleSubmitAssignment}
            brandName={cms.brandName}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboardView
            cms={cms}
            onUpdateCMS={setCms}
            courses={courses}
            onAddCourse={(c) => setCourses(prev => [c, ...prev])}
            onUpdateCourse={(c) => setCourses(prev => prev.map(x => x.id === c.id ? c : x))}
            onDeleteCourse={(id) => setCourses(prev => prev.filter(x => x.id !== id))}
            students={students}
            onUpdateStudentStatus={(id, status) => setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))}
            enrollmentRequests={enrollmentRequests}
            onApproveEnrollment={handleApproveEnrollment}
            onRejectEnrollment={handleRejectEnrollment}
            pdfDocuments={pdfDocuments}
            onAddPdfDocument={(doc) => setPdfDocuments(prev => [doc, ...prev])}
            onDeletePdfDocument={(id) => setPdfDocuments(prev => prev.filter(x => x.id !== id))}
            assignments={assignments}
            onAddAssignment={(asg) => setAssignments(prev => [asg, ...prev])}
            assignmentSubmissions={assignmentSubmissions}
            onGradeAssignment={handleGradeAssignment}
            internships={internships}
            onAddInternship={(item) => setInternships(prev => [item, ...prev])}
            onDeleteInternship={(id) => setInternships(prev => prev.filter(x => x.id !== id))}
            internshipApplications={internshipApplications}
            onUpdateInternshipAppStatus={handleUpdateInternshipAppStatus}
            announcements={announcements}
            onAddAnnouncement={(ann) => setAnnouncements(prev => [ann, ...prev])}
            onDeleteAnnouncement={(id) => setAnnouncements(prev => prev.filter(x => x.id !== id))}
            policies={policies}
            onUpdatePolicy={handleUpdatePolicy}
            onSelectTab={handleSelectTab}
          />
        )}
      </main>

      {/* SECTION 11 – FOOTER */}
      <Footer onSelectTab={handleSelectTab} brandName={cms.brandName} />
    </div>
  );
}
