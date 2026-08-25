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
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-dark-950/90 backdrop-blur-md border-b border-[#E5E9F0] dark:border-[#1e2746]/80 px-4 sm:px-6 py-3 transition-colors duration-200 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-light-blue via-indigo-600 to-purple-600 dark:from-neon-blue dark:via-brand-600 dark:to-neon-purple flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-all duration-300">
              <Code2 className="w-5 h-5" />
            </div>
            {/* Subtle glow aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-light-blue to-purple-600 rounded-2xl blur opacity-25 dark:opacity-40 group-hover:opacity-60 transition duration-300 -z-10" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-light-textStrong dark:text-white flex items-center gap-1.5 font-sans">
              CodeVault <span className="text-[10px] px-2 py-0.5 rounded-full bg-light-blueSoft text-light-blue dark:bg-purple-500/20 dark:text-purple-300 font-bold border border-light-blueBorder/40 dark:border-purple-500/30">PRO</span>
            </span>
            <span className="text-[10px] text-light-textMuted dark:text-dark-400 block -mt-1 font-medium">Next-Gen Code & AI Platform</span>
          </div>
        </Link>

        {/* Offline Badge */}
        {!isOnline && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode {queuedRuns.length > 0 && `(${queuedRuns.length} queued)`}</span>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-light-secondary dark:bg-dark-900/60 p-1.5 rounded-2xl border border-light-border dark:border-[#1b223c]">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive('/') && location.pathname === '/'
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            Home
          </Link>

          <Link
            to="/programs"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/programs') 
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            Programs
          </Link>

          <Link
            to="/my-class"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/my-class') 
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500 dark:text-accent-amber" />
            My Class
          </Link>

          <Link
            to="/playground"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/playground') 
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-accent-violet" />
            Playground
          </Link>

          {isCreator && (
            <>
              <Link
                to="/import"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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

          {(user?.role === 'teacher' || isCreator) && (
            <Link
              to="/classrooms"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              isActive('/creator') 
                ? 'text-white bg-light-blue shadow-sm dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 dark:shadow-brand-500/25' 
                : 'text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white hover:bg-white dark:hover:bg-dark-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            Creator
          </Link>
        </div>

        {/* Right Actions: CodeVault AI trigger + Theme toggle + Auth */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick AI Assistant Trigger in Navbar */}
          <button
            onClick={toggleChat}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-light-blueSoft dark:bg-gradient-to-r dark:from-purple-950/50 dark:to-dark-900 border border-light-blueBorder/50 dark:border-purple-500/40 text-light-blue dark:text-purple-300 text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 group"
            title="Open CodeVault AI Assistant"
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-light-blue dark:text-neon-purple group-hover:rotate-12 transition-transform" />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                offlineState.status === 'ready' 
                  ? 'bg-cyan-500' 
                  : healthStatus === 'ONLINE_HEALTHY' 
                  ? 'bg-emerald-500' 
                  : 'bg-amber-500'
              } animate-pulse`} />
            </div>
            <span>CodeVault AI</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white border border-light-border dark:border-[#1b223c] transition-all hover:scale-105 shadow-sm"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-light-blue" />}
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-1">
              <span className="hidden md:block text-xs font-semibold text-light-textNormal dark:text-dark-200">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-2xl bg-light-secondary dark:bg-dark-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-light-textMuted dark:text-dark-400 hover:text-rose-600 dark:hover:text-rose-400 border border-light-border dark:border-[#1b223c] hover:border-rose-300 dark:hover:border-rose-500/30 transition-all shadow-sm"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-2xl bg-light-blue hover:bg-light-blueHover dark:bg-gradient-to-r dark:from-brand-600 dark:to-indigo-600 text-white text-xs font-bold shadow-sm shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-light-secondary dark:bg-dark-900 text-light-textNormal dark:text-dark-300 hover:text-light-textStrong dark:hover:text-white border border-light-border dark:border-[#1b223c]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-light-border dark:border-[#1b223c] space-y-1 animate-slide-down">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-xs font-semibold ${
              isActive('/') && location.pathname === '/' 
                ? 'bg-light-blueSoft text-light-blue dark:bg-dark-800 dark:text-white' 
                : 'text-light-textNormal dark:text-dark-300 hover:bg-light-secondary dark:hover:bg-dark-850'
            }`}
          >
            Home
          </Link>
          <Link
            to="/programs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-xs font-semibold ${
              isActive('/programs') 
                ? 'bg-light-blueSoft text-light-blue dark:bg-dark-800 dark:text-white' 
                : 'text-light-textNormal dark:text-dark-300 hover:bg-light-secondary dark:hover:bg-dark-850'
            }`}
          >
            Programs
          </Link>
          <Link
            to="/my-class"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-xs font-semibold ${
              isActive('/my-class') 
                ? 'bg-light-blueSoft text-light-blue dark:bg-dark-800 dark:text-white' 
                : 'text-light-textNormal dark:text-dark-300 hover:bg-light-secondary dark:hover:bg-dark-850'
            }`}
          >
            My Class (Interactive DSA)
          </Link>
          <Link
            to="/playground"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-xs font-semibold ${
              isActive('/playground') 
                ? 'bg-light-blueSoft text-light-blue dark:bg-dark-800 dark:text-white' 
                : 'text-light-textNormal dark:text-dark-300 hover:bg-light-secondary dark:hover:bg-dark-850'
            }`}
          >
            Live Playground
          </Link>
          <Link
            to="/creator"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2 rounded-xl text-xs font-semibold ${
              isActive('/creator') 
                ? 'bg-light-blueSoft text-light-blue dark:bg-dark-800 dark:text-white' 
                : 'text-light-textNormal dark:text-dark-300 hover:bg-light-secondary dark:hover:bg-dark-850'
            }`}
          >
            Creator
          </Link>
        </div>
      )}
    </nav>
  );
};
