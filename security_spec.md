# RM HEAVEN — Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity & Privilege Invariant**: Public registration can only create `/users/{userId}` with `role == 'student'` and `accountStatus == 'active'`. Only existing verified administrators (`isAdmin()`) can write to `/admins/{adminId}` or modify `role` / `accountStatus`.
2. **Email Spoofing Guard**: Bootstrapped admin check (`ranimuthuraj7409@gmail.com`) strictly requires `request.auth.token.email_verified == true`.
3. **PII Isolation Invariant**: `/users/{userId}` contains PII (`email`, `mobile`, `city`) and is strictly restricted to `isOwner(userId)` or `isAdmin()` on `get`, and `isAdmin()` only on `list`. Public certificate verification reads `/certificate_verifications/{certificateCode}` (no email/UID) and disables `list`.
4. **Enrollment Authorization Invariant**: A student cannot approve their own enrollment request (`/enrollment_requests`), cannot create or reactivate `/student_enrollments/{studentId}_{courseId}`, and cannot access `/courses/{courseId}/lessons`, `/courses/{courseId}/materials`, or `/courses/{courseId}/assignments` without an active `/student_enrollments/{studentId}_{courseId}` document created by an admin.
5. **Assignment & Evaluation Integrity**: Students cannot submit assignments for courses they are not enrolled in, and cannot set or alter `marks`, `feedback`, or `status == 'Evaluated'` on `/assignment_submissions`.
6. **Temporal & Schema Integrity**: Every create/update enforces strict key allowlists (`hasAll` / `hasOnly` / `affectedKeys().hasOnly`), type/size limits, regex-validated document IDs, and server-side `request.time` timestamps.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Self-Admin Registration**: `POST /users/{uid}` with `{ role: 'admin', ... }` -> MUST return `PERMISSION_DENIED`.
2. **Email Spoof Admin Escalation**: Unverified token (`email_verified: false`) matching admin email reading `/users` -> MUST return `PERMISSION_DENIED`.
3. **Student Self-Approval**: Student updates `/enrollment_requests/{id}` setting `status: 'Approved'` -> MUST return `PERMISSION_DENIED`.
4. **Direct Enrollment Creation**: Student creates `/student_enrollments/{uid}_{courseId}` directly -> MUST return `PERMISSION_DENIED`.
5. **Shadow Ghost Field Injection**: Student updates `/users/{uid}` adding `{ isVerifiedAdmin: true }` -> MUST return `PERMISSION_DENIED`.
6. **PII Cross-Student Read**: Student A performs `get` or `list` on `/users/{studentB}` -> MUST return `PERMISSION_DENIED`.
7. **Unenrolled Material Access**: Unenrolled student lists `/courses/{courseId}/materials` -> MUST return `PERMISSION_DENIED`.
8. **Self-Grading Assignment**: Student updates `/assignment_submissions/{id}` setting `marks: 100, status: 'Evaluated'` -> MUST return `PERMISSION_DENIED`.
9. **ID Poisoning**: Creating document with 500-char ID or invalid characters `../admin` -> MUST return `PERMISSION_DENIED`.
10. **Timestamp Spoofing**: Creating `/enrollment_requests/{id}` with backdated `createdAt` (`!= request.time`) -> MUST return `PERMISSION_DENIED`.
11. **Internship Self-Acceptance**: Student updates `/internship_applications/{id}` setting `status: 'Accepted'` -> MUST return `PERMISSION_DENIED`.
12. **Audit Log Tampering**: Non-admin reads/writes `/audit_logs/{id}` or admin attempts to `delete` `/audit_logs/{id}` -> MUST return `PERMISSION_DENIED`.
