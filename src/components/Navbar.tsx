import React, { useState } from 'react';
import { NavigationTab, UserRole } from '../types';
import { BrandLogo } from './BrandLogo';
import { Menu, X, Shield, User, ChevronDown, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  studentName?: string;
  pendingRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  brandName,
  userRole,
  onSelectRole,
  studentName = 'Aditya Vardhan',
  pendingRequestsCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks: { label: string; tab: NavigationTab }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Courses', tab: 'courses' },
    { label: 'Internships', tab: 'internships' },
    { label: 'Resources', tab: 'resources' },
    { label: 'Announcements', tab: 'announcements' },
    { label: 'Contact', tab: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EAE1DD] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Official Brand Logo & Lockup */}
          <BrandLogo
            variant="lockup"
            size="md"
            brandName={brandName}
            onClick={() => onSelectTab('home')}
          />

          {/* Navigation Links (Home | About | Courses | Internships | Resources | Announcements | Contact) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wide">
            {navLinks.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => onSelectTab(item.tab)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#800020] font-bold'
                      : 'text-[#817779] hover:text-[#393333]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#800020] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Role & Portal Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#393333] border border-[#EAE1DD] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {userRole === 'owner' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-[#800020]" />
                    <span className="font-semibold text-[#800020]">Owner Mode</span>
                    {pendingRequestsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#800020]" />
                    )}
                  </>
                ) : userRole === 'student' ? (
                  <>
                    <User className="w-3.5 h-3.5 text-[#702D3D]" />
                    <span>Student: {studentName.split(' ')[0]}</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-[#817779]" />
                    <span>Portal Access</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 text-[#817779]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-[#393333] rounded-xl shadow-xl border border-[#EAE1DD] py-2 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#817779] tracking-wider">
                    Role & Mode Switcher
                  </div>
                  <button
                    onClick={() => {
                      onSelectRole('student');
                      onSelectTab('student-dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F8F3EE] flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#393333]">Student Dashboard</span>
                    {userRole === 'student' && <span className="text-[#800020] font-bold text-[11px]">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('owner');
                      onSelectTab('admin-dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F8F3EE] flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#800020]">Owner Admin Console</span>
                    {userRole === 'owner' && <span className="text-[#800020] font-bold text-[11px]">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('guest');
                      onSelectTab('home');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#F8F3EE] flex items-center justify-between text-[#817779]"
                  >
                    <span>Public Guest View</span>
                    {userRole === 'guest' && <span className="text-[#702D3D] font-bold text-[11px]">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Direct Login and Register Buttons */}
            {userRole === 'student' ? (
              <button
                onClick={() => onSelectTab('student-dashboard')}
                className="px-4 py-2 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                My Dashboard
              </button>
            ) : userRole === 'owner' ? (
              <button
                onClick={() => onSelectTab('admin-dashboard')}
                className="px-4 py-2 text-xs font-semibold bg-[#702D3D] hover:bg-[#592330] text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Owner Panel
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-[#702D3D] hover:text-[#800020] transition-colors whitespace-nowrap"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onSelectTab('register')}
                  className="px-4 py-2 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  Register Now
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#702D3D] hover:text-[#800020] rounded-lg hover:bg-[#F8F3EE]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAE1DD] px-4 pt-2 pb-5 space-y-1">
          {navLinks.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#800020] text-white font-semibold'
                    : 'text-[#393333] hover:bg-[#F8F3EE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#EAE1DD] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTab('login');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs text-center font-medium bg-[#F8F3EE] text-[#393333] border border-[#EAE1DD] rounded-lg"
            >
              Student Login
            </button>
            <button
              onClick={() => {
                onSelectTab('register');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs text-center font-semibold bg-[#800020] text-white rounded-lg"
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
