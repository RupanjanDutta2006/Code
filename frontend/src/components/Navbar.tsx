import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  FolderPlus, 
  PlusCircle, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  LogIn, 
  User, 
  Layers, 
  Menu, 
  X,
  WifiOff,
  Sparkles,
  Users,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';
import { useAIChat } from '../context/AIChatContext';

export const Navbar: React.FC = () => {
  const { user, logout, isTeacher, isCreator } = useAuth();
  const { isOnline, queuedRuns } = useOffline();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { toggleChat } = useAIChat();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 liquid-glass border-b border-slate-200/80 dark:border-dark-700/80 px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CodeVault <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20 dark:border-brand-500/30">PRO</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-dark-400 block -mt-1 font-medium">Student Code Library & Compiler</span>
          </div>
        </Link>

        {/* Offline Badge */}
        {!isOnline && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode {queuedRuns.length > 0 && `(${queuedRuns.length} queued)`}</span>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
            }`}
          >
            Home
          </Link>

          {isCreator ? (
            <>
              <Link
                to="/my-programs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/my-programs') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                My Programs
              </Link>
              <Link
                to="/import"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/import') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <FolderPlus className="w-4 h-4 text-accent-cyan" />
                Import Folder
              </Link>
              <Link
                to="/create"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/create') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-accent-emerald" />
                New Program
              </Link>
              <Link
                to="/classrooms"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/classrooms') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-accent-amber" />
                My Classes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/programs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/programs') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <Layers className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                Programs
              </Link>
              <Link
                to="/my-class"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/my-class') 
                    ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                    : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-accent-amber" />
                My Class
              </Link>
            </>
          )}

          <Link
            to="/playground"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/playground') 
                ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-accent-violet" />
            Playground
          </Link>

          <Link
            to="/creator"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/creator') 
                ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Creator
          </Link>

          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/about') 
                ? 'text-brand-600 dark:text-white bg-slate-100 dark:bg-dark-800' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
            }`}
          >
            About
          </Link>

          <Link
            to="/contact"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/contact') 
                ? 'text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-dark-800' 
                : 'text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* User Auth Action Buttons & Theme Switcher */}
        <div className="hidden lg:flex items-center gap-3">
          {/* CodeVault AI Global Button */}
          <button
            onClick={toggleChat}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600/15 to-indigo-600/15 hover:from-brand-600/25 hover:to-indigo-600/25 text-brand-600 dark:text-brand-300 border border-brand-500/30 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all hover:scale-105"
            title="Open CodeVault AI Chat"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>CodeVault AI</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 fill-yellow-400/20 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-2 py-1 pr-2.5 rounded-xl bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-700">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.username}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-dark-600 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    <span>{user.full_name || user.username}</span>
                    {user.provider && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-dark-300 font-mono font-normal uppercase">
                        {user.provider}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-dark-400 uppercase font-medium">
                    {user.role} {user.phone_number ? `• ${user.phone_number}` : ''}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 dark:text-dark-400 hover:text-rose-600 dark:hover:text-accent-rose hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-800 dark:hover:bg-dark-750 text-slate-800 dark:text-white text-sm font-medium border border-slate-200 dark:border-dark-700 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-slate-500 dark:text-dark-300" />
                Login
              </Link>
              <Link
                to="/login?tab=register"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-md shadow-brand-500/20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu & Theme Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-yellow-400 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-dark-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-dark-800 space-y-2 animate-slide-up">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            Home
          </Link>
          <Link
            to="/programs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            Programs Library
          </Link>
          <Link
            to="/playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            Live Playground
          </Link>
          <Link
            to="/my-class"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            My Class (Interactive)
          </Link>
          <Link
            to="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            + Create Program
          </Link>
          <Link
            to="/creator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Creator & Resources
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            About & Docs
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-800 text-emerald-600 dark:text-emerald-400"
          >
            Contact & Team
          </Link>

          <div className="pt-2 border-t border-slate-200 dark:border-dark-800">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2.5">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.username}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-dark-600 shadow-sm"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {user.full_name || user.username}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-dark-400 uppercase">
                      {user.role} {user.provider ? `(${user.provider})` : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1 rounded-lg text-xs text-rose-600 dark:text-accent-rose bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 font-medium"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-white text-xs font-medium border border-slate-200 dark:border-dark-700"
                >
                  Login
                </Link>
                <Link
                  to="/login?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-brand-600 text-white text-xs font-medium"
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
