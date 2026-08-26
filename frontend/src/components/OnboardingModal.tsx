import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  User, 
  Phone, 
  GraduationCap, 
  Check, 
  AlertCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModalPortal } from './ModalPortal';

export const OnboardingModal: React.FC = () => {
  const { needsOnboarding, firebaseUser, user, completeOnboarding } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'professor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize display name from Google or existing profile when modal appears
  useEffect(() => {
    if (needsOnboarding && firebaseUser) {
      const initialName = firebaseUser.displayName || user?.full_name || '';
      setName(initialName);
      if (firebaseUser.phoneNumber) {
        setPhone(firebaseUser.phoneNumber);
      }
      setError(null);
    }
  }, [needsOnboarding, firebaseUser, user]);

  if (!needsOnboarding) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Full Name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await completeOnboarding({
        displayName: trimmedName,
        phoneNumber: phone.trim() || null,
        profileRole: role || null,
      });
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setError(err.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal
      isOpen={needsOnboarding}
      onClose={() => {}} // Non-dismissible without completing required name
      title="Welcome to CodeVault Pro"
      subtitle="Complete your developer & classroom profile"
      icon={<Sparkles className="w-5 h-5 text-amber-400" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Mandatory) */}
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-dark-400 mt-1">
              Your name as shown in classrooms, discussions, and submissions.
            </p>
          </div>

          {/* Phone Number (Optional) */}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-dark-400 mt-1">
              Optional for contact preferences. No SMS OTP required.
            </p>
          </div>

          {/* Role Selection (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-dark-200">
                Profile Role
              </label>
              <span className="text-[10px] text-slate-400 dark:text-dark-400 uppercase font-mono">Optional</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'student'
                    ? 'bg-crimson-500/15 text-crimson-600 dark:text-crimson-400 border-crimson-500/40 shadow-glow-red-sm'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('professor')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === 'professor'
                    ? 'bg-crimson-500/15 text-crimson-600 dark:text-crimson-400 border-crimson-500/40 shadow-glow-red-sm'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Professor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole(null)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  role === null
                    ? 'bg-slate-200 dark:bg-dark-800 text-slate-800 dark:text-white border-slate-300 dark:border-white/20'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Skip</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-dark-400 mt-1.5">
              Role is profile info only. You can create or join classrooms regardless of role.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-extrabold text-xs shadow-glow-red transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Continue to CodeVault Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};