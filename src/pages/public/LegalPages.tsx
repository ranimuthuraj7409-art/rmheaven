import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, XCircle } from 'lucide-react';
import {
  CONDUCT_PRINCIPLES,
  CONDUCT_VERSION,
  PRIVACY_SECTIONS,
  PRIVACY_VERSION,
  TERMS_SECTIONS,
  TERMS_VERSION,
} from '../../constants/legal';
import { formatTimestamp, verifyCertificateByCode } from '../../firebase/services';
import { StatusLabel } from '../../components/BrandAssets';
import type { CertificateVerification } from '../../types';

export function TermsPage() {
  return (
    <div className="bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 sm:p-12">
          <p className="font-mono text-xs font-medium text-[#761D2D]">
            Document Version {TERMS_VERSION}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#292323]">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#292323]/75">
            These Terms & Conditions govern student registration, course enrollment, intellectual property, certificate eligibility, and platform usage on RM HEAVEN.
          </p>

          <div className="mt-8 space-y-6 border-t border-[#292323]/10 pt-8">
            {TERMS_SECTIONS.map((sec) => (
              <section key={sec.title}>
                <h2 className="font-display text-2xl font-semibold text-[#292323]">{sec.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#292323]/80">{sec.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#292323]/10 pt-6 text-sm">
            <Link to="/conduct" className="font-semibold text-[#761D2D] hover:underline">
              Read Student Code of Conduct
            </Link>
            <Link to="/register" className="font-semibold text-[#761D2D] hover:underline">
              Proceed to Student Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 sm:p-12">
          <p className="font-mono text-xs font-medium text-[#761D2D]">
            Document Version {PRIVACY_VERSION}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#292323]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#292323]/75">
            RM HEAVEN protects student privacy through strict role-based isolation, verified authentication, and minimal public disclosure.
          </p>

          <div className="mt-8 space-y-6 border-t border-[#292323]/10 pt-8">
            {PRIVACY_SECTIONS.map((sec) => (
              <section key={sec.title}>
                <h2 className="font-display text-2xl font-semibold text-[#292323]">{sec.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#292323]/80">{sec.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConductPage() {
  return (
    <div className="bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 sm:p-12">
          <p className="font-mono text-xs font-medium text-[#761D2D]">
            Document Version {CONDUCT_VERSION}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#292323]">
            Student Discipline & Code of Conduct
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#292323]/75">
            Every student at RM HEAVEN commits to upholding these nine standards of integrity, respect, and institutional discipline throughout all courses and internships.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#292323]/10 pt-8 sm:grid-cols-2">
            {CONDUCT_PRINCIPLES.map((item, idx) => (
              <div key={item.title} className="rounded-xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-5">
                <span className="font-mono text-xs font-semibold text-[#761D2D] tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#292323]">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#292323]/80">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#292323]/10 pt-6 text-sm">
            <Link to="/terms" className="font-semibold text-[#761D2D] hover:underline">
              Read Terms & Conditions
            </Link>
            <Link to="/register" className="font-semibold text-[#761D2D] hover:underline">
              Proceed to Student Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VerifyCertificatePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<CertificateVerification | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const record = await verifyCertificateByCode(code);
      setResult(record);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3 text-[#761D2D]">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              Credential Verification
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#292323]">
            Verify an RM HEAVEN Certificate
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
            Enter the unique certificate code (for example, <span className="font-mono">RMH-2026-XXXXXX</span>) to confirm authenticity directly against RM HEAVEN records.
          </p>

          <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292323]/45" />
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Certificate ID (e.g. RMH-2026-A9K2P4)"
                className="w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-2.5 pl-10 pr-4 font-mono text-sm uppercase focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#761D2D] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          {searched && (
            <div className="mt-8 border-t border-[#292323]/10 pt-6">
              {result ? (
                <div className="rounded-xl border border-[#D5B77A]/60 bg-[#F8F4ED]/70 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm font-semibold text-[#761D2D]">
                      {result.certificateCode}
                    </span>
                    <StatusLabel status={result.status} />
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-[#292323]">
                    {result.recipientName}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#292323]/80">
                    {result.programType}: {result.programTitle}
                  </p>
                  <p className="mt-2 text-xs text-[#292323]/65 tabular-nums">
                    Issued on {formatTimestamp(result.issuedAt)}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-[#B4434D]/30 bg-[#B4434D]/8 p-5">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B4434D]" />
                  <div>
                    <p className="text-sm font-semibold text-[#292323]">No Matching Certificate Found</p>
                    <p className="mt-1 text-xs text-[#292323]/75">
                      Confirm the certificate code exactly as printed and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
