export type NavigationTab = 
  | 'home' 
  | 'about' 
  | 'courses' 
  | 'internships' 
  | 'resources' 
  | 'announcements' 
  | 'contact' 
  | 'terms' 
  | 'discipline' 
  | 'privacy' 
  | 'login' 
  | 'register' 
  | 'student-dashboard' 
  | 'admin-dashboard';

export type UserRole = 'guest' | 'student' | 'owner';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  college: string;
  department: string;
  academicYear: string;
  city: string;
  state: string;
  enrolledCourses: string[]; // e.g., ['Coding'], ['Digital Marketing'], or ['Coding', 'Digital Marketing']
  pendingCourseRequests: string[];
  status: 'Active' | 'Pending Approval' | 'Suspended';
  avatarUrl?: string;
  agreedTermsVersion: string;
  agreedDisciplineVersion: string;
  agreedPrivacyVersion: string;
  agreedTimestamp: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  durationMinutes: number;
  studyNote: StudyNote;
  pdfDocument?: PdfDocument;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  level: 'Beginner' | 'Intermediate' | 'Comprehensive';
  durationWeeks: number;
  modules: CourseModule[];
  featured: boolean;
  published: boolean;
  enrolledStudentsCount: number;
}

export interface StudyNote {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  introduction: string;
  learningObjectives: string[];
  detailedExplanations: string;
  practicalExamples: string;
  importantConcepts: string[];
  keyTakeaways: string[];
  practiceQuestions: string[];
  assignmentPrompt?: string;
  isLocked: boolean; // locked for unapproved students
}

export interface PdfDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
  published: boolean;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  description?: string;
}

export type EnrollmentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended';

export interface EnrollmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  requestedCourses: string[]; // e.g. ['Coding'], ['Digital Marketing'], or ['Coding', 'Digital Marketing']
  requestDate: string;
  status: EnrollmentStatus;
  decisionDate?: string;
  reviewerNotes?: string;
}

export interface Internship {
  id: string;
  title: string;
  department: string;
  description: string;
  skills: string[];
  eligibility: string;
  duration: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  deadline: string;
  availablePositions: number;
  applicationInstructions: string;
  published: boolean;
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Shortlisted' | 'Selected' | 'Rejected';

export interface InternshipApplication {
  id: string;
  internshipId: string;
  internshipTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentPhone: string;
  resumeFileName: string;
  resumeFileSize: string;
  statementOfPurpose: string;
  status: ApplicationStatus;
  appliedDate: string;
  feedback?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description: string;
  instructions: string;
  deadline: string;
  totalPoints: number;
  published: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionText: string;
  attachedFileName?: string;
  attachedRepoUrl?: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Graded' | 'Revision Requested';
  grade?: string;
  pointsScored?: number;
  mentorFeedback?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Enrollment' | 'Assignment' | 'Internship' | 'General';
  content: string;
  publishedDate: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  published: boolean;
}

export interface PolicyDocument {
  id: 'terms' | 'discipline' | 'privacy';
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  content: string;
  changelog: { version: string; date: string; summary: string }[];
}

export interface WebsiteCMS {
  brandName: string;
  heroHeadline: string;
  heroSubtext: string;
  mascotSettings: {
    visibleInHero: boolean;
    visibleInDashboard: boolean;
    visibleInWelcome: boolean;
    show360ModelSheet: boolean;
  };
  welcomeSection: {
    heading: string;
    mission: string;
    teachingApproach: string;
    learningOpportunities: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    officeAddress: string;
    officeHours: string;
  };
  footerContent: {
    aboutExcerpt: string;
    copyrightText: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}
