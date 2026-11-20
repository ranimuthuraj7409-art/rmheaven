import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, X, Send } from 'lucide-react';
import { applyForInternship } from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { EmptyState, LoadingState, StatusLabel } from '../../components/BrandAssets';
import type { Internship } from '../../types';

export function InternshipsPage({
  internships,
  loading,
}: {
  internships: Internship[];
  loading: boolean;
}) {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [sop, setSop] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return internships.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.skillsRequired.some((s) => s.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [internships, search, statusFilter]);

  const handleOpenApply = (internship: Internship) => {
    if (!user) {
      navigate('/login', { state: { from: '/internships' } });
      return;
    }
    if (!user.emailVerified) {
      showToast('Verify Your Email', 'warning', 'Please verify your email in the Student Dashboard before applying.');
      navigate('/dashboard');
      return;
    }
    if (!profile) {
      showToast('Profile Required', 'warning', 'Complete student registration before applying for internships.');
      navigate('/register');
      return;
    }
    setSelectedInternship(internship);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship || !profile) return;
    if (sop.trim().length < 10) {
      showToast('Statement Too Short', 'error', 'Please write at least 10 characters explaining your interest.');
      return;
    }
    setSubmitting(true);
    try {
      await applyForInternship({
        internship: selectedInternship,
        student: profile,
        statementOfPurpose: sop,
        portfolioUrl,
      });
      showToast('Application Submitted', 'success', `Applied to "${selectedInternship.title}". Track updates in My Applications.`);
      setSelectedInternship(null);
      setSop('');
      setPortfolioUrl('');
    } catch (err) {
      showToast('Application Failed', 'error', err instanceof Error ? err.message : 'Unable to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
            Internship Programmes
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
            Applied Learning & Internships
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#292323]/75">
            Review programme eligibility, required skills, expected outcomes, and application deadlines before submitting your candidacy.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#292323]/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#292323]/45" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, department, or skill..."
              className="w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 py-2 pl-10 pr-4 text-sm text-[#292323] focus:border-[#761D2D] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#F8F4ED] p-1">
            {(['all', 'open', 'closed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === st ? 'bg-[#761D2D] text-white' : 'text-[#292323]/75 hover:text-[#292323]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {loading ? (
            <LoadingState message="Loading internship programmes..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No Internship Programmes Listed"
              description="Administrators can publish internship programmes directly from the Admin Dashboard. Check back soon or explore our courses."
              actionLabel="Explore Courses"
              onAction={() => navigate('/courses')}
            />
          ) : (
            filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#292323]/10 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#761D2D]">
                      <span>{item.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Deadline: {item.deadline}</span>
                    </div>
                    <h2 className="mt-2 font-display text-3xl font-bold text-[#292323]">
                      {item.title}
                    </h2>
                  </div>
                  <StatusLabel status={item.status === 'open' ? 'Open' : 'Closed'} />
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#292323]/80">
                  {item.description}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 border-t border-[#292323]/10 pt-6 md:grid-cols-3">
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                      Eligibility
                    </h3>
                    <p className="mt-2 text-sm text-[#292323]/80">{item.eligibility}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                      Skills Required
                    </h3>
                    <p className="mt-2 text-sm text-[#292323]/80">
                      {item.skillsRequired.join(' · ') || 'Foundational readiness'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                      Learning Outcomes
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-[#292323]/80">
                      {item.learningOutcomes.map((o, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#761D2D]" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end border-t border-[#292323]/10 pt-5">
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => navigate('/admin')}
                      className="rounded-lg border border-[#761D2D] px-4 py-2 text-xs font-semibold text-[#761D2D] hover:bg-[#F8F4ED]"
                    >
                      Manage Applications in Admin
                    </button>
                  ) : item.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenApply(item)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Apply for Internship
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-[#292323]/55">
                      Applications closed for this cohort
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Application Modal */}
      {selectedInternship && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#292323]/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#292323]/12 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#761D2D] uppercase">Internship Application</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-[#292323]">
                  {selectedInternship.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInternship(null)}
                className="rounded-lg p-1.5 text-[#292323]/60 hover:bg-[#F8F4ED]"
                aria-label="Close application form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Statement of Purpose (Required)
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={3000}
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  placeholder="Describe your relevant coursework, skills, and what you aim to contribute and learn..."
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3 text-sm text-[#292323] focus:border-[#761D2D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Portfolio / Project Link (Optional)
                </label>
                <input
                  type="url"
                  maxLength={500}
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm text-[#292323] focus:border-[#761D2D] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInternship(null)}
                  className="rounded-lg border border-[#292323]/15 px-4 py-2 text-sm font-medium text-[#292323] hover:bg-[#F8F4ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#761D2D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
