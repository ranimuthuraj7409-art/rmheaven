import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { submitSupportTicket } from '../../firebase/services';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RmHeavenWordmark } from '../../components/BrandAssets';
import type { WebsiteContent } from '../../types';

export function ContactPage({ content }: { content: WebsiteContent }) {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(profile?.fullName || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || message.trim().length < 5) {
      showToast('Incomplete Form', 'error', 'Please fill in all fields (message at least 5 characters).');
      return;
    }
    setSubmitting(true);
    try {
      const id = await submitSupportTicket({
        studentId: user?.uid,
        name,
        email,
        subject,
        message,
      });
      setSubmittedId(id);
      setSubject('');
      setMessage('');
      showToast('Inquiry Sent', 'success', 'Your message has been delivered to the RM HEAVEN administration team.');
    } catch (err) {
      showToast('Submission Failed', 'error', err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F4ED] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
            Admissions & Support
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#292323] sm:text-5xl">
            <RmHeavenWordmark prefix="Contact" />
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#292323]/75">
            Reach our admissions and academic support desk for inquiries about courses, enrollment approvals, internships, or certificate verification.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-[#761D2D]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#292323]">Email Desk</h2>
                  <a
                    href={`mailto:${content.contactEmail || 'rmheaven.edu@gmail.com'}`}
                    className="mt-1 inline-block text-sm font-medium text-[#761D2D] hover:underline"
                  >
                    {content.contactEmail || 'rmheaven.edu@gmail.com'}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-[#761D2D]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#292323]">Academic Support Line</h2>
                  <a
                    href={`tel:${(content.contactPhone || '9025528671').replace(/\s+/g, '')}`}
                    className="mt-1 inline-block text-sm font-medium text-[#761D2D] tabular-nums hover:underline"
                  >
                    {content.contactPhone || '9025528671'}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#292323]/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[#761D2D]" />
                <div>
                  <h2 className="text-sm font-semibold text-[#292323]">Operations Office</h2>
                  <p className="mt-1 text-sm text-[#292323]/75">
                    {content.officeLocation || 'Online & Regional Academic Desk'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#292323]/10 bg-white p-8 lg:col-span-7">
            {submittedId ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />
                <h2 className="mt-4 font-display text-2xl font-bold text-[#292323]">
                  Inquiry Logged Successfully
                </h2>
                <p className="mt-2 text-sm text-[#292323]/75">
                  Reference ID: <span className="font-mono font-medium">{submittedId}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedId(null)}
                  className="mt-6 rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Send a Message
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Full Name</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292323]/80">Email Address</label>
                    <input
                      type="email"
                      required
                      maxLength={160}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Subject</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Course inquiry, enrollment status, internship question..."
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Message</label>
                  <textarea
                    required
                    rows={5}
                    maxLength={3000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 p-3.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
