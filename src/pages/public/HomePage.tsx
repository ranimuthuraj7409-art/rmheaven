import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, Award, FileCheck2, Compass, ShieldCheck } from 'lucide-react';
import { BRAND_IMAGES, getCourseThumbnail } from '../../constants/legal';
import { BrandImage, EmptyState, RmCrestMark, RmHeavenWordmark } from '../../components/BrandAssets';
import type { Course, Department, Internship, WebsiteContent } from '../../types';
import { RM_DEPARTMENTS } from '../../data/curriculum/departments';

export function HomePage({
  content,
  departments,
  courses,
  internships,
  loadingCourses,
  loadingInternships,
}: {
  content: WebsiteContent;
  departments: Department[];
  courses: Course[];
  internships: Internship[];
  loadingCourses: boolean;
  loadingInternships: boolean;
}) {
  const displayDepartments =
    departments.length > 0
      ? departments
      : RM_DEPARTMENTS.map((d) => ({ ...d, createdAt: null, updatedAt: null }));
  const featuredCourses = courses.slice(0, 3);
  const featuredInternships = internships.filter((i) => i.status === 'open').slice(0, 3);

  const pillars = [
    {
      num: '01',
      title: 'Practical Learning',
      desc: 'Structured modules and applied assignments designed to build real capability rather than passive video watching.',
      icon: BookOpen,
    },
    {
      num: '02',
      title: 'Skill Development',
      desc: 'Progressive curricula spanning foundational fluency to advanced execution with rubric-driven feedback.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Curated Learning Resources',
      desc: 'Authorized study notes, PDF handbooks, and module briefs organized directly inside your learning workspace.',
      icon: FileCheck2,
    },
    {
      num: '04',
      title: 'Internship Opportunities',
      desc: 'Direct application pathways into structured RM HEAVEN internship cohorts with clear outcomes and timelines.',
      icon: Briefcase,
    },
    {
      num: '05',
      title: 'Professional Development',
      desc: 'Accountable academic conduct, mentor evaluation, and verifiable completion certificates.',
      icon: Award,
    },
  ];

  const steps = [
    { step: '01', title: 'Register', desc: 'Review our Terms & Code of Conduct, verify your email, and establish your student profile.' },
    { step: '02', title: 'Explore Courses', desc: 'Browse published curricula, review module syllabi, and evaluate learning outcomes.' },
    { step: '03', title: 'Request Enrollment', desc: 'Submit an enrollment request directly from any course page with an optional study note.' },
    { step: '04', title: 'Wait for Admin Approval', desc: 'Administrators review every request to verify readiness and confirm cohort placement.' },
    { step: '05', title: 'Access Learning Dashboard', desc: 'Unlock authorized lessons, PDF materials, and assignments inside your personal portal.' },
    { step: '06', title: 'Complete Learning Activities', desc: 'Submit assignments, track module progress, apply for internships, and earn verified credentials.' },
  ];

  return (
    <div>
      {/* Optional CMS Announcement Banner */}
      {content.announcementBanner && content.announcementBanner.trim() && (
        <div className="border-b border-[#D5B77A]/40 bg-[#761D2D] px-4 py-2.5 text-center text-xs font-medium text-[#F8F4ED]">
          {content.announcementBanner}
        </div>
      )}

      {/* Hero Section */}
      <section className="border-b border-[#292323]/10 bg-[#F8F4ED]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <div className="flex items-center gap-3.5">
                <RmCrestMark size={56} />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  <RmHeavenWordmark suffix="Academy" />
                </span>
              </div>

              <h1
                className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-[#292323] sm:text-5xl lg:text-[3.5rem]"
                style={{ textWrap: 'balance' }}
              >
                {content.heroHeadline || 'Your Journey. Your Skills. Your Future.'}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#292323]/80 sm:text-lg">
                {content.heroSubtext ||
                  'RM HEAVEN unites structured online learning, mentor-reviewed assignments, and curated internship programmes within an accountable academic ecosystem.'}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors whitespace-nowrap"
                >
                  Explore Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#761D2D] bg-white px-6 py-3 text-sm font-semibold text-[#761D2D] hover:bg-[#761D2D] hover:text-white transition-colors whitespace-nowrap"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-[#292323]/12 bg-white shadow-sm">
                <BrandImage
                  src={BRAND_IMAGES.heroAcademy}
                  alt="RM HEAVEN architectural learning pavilion"
                  fallbackTitle="RM HEAVEN"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A. Welcome to RM HEAVEN */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#292323]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-wider uppercase">
                <RmHeavenWordmark prefix="Welcome to" />
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#292323] sm:text-4xl">
                {content.welcomeTitle || 'A Disciplined Standard in Online Education'}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-[#292323]/80">
                {content.welcomeBody ||
                  'Designed for ambitious learners who value depth over shortcuts, RM HEAVEN connects rigorous coursework with guided internship pathways. Every enrollment is personally reviewed, every assignment is evaluated with constructive feedback, and every credential is verifiable.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-[#761D2D]">
                <Link to="/about" className="inline-flex items-center gap-1.5 hover:underline">
                  Read About RM HEAVEN <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/verify" className="inline-flex items-center gap-1.5 hover:underline">
                  <ShieldCheck className="h-4 w-4" /> Verify a Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Departments */}
      <section className="bg-[#F8F4ED] py-14 border-b border-[#292323]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                Academic Schools
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#292323] sm:text-4xl">
                Four Specialized Departments
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638] whitespace-nowrap"
            >
              Explore Full Catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayDepartments.map((dept, idx) => {
              const deptCount = courses.filter(
                (c) => c.departmentId === dept.id || c.category === dept.name,
              ).length;
              return (
                <Link
                  key={dept.id}
                  to={`/courses?dept=${encodeURIComponent(dept.id)}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[#292323]/10 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#761D2D]/40"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#761D2D]">
                      <span className="font-mono">0{idx + 1}</span>
                      {deptCount > 0 && <span>{deptCount} Courses</span>}
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold text-[#292323] group-hover:text-[#761D2D]">
                      {dept.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#292323]/70 line-clamp-3">
                      {dept.description}
                    </p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#761D2D]">
                    View Courses <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* B. Explore Our Courses (Dynamic from Firestore) */}
      <section className="bg-[#F8F4ED] py-16 sm:py-20 border-b border-[#292323]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                Academic Catalogue
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#292323] sm:text-4xl">
                Explore Our Courses
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638] whitespace-nowrap"
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {loadingCourses ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-80 animate-pulse rounded-2xl border border-[#292323]/10 bg-white" />
                ))}
              </div>
            ) : featuredCourses.length === 0 ? (
              <EmptyState
                title="Courses Are Being Prepared"
                description="Published courses added by RM HEAVEN administrators will appear here automatically. Register your student account to be notified as new cohorts open."
                actionLabel="Register for Updates"
                onAction={() => {
                  window.location.href = '/register';
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {featuredCourses.map((course) => (
                  <article
                    key={course.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#292323]/10 bg-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#292323]/5">
                      <BrandImage
                        src={getCourseThumbnail(course)}
                        alt={course.title}
                        fallbackTitle={course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#761D2D]">
                        <span>{course.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.duration}</span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-[#292323]">
                        {course.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#292323]/75">
                        {course.shortDescription}
                      </p>
                      <div className="mt-5 pt-4 border-t border-[#292323]/10">
                        <Link
                          to={`/courses/${course.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638]"
                        >
                          Course Details <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* C. Internship Opportunities (Dynamic from Firestore) */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#292323]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                Applied Experience
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#292323] sm:text-4xl">
                Internship Opportunities
              </h2>
            </div>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638] whitespace-nowrap"
            >
              View All Programmes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {loadingInternships ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2].map((n) => (
                  <div key={n} className="h-64 animate-pulse rounded-2xl border border-[#292323]/10 bg-[#F8F4ED]" />
                ))}
              </div>
            ) : featuredInternships.length === 0 ? (
              <EmptyState
                title="No Open Internship Cohorts Right Now"
                description="Internship programmes published by administrators will be listed here with eligibility criteria, required skills, and application deadlines."
                actionLabel="Explore Courses"
                onAction={() => {
                  window.location.href = '/courses';
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {featuredInternships.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-2xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-6"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[#761D2D]">
                      <span>{item.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Deadline {item.deadline}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-[#292323]">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#292323]/75 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="mt-5 pt-4 border-t border-[#292323]/10">
                      <Link
                        to="/internships"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:text-[#8F2638]"
                      >
                        Review & Apply <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* D. Why Choose RM HEAVEN */}
      <section className="bg-[#292323] py-16 sm:py-20 text-[#F8F4ED]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#D5B77A] uppercase">
              Academic Standards
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8F4ED] sm:text-4xl">
              Why Choose RM HEAVEN?
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="rounded-2xl border border-[#F8F4ED]/12 bg-[#F8F4ED]/[0.04] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-[#D5B77A] tabular-nums">
                      {item.num}
                    </span>
                    <Icon className="h-5 w-5 text-[#D5B77A]" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-[#F8F4ED]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#F8F4ED]/75">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* E. How It Works */}
      <section className="bg-[#F8F4ED] py-16 sm:py-20 border-b border-[#292323]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
              Enrollment Pathway
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#292323] sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-[#292323]/10 bg-white p-6"
              >
                <span className="font-mono text-sm font-semibold text-[#761D2D] tabular-nums">
                  Step {s.step}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#292323]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. Call to Action */}
      <section className="bg-[#761D2D] py-16 text-[#F8F4ED]">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ textWrap: 'balance' }}>
            Begin Your Structured Learning & Internship Journey
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#F8F4ED]/85">
            Create your verified student account, review our academic standards, and request enrollment in your chosen programme.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-[#D5B77A] px-6 py-3 text-sm font-semibold text-[#292323] hover:bg-[#e3c88e] transition-colors whitespace-nowrap"
            >
              Register as a Student
            </Link>
            <Link
              to="/courses"
              className="rounded-lg border border-[#F8F4ED]/40 px-6 py-3 text-sm font-semibold text-[#F8F4ED] hover:bg-[#8F2638] transition-colors whitespace-nowrap"
            >
              Browse Course Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
