import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  Code2, 
  Mail, 
  Lock, 
  User, 
  Phone,
  GraduationCap,
  BookOpen,
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Check,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mapAuthErrorToMessage } from '../services/firebase';
import { ModalPortal } from '../components/ModalPortal';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, resetPassword } = useAuth();

  // Mode selection: 'signin' | 'register'
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'signin';
  const [isRegister, setIsRegister] = useState<boolean>(initialMode === 'register');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileRole, setProfileRole] = useState<'student' | 'professor' | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const mapFirebaseError = (err: any): string => {
    return mapAuthErrorToMessage(err);
  };

  const handleTabSwitch = (registerMode: boolean) => {
    setIsRegister(registerMode);
    setError('');
    setSuccessMsg('');
    setSearchParams(registerMode ? { tab: 'register' } : { tab: 'signin' });
  };

  // Handle Email / Password Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister) {
      // 1. Mandatory Name Validation
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError('Full Name is required.');
        return;
      }

      // 2. Password Confirmation Validation
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify and try again.');
        return;
      }

      setLoading(true);
      try {
        await register({
          name: trimmedName,
          email: email.trim(),
          password,
          phoneNumber: phoneNumber.trim() || null,
          profileRole: profileRole || null,
        });

        setSuccessMsg('Account created successfully! Welcome to CodeVault Pro.');
        setTimeout(() => {
          navigate('/my-class?tab=classrooms');
        }, 400);
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(mapFirebaseError(err) || err.message || 'Failed to create account.');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In Flow (No Name/Phone/Role asked)
      setLoading(true);
      try {
        const loggedInUser = await login(email.trim(), password);
        setSuccessMsg(`Welcome back, ${loggedInUser.full_name || loggedInUser.username}!`);
        setTimeout(() => {
          navigate('/my-class?tab=classrooms');
        }, 400);
      } catch (err: any) {
        console.error('Sign-in error:', err);
        setError(mapFirebaseError(err) || err.message || 'Failed to sign in.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleAuth = async () => {
    setError('');
    setSuccessMsg('');
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.needsOnboarding) {
        setSuccessMsg(`Welcome, ${result.user.full_name || result.user.username}!`);
        setTimeout(() => {
          navigate('/my-class?tab=classrooms');
        }, 400);
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(mapFirebaseError(err) || err.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(mapFirebaseError(err) || err.message || 'Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 dark:bg-[#0e0e13]/90 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-700 text-white shadow-glow-red-sm mb-1">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CodeVault <span className="text-crimson-500 font-mono">Pro</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-dark-300">
            {isRegister 
              ? 'Create your CodeVault developer & classroom account' 
              : 'Sign in to access your compiler, workspaces & classes'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              !isRegister
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isRegister
                ? 'bg-crimson-600 text-white shadow-glow-red-sm'
                : 'text-slate-600 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CREATE ACCOUNT ONLY: Full Name (Mandatory) */}
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                Full Name <span className="text-crimson-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Souvik Saha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
              Email Address <span className="text-crimson-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200">
                Password <span className="text-crimson-500">*</span>
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSent(false);
                    setForgotError('');
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-crimson-500 hover:text-crimson-400 font-semibold"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium"
              />
            </div>
          </div>

          {/* CREATE ACCOUNT ONLY: Confirm Password */}
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
                Confirm Password <span className="text-crimson-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium"
                />
              </div>
            </div>
          )}

          {/* CREATE ACCOUNT ONLY: Optional Phone Number */}
          {isRegister && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200">
                  Phone Number
                </label>
                <span className="text-[10px] text-slate-400 dark:text-dark-400 uppercase font-mono">Optional</span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-colors font-medium"
                />
              </div>
            </div>
          )}

          {/* CREATE ACCOUNT ONLY: Optional Role Selection */}
          {isRegister && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-dark-200">
                  Role
                </label>
                <span className="text-[10px] text-slate-400 dark:text-dark-400 uppercase font-mono">Optional</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProfileRole('student')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    profileRole === 'student'
                      ? 'bg-crimson-500/15 text-crimson-500 border-crimson-500/40 shadow-glow-red-sm'
                      : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileRole('professor')}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    profileRole === 'professor'
                      ? 'bg-crimson-500/15 text-crimson-500 border-crimson-500/40 shadow-glow-red-sm'
                      : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Professor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileRole(null)}
                  className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    profileRole === null
                      ? 'bg-slate-200 dark:bg-dark-800 text-slate-800 dark:text-white border-slate-300 dark:border-white/20'
                      : 'bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading || (isRegister && !name.trim())}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-extrabold text-xs shadow-glow-red transition-all disabled:opacity-50 touch-target flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-dark-500 font-bold">
            OR
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
        </div>

        {/* Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading || googleLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-800 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-dark-100 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50 touch-target"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

        {/* Switch mode footer */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-white/5">
          {isRegister ? (
            <p className="text-xs text-slate-600 dark:text-dark-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch(false)}
                className="text-crimson-600 dark:text-crimson-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-600 dark:text-dark-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch(true)}
                className="text-crimson-600 dark:text-crimson-400 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-[11px] text-slate-500 dark:text-dark-500">
          By continuing, you agree to CodeVault's{' '}
          <Link to="/about" className="text-crimson-500 hover:underline">Terms</Link> &{' '}
          <Link to="/about" className="text-crimson-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <ModalPortal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        icon={<KeyRound className="w-4 h-4 text-crimson-500" />}
        maxWidth="sm"
      >
        {forgotSent ? (
          <div className="space-y-3 text-center py-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Reset Email Sent!
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-dark-300 leading-relaxed">
              We've sent a password reset link to <span className="font-mono text-crimson-500">{forgotEmail}</span>. Check your inbox and follow the link.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 rounded-xl bg-crimson-600 text-white text-xs font-bold"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <p className="text-[11px] text-slate-600 dark:text-dark-300 leading-relaxed">
              Enter your email address and we'll send you an official Google Firebase password reset link.
            </p>

            {forgotError && (
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 text-[11px]">
                {forgotError}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-dark-200 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-crimson-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="px-4 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50"
              >
                {forgotLoading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        )}
      </ModalPortal>

    </div>
  );
};

export default LoginPage;