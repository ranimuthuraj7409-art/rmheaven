import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function ResourcesPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-[75vh] bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
            Academic Library & Verification
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
            Learning Resources
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#292323]/75">
            RM HEAVEN organizes course handbooks, module PDFs, and study references directly inside each approved course workspace to protect intellectual property and maintain curriculum quality.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
            <Lock className="h-6 w-6 text-[#761D2D]" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#292323]">
              Authorized Course PDFs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
              Course notes and study PDFs are accessible strictly to students whose enrollment request has been approved by an administrator.
            </p>
            <div className="mt-5">
              <Link
                to={user ? (isAdmin ? '/admin' : '/dashboard') : '/login'}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:underline"
              >
                {user ? 'Open My Learning Materials' : 'Sign In to Access'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
            <FileText className="h-6 w-6 text-[#761D2D]" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#292323]">
              Academic Policies & Conduct
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
              Review our platform rules covering material usage permissions, assignment originality, and disciplinary standards.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm font-semibold text-[#761D2D]">
              <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
              <Link to="/conduct" className="hover:underline">Student Code of Conduct</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
            <ShieldCheck className="h-6 w-6 text-[#761D2D]" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#292323]">
              Certificate Verification
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
              Employers and academic institutions can independently verify any RM HEAVEN course or internship certificate by its unique ID.
            </p>
            <div className="mt-5">
              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#761D2D] hover:underline"
              >
                Verify a Certificate <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[#292323]/10 bg-white p-8">
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 h-6 w-6 shrink-0 text-[#761D2D]" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#292323]">
                Download Permissions & Intellectual Property
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#292323]/80">
                Each course document uploaded by administrators carries an explicit download permission flag. Materials marked as view-only can be read inside the secure Student Dashboard viewer, while authorized downloadable handbooks include a direct download action. Redistribution outside RM HEAVEN is strictly prohibited under our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
