export const TERMS_VERSION = '2026.1';
export const CONDUCT_VERSION = '2026.1';
export const PRIVACY_VERSION = '2026.1';

export const BRAND_IMAGES = {
  lionCrest: '/assets/aistudio/Regal_RM_Heaven_Lion_Crest__1__42e22830.png',
  heroAcademy: '/src/assets/images/hero_academy_composition_1795024485828.jpg',
  courseProgramming: '/src/assets/images/course_dept_programming_1795103781906.jpg',
  courseAiData: '/src/assets/images/course_dept_ai_data_1795103781169.jpg',
  courseDesignStudio: '/src/assets/images/course_dept_design_1795103781127.jpg',
  courseBusiness: '/src/assets/images/course_dept_business_1795103781692.jpg',
  courseTech: '/src/assets/images/course_dept_programming_1795103781906.jpg',
  courseDesign: '/src/assets/images/course_dept_design_1795103781127.jpg',
  internshipHall: '/src/assets/images/internship_fellowship_visual_1795024486996.jpg',
};

const LEGACY_COURSE_PLACEHOLDERS = new Set([
  '/src/assets/images/course_tech_leadership_1795024486575.jpg',
  '/src/assets/images/course_design_strategy_1795024487187.jpg',
  '/src/assets/images/internship_fellowship_visual_1795024486996.jpg',
]);

export function getCourseThumbnail(course: {
  departmentId?: string;
  departmentName?: string;
  category?: string;
  title?: string;
  thumbnailUrl?: string;
}): string {
  const rawThumb = (course.thumbnailUrl || '').trim();
  if (rawThumb && !LEGACY_COURSE_PLACEHOLDERS.has(rawThumb)) {
    return rawThumb;
  }

  const hint = `${course.departmentId || ''} ${course.departmentName || ''} ${course.category || ''} ${course.title || ''}`.toLowerCase();

  if (
    hint.includes('dept_ai') ||
    hint.includes('dept-ai') ||
    hint.includes('artificial intelligence') ||
    hint.includes('machine learning') ||
    hint.includes('generative ai') ||
    hint.includes('prompt') ||
    hint.includes('data science') ||
    hint.includes('data analytics') ||
    hint.includes('ai tools')
  ) {
    return BRAND_IMAGES.courseAiData;
  }

  if (
    hint.includes('dept_design') ||
    hint.includes('dept-design') ||
    hint.includes('design') ||
    hint.includes('ui/ux') ||
    hint.includes('video') ||
    hint.includes('motion') ||
    hint.includes('branding')
  ) {
    return BRAND_IMAGES.courseDesignStudio;
  }

  if (
    hint.includes('dept_business') ||
    hint.includes('dept-business') ||
    hint.includes('business') ||
    hint.includes('marketing') ||
    hint.includes('seo') ||
    hint.includes('freelancing') ||
    hint.includes('content creation') ||
    hint.includes('communication') ||
    hint.includes('career') ||
    hint.includes('entrepreneurship') ||
    hint.includes('project management')
  ) {
    return BRAND_IMAGES.courseBusiness;
  }

  return BRAND_IMAGES.courseProgramming;
}

export const COURSE_INTEREST_OPTIONS = [
  'Software Engineering & Systems',
  'Data Science & Applied Analytics',
  'Product & Design Architecture',
  'Business Strategy & Operations',
  'Digital Commerce & Growth',
  'Research & Academic Writing',
];

export const DEFAULT_WEBSITE_CONTENT = {
  id: 'global',
  heroHeadline: 'Your Journey. Your Skills. Your Future.',
  heroSubtext:
    'RM HEAVEN unites structured online learning, mentor-reviewed assignments, and curated internship programmes within an accountable academic ecosystem.',
  welcomeTitle: 'A Disciplined Standard in Online Education',
  welcomeBody:
    'Designed for ambitious learners who value depth over shortcuts, RM HEAVEN connects rigorous coursework with guided internship pathways. Every enrollment is personally reviewed, every assignment is evaluated with constructive feedback, and every credential is verifiable.',
  announcementBanner: '',
  contactEmail: 'rmheaven.edu@gmail.com',
  contactPhone: '9025528671',
  officeLocation: 'Academic Operations Desk — Online & Regional Programmes',
};

