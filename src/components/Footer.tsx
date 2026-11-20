import React from 'react';
import { Link } from 'react-router-dom';
import { RmCrestMark, RmHeavenWordmark } from './BrandAssets';
import type { WebsiteContent } from '../types';

export function Footer({ content }: { content: WebsiteContent }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#292323]/12 bg-[#292323] text-[#F8F4ED]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <RmCrestMark size={52} />
              <div>
                <p className="font-display text-2xl font-bold tracking-tight">
                  <RmHeavenWordmark variant="dark" />
                </p>
                <p className="text-xs text-[#D5B77A]">Online Learning & Internships</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#F8F4ED]/75">
              Structured skill development, mentor-reviewed assignments, and verifiable internship credentials.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#D5B77A]">Academic Navigation</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F8F4ED]/80">
              <li><Link to="/" className="hover:text-[#D5B77A] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#D5B77A] transition-colors">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-[#D5B77A] transition-colors">Courses</Link></li>
              <li><Link to="/internships" className="hover:text-[#D5B77A] transition-colors">Internships</Link></li>
              <li><Link to="/resources" className="hover:text-[#D5B77A] transition-colors">Learning Resources</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#D5B77A] transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#D5B77A]">Governance & Verification</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F8F4ED]/80">
              <li><Link to="/register" className="hover:text-[#D5B77A] transition-colors">Student Registration</Link></li>
              <li><Link to="/login" className="hover:text-[#D5B77A] transition-colors">Student Login</Link></li>
              <li><Link to="/verify" className="hover:text-[#D5B77A] transition-colors">Verify Certificate</Link></li>
              <li><Link to="/terms" className="hover:text-[#D5B77A] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#D5B77A] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/conduct" className="hover:text-[#D5B77A] transition-colors">Code of Conduct</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#D5B77A]">Admissions & Support</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F8F4ED]/80">
              <li>
                <a
                  href={`mailto:${content.contactEmail || 'rmheaven.edu@gmail.com'}`}
                  className="hover:text-[#D5B77A] transition-colors"
                >
                  {content.contactEmail || 'rmheaven.edu@gmail.com'}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${(content.contactPhone || '9025528671').replace(/\s+/g, '')}`}
                  className="hover:text-[#D5B77A] transition-colors tabular-nums"
                >
                  {content.contactPhone || '9025528671'}
                </a>
              </li>
              <li>{content.officeLocation || 'Online & Regional Academic Desk'}</li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-lg border border-[#D5B77A]/50 px-3.5 py-1.5 text-xs font-semibold text-[#D5B77A] hover:bg-[#D5B77A] hover:text-[#292323] transition-colors"
                >
                  Contact Admissions Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#F8F4ED]/12 pt-6 text-xs text-[#F8F4ED]/60 sm:flex-row sm:items-center">
          <p>© {year} RM HEAVEN. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/terms" className="hover:text-[#F8F4ED]">Terms</Link>
            <Link to="/privacy" className="hover:text-[#F8F4ED]">Privacy</Link>
            <Link to="/conduct" className="hover:text-[#F8F4ED]">Discipline & Conduct</Link>
            <Link to="/contact" className="hover:text-[#F8F4ED]">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
