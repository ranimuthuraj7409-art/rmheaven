import React, { useState } from 'react';
import { Internship, InternshipApplication, NavigationTab } from '../types';
import { Search, MapPin, Calendar, Briefcase, CheckCircle2, ArrowRight, X, Upload, FileText, AlertCircle } from 'lucide-react';

interface InternshipsViewProps {
  internships: Internship[];
  onApplyInternship: (application: Omit<InternshipApplication, 'id' | 'appliedDate' | 'status'>) => void;
  onSelectTab: (tab: NavigationTab) => void;
  brandName: string;
}

export const InternshipsView: React.FC<InternshipsViewProps> = ({
  internships,
  onApplyInternship,
  onSelectTab,
  brandName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');

  // Application modal state
  const [applyingInternship, setApplyingInternship] = useState<Internship | null>(null);
  const [applicantName, setApplicantName] = useState('Aditya Vardhan Raman');
  const [applicantEmail, setApplicantEmail] = useState('aditya.v@student.ac.in');
  const [applicantPhone, setApplicantPhone] = useState('+91 98765 43210');
  const [applicantCollege, setApplicantCollege] = useState('National Institute of Technology');
  const [sop, setSop] = useState('Eager to contribute directly to laboratory systems engineering benchmarks.');
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string } | null>({
    name: 'Aditya_Vardhan_Academic_CV_2026.pdf',
    size: '348 KB'
  });
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filtered = internships.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = modeFilter === 'All' || item.workMode === modeFilter;
    return matchesSearch && matchesMode;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingInternship || !applicantName.trim() || !applicantEmail.trim() || !resumeFile) return;

    onApplyInternship({
      internshipId: applyingInternship.id,
      internshipTitle: applyingInternship.title,
      studentId: 'std-2026-0842',
      studentName: applicantName.trim(),
      studentEmail: applicantEmail.trim(),
      studentCollege: applicantCollege.trim(),
      studentPhone: applicantPhone.trim(),
      resumeFileName: resumeFile.name,
      resumeFileSize: resumeFile.size,
      statementOfPurpose: sop.trim()
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setApplyingInternship(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
          Research & Placement Directorate
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Academic & Technical Internship Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-[#817779] max-w-3xl leading-relaxed">
          Explore officially sanctioned research and industry fellowship positions. Applications are evaluated based on technical merit, coursework completion, and laboratory needs.
        </p>
      </div>

      {/* Executive Career Mentor Banner */}
      <div className="bg-gradient-to-r from-white via-[#F8F3EE] to-white border-2 border-[#D6B878]/60 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl overflow-hidden bg-white border-2 border-[#D6B878] shrink-0 shadow-xs">
            <img
              src="/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png"
              alt="RM Heaven Career Mentor"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#800020] bg-[#EAD5D8]/50 px-2 py-0.5 rounded">
              Direct Placement Pipeline
            </span>
            <h3 className="text-base sm:text-lg font-bold font-heading text-[#393333]">
              Gain Industry-Ready Technical Experience
            </h3>
            <p className="text-xs text-[#817779] max-w-xl leading-relaxed">
              All listed internships offer direct mentor guidance, live production repository access, and official institutional recommendations upon successful completion.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAE1DD] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#817779]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, department, or skill..."
            className="w-full pl-8 pr-3 py-2 border border-[#EAE1DD] rounded-xl bg-[#FCFAF8] focus:outline-none focus:ring-1 focus:ring-[#800020]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[#817779] font-medium">Work Mode:</span>
          {['All', 'On-site', 'Remote', 'Hybrid'].map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                modeFilter === mode
                  ? 'border-[#800020] bg-[#F8F3EE] text-[#800020] font-bold'
                  : 'border-[#EAE1DD] text-[#817779] hover:bg-[#FCFAF8]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white border-2 border-[#EAE1DD] hover:border-[#800020]/40 rounded-2xl p-7 shadow-xs flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#817779]">
                <span className="font-semibold text-[#800020]">{item.department}</span>
                <span className="font-mono text-[11px] bg-[#F8F3EE] px-2 py-0.5 rounded text-[#702D3D]">
                  {item.workMode} · {item.duration}
                </span>
              </div>

              <h2 className="text-xl font-bold font-heading text-[#393333]">
                {item.title}
              </h2>

              <p className="text-xs text-[#817779] leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 bg-[#FCFAF8] border border-[#EAE1DD] rounded-xl text-xs text-[#393333] space-y-1">
                <span className="font-semibold block text-[11px]">Eligibility:</span>
                <p className="text-[#817779]">{item.eligibility}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.skills.map((sk, sIdx) => (
                  <span key={sIdx} className="text-[10px] bg-[#F8F3EE] text-[#702D3D] px-2 py-0.5 rounded border border-[#EAE1DD]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE1DD] flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-[#817779] block">Application Deadline:</span>
                <span className="font-mono font-bold text-[#800020]">{item.deadline}</span>
              </div>
              <button
                onClick={() => setApplyingInternship(item)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors"
              >
                <span>Apply for Fellowship</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {applyingInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-[#EAE1DD] p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE1DD]">
              <div>
                <span className="text-[10px] font-bold text-[#800020] uppercase">Internship Application Dossier</span>
                <h3 className="text-sm font-bold text-[#393333]">{applyingInternship.title}</h3>
              </div>
              <button onClick={() => setApplyingInternship(null)} className="text-[#817779] hover:text-[#393333]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-24 h-36 mx-auto rounded-2xl overflow-hidden bg-white border-2 border-[#D6B878] shadow-sm">
                  <img
                    src="/assets/aistudio/Confident_Lion_Executive_with_Laptop_2cf6151e.png"
                    alt="Application Received"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#393333]">Application Submitted Successfully!</h4>
                  <p className="text-xs text-[#817779]">Your dossier has been logged in the admissions queue for faculty review.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#393333] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#393333] mb-1">Email</label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#393333] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#393333] mb-1">College</label>
                    <input
                      type="text"
                      value={applicantCollege}
                      onChange={(e) => setApplicantCollege(e.target.value)}
                      className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Statement of Purpose / Research Interest</label>
                  <textarea
                    rows={3}
                    value={sop}
                    onChange={(e) => setSop(e.target.value)}
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Academic Resume (PDF format)</label>
                  <div className="p-3 bg-[#F8F3EE] border border-[#EAE1DD] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#800020]" />
                      <span className="font-medium text-[#393333]">{resumeFile?.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#817779]">{resumeFile?.size}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE1DD]">
                  <button
                    type="button"
                    onClick={() => setApplyingInternship(null)}
                    className="px-4 py-2 border border-[#EAE1DD] rounded-lg text-[#817779]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#800020] text-white rounded-lg font-semibold hover:bg-[#630018]"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
