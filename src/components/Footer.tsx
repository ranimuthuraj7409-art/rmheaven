import React from 'react';
import { NavigationTab } from '../types';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, brandName }) => {
  return (
    <footer className="bg-[#F8F3EE] text-[#393333] border-t border-[#EAE1DD] pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#EAE1DD]">
          
          {/* Column 1: Identity & Official Logo */}
          <div className="space-y-4">
            <BrandLogo
              variant="lockup"
              size="md"
              brandName={brandName}
              subtitleText="Academic & Learning Management"
              onClick={() => onSelectTab('home')}
            />
            <p className="text-[#817779] text-xs leading-relaxed">
              A disciplined, industry-calibrated academic platform providing dynamic course modules, protected study notes, rigorous assignment evaluations, and verified research internships.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#800020] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D6B878]" />
              <span>Owner-Approved Access & Verified Credentials</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#800020] uppercase tracking-wider text-xs">
              Platform Sections
            </h4>
            <ul className="space-y-2 text-[#817779]">
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-[#800020] transition-colors"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('courses')}
                  className="hover:text-[#800020] transition-colors"
                >
                  Courses: Coding & Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('internships')}
                  className="hover:text-[#800020] transition-colors"
                >
                  Internship Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('resources')}
                  className="hover:text-[#800020] transition-colors"
                >
                  Learning Resources & Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('announcements')}
                  className="hover:text-[#800020] transition-colors"
                >
                  Official Announcements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('login')}
                  className="hover:text-[#800020] transition-colors font-medium text-[#702D3D]"
                >
                  Student Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#800020] uppercase tracking-wider text-xs">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-[#817779]">
              <li>
                <button
                  onClick={() => onSelectTab('terms')}
                  className="hover:text-[#800020] transition-colors font-medium"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('discipline')}
                  className="hover:text-[#800020] transition-colors font-medium text-[#702D3D]"
                >
                  Student Discipline & Code of Conduct
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('privacy')}
                  className="hover:text-[#800020] transition-colors font-medium"
                >
                  Privacy & Data Protection Policy
                </button>
              </li>
              <li className="pt-2 text-[11px] text-[#817779]">
                Policy Version: <strong>2.4-ACAD</strong> (Updated March 2026)
              </li>
            </ul>
          </div>

          {/* Column 4: Secretariat & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#800020] uppercase tracking-wider text-xs">
              Academic Secretariat
            </h4>
            <div className="space-y-2 text-[#817779] text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D6B878] shrink-0 mt-0.5" />
                <span>Knowledge Campus Phase I, Tech Corridor, Bangalore 560103</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6B878] shrink-0" />
                <span className="font-mono text-[#702D3D]">admissions@platform.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D6B878] shrink-0" />
                <span>+91 (080) 4120-8800</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-[#817779]">
              Hours: Mon – Fri: 09:00 AM – 05:30 PM
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#817779] gap-4">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved. Unauthorized redistribution of course notes is prohibited.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('terms')} className="hover:text-[#800020]">
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => onSelectTab('discipline')} className="hover:text-[#800020]">
              Discipline Policy
            </button>
            <span>·</span>
            <button onClick={() => onSelectTab('privacy')} className="hover:text-[#800020]">
              Privacy Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
