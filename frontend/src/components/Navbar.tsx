import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  FolderPlus, 
  PlusCircle, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  LogIn, 
  Layers, 
  Menu, 
  X,
  WifiOff,
  Sparkles,
  Users,
  Sun,
  Moon,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';
import { useAIChat } from '../context/AIChatContext';

export const Navbar: React.FC = () => {
  const { user, logout, isCreator } = useAuth();
  const { isOnline, queuedRuns } = useOffline();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { toggleChat, healthStatus, offlineState } = useAIChat();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 oky-glass border-b border-slate-200/80 dark:border-[#1e2746]/80 px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-blue via-brand-600 to-neon-purple flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-neon-purple transition-all duration-300">
              <Code2 className="w-5 h-5" />
            </div>
            {/* Subtle glow aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 -z-10" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
              CodeVault <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-purple dark:text-purple-300 font-bold border border-purple-500/30">PRO</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-dark-400 block -mt-1 font-medium">Next-Gen Code & AI Platform</span>
          </div>
        </Link>

        {/* Offline Badge */}
        {!isOnline && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-medium animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode {queuedRuns.length > 0 && `(${queuedRuns.length} queued)`}</span>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-dark-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-[#1b223c]">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive('/') && location.pathname === '/'
                ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
            }`}
          >
            Home
          </Link>

          {isCreator ? (
            <>
              <Link
                to="/my-programs"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/my-programs') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                My Programs
              </Link>
              <Link
                to="/import"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/import') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5 text-accent-cyan" />
                Import
              </Link>
              <Link
                to="/create"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/create') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-accent-emerald" />
                New Program
              </Link>
              <Link
                to="/classrooms"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/classrooms') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-accent-amber" />
                Classrooms
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/programs"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/programs') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                Programs
              </Link>
              <Link
                to="/my-class"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/my-class') 
                    ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-accent-amber" />
                My Class
              </Link>
            </>
          )}

          <Link
            to="/playground"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/playground') 
                ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-accent-violet" />
            Playground
          </Link>

          <Link
            to="/creator"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/creator') 
                ? 'text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-md shadow-brand-500/25' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Creator
          </Link>
        </div>

        {/* User Auth, AI Trigger & Theme Switcher */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Futuristic CodeVault AI Global Button */}
          <button
            onClick={toggleChat}
            className="group relative px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#141a2e] to-[#0e1222] hover:from-[#1b223c] hover:to-[#141a2e] text-white border border-purple-500/30 flex items-center gap-2 text-xs font-bold shadow-lg shadow-purple-500/10 hover:shadow-neon-purple transition-all duration-300 hover:scale-105"
            title="Open CodeVault AI Chat"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              CodeVault AI
            </span>
            {healthStatus === 'ONLINE_HEALTHY' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            ) : offlineState.status === 'ready' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-[#1b223c] bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 fill-yellow-400/20 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-2xl bg-slate-100 dark:bg-dark-900/90 border border-slate-200 dark:border-[#1b223c]">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.username}
                    className="w-7 h-7 rounded-xl object-cover border border-slate-200 dark:border-purple-500/30 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-neon-purple text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    <span>{user.full_name || user.username}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-dark-400 uppercase font-mono font-medium">
                    {user.role}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-2xl text-slate-500 dark:text-dark-400 hover:text-rose-500 dark:hover:text-accent-rose hover:bg-slate-100 dark:hover:bg-dark-900 border border-transparent dark:hover:border-rose-500/20 transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-900 dark:hover:bg-dark-850 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-[#1b223c] transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-dark-300" />
                Login
              </Link>
              <Link
                to="/login?tab=register"
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-neon-blue to-brand-600 hover:from-brand-600 hover:to-neon-purple text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu & Action Buttons */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleChat}
            className="p-2 rounded-xl bg-gradient-to-r from-brand-600 to-neon-purple text-white text-xs font-semibold shadow-sm"
            title="CodeVault AI"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-900 text-slate-700 dark:text-yellow-400 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-dark-800 space-y-2 animate-slide-up bg-dark-950/95 p-4 rounded-3xl backdrop-blur-xl border border-dark-750">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-850"
          >
            Home
          </Link>
          <Link
            to="/programs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-850"
          >
            Programs Library
          </Link>
          <Link
            to="/playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-850"
          >
            Live Playground
          </Link>
          <Link
            to="/my-class"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-850"
          >
            My Class (Interactive DSA)
          </Link>
          <Link
            to="/creator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-850"
          >
            Creator & Resources
          </Link>

          <div className="pt-3 border-t border-slate-200 dark:border-dark-800">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-dark-900 rounded-2xl">
                <div>
                  <span className="text-xs font-semibold text-white block">{user.full_name || user.username}</span>
                  <span className="text-[9px] text-dark-400 uppercase">{user.role}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1 rounded-xl text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 font-medium"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-2xl bg-dark-850 text-white text-xs font-semibold border border-dark-750"
                >
                  Login
                </Link>
                <Link
                  to="/login?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
