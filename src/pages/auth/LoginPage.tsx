import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { RmCrestMark, RmHeavenWordmark } from '../../components/BrandAssets';

export function LoginPage() {
  const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res.isAdminUser) {
        showToast('Administrator Verified', 'success', 'Redirecting to Admin Dashboard.');
        navigate(fromPath || '/admin');
      } else {
        showToast('Signed In', 'success', 'Welcome back to RM HEAVEN.');
        navigate(fromPath || '/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to sign in.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setErrorMsg('Invalid email address or password.');
      } else if (msg.includes('auth/operation-not-allowed')) {
        setErrorMsg(
          'Email/Password sign-in is not yet enabled in Firebase Authentication Console. Use "Sign In with Google" below or enable Email/Password under Firebase Console > Authentication > Sign-in method.',
        );
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.isAdminUser) {
        showToast('Administrator Verified', 'success', 'Redirecting to Admin Dashboard.');
        navigate('/admin');
      } else if (res.needsOnboarding) {
        showToast(
          'Complete First-Time Orientation',
          'info',
          'Please accept our Terms & Code of Conduct and complete your student profile.',
        );
        navigate('/register');
      } else {
        showToast('Signed In', 'success', 'Welcome back to RM HEAVEN.');
        navigate(fromPath || '/dashboard');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSending(true);
    try {
      await resetPassword(resetEmail);
      showToast('Reset Email Sent', 'success', 'Check your inbox for password reset instructions.');
      setResetMode(false);
      setResetEmail('');
    } catch (err: unknown) {
      showToast('Reset Failed', 'error', err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#F8F4ED] px-4 py-14">
      <div className="w-full max-w-md rounded-2xl border border-[#292323]/12 bg-white p-8">
        <div className="flex items-center gap-3">
          <RmCrestMark size={42} />
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase">
              <RmHeavenWordmark suffix="Portal" />
            </p>
            <h1 className="font-display text-3xl font-bold text-[#292323]">
              {resetMode ? 'Reset Password' : 'Account Sign In'}
            </h1>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#B4434D]/35 bg-[#B4434D]/8 p-3.5 text-xs leading-relaxed text-[#761D2D]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {resetMode ? (
          <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-[#292323]/75">
              Enter your registered email address and we will send a secure password reset link via Firebase Authentication.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#292323]/80">Registered Email</label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="text-xs font-semibold text-[#292323]/70 hover:text-[#292323]"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={resetSending}
                className="rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50"
              >
                {resetSending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#292323]/20 bg-[#F8F4ED]/60 px-4 py-2.5 text-sm font-semibold text-[#292323] hover:bg-[#F8F4ED] transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-[#761D2D]" />
                Sign In with Google
              </button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-[#292323]/45">
              <div className="h-px flex-1 bg-[#292323]/12" />
              <span>or sign in with email</span>
              <div className="h-px flex-1 bg-[#292323]/12" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#292323]/80">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#292323]/80">Password</label>
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#761D2D] hover:underline"
                  >
                    <KeyRound className="h-3 w-3" /> Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#292323]/15 bg-[#F8F4ED]/40 px-3.5 py-2.5 text-sm focus:border-[#761D2D] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#761D2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8F2638] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 border-t border-[#292323]/10 pt-4 text-center text-xs text-[#292323]/75">
              New to RM HEAVEN?{' '}
              <Link to="/register" className="font-semibold text-[#761D2D] hover:underline">
                Start Student Registration
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
