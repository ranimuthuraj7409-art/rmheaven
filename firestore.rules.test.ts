/**
 * Security Rule Test Specification for RM HEAVEN
 * Verifies the "Dirty Dozen" adversarial payloads against firestore.rules
 * Run with Firebase Emulator Suite (`@firebase/rules-unit-testing`) when testing locally.
 */

export const DIRTY_DOZEN_TEST_CASES = [
  {
    id: 'DD-01',
    name: 'Reject self-assigned admin role during user registration',
    collection: 'users',
    operation: 'create',
    payload: { uid: 'attacker1', role: 'admin', accountStatus: 'active' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-02',
    name: 'Reject unverified email spoofing admin email',
    collection: 'users',
    operation: 'list',
    auth: { uid: 'spoof1', token: { email: 'ranimuthuraj7409@gmail.com', email_verified: false } },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-03',
    name: 'Reject student approving own enrollment request',
    collection: 'enrollment_requests',
    operation: 'update',
    payload: { status: 'Approved' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-04',
    name: 'Reject student directly creating student_enrollments document',
    collection: 'student_enrollments',
    operation: 'create',
    payload: { studentId: 'student1', courseId: 'course1', status: 'active' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-05',
    name: 'Reject shadow ghost field on user profile update',
    collection: 'users',
    operation: 'update',
    payload: { fullName: 'Updated Name', ghostPrivilege: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-06',
    name: 'Reject cross-student PII read on /users/{otherId}',
    collection: 'users',
    operation: 'get',
    targetId: 'student2',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-07',
    name: 'Reject unenrolled student reading restricted course materials',
    collection: 'courses/course1/materials',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-08',
    name: 'Reject student setting marks or Evaluated status on submission',
    collection: 'assignment_submissions',
    operation: 'update',
    payload: { marks: 100, status: 'Evaluated' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-09',
    name: 'Reject oversized or malformed document ID (ID poisoning)',
    collection: 'enrollment_requests',
    operation: 'create',
    targetId: 'x'.repeat(200),
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-10',
    name: 'Reject client-forged timestamp != request.time',
    collection: 'enrollment_requests',
    operation: 'create',
    payload: { createdAt: new Date('2020-01-01T00:00:00Z') },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-11',
    name: 'Reject student accepting own internship application',
    collection: 'internship_applications',
    operation: 'update',
    payload: { status: 'Accepted' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-12',
    name: 'Reject audit log deletion or non-admin write',
    collection: 'audit_logs',
    operation: 'delete',
    expected: 'PERMISSION_DENIED',
  },
];