export const TERMS_SECTIONS = [
  {
    title: '1. Registration Requirements',
    body: 'Applicants must provide accurate, truthful personal and academic details during registration, including a valid email address and mobile contact number. Email verification is mandatory before submitting course enrollment requests, internship applications, or assignment submissions.',
  },
  {
    title: '2. Account Responsibility',
    body: 'Each RM HEAVEN account is strictly personal and non-transferable. Students are responsible for maintaining the confidentiality of their login credentials and for all activities performed under their account.',
  },
  {
    title: '3. Course Enrollment Rules',
    body: 'Course discovery is open to all visitors, while access to lessons, restricted PDFs, and assignments requires explicit administrative approval. Submitting an enrollment request does not automatically grant access; administrators review and approve or decline requests based on programme capacity and readiness.',
  },
  {
    title: '4. Learning Material Usage',
    body: 'Course notes, PDFs, reference briefs, and recorded instruction are licensed strictly for individual personal study by enrolled students. Downloading is permitted only for resources explicitly marked as downloadable by administrators.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All curriculum structures, instructional documents, assessments, brand assets, and verification records remain the exclusive intellectual property of RM HEAVEN and its respective academic contributors.',
  },
  {
    title: '6. Acceptable Platform Usage',
    body: 'Users must not attempt to bypass authentication, manipulate enrollment records, scrape restricted collections, inject unauthorized payloads, or disrupt platform availability for other learners or administrators.',
  },
  {
    title: '7. Certificate Eligibility',
    body: 'Certificates are issued solely upon verified completion of required course modules, evaluated assignments, or approved internship deliverables. All issued certificates carry a unique verification code.',
  },
  {
    title: '8. Account Suspension Conditions',
    body: 'RM HEAVEN administrators reserve the right to suspend or revoke accounts involved in credential sharing, unauthorized redistribution of paid or restricted materials, academic dishonesty, harassment, or security violations.',
  },
  {
    title: '9. Privacy & Data Handling',
    body: 'Student contact details, academic background, and submission records are stored securely in isolated access-controlled records and are never sold or exposed to unauthorized third parties.',
  },
];

export const CONDUCT_PRINCIPLES = [
  {
    title: 'Professional Conduct',
    detail: 'Maintain courteous, disciplined, and constructive behaviour across all written submissions, support tickets, and programme communications.',
  },
  {
    title: 'Mutual Respect',
    detail: 'Treat instructors, evaluators, administrators, and fellow learners with respect regardless of background or academic level.',
  },
  {
    title: 'Academic Honesty',
    detail: 'Complete every assignment, case study, and project deliverable independently and honestly unless collaboration is explicitly authorized.',
  },
  {
    title: 'Zero Plagiarism',
    detail: 'Never submit copied, fabricated, or unattributed work as your own. Proper citations are required for all external references.',
  },
  {
    title: 'Credential Confidentiality',
    detail: 'Never share your login credentials, session access, or verification links with any other individual.',
  },
  {
    title: 'Material Protection',
    detail: 'Do not copy, screenshot for redistribution, upload, sell, or circulate restricted or paid RM HEAVEN study materials.',
  },
  {
    title: 'Internship Compliance',
    detail: 'Adhere strictly to timelines, confidentiality obligations, and deliverable standards set for each internship programme.',
  },
  {
    title: 'Session Discipline',
    detail: 'Observe punctuality, attentive participation, and professional etiquette during all scheduled online sessions and evaluations.',
  },
  {
    title: 'Facility Stewardship',
    detail: 'Use platform resources, support channels, and AI study assistance responsibly and strictly for legitimate educational purposes.',
  },
];

export const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you explicitly provide during registration and learning participation: full name, email address, mobile number, educational qualification, institution name (optional), city, course interests, assignment submissions, and internship applications.',
  },
  {
    title: '2. How Your Data Is Used',
    body: 'Your information is used strictly to verify your identity, evaluate enrollment requests, deliver course materials, grade assignments, manage internship placements, issue verifiable certificates, and send essential academic notifications.',
  },
  {
    title: '3. Strict Access Isolation',
    body: 'Student profiles and personal contact details are isolated by database security rules. Other students cannot view your email address, phone number, submissions, or grades. Only you and authorized RM HEAVEN administrators can view your account record.',
  },
  {
    title: '4. Certificate Verification Privacy',
    body: 'Public certificate verification lookups expose only the recipient name, programme title, issue date, and validity status for a specific certificate code—never email addresses, phone numbers, or account identifiers.',
  },
  {
    title: '5. Security & Retention',
    body: 'Passwords are handled exclusively by Firebase Authentication and are never stored in application databases or source code. Legal consent timestamps and versions are retained for compliance auditing.',
  },
];
