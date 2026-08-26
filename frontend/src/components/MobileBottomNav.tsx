import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Terminal, GraduationCap, Sparkles } from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { toggleChat, isOpen } = useAIChat();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      active: isActive('/') && location.pathname === '/',
    },
    {
      label: 'Programs',
      path: '/programs',
      icon: Layers,
      active: isActive('/programs'),
    },
    {
      label: 'Compiler',
      path: '/playground',
      icon: Terminal,
      active: isActive('/playground'),
    },
    {
      label: 'My Class',
      path: '/my-class',
      icon: GraduationCap,
      active: isActive('/my-class'),
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#09090d]/90 backdrop-blur-2xl border-t border-light-border dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.8)] transition-colors duration-200"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full touch-target rounded-xl transition-all duration-150 relative ${
                item.active
                  ? 'text-crimson-600 dark:text-crimson-400 font-bold'
                  : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-transform ${item.active ? 'scale-110' : ''}`}>
                <Icon className="w-5 h-5" />
                {item.active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-crimson-500 shadow-glow-red-sm" />
                )}
              </div>
              <span className="text-[10px] tracking-tight font-medium -mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* 5th Tab: AI Chat Trigger Button */}
        <button
          onClick={toggleChat}
          className={`flex flex-col items-center justify-center h-full touch-target rounded-xl transition-all duration-150 relative ${
            isOpen
              ? 'text-crimson-600 dark:text-crimson-400 font-bold'
              : 'text-light-textSecondary dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white'
          }`}
          title="Open CodeVault AI"
        >
          <div className="relative p-1 rounded-xl">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-crimson-600 via-red-600 to-rose-600 text-white flex items-center justify-center shadow-glow-red-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white dark:border-[#09090d]" />
          </div>
          <span className="text-[10px] tracking-tight font-medium -mt-0.5">AI Assist</span>
        </button>
      </div>
    </nav>
  );
};
