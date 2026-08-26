import React from 'react';
import { Code2 } from 'lucide-react';

interface CodeVaultStartupShellProps {
  message?: string;
  minimal?: boolean;
}

export const CodeVaultStartupShell: React.FC<CodeVaultStartupShellProps> = ({ 
  message = 'Initializing CodeVault...',
  minimal = false
}) => {
  if (minimal) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center px-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-700 text-white flex items-center justify-center shadow-glow-red-sm animate-pulse">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="absolute -inset-1 bg-crimson-500/20 rounded-2xl blur-sm -z-10" />
        </div>
        <p className="text-xs font-mono text-slate-500 dark:text-dark-400">{message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 relative select-none animate-fade-in">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-sm">
        {/* Brand Icon with Glow Ring */}
        <div className="relative">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-crimson-500 to-crimson-700 text-white flex items-center justify-center shadow-glow-red">
            <Code2 className="w-7 h-7" />
          </div>
          <div className="absolute -inset-2 bg-crimson-500/25 rounded-3xl blur-md -z-10 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CodeVault <span className="text-crimson-500 font-mono">Pro</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-dark-400 font-medium">
            {message}
          </p>
        </div>

        {/* Indeterminate Progress Indicator */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-dark-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-crimson-600 via-crimson-400 to-crimson-600 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
};