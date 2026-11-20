import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RmHeavenWordmark } from '../../components/BrandAssets';

export function HowItWorksPage() {
  const stages = [
    {
      num: '01',
      title: 'Review Guidelines & Register',
      detail:
        'Every new learner begins by reading our Welcome Brief, Terms & Conditions, and Student Discipline & Code of Conduct. Once accepted and verified via email, your student profile is activated.',
    },
    {
      num: '02',
      title: 'Explore Courses & Syllabi',
      detail:
        'Browse published courses, inspect level and duration metadata, and review module outlines before committing to a learning track.',
    },
    {
      num: '03',
      title: 'Submit an Enrollment Request',
      detail:
        'Click Enroll Now on any published course. Your request is logged with Pending Approval status and routed immediately to RM HEAVEN administrators.',
    },
    {
      num: '04',
      title: 'Administrative Review & Approval',
      detail:
        'Administrators review every enrollment request. Approval writes an authoritative enrollment record in Firebase, unlocking course access and sending an in-app notification.',
    },
    {
      num: '05',
      title: 'Study Modules, Materials & Assignments',
      detail:
        'Access lessons, read authorized PDF notes, track module progress, and submit assignments before their deadlines for marks and written evaluator feedback.',
    },
    {
      num: '06',
      title: 'Apply for Internships & Earn Certificates',
      detail:
        'Apply for open internship cohorts directly from your dashboard and receive verifiable RM HEAVEN certificates upon verified programme completion.',
    },
  ];

  return (
    <div className="bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
            Academic Process
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
            <RmHeavenWordmark prefix="How" suffix="Works" />
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#292323]/75">
            A transparent six-stage journey designed for serious learning, verified access, and accountable mentorship.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {stages.map((s) => (
            <div
              key={s.num}
              className="flex flex-col gap-4 rounded-2xl border border-[#292323]/10 bg-white p-6 sm:flex-row sm:items-start sm:gap-6"
            >
              <span className="font-mono text-lg font-semibold text-[#761D2D] tabular-nums shrink-0">
                {s.num}
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#292323]">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#292323]/80">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors"
          >
            Start Registration <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/courses"
            className="rounded-lg border border-[#292323]/20 bg-white px-6 py-3 text-sm font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D]"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
