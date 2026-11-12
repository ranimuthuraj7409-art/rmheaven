import React, { useState } from 'react';
import { NavigationTab, UserRole } from '../types';
import { MascotCharacter } from './MascotCharacter';
import { BrandLogo } from './BrandLogo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onSelectTab,
  brandName
}) => {
  const [email, setEmail] = useState('aditya.v@student.ac.in');
  const [password, setPassword] = useState('academic2026');
  const [roleOption, setRoleOption] = useState<'student' | 'owner'>('student');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (roleOption === 'owner') {
      onLoginSuccess(email.trim(), 'owner');
      onSelectTab('admin-dashboard');
    } else {
      onLoginSuccess(email.trim(), 'student');
      onSelectTab('student-dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#FCFAF8] text-[#393333]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-[#EAE1DD] rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Left Form */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <BrandLogo variant="badge" size="sm" brandName={brandName} />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
                Access Gateway
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#393333] mt-1">
                Sign In to Your Account
              </h1>
              <p className="text-xs text-[#817779] mt-1">
                Access your enrolled courses, protected study notes, assignments, and mentorship.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-[#EAD5D8]/40 border border-[#800020]/20 rounded-xl text-xs text-[#800020] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotPasswordNotice && (
            <div className="p-3.5 bg-[#F8F3EE] border border-[#EAE1DD] rounded-xl text-xs text-[#702D3D]">
              A secure password reset link has been dispatched to your institutional email.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Account Role Selector */}
            <div>
              <label className="block font-semibold text-[#393333] mb-1">Select Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRoleOption('student');
                    setEmail('aditya.v@student.ac.in');
                  }}
                  className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                    roleOption === 'student'
                      ? 'border-[#800020] bg-[#F8F3EE] text-[#800020] font-bold'
                      : 'border-[#EAE1DD] text-[#817779] hover:bg-[#FCFAF8]'
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoleOption('owner');
                    setEmail('owner@platform.edu');
                  }}
                  className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                    roleOption === 'owner'
                      ? 'border-[#800020] bg-[#F8F3EE] text-[#800020] font-bold'
                      : 'border-[#EAE1DD] text-[#817779] hover:bg-[#FCFAF8]'
                  }`}
                >
                  Platform Owner (Admin)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#393333] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#817779] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@institution.ac.in"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#393333]">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(true)}
                  className="text-[11px] text-[#702D3D] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#817779] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#EAE1DD] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#800020] bg-[#FCFAF8]"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-md transition-colors"
              >
                Sign In to {roleOption === 'owner' ? 'Owner Admin Console' : 'Student Portal'}
              </button>
            </div>

            <div className="pt-3 border-t border-[#EAE1DD] flex items-center justify-between text-xs text-[#817779]">
              <span>Don't have an account yet?</span>
              <button
                type="button"
                onClick={() => onSelectTab('register')}
                className="font-semibold text-[#800020] hover:underline"
              >
                Create Account →
              </button>
            </div>
          </form>
        </div>

        {/* Right Mascot Card */}
        <div className="md:col-span-5 flex justify-center">
          <MascotCharacter variant="login" />
        </div>

      </div>
    </div>
  );
};
