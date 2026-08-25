import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  Code2, 
  Smartphone, 
  Mail, 
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Sparkles
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mesh-gradient-bg transition-colors duration-200">
      {/* Invisible reCAPTCHA container for Phone Auth */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 rounded-3xl bg-gradient-to-tr from-light-blue via-indigo-600 to-purple-600 dark:from-neon-blue dark:via-brand-600 dark:to-neon-purple flex items-center justify-center text-white mx-auto shadow-md dark:shadow-2xl dark:shadow-brand-500/30">
            <Code2 className="w-7 h-7" />
            <div className="absolute -inset-1 bg-gradient-to-r from-light-blue to-purple-600 rounded-3xl blur-md opacity-30 dark:opacity-50 -z-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-light-textStrong dark:text-white tracking-tight font-sans">
            {mode === 'register' 
              ? 'Create CodeVault Account' 
              : mode === 'phone' 
              ? 'Mobile SMS Authentication' 
              : 'Welcome Back'}
          </h1>
          <p className="text-xs text-light-textSecondary dark:text-dark-300 max-w-sm mx-auto leading-relaxed">
            {mode === 'register'
              ? 'Sign up to practice, compile in 11+ languages, and manage classrooms.'
              : mode === 'phone'
              ? 'Fast and secure login using your mobile number and one-time SMS code.'
              : 'Sign in with Google, GitHub, Phone SMS, or your credentials.'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0e1222]/80 border border-light-border dark:border-[#232b4b] space-y-2.5 shadow-card-light">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-light-blue dark:text-neon-purple" />
              ⚡ Instant Demo Profiles
            </span>
            <span className="text-[10px] text-light-blue dark:text-purple-400 font-semibold">1-Click Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleDemoLogin('prof_sharma')}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-dark-900 dark:hover:bg-dark-850 border border-amber-300 dark:border-amber-500/30 text-xs font-bold text-amber-800 dark:text-amber-300 text-left transition-all shadow-sm"
            >
              👨‍🏫 Teacher Mode
              <span className="block text-[10px] font-normal text-amber-600 dark:text-dark-400">Prof. Sharma</span>
            </button>

            <button
              onClick={() => handleDemoLogin('asha_r')}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-dark-900 dark:hover:bg-dark-850 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold text-emerald-800 dark:text-emerald-300 text-left transition-all shadow-sm"
            >
              🎓 Student Mode
              <span className="block text-[10px] font-normal text-emerald-600 dark:text-dark-400">Asha R.</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-dark-900/80 border border-light-border dark:border-[#232b4b] shadow-card-light dark:shadow-2xl space-y-5">
          
          {/* Social Auth Buttons (Google & GitHub) */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={loading || socialLoading !== null}
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-2xl border border-light-borderStrong dark:border-[#232b4b] bg-white hover:bg-light-secondary dark:bg-dark-900/90 dark:hover:bg-dark-850 text-light-textStrong dark:text-white text-xs font-bold shadow-card-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:border-light-blueBorder dark:hover:border-purple-500/30"
            >
              {socialLoading === 'google' ? (
                <RotateCw className="w-4 h-4 animate-spin text-light-blue dark:text-purple-400" />
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
              className="w-full py-3 px-4 rounded-2xl border border-light-borderStrong dark:border-[#232b4b] bg-white hover:bg-light-secondary dark:bg-dark-900/90 dark:hover:bg-dark-850 text-light-textStrong dark:text-white text-xs font-bold shadow-card-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:border-light-blueBorder dark:hover:border-purple-500/30"
            >
              {socialLoading === 'github' ? (
                <RotateCw className="w-4 h-4 animate-spin text-light-blue dark:text-purple-400" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current text-light-textStrong dark:text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-light-border dark:border-[#1b223c] w-full"></div>
            <span className="bg-white dark:bg-[#0e1222] px-3 text-[10px] font-bold text-light-textMuted dark:text-dark-400 uppercase tracking-widest font-mono">
              Or Authenticate With
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1.5 bg-light-secondary dark:bg-dark-950 rounded-2xl border border-light-border dark:border-[#1b223c]">
            <button
              type="button"
              onClick={() => { setMode('email'); setError(''); setSuccessMsg(''); }}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'email' 
                  ? 'bg-light-blue text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple' 
                  : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('phone'); setError(''); setSuccessMsg(''); }}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'phone' 
                  ? 'bg-light-blue text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple' 
                  : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS OTP</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register' 
                  ? 'bg-light-blue text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple' 
                  : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Standard Login & Register Form */}
          {(mode === 'email' || mode === 'register') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1.5">
                      Account Role *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('USER')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          role === 'USER'
                            ? 'border-light-blue bg-light-blueSoft text-light-blue dark:border-purple-500 dark:bg-purple-500/20 dark:text-white shadow-sm'
                            : 'border-light-border bg-light-secondary text-light-textSecondary dark:border-[#1b223c] dark:bg-dark-950 dark:text-dark-400 hover:text-light-textStrong'
                        }`}
                      >
                        🎓 Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('TEACHER')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          role === 'TEACHER'
                            ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-500/20 dark:text-white shadow-sm'
                            : 'border-light-border bg-light-secondary text-light-textSecondary dark:border-[#1b223c] dark:bg-dark-950 dark:text-dark-400 hover:text-light-textStrong'
                        }`}
                      >
                        👨‍🏫 Teacher
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 outline-none focus:border-light-blue dark:focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 outline-none focus:border-light-blue dark:focus:border-purple-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1">
                  {mode === 'register' ? 'Choose Username *' : 'Username or Email *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. rohit_k"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 outline-none focus:border-light-blue dark:focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 outline-none focus:border-light-blue dark:focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
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

          {/* Phone SMS OTP Auth */}
          {mode === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white font-mono outline-none"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-xs text-light-textStrong dark:text-white placeholder-light-textMuted dark:placeholder-dark-500 outline-none focus:border-light-blue dark:focus:border-purple-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RotateCw className="w-4 h-4 animate-spin" /> : <span>Send OTP Code</span>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-light-textStrong dark:text-dark-300 block mb-1">
                      Enter 6-digit SMS OTP *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 bg-light-secondary dark:bg-dark-950 border border-light-borderStrong dark:border-[#232b4b] rounded-2xl text-base text-light-textStrong dark:text-white text-center font-mono tracking-widest outline-none focus:border-light-blue dark:focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-neon-blue dark:to-neon-purple text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <RotateCw className="w-4 h-4 animate-spin" /> : <span>Verify & Sign In</span>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
