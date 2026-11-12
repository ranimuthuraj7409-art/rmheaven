import React from 'react';
import { PolicyDocument, NavigationTab } from '../types';
import { ShieldCheck, Calendar, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

interface TermsViewProps {
  policy: PolicyDocument;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const TermsView: React.FC<TermsViewProps> = ({ policy, onSelectTab, brandName }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FCFAF8] text-[#393333]">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#817779]">
        <button onClick={() => onSelectTab('home')} className="hover:text-[#800020] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="text-[#393333] font-medium">Terms & Conditions</span>
      </div>

      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F3EE] border border-[#EAE1DD] rounded-full text-xs font-semibold text-[#800020]">
          <ShieldCheck className="w-4 h-4 text-[#D6B878]" />
          <span>Official Legal Governance Document</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Terms and Conditions of Educational Service
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#817779] pt-1">
          <span>Platform: <strong>{brandName}</strong></span>
          <span>·</span>
          <span>Version: <strong>{policy.version}</strong></span>
          <span>·</span>
          <span>Effective Date: <strong>{policy.effectiveDate}</strong></span>
        </div>
      </div>

      {/* Legal Advisory Callout */}
      <div className="p-4 bg-[#F8F3EE] border border-[#EAE1DD] rounded-xl text-xs text-[#817779] flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          These terms represent an autonomous educational agreement between enrolled students and the platform governance. Registered students must accept these terms during registration and re-verify whenever material updates are published.
        </p>
      </div>

      {/* Document Content */}
      <div className="bg-white border border-[#EAE1DD] rounded-2xl p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-[#393333] leading-relaxed whitespace-pre-line font-sans">
        {policy.content}
      </div>

      {/* Version Changelog & Audit Trail */}
      <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#800020] uppercase tracking-wider">
          Compliance Version History & Audit Trail
        </h3>
        <div className="divide-y divide-[#EAE1DD] text-xs">
          {policy.changelog.map((log, idx) => (
            <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-mono font-bold text-[#393333]">{log.version}</span>
                <span className="text-[#817779] ml-2">— {log.summary}</span>
              </div>
              <span className="text-[11px] font-mono text-[#702D3D]">{log.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => onSelectTab('discipline')}
          className="text-xs font-semibold text-[#800020] hover:underline"
        >
          Next: Read Student Discipline Policy →
        </button>
        <button
          onClick={() => onSelectTab('register')}
          className="px-6 py-2.5 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors"
        >
          Proceed to Registration
        </button>
      </div>

    </div>
  );
};
