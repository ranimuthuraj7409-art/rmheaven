import React from 'react';
import { PdfDocument, Course, NavigationTab, StudentProfile } from '../types';
import { FileText, Download, Lock, CheckCircle2, ShieldCheck, BookOpen } from 'lucide-react';

interface ResourcesViewProps {
  pdfDocuments: PdfDocument[];
  courses: Course[];
  studentProfile?: StudentProfile;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  pdfDocuments,
  courses,
  studentProfile,
  onSelectTab,
  brandName
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
          Academic Vault
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Learning Resources & Study Handbooks
        </h1>
        <p className="text-xs sm:text-sm text-[#817779] max-w-3xl leading-relaxed">
          Comprehensive curriculum textbooks, code specifications, and field manuals. All materials are copyrighted property of {brandName} and protected against unauthorized redistribution.
        </p>
      </div>

      {/* Advisory Note on Access */}
      <div className="p-5 bg-white border-2 border-[#D6B878]/60 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#800020] shrink-0" />
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-[#393333]">Protected Material Governance</h3>
            <p className="text-xs text-[#817779]">
              To access protected PDF master guides and lesson study notes, log in with an approved student account.
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectTab('login')}
          className="px-5 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded-xl hover:bg-[#630018] shrink-0"
        >
          Sign In to Access Vault
        </button>
      </div>

      {/* PDF Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pdfDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border-2 border-[#EAE1DD] rounded-2xl p-7 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#817779]">
                <span className="font-mono text-[#800020] font-bold">{doc.fileSize} · PDF HandBook</span>
                <span className="font-mono text-[11px]">Uploaded: {doc.uploadDate}</span>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-7 h-7 text-[#D6B878] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#393333]">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#702D3D] mt-0.5">
                    File: {doc.fileName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#817779] leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#EAE1DD] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#817779]">
                <Lock className="w-3.5 h-3.5 text-[#800020]" />
                <span>Protected Intellectual Property</span>
              </div>
              <button
                onClick={() => onSelectTab('login')}
                className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold bg-[#F8F3EE] hover:bg-[#F1E8DC] text-[#702D3D] border border-[#EAE1DD] rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (Student Login)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
