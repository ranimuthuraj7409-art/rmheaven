import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RmCrestMark, RmHeavenWordmark } from './BrandAssets';

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', to: '/courses' },
    { label: 'Internships', to: '/internships' },
    { label: 'Resources', to: '/resources' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
  ];

  const primaryCta = user
    ? isAdmin
      ? { label: 'Admin Portal', to: '/admin' }
      : { label: 'Student Dashboard', to: '/dashboard' }
    : { label: 'Student Portal', to: '/login' };

  return (
    <header className="sticky top-0 z-40 border-b border-[#292323]/10 bg-[#F8F4ED]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Crest + Single-line Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight whitespace-nowrap shrink-0"
        >
          <RmCrestMark size={38} />
          <RmHeavenWordmark />
        </Link>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {navLinks.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors border-b-2 py-1 ${
                  active
                    ? 'border-[#761D2D] text-[#761D2D]'
                    : 'border-transparent text-[#292323]/80 hover:text-[#761D2D] hover:border-[#D5B77A]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={primaryCta.to}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#761D2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F2638] transition-colors whitespace-nowrap shrink-0"
          >
            {primaryCta.label}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-[#292323]/15 p-2 text-[#292323] hover:bg-white"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#292323]/10 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#292323] hover:bg-[#F8F4ED] hover:text-[#761D2D]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#292323] hover:bg-[#F8F4ED] hover:text-[#761D2D]"
            >
              Contact Us
            </Link>
            <div className="mt-2 border-t border-[#292323]/10 pt-3 flex flex-col gap-2">
              <Link
                to={primaryCta.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#761D2D] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {primaryCta.label}
              </Link>
              {!user && (
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[#761D2D] px-4 py-2.5 text-center text-sm font-semibold text-[#761D2D]"
                >
                  Start Your Journey
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
