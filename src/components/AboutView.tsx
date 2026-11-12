import React from 'react';
import { WebsiteCMS, NavigationTab } from '../types';
import { MascotCharacter } from './MascotCharacter';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Target, Compass, Award, BookOpen, Users, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  cms: WebsiteCMS;
  onSelectTab: (tab: NavigationTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ cms, onSelectTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-3">
        <BrandLogo variant="badge" size="sm" brandName={cms.brandName} />
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
            Institutional Identity & Vision
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333] mt-1">
            About {cms.brandName}
          </h1>
          <p className="text-xs sm:text-sm text-[#817779] max-w-3xl leading-relaxed mt-1">
            An autonomous, dynamic academic internship and learning management ecosystem founded on principles of intellectual rigor, practical code execution, and unyielding student integrity.
          </p>
        </div>
      </div>

      {/* Narrative & Mascot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-8 space-y-6 text-xs sm:text-sm text-[#393333] leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold font-heading text-[#800020]">
              Educational Philosophy & Standard
            </h2>
            <p className="text-[#817779]">
              In contemporary technical landscapes—spanning distributed software systems, full-stack architectures, algorithmic search dynamics, and data-driven advertising—passive observation is insufficient. True competence demands deliberate practice, disciplined execution, and rigorous faculty review.
            </p>
            <p className="text-[#817779]">
              At {cms.brandName}, course enrollment is not an automatic open gate. Every student dossier is independently verified and approved by the Platform Owner to ensure candidates meet foundational prerequisites and commit to our academic Code of Conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 bg-white border border-[#EAE1DD] rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#800020]">
                <Target className="w-4 h-4 text-[#D6B878]" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs text-[#817779] leading-relaxed">
                {cms.welcomeSection.mission}
              </p>
            </div>

            <div className="p-5 bg-white border border-[#EAE1DD] rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#800020]">
                <Compass className="w-4 h-4 text-[#D6B878]" />
                <span>Teaching Approach</span>
              </div>
              <p className="text-xs text-[#817779] leading-relaxed">
                {cms.welcomeSection.teachingApproach}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-xl font-bold font-heading text-[#800020]">
              The Four Academic Pillars
            </h2>
            <div className="space-y-2.5 text-xs text-[#817779]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <span><strong>Disciplined Intellectual Rigor:</strong> Complete original study notes, algorithmic problem solving, and rigorous theoretical frameworks for every topic.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <span><strong>Protected Learning Vaults:</strong> High-value course notes and PDF manuals accessible strictly to approved students, safeguarding academic value.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <span><strong>Direct Faculty Evaluation:</strong> Assignment defenses and code reviews graded individually with qualitative feedback and points rubrics.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                <span><strong>Career Placement Pathways:</strong> Merit-based fellowship and internship positions connecting top performers with industry laboratories.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Mascot Column */}
        <div className="lg:col-span-4 flex justify-center">
          <MascotCharacter variant="hero" />
        </div>

      </div>

    </div>
  );
};
