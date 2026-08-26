import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code2, 
  FolderPlus, 
  PlusCircle, 
  GraduationCap, 
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
  ExternalLink,
  BookOpen,
  Activity,
  ShieldCheck
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#08080c]/85 backdrop-blur-xl border-b border-[#E5E9F0] dark:border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo - Compact on mobile, expanded on desktop */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 touch-target">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-crimson-600 via-red-600 to-rose-600 flex items-center justify-center text-white shadow-glow-red-sm group-hover:scale-105 transition-all duration-300">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-crimson-500 to-red-700 rounded-2xl blur opacity-25 dark:opacity-40 group-hover:opacity-60 transition duration-300 -z-10" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-light-textStrong dark:text-white flex items-center gap-1 font-sans">
              CodeVault <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-crimson-500/15 text-crimson-500 dark:text-crimson-400 font-bold border border-crimson-500/30">PRO</span>
            </span>
            <span className="hidden sm:block text-[10px] text-light-textMuted dark:text-dark-400 -mt-1 font-medium">Next-Gen Code & AI Platform</span>
          </div>
        </Link>

        {/* Offline Badge */}
        {!isOnline && (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-medium animate-pulse">
            <WifiOff className="w-3 h-3" />
            <span className="hidden sm:inline">Offline Mode</span>
            {queuedRuns.length > 0 && <span>({queuedRuns.length})</span>}
          </div>
        )}

        {/* Desktop Navigation Links (Hidden on mobile - mobile uses MobileBottomNav) */}
        <div className="hidden lg:flex items-center gap-1 bg-light-secondary dark:bg-[#111116]/80 p-1 rounded-2xl border border-light-border dark:border-white/10">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive('/') && location.pathname === '/'
                ? 'text-white bg-crimson-600 shadow-sm dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:shadow-glow-red-sm' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-[#1c1c24]'
            }`}
          >
            Home
          </Link>

          <Link
            to="/programs"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/programs') 
                ? 'text-white bg-crimson-600 shadow-sm dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:shadow-glow-red-sm' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-[#1c1c24]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400" />
            Programs
          </Link>

          <Link
            to="/my-class"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/my-class') 
                ? 'text-white bg-crimson-600 shadow-sm dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:shadow-glow-red-sm' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-[#1c1c24]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400" />
            My Class
          </Link>

          <Link
            to="/playground"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/playground') 
                ? 'text-white bg-crimson-600 shadow-sm dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 dark:shadow-glow-red-sm' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-[#1c1c24]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400" />
            Playground
          </Link>

          {isCreator && (
            <>
              <Link
                to="/import"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/import') 
                    ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                    : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5 text-accent-cyan" />
                Import
              </Link>
              <Link
                to="/create"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/create') 
                    ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                    : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-accent-emerald" />
                + New
              </Link>
            </>
          )}

          {(user?.role === 'TEACHER' || isCreator) && (
            <Link
              to="/classrooms"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/classrooms') 
                  ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                  : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-accent-amber" />
              Classrooms
            </Link>
          )}

          <Link
            to="/creator"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/creator') 
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Creator
          </Link>
        </div>

        {/* Right Actions: AI Assist + Theme toggle + Auth + More Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick AI Assistant Trigger in Navbar */}
          <button
            onClick={toggleChat}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-crimson-500/10 dark:bg-[#141418] border border-crimson-500/30 text-crimson-600 dark:text-crimson-400 text-xs font-bold shadow-xs hover:shadow-glow-red-sm transition-all duration-200 hover:scale-105 group"
            title="Open CodeVault AI Assistant"
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-crimson-500 dark:text-crimson-400 group-hover:rotate-12 transition-transform" />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                offlineState.status === 'ready' 
                  ? 'bg-crimson-400' 
                  : healthStatus === 'ONLINE_HEALTHY' 
                  ? 'bg-emerald-500' 
                  : 'bg-amber-500'
              } animate-pulse`} />
            </div>
            <span>CodeVault AI</span>
          </button>

          {/* Theme Toggle Button (Touch-friendly 44px min target) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-light-secondary dark:bg-[#111116] text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white border border-light-border dark:border-white/10 flex items-center justify-center transition-all shadow-xs hover:border-crimson-500/40"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle light and dark theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-crimson-500" />}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/my-activity"
                className={`h-10 px-3 rounded-xl bg-light-secondary dark:bg-[#111116] hover:bg-slate-100 dark:hover:bg-dark-800 text-light-textNormal dark:text-dark-200 border border-light-border dark:border-white/10 flex items-center gap-1.5 transition-all shadow-xs ${
                  isActive('/my-activity') ? 'border-crimson-500/50 text-crimson-600 dark:text-crimson-400' : ''
                }`}
                title="View Activity History"
              >
                <Activity className="w-4 h-4 text-crimson-500" />
                <span className="hidden sm:inline text-xs font-bold">{user.username}</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/activity"
                  className="h-10 px-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Admin Audit Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="w-10 h-10 rounded-xl bg-light-secondary dark:bg-[#111116] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-light-textMuted dark:text-dark-400 hover:text-crimson-500 dark:hover:text-crimson-400 border border-light-border dark:border-white/10 flex items-center justify-center transition-all shadow-xs"
                title="Log Out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="h-10 px-3.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 dark:bg-gradient-to-r dark:from-crimson-600 dark:to-rose-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all shadow-glow-red-sm hover:scale-105"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Secondary Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-light-secondary dark:bg-[#111116] text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white border border-light-border dark:border-white/10 flex items-center justify-center transition-all shadow-xs"
            aria-label="More navigation items"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Menu Sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-light-border dark:border-[#1b223c] grid grid-cols-2 gap-1.5 animate-slide-down">
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-200 hover:text-light-textStrong dark:hover:text-white"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            <span>Docs & About</span>
          </Link>
          <Link
            to="/creator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-200 hover:text-light-textStrong dark:hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Creator Profile</span>
          </Link>
          {isCreator && (
            <>
              <Link
                to="/import"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-200"
              >
                <FolderPlus className="w-3.5 h-3.5 text-cyan-500" />
                <span>Import JSON</span>
              </Link>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Create Program</span>
              </Link>
            </>
          )}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-200 hover:text-light-textStrong dark:hover:text-white col-span-2"
          >
            <Users className="w-3.5 h-3.5 text-purple-500" />
            <span>Contact & Team</span>
          </Link>
        </div>
      )}
    </header>
  );
};
