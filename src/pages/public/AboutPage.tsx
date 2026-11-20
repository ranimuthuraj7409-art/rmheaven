import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Briefcase, Award } from 'lucide-react';
import { BRAND_IMAGES } from '../../constants/legal';
import { BrandImage, RmCrestMark, RmHeavenWordmark } from '../../components/BrandAssets';

export function AboutPage() {
  return (
    <div className="bg-[#F8F4ED]">
      <section className="border-b border-[#292323]/10 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <div className="flex items-center gap-3">
                <RmCrestMark size={44} />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  <RmHeavenWordmark prefix="About" />
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
                Built on Academic Discipline & Applied Merit
              </h1>
              <p className="mt-5 text-base leading-relaxed text-[#292323]/80">
                RM HEAVEN is an online learning and internship management platform committed to measurable skill development, transparent enrollment governance, and verified achievement.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#292323]/80">
                Rather than offering unverified click-through badges, every course enrollment is reviewed by administrators, every assignment receives structured feedback, and every issued certificate carries an auditable verification code.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="h-full min-h-[300px] overflow-hidden rounded-2xl border border-[#292323]/12">
                <BrandImage
                  src={BRAND_IMAGES.internshipHall}
                  alt="RM HEAVEN executive seminar environment"
                  fallbackTitle="RM HEAVEN"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-[#292323]">Core Institutional Commitments</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: 'Curated Curriculum',
                text: 'Courses organized into clear modules, focused lessons, and authorized reading materials.',
              },
              {
                icon: ShieldCheck,
                title: 'Verified Governance',
                text: 'Strict academic integrity, role-based security, and explicit administrative approval.',
              },
              {
                icon: Briefcase,
                title: 'Guided Internships',
                text: 'Structured internship cohorts with defined eligibility, required skills, and real deliverables.',
              },
              {
                icon: Award,
                title: 'Authentic Credentials',
                text: 'Unique certificate IDs and public verification lookup without exposing student privacy.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-[#292323]/10 bg-white p-6">
                  <Icon className="h-6 w-6 text-[#761D2D]" />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-[#292323]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              to="/conduct"
              className="rounded-lg border border-[#292323]/20 bg-white px-6 py-3 text-sm font-semibold text-[#292323] hover:border-[#761D2D] hover:text-[#761D2D] transition-colors"
            >
              Read Code of Conduct
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
