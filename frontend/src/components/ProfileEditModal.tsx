import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Check, 
  AlertCircle,
  X,
  Save,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModalPortal } from './ModalPortal';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileRole, setProfileRole] = useState<'student' | 'professor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.full_name || user.displayName || '');
      setPhoneNumber(user.phoneNumber || user.phone_number || '');
      setProfileRole(user.profileRole || user.profile_role || null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError('Full Name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateUserProfile({
        displayName: trimmed,
        phoneNumber: phoneNumber.trim() || null,
        profileRole: profileRole || null,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your CodeVault public name and contact details"
      icon={<User className="w-5 h-5 text-crimson-500" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-dark-200 block mb-1.5">
              Email Address (Account ID)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs text-slate-500 dark:text-dark-400 outline-none cursor-not-allowed font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-dark-500 mt-1">
              Account email is managed by your authentication provider.
            </p>
          </div>

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
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all font-medium"
              />
            </div>
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-dark-500 outline-none focus:border-crimson-500 transition-all font-medium"
              />
            </div>
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
                onClick={() => setProfileRole('student')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  profileRole === 'student'
                    ? 'bg-crimson-500/15 text-crimson-600 dark:text-crimson-400 border-crimson-500/40 shadow-glow-red-sm'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileRole('professor')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  profileRole === 'professor'
                    ? 'bg-crimson-500/15 text-crimson-600 dark:text-crimson-400 border-crimson-500/40 shadow-glow-red-sm'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-600 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Professor</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileRole(null)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  profileRole === null
                    ? 'bg-slate-200 dark:bg-dark-800 text-slate-800 dark:text-white border-slate-300 dark:border-white/20'
                    : 'bg-slate-50 dark:bg-dark-950 text-slate-500 dark:text-dark-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>None</span>
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-750 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};