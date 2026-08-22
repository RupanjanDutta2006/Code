import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  Code2, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConfirmationResult } from '../services/firebase';

type AuthMode = 'email' | 'phone' | 'register';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    login, 
    register, 
    loginWithGoogle, 
    loginWithGithub, 
    sendPhoneOtp, 
    verifyPhoneOtp 
  } = useAuth();

  // Mode selection
  const initialMode: AuthMode = searchParams.get('tab') === 'register' ? 'register' : 'email';
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Email / standard form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'USER' | 'TEACHER'>('USER');

  // Phone / SMS OTP form state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend countdown timer
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const mapFirebaseError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/popup-closed-by-user') return 'Sign-in window was closed before completion.';
    if (code === 'auth/cancelled-popup-request') return 'Sign-in operation cancelled.';
    if (code === 'auth/popup-blocked') return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    if (code === 'auth/invalid-verification-code') return 'Invalid OTP verification code. Please check your SMS and try again.';
    if (code === 'auth/code-expired') return 'SMS verification code has expired. Please request a new code.';
    if (code === 'auth/invalid-phone-number') return 'Invalid phone number format. Please check your country code and digits.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes before trying again.';
    if (code === 'auth/captcha-check-failed') return 'reCAPTCHA verification failed. Please try again.';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password') return 'Invalid login credentials.';
    return err?.message || err?.response?.data?.detail || 'Authentication failed. Please try again.';
  };

  // Handle Standard Email/Username Login & Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(username, email, password, role, fullName);
      } else {
        await login(username, password);
      }
      navigate(role === 'TEACHER' ? '/classrooms' : '/programs');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login / Signup
  const handleGoogleAuth = async () => {
    setError('');
    setSuccessMsg('');
    setSocialLoading('google');
    try {
      const user = await loginWithGoogle(role);
      setSuccessMsg(`Welcome, ${user.full_name || user.username}!`);
      setTimeout(() => {
        navigate(user.role === 'TEACHER' ? '/classrooms' : '/programs');
      }, 500);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(mapFirebaseError(err));
    } finally {
      setSocialLoading(null);
    }
  };

  // Handle GitHub Login / Signup
  const handleGithubAuth = async () => {
    setError('');
    setSuccessMsg('');
    setSocialLoading('github');
    try {
      const user = await loginWithGithub(role);
      setSuccessMsg(`Welcome, ${user.full_name || user.username}!`);
      setTimeout(() => {
        navigate(user.role === 'TEACHER' ? '/classrooms' : '/programs');
      }, 500);
    } catch (err: any) {
      console.error('GitHub sign-in error:', err);
      setError(mapFirebaseError(err));
    } finally {
      setSocialLoading(null);
    }
  };

  // Handle Send Phone SMS OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    const fullPhone = `${countryCode}${cleanPhone}`;
    setLoading(true);

    try {
      const result = await sendPhoneOtp(fullPhone, 'recaptcha-container');
      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(60);
      setSuccessMsg(`Verification code sent via SMS to ${fullPhone}`);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify Phone SMS OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('No pending verification found. Please request an OTP first.');
      return;
    }

    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP sent via SMS.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await verifyPhoneOtp(confirmationResult, otpCode.trim(), role);
      setSuccessMsg('Phone verified successfully! Redirecting...');
      setTimeout(() => {
        navigate(user.role === 'TEACHER' ? '/classrooms' : '/programs');
      }, 600);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Demo Login helper
  const handleDemoLogin = async (demoUsername: string) => {
    setLoading(true);
    setError('');
    try {
      await login(demoUsername, 'password123');
      navigate(demoUsername === 'prof_sharma' ? '/classrooms' : '/programs');
    } catch (err: any) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 transition-colors duration-200">
      {/* Invisible reCAPTCHA container for Phone Auth */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {mode === 'register' 
              ? 'Create CodeVault Account' 
              : mode === 'phone' 
              ? 'Mobile SMS Authentication' 
              : 'Welcome Back to CodeVault'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-dark-300 max-w-sm mx-auto">
            {mode === 'register'
              ? 'Sign up to practice, compile in 11+ languages, and manage classrooms.'
              : mode === 'phone'
              ? 'Fast and secure login using your mobile number and one-time SMS code.'
              : 'Sign in with Google, GitHub, Phone SMS, or your username.'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-dark-900 border border-slate-200 dark:border-dark-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-dark-300 uppercase tracking-wider font-mono">
              ⚡ Quick Demo Accounts
            </span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">Instant Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('prof_sharma')}
              className="px-3 py-2 rounded-xl bg-white dark:bg-dark-850 hover:bg-slate-50 dark:hover:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-semibold text-amber-600 dark:text-amber-300 text-left transition-colors shadow-sm"
            >
              👨‍🏫 Teacher Mode
              <span className="block text-[10px] font-normal text-slate-500 dark:text-dark-400">Prof. Sharma</span>
            </button>

            <button
              onClick={() => handleDemoLogin('asha_r')}
              className="px-3 py-2 rounded-xl bg-white dark:bg-dark-850 hover:bg-slate-50 dark:hover:bg-dark-800 border border-slate-200 dark:border-dark-700 text-xs font-semibold text-emerald-600 dark:text-emerald-300 text-left transition-colors shadow-sm"
            >
              🎓 Student Mode
              <span className="block text-[10px] font-normal text-slate-500 dark:text-dark-400">Asha R.</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 shadow-xl space-y-5 transition-colors duration-200">
          
          {/* Social Auth Buttons (Google & GitHub) */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={loading || socialLoading !== null}
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-950 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-800 dark:text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 group hover:border-slate-300 dark:hover:border-dark-600"
            >
              {socialLoading === 'google' ? (
                <RotateCw className="w-4 h-4 animate-spin text-brand-500" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              disabled={loading || socialLoading !== null}
              onClick={handleGithubAuth}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-900 hover:bg-slate-800 dark:bg-dark-950 dark:hover:bg-dark-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {socialLoading === 'github' ? (
                <RotateCw className="w-4 h-4 animate-spin text-brand-400" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-dark-750 w-full"></div>
            <span className="bg-white dark:bg-dark-900 px-3 text-[10px] font-semibold text-slate-400 dark:text-dark-400 uppercase tracking-widest font-mono">
              Or Authenticate With
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-dark-950 rounded-xl border border-slate-200 dark:border-dark-750">
            <button
              type="button"
              onClick={() => { setMode('email'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mode === 'email' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('phone'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mode === 'phone' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone SMS</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mode === 'register' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-dark-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tab 1: Standard Username/Email Login OR Tab 3: Sign Up */}
          {(mode === 'email' || mode === 'register') && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1.5">
                      Account Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('USER')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'USER'
                            ? 'border-brand-500 bg-brand-500/15 text-brand-700 dark:text-white'
                            : 'border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        🎓 Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('TEACHER')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'TEACHER'
                            ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-white'
                            : 'border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        👨‍🏫 Teacher
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                  {mode === 'register' ? 'Choose Username *' : 'Username or Email *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rohit_k"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : mode === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to CodeVault</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: Phone Number & SMS OTP Auth */}
          {mode === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1.5">
                      Account Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('USER')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'USER'
                            ? 'border-brand-500 bg-brand-500/15 text-brand-700 dark:text-white'
                            : 'border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        🎓 Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('TEACHER')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          role === 'TEACHER'
                            ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-white'
                            : 'border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        👨‍🏫 Teacher
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono"
                      >
                        <option value="+91">🇮🇳 +91 (IN)</option>
                        <option value="+1">🇺🇸 +1 (US/CA)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+61">🇦🇺 +61 (AU)</option>
                        <option value="+49">🇩🇪 +49 (DE)</option>
                        <option value="+81">🇯🇵 +81 (JP)</option>
                        <option value="+65">🇸🇬 +65 (SG)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-brand-500 font-mono transition-colors"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-dark-400 block mt-1">
                      We will send a 6-digit SMS verification code to this number.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Send SMS Verification Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-750 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-dark-400 block">Sent code to</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                        {countryCode} {phoneNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(''); }}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-medium"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-dark-300 block mb-1">
                      Enter 6-Digit SMS Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-xl text-center text-lg tracking-[0.5em] font-mono text-slate-900 dark:text-white outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-dark-400 pt-1">
                    <span>Didn't receive SMS?</span>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleSendOtp}
                      className="text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50 font-medium"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend SMS Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Privacy & Security Note */}
          <div className="pt-2 text-center">
            <p className="text-[10px] text-slate-400 dark:text-dark-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Firebase Authenticated • 256-Bit SSL Protected Session</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
