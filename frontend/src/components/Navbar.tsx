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
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

export const Navbar: React.FC = () => {
  const { user, logout, isTeacher, isCreator } = useAuth();
  const { isOnline, queuedRuns } = useOffline();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              CodeVault <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">PRO</span>
            </span>
            <span className="text-[10px] text-dark-400 block -mt-1 font-medium">Student Code Library & Runner</span>
          </div>
        </Link>

        {/* Offline Badge */}
        {!isOnline && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode {queuedRuns.length > 0 && `(${queuedRuns.length} queued)`}</span>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
            }`}
          >
            Home
          </Link>

          {isCreator ? (
            <>
              <Link
                to="/my-programs"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/my-programs') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-brand-400" />
                My Programs
              </Link>
              <Link
                to="/import"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/import') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                }`}
              >
                <FolderPlus className="w-4 h-4 text-accent-cyan" />
                Import Folder
              </Link>
              <Link
                to="/create"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/create') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-accent-emerald" />
                New Program
              </Link>
              <Link
                to="/classrooms"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/classrooms') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
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
                  isActive('/programs') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                }`}
              >
                <Layers className="w-4 h-4 text-brand-400" />
                Programs
              </Link>
              <Link
                to="/classrooms"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/classrooms') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
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
              isActive('/playground') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-accent-violet" />
            Playground
          </Link>

          <Link
            to="/about"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/about') ? 'text-white bg-dark-800' : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
            }`}
          >
            About
          </Link>
        </div>

        {/* User Auth Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 py-1 pr-2 rounded-xl bg-dark-800/80 border border-dark-700">
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.full_name || user.username}
                  </div>
                  <div className="text-[10px] text-dark-400 uppercase font-medium">
                    {user.role}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-dark-400 hover:text-accent-rose hover:bg-dark-800 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-sm font-medium border border-dark-700 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-dark-300" />
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-2 border-t border-dark-700/60 mt-3 space-y-1 animate-slide-up">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
          >
            Home
          </Link>
          {isCreator ? (
            <>
              <Link
                to="/my-programs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                My Programs
              </Link>
              <Link
                to="/import"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                Import Folder
              </Link>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                Create Program
              </Link>
              <Link
                to="/classrooms"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                My Classes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/programs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                Programs
              </Link>
              <Link
                to="/classrooms"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
              >
                My Class
              </Link>
            </>
          )}
          <Link
            to="/playground"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
          >
            Collaborative Playground
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-dark-200 hover:bg-dark-800"
          >
            About
          </Link>
          <div className="pt-2 border-t border-dark-700">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-accent-rose hover:bg-dark-800"
              >
                Logout ({user.username})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-brand-400 hover:bg-dark-800"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
