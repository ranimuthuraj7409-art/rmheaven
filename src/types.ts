export type UserRole = 'student' | 'admin';
export type AccountStatus = 'active' | 'suspended';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
export type CourseStatus = 'published' | 'draft' | 'archived';
export type EnrollmentRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type StudentEnrollmentStatus = 'active' | 'revoked' | 'completed';
export type SubmissionStatus = 'Submitted' | 'Under Review' | 'Evaluated';
export type InternshipStatus = 'open' | 'closed' | 'archived';
export type InternshipApplicationStatus = 'Applied' | 'Under Review' | 'Accepted' | 'Rejected' | 'Completed';
export type CertificateStatus = 'Valid' | 'Revoked';
export type SupportTicketStatus = 'Open' | 'In Progress' | 'Resolved';

export type AiTutorMode =
  | 'Simple Explanation'
  | 'Detailed Explanation'
  | 'Short Notes'
  | 'Detailed Notes'
  | 'Step-by-Step Learning'
  | 'Real-World Examples'
  | 'Important Questions'
  | 'MCQ Generator'
  | 'Practice Test'
  | 'Quick Revision'
  | 'Translate Notes'
  | 'Doubt Clarification';

export type SavedAiNoteMode =
  | 'simple'
  | 'detailed'
  | 'short_revision'
  | 'step_by_step'
  | 'practice_questions'
  | 'translation'
  | 'tutor_saved';

export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string;
  orderIndex: number;
  status: 'active' | 'archived';
  createdAt: unknown;
  updatedAt: unknown;
}

export interface AdminUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'admin';
  createdBy?: string;
  createdAt: unknown;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobile: string;
  qualification: string;
  institution?: string;
  city: string;
  courseInterests?: string[];
  role: UserRole;
  accountStatus: AccountStatus;
  termsAccepted: boolean;
  termsVersion: string;
  conductAccepted: boolean;
  conductVersion: string;
  acceptedAt: unknown;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface Course {
  id: string;
  title: string;
  departmentId?: string;
  departmentName?: string;
  category: string;
  level: CourseLevel;
  duration: string;
  shortDescription: string;
  fullDescription: string;
  introduction?: string;
  objectives?: string[];
  targetAudience?: string;
  prerequisites?: string;
  syllabusSummary?: string[];
  moduleAssessments?: string[];
  finalAssessmentTitle?: string;
  thumbnailUrl?: string;
  outcomes?: string[];
  status: CourseStatus;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  assessmentTitle?: string;
  assessmentCriteria?: string;
  orderIndex: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  summary?: string;
  objectives?: string[];
  contentBody: string;
  examples?: string;
  exercisePrompt?: string;
  status?: 'published' | 'draft';
  durationMinutes?: number;
  orderIndex: number;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface StudyNote {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  sourceType: 'official' | 'ai_assisted_admin';
  status: 'published' | 'draft';
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
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface LearningMaterial {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  downloadAllowed: boolean;
  status: 'active' | 'draft' | 'archived';
  uploadedBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface Quiz {
  id: string;
  courseId: string;
  moduleId?: string;
  quizType: 'module' | 'final' | 'practice';
  title: string;
  description: string;
  passingPercent: number;
  status: 'published' | 'draft';
  questionCount: number;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface QuizQuestion {
  id: string;
  courseId: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topicTag?: string;
  orderIndex: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  moduleId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  weakTopics: string[];
  answersJson: string;
  source: 'course_quiz' | 'ai_practice';
  createdAt: unknown;
}

export interface SavedAiNote {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  noteMode: SavedAiNoteMode;
  language: string;
  title: string;
  content: string;
  isAiGenerated: true;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface AiTutorMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  mode?: AiTutorMode;
  language?: string;
  createdAt: string;
}

export interface AiTutorSession {
  id: string;
  studentId: string;
  courseId: string;
  lessonId?: string;
  language: string;
  mode: string;
  messagesJson: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface EnrollmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  note?: string;
  status: EnrollmentRequestStatus;
  adminFeedback?: string;
  reviewedBy?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  status: StudentEnrollmentStatus;
  completedLessonIds: string[];
  progressPercent: number;
  approvedBy: string;
  approvedAt: unknown;
  updatedAt: unknown;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  instructions: string;
  dueDate: string;
  maxMarks: number;
  status: 'published' | 'closed';
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  courseId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  fileUrl?: string;
  fileName?: string;
  notes?: string;
  status: SubmissionStatus;
  marks?: number;
  feedback?: string;
  submittedAt: unknown;
  evaluatedAt?: unknown;
  updatedAt: unknown;
}

export interface Internship {
  id: string;
  title: string;
  department: string;
  description: string;
  eligibility: string;
  skillsRequired: string[];
  duration: string;
  learningOutcomes: string[];
  deadline: string;
  thumbnailUrl?: string;
  status: InternshipStatus;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  internshipTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  mobile?: string;
  qualification?: string;
  statementOfPurpose: string;
  portfolioUrl?: string;
  status: InternshipApplicationStatus;
  adminFeedback?: string;
  appliedAt: unknown;
  updatedAt: unknown;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  programId: string;
  programTitle: string;
  programType: 'Course' | 'Internship';
  downloadAllowed: boolean;
  status: CertificateStatus;
  issuedBy: string;
  issuedAt: unknown;
  updatedAt: unknown;
}

export interface CertificateVerification {
  certificateCode: string;
  recipientName: string;
  programTitle: string;
  programType: 'Course' | 'Internship';
  status: CertificateStatus;
  issuedAt: unknown;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientRole: 'student' | 'admin';
  title: string;
  message: string;
  type: 'enrollment' | 'course' | 'assignment' | 'internship' | 'certificate' | 'registration' | 'system';
  linkPath?: string;
  read: boolean;
  createdAt: unknown;
}

export interface WebsiteContent {
  id: string;
  heroHeadline?: string;
  heroSubtext?: string;
  welcomeTitle?: string;
  welcomeBody?: string;
  announcementBanner?: string;
  contactEmail?: string;
  contactPhone?: string;
  officeLocation?: string;
  updatedAt: unknown;
}

export interface SupportTicket {
  id: string;
  studentId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  adminReply?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: string;
  createdAt: unknown;
}
