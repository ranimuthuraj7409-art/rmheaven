import React, { useState } from 'react';
import { WebsiteCMS } from '../types';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactViewProps {
  cms: WebsiteCMS;
}

export const ContactView: React.FC<ContactViewProps> = ({ cms }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Enrollment Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FCFAF8] text-[#393333]">
      
      {/* Header */}
      <div className="border-b border-[#EAE1DD] pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">
          Academic Secretariat
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#393333]">
          Contact Admissions & Administration
        </h1>
        <p className="text-xs sm:text-sm text-[#817779] max-w-2xl leading-relaxed">
          For inquiries regarding enrollment verification, study notes access, internship applications, or institutional partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form (Left) */}
        <div className="lg:col-span-7 bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-10 shadow-xs">
          <h2 className="text-lg font-bold font-heading text-[#393333] mb-4">
            Send an Official Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-[#393333]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#817779] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your inquiry has been registered. Our secretariat will respond to <span className="font-semibold text-[#800020]">{email}</span> within 1-2 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-4 px-5 py-2 text-xs font-semibold bg-[#800020] text-white rounded-xl hover:bg-[#630018]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-[#EAD5D8]/40 border border-[#800020]/20 rounded-xl text-[#800020] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Vardhan Raman"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#393333] mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@student.ac.in"
                    className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Inquiry Topic *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                >
                  <option value="Course Enrollment Inquiry">Course Enrollment Approval Status</option>
                  <option value="Study Notes Access">Protected Study Notes & PDF Permissions</option>
                  <option value="Internship Fellowship">Internship Fellowship Application</option>
                  <option value="Assignment Submission">Assignment Defense & Grading</option>
                  <option value="Disciplinary Grievance">Student Discipline & Appeal Process</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#393333] mb-1">Message Details *</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your question or include your student ID if applicable..."
                  className="w-full px-3 py-2 border border-[#EAE1DD] rounded-lg bg-[#FCFAF8] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 font-semibold bg-[#800020] hover:bg-[#630018] text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Official Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Information & Office Details (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#EAE1DD] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold font-heading text-[#393333]">
              Secretariat Headquarters
            </h3>

            <div className="space-y-3 text-[#817779]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#393333]">Campus Location:</strong>
                  <span>{cms.contactInfo.officeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#393333]">Official Secretariat Inboxes:</strong>
                  <div>Admissions: <span className="font-mono text-[#800020]">{cms.contactInfo.email}</span></div>
                  <div>Legal & Terms: <span className="font-mono text-[#702D3D]">legal@platform.edu</span></div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#393333]">Telephone Line:</strong>
                  <span className="font-mono">{cms.contactInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#393333]">Operating Hours:</strong>
                  <span>{cms.contactInfo.officeHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Integrity Callout */}
          <div className="bg-[#F8F3EE] border border-[#EAE1DD] rounded-2xl p-6 text-xs text-[#817779] space-y-2">
            <h4 className="font-bold text-[#800020] uppercase tracking-wider text-[11px]">
              Compliance & Ethics Protocol
            </h4>
            <p className="leading-relaxed">
              All communications are logged for compliance monitoring. For academic disciplinary appeals, address correspondence directly to the Office of the Dean.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
