import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LogIn, UserPlus, Code2, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(searchParams.get('tab') === 'register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'USER' | 'TEACHER'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, email, password, role, fullName);
      } else {
        await login(username, password);
      }
      navigate(role === 'TEACHER' ? '/classrooms' : '/programs');
    } catch (err: any) {
      console.error('Auth failed:', err);
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create Your Account' : 'Welcome Back to CodeVault'}
          </h1>
          <p className="text-xs text-dark-300">
            {isRegister
              ? 'Join as a Student or Teacher to practice, run, and share code.'
              : 'Sign in to access your personal code library and classrooms.'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-dark-700/80 space-y-2.5">
          <span className="text-[11px] font-semibold text-dark-300 uppercase tracking-wider block font-mono">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('prof_sharma')}
              className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-amber-300 text-left transition-colors"
            >
              👨‍🏫 Teacher Mode
              <span className="block text-[10px] font-normal text-dark-400">Prof. Sharma</span>
            </button>

            <button
              onClick={() => handleDemoLogin('asha_r')}
              className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-emerald-300 text-left transition-colors"
            >
              🎓 Student Mode
              <span className="block text-[10px] font-normal text-dark-400">Asha R.</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-2xl bg-dark-900 border border-dark-700 shadow-2xl space-y-5">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-dark-950 rounded-xl border border-dark-750">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isRegister ? 'bg-brand-600 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isRegister ? 'bg-brand-600 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="text-xs font-semibold text-dark-300 block mb-1">
                    Role *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        role === 'USER'
                          ? 'border-brand-500 bg-brand-500/15 text-white'
                          : 'border-dark-700 bg-dark-950 text-dark-400 hover:text-white'
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('TEACHER')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        role === 'TEACHER'
                          ? 'border-amber-500 bg-amber-500/15 text-white'
                          : 'border-dark-700 bg-dark-950 text-dark-400 hover:text-white'
                      }`}
                    >
                      👨‍🏫 Teacher
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-300 block mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-dark-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1">
                {isRegister ? 'Choose Username *' : 'Username or Email *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. rohit_k"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-dark-300 block mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-dark-950 border border-dark-700 rounded-xl text-xs text-white placeholder-dark-500 outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
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
        </div>
      </div>
    </div>
  );
};
