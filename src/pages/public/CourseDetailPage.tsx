import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Lock, Send } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  fetchCourseModules,
  getCourseById,
  submitEnrollmentRequest,
  timestampToMillis,
} from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getCourseThumbnail } from '../../constants/legal';
import { BrandImage, EmptyState, LoadingState, StatusLabel } from '../../components/BrandAssets';
import type { Course, CourseModule, EnrollmentRequest, StudentEnrollment } from '../../types';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [existingRequest, setExistingRequest] = useState<EnrollmentRequest | null>(null);
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let active = true;
    setLoading(true);
    Promise.all([getCourseById(courseId), fetchCourseModules(courseId)])
      .then(([c, mods]) => {
        if (!active) return;
        setCourse(c);
        setModules(mods);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!user || !courseId || isAdmin) return;
    const reqQ = query(
      collection(db, 'enrollment_requests'),
      where('studentId', '==', user.uid),
      where('courseId', '==', courseId),
    );
    const unsubReq = onSnapshot(reqQ, (snap) => {
      const latest = snap.docs
        .map((d) => d.data() as EnrollmentRequest)
        .sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt))[0];
      setExistingRequest(latest || null);
    });

    const enrQ = query(
      collection(db, 'student_enrollments'),
      where('studentId', '==', user.uid),
      where('courseId', '==', courseId),
    );
    const unsubEnr = onSnapshot(enrQ, (snap) => {
      setEnrollment(snap.docs[0] ? (snap.docs[0].data() as StudentEnrollment) : null);
    });

    return () => {
      unsubReq();
      unsubEnr();
    };
  }, [user, courseId, isAdmin]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    if (!user) {
      navigate('/login', { state: { from: `/courses/${course.id}` } });
      return;
    }
    if (!user.emailVerified) {
      showToast(
        'Email Verification Required',
        'warning',
        'Please verify your email address from your Student Dashboard before requesting enrollment.',
      );
      navigate('/dashboard');
      return;
    }
    if (!profile) {
      showToast('Complete Registration', 'warning', 'Please finish your student onboarding profile first.');
      navigate('/register');
      return;
    }
    if (profile.accountStatus === 'suspended') {
      showToast('Account Suspended', 'error', 'Your account is currently suspended. Contact support for assistance.');
      return;
    }

    setSubmitting(true);
    try {
      await submitEnrollmentRequest({
        studentId: user.uid,
        studentName: profile.fullName,
        studentEmail: profile.email,
        courseId: course.id,
        courseTitle: course.title,
        note,
      });
      setNote('');
      showToast(
        'Enrollment Request Submitted',
        'success',
        'Your request is now Pending Approval. You will receive an in-app notification once reviewed.',
      );
    } catch (err) {
      showToast(
        'Enrollment Request Failed',
        'error',
        err instanceof Error ? err.message : 'Unable to submit enrollment request.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14">
        <LoadingState message="Loading course curriculum..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14">
        <EmptyState
          title="Course Not Found"
          description="This course may have been archived or is not currently published."
          actionLabel="Back to Courses"
          onAction={() => navigate('/courses')}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F4ED] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#761D2D] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Course Info & Syllabus */}
          <div className="lg:col-span-8 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-[#292323]/10 bg-white">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#292323]/5">
                <BrandImage
                  src={getCourseThumbnail(course)}
                  alt={course.title}
                  fallbackTitle={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#761D2D]">
                  <span>{course.departmentName || course.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{course.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{course.duration}</span>
                </div>
                <h1 className="mt-2 font-display text-4xl font-bold text-[#292323]">
                  {course.title}
                </h1>
                {course.introduction && (
                  <p className="mt-4 rounded-xl border border-[#D5B77A]/35 bg-[#F8F4ED] p-4 text-sm leading-relaxed text-[#292323]">
                    {course.introduction}
                  </p>
                )}
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#292323]/80">
                  {course.fullDescription}
                </p>

                {course.objectives && course.objectives.length > 0 && (
                  <div className="mt-8 border-t border-[#292323]/10 pt-6">
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Course Objectives
                    </h2>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {course.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#292323]/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#761D2D]" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(course.targetAudience || course.prerequisites) && (
                  <div className="mt-8 grid grid-cols-1 gap-5 border-t border-[#292323]/10 pt-6 sm:grid-cols-2">
                    {course.targetAudience && (
                      <div className="rounded-xl bg-[#F8F4ED]/65 p-4 border border-[#292323]/8">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                          Who Should Learn This Course
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#292323]/85">
                          {course.targetAudience}
                        </p>
                      </div>
                    )}
                    {course.prerequisites && (
                      <div className="rounded-xl bg-[#F8F4ED]/65 p-4 border border-[#292323]/8">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                          Prerequisites
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#292323]/85">
                          {course.prerequisites}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {course.outcomes && course.outcomes.length > 0 && (
                  <div className="mt-8 border-t border-[#292323]/10 pt-6">
                    <h2 className="font-display text-2xl font-semibold text-[#292323]">
                      Learning Outcomes
                    </h2>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {course.outcomes.map((out, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#292323]/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#761D2D]" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Syllabus Modules */}
            <div className="rounded-2xl border border-[#292323]/10 bg-white p-8">
              <h2 className="font-display text-2xl font-semibold text-[#292323]">
                Complete Curriculum &amp; Assessments
              </h2>
              <p className="mt-1 text-sm text-[#292323]/65">
                Full lessons, 11-section official study notes, PDF handbooks, interactive quizzes, assignments, and the RM HEAVEN AI Tutor unlock inside My Courses upon administrative approval.
              </p>

              {modules.length === 0 ? (
                <p className="mt-6 text-sm text-[#292323]/65">
                  Module syllabus is being finalized by the curriculum team.
                </p>
              ) : (
                <div className="mt-6 divide-y divide-[#292323]/10 border-t border-[#292323]/10">
                  {modules.map((mod, idx) => (
                    <div key={mod.id} className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-[#292323]">
                          Module {String(idx + 1).padStart(2, '0')}: {mod.title}
                        </h3>
                        <Lock className="h-4 w-4 shrink-0 text-[#292323]/40" />
                      </div>
                      {mod.description && (
                        <p className="mt-1.5 text-sm text-[#292323]/75">{mod.description}</p>
                      )}
                      {mod.assessmentTitle && (
                        <p className="mt-1.5 text-xs font-medium text-[#761D2D]">
                          Assessment: {mod.assessmentTitle}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {course.finalAssessmentTitle && (
                <div className="mt-6 rounded-xl border border-[#D5B77A]/40 bg-[#F8F4ED] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#761D2D]">
                    Final Course Assessment
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#292323]">{course.finalAssessmentTitle}</p>
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-[#292323]/12 bg-white p-6">
              <h2 className="font-display text-2xl font-semibold text-[#292323]">
                Course Enrollment
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
                Enrollment requires administrative review to ensure structured cohort guidance.
              </p>

              <div className="mt-6 space-y-3 border-t border-b border-[#292323]/10 py-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#292323]/65">Category</span>
                  <span className="font-medium text-[#292323]">{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#292323]/65">Level</span>
                  <span className="font-medium text-[#292323]">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#292323]/65">Duration</span>
                  <span className="font-medium text-[#292323]">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#292323]/65">Modules</span>
                  <span className="font-medium text-[#292323] tabular-nums">{modules.length}</span>
                </div>
              </div>

              <div className="mt-6">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="block w-full rounded-lg bg-[#761D2D] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#8F2638]"
                  >
                    Manage in Admin Portal
                  </Link>
                ) : enrollment && enrollment.status === 'active' ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                      <StatusLabel status="Approved" />
                      <p className="mt-1.5 text-xs text-[#292323]/80">
                        You are actively enrolled in this course.
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block w-full rounded-lg bg-[#761D2D] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#8F2638]"
                    >
                      Open Course in Dashboard
                    </Link>
                  </div>
                ) : existingRequest && existingRequest.status === 'Pending' ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold">Pending Approval</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#292323]/80">
                        Your enrollment request has been submitted and is awaiting administrator review.
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block w-full rounded-lg border border-[#761D2D] px-4 py-2.5 text-center text-sm font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                    >
                      Track in Student Dashboard
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleEnroll} className="space-y-4">
                    {existingRequest && existingRequest.status === 'Rejected' && (
                      <div className="rounded-xl border border-[#B4434D]/30 bg-[#B4434D]/8 p-3.5 text-xs text-[#292323]">
                        <StatusLabel status="Rejected" />
                        {existingRequest.adminFeedback && (
                          <p className="mt-1 text-[#292323]/80">
                            Admin feedback: {existingRequest.adminFeedback}
                          </p>
                        )}
                      </div>
                    )}

                    {user && (
                      <div>
                        <label className="block text-xs font-medium text-[#292323]/75">
                          Study Goal / Note for Reviewer (Optional)
                        </label>
                        <textarea
                          rows={3}
                          maxLength={600}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Share your background or learning objectives..."
                          className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-sm text-[#292323] focus:border-[#761D2D] focus:outline-none"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#761D2D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      {submitting
                        ? 'Submitting Request...'
                        : user
                        ? 'Enroll Now'
                        : 'Sign In to Request Enrollment'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
