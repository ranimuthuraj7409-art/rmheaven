import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  CONDUCT_PRINCIPLES,
  CONDUCT_VERSION,
  COURSE_INTEREST_OPTIONS,
  TERMS_SECTIONS,
  TERMS_VERSION,
} from '../../constants/legal';
import { RmCrestMark, RmHeavenWordmark } from '../../components/BrandAssets';

export function RegisterPage() {
  const { user, profile, registerStudent, completeGoogleOnboarding, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If a Google-authenticated user has not yet created their profile, start on step 1 (must still accept terms)
  const isGoogleOnboarding = Boolean(user && !profile);

  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [conductAccepted, setConductAccepted] = useState(false);

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [city, setCity] = useState('');
  const [courseInterests, setCourseInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const passwordRules = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordStrong = Object.values(passwordRules).every(Boolean);

  const toggleInterest = (topic: string) => {
    setCourseInterests((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic],
    );
  };

  const handleProceedToForm = () => {
    if (!termsAccepted || !conductAccepted) {
      showToast(
        'Consent Required',
        'warning',
        'Please read and accept both the Terms & Conditions and Student Code of Conduct to continue.',
      );
      return;
    }
    setStep('form');
  };

  const handleGoogleContinue = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.isAdminUser) {
        navigate('/admin');
        return;
      }
      if (!res.needsOnboarding) {
        showToast('Account Found', 'info', 'You are already registered. Redirecting to your dashboard.');
        navigate('/dashboard');
        return;
      }
      showToast('Google Account Connected', 'success', 'Complete your academic profile below to finish registration.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to connect Google account.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!termsAccepted || !conductAccepted) {
      setFormError('Terms & Conditions and Student Code of Conduct acceptance is required.');
      return;
    }
    if (fullName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (mobile.trim().length < 7) {
      setFormError('Please enter a valid mobile number.');
      return;
    }
    if (!qualification.trim() || !city.trim()) {
      setFormError('Please provide your educational qualification and city.');
      return;
    }

    setSubmitting(true);
    try {
      if (isGoogleOnboarding) {
        await completeGoogleOnboarding({
          fullName,
          mobile,
          qualification,
          institution,
          city,
          courseInterests,
          termsAccepted,
          conductAccepted,
        });
        showToast('Registration Completed', 'success', 'Welcome to RM HEAVEN! Your student dashboard is ready.');
        navigate('/dashboard');
      } else {
        if (!isPasswordStrong) {
          setFormError('Please ensure your password meets all five strength requirements.');
          setSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setFormError('Password and Confirm Password do not match.');
          setSubmitting(false);
          return;
        }
        await registerStudent({
          fullName,
          email,
          mobile,
          password,
          qualification,
          institution,
          city,
          courseInterests,
          termsAccepted,
          conductAccepted,
        });
        showToast(
          'Account Created — Verify Your Email',
          'success',
          'A verification link has been sent to your email address. Verify your email to unlock enrollments.',
        );
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Registration failed.';
      if (raw.includes('auth/email-already-in-use')) {
        setFormError('An account with this email already exists. Please sign in instead.');
      } else if (raw.includes('auth/operation-not-allowed')) {
        setFormError(
          'Email/Password sign-in is not yet enabled in Firebase Authentication Console. Use "Continue with Google" below or enable Email/Password under Firebase Console > Authentication > Sign-in method.',
        );
      } else {
        setFormError(raw);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F4ED] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[#292323]/10 bg-white px-5 py-3.5 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 'intro' ? 'text-[#761D2D]' : 'text-emerald-800'}`}>
            <span className="font-mono tabular-nums">01</span>
            <span>Welcome, Terms & Code of Conduct</span>
          </div>
          <span className="text-[#292323]/30">/</span>
          <div className={`flex items-center gap-2 ${step === 'form' ? 'text-[#761D2D]' : 'text-[#292323]/50'}`}>
            <span className="font-mono tabular-nums">02</span>
            <span>Student Registration Profile</span>
          </div>
        </div>

        {step === 'intro' ? (
          <div className="rounded-2xl border border-[#292323]/12 bg-white p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <RmCrestMark size={44} />
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                  First-Time Student Orientation
                </p>
                <h1 className="font-display text-3xl font-bold text-[#292323] sm:text-4xl">
                  <RmHeavenWordmark prefix="Welcome to" />
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#292323]/80">
              Before completing your student registration, please review and accept our institutional Terms & Conditions and Student Discipline & Code of Conduct. Your acceptance timestamp and document versions are securely recorded with your profile.
            </p>

            {/* Summary A: Terms & Conditions */}
            <div className="mt-8 rounded-xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Terms & Conditions Summary ({TERMS_VERSION})
                </h2>
                <Link to="/terms" target="_blank" className="text-xs font-semibold text-[#761D2D] hover:underline">
                  Read Full Document
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TERMS_SECTIONS.map((sec) => (
                  <div key={sec.title} className="rounded-lg border border-[#292323]/8 bg-white p-3.5">
                    <h3 className="text-xs font-semibold text-[#761D2D]">{sec.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#292323]/75">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary B: Student Code of Conduct */}
            <div className="mt-6 rounded-xl border border-[#292323]/10 bg-[#F8F4ED]/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-[#292323]">
                  Student Discipline & Code of Conduct ({CONDUCT_VERSION})
                </h2>
                <Link to="/conduct" target="_blank" className="text-xs font-semibold text-[#761D2D] hover:underline">
                  Read Full Document
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CONDUCT_PRINCIPLES.map((item) => (
                  <div key={item.title} className="flex items-start gap-2 rounded-lg border border-[#292323]/8 bg-white p-3">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#761D2D]" />
                    <div>
                      <p className="text-xs font-semibold text-[#292323]">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#292323]/75">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicit Consent Checkboxes */}
            <div className="mt-8 space-y-3 border-t border-[#292323]/10 pt-6">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#292323]/12 p-3.5 hover:bg-[#F8F4ED]/50">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#761D2D]"
                />
                <span className="text-sm text-[#292323]">
                  I have read and agree to the{' '}
                  <Link to="/terms" target="_blank" className="font-semibold text-[#761D2D] underline">
                    RM HEAVEN Terms & Conditions
                  </Link>{' '}
                  (Version {TERMS_VERSION}).
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#292323]/12 p-3.5 hover:bg-[#F8F4ED]/50">
                <input
                  type="checkbox"
                  checked={conductAccepted}
                  onChange={(e) => setConductAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#761D2D]"
                />
                <span className="text-sm text-[#292323]">
                  I commit to upholding the{' '}
                  <Link to="/conduct" target="_blank" className="font-semibold text-[#761D2D] underline">
                    Student Discipline & Code of Conduct
                  </Link>{' '}
                  (Version {CONDUCT_VERSION}).
                </span>
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#292323]/65">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-[#761D2D] hover:underline">
                  Sign in here
                </Link>
              </p>
              <button
                type="button"
                onClick={handleProceedToForm}
                disabled={!termsAccepted || !conductAccepted}
                className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-45 transition-colors"
              >
                Accept & Continue to Registration
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#292323]/12 bg-white p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292323]/10 pb-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-[#761D2D] uppercase">
                  Student Account Registration
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold text-[#292323]">
                  {isGoogleOnboarding ? 'Complete Your Academic Profile' : 'Create Your Student Profile'}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setStep('intro')}
                className="text-xs font-semibold text-[#761D2D] hover:underline"
              >
                Review Terms & Conduct
              </button>
            </div>

            {!isGoogleOnboarding && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleContinue}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#292323]/20 bg-[#F8F4ED]/60 px-4 py-2.5 text-sm font-semibold text-[#292323] hover:bg-[#F8F4ED] transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-[#761D2D]" />
                  Continue with Verified Google Account
                </button>
                <div className="my-5 flex items-center gap-3 text-xs text-[#292323]/45">
                  <div className="h-px flex-1 bg-[#292323]/12" />
                  <span>or register with email & password</span>
                  <div className="h-px flex-1 bg-[#292323]/12" />
                </div>
              </div>
            )}

            {formError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#B4434D]/35 bg-[#B4434D]/8 p-4 text-xs leading-relaxed text-[#761D2D]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Full Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your legal full name"
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={isGoogleOnboarding}
                    maxLength={160}
                    value={isGoogleOnboarding ? user?.email || '' : email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm disabled:opacity-60 focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={24}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">City *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chennai, Bengaluru, London..."
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">
                    Education Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="B.Tech Computer Science, MBA, Graduate..."
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292323]/80">
                    College / Institution (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={180}
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University or College name"
                    className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                  />
                </div>
              </div>

              {!isGoogleOnboarding && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">Password *</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#292323]/80">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {[
                      ['8+ characters', passwordRules.length],
                      ['Uppercase letter', passwordRules.upper],
                      ['Lowercase letter', passwordRules.lower],
                      ['Number', passwordRules.digit],
                      ['Symbol', passwordRules.special],
                    ].map(([label, ok]) => (
                      <span
                        key={label as string}
                        className={ok ? 'font-medium text-emerald-800' : 'text-[#292323]/55'}
                      >
                        {ok ? '✓' : '·'} {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">
                  Course Interests
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {COURSE_INTEREST_OPTIONS.map((topic) => (
                    <label
                      key={topic}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[#292323]/12 px-3 py-2 text-xs text-[#292323] hover:bg-[#F8F4ED]/60"
                    >
                      <input
                        type="checkbox"
                        checked={courseInterests.includes(topic)}
                        onChange={() => toggleInterest(topic)}
                        className="h-3.5 w-3.5 accent-[#761D2D]"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-[#761D2D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Creating Account...' : 'Complete Student Registration'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
