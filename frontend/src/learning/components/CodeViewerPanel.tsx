import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { ProgramImplementation } from '../core/types';

interface CodeViewerPanelProps {
  implementation: ProgramImplementation;
  activeLineNumber?: number;
  availableLanguages: string[];
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const CodeViewerPanel: React.FC<CodeViewerPanelProps> = ({
  implementation,
  activeLineNumber,
  availableLanguages,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const codeLines = (implementation?.sourceCode || '').split('\n');
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active line smoothly
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLineNumber]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-light-border dark:border-white/10 bg-[#08080c] text-slate-100 overflow-hidden shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0e13] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-semibold text-dark-200 ml-2">
            Source Code
          </span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-dark-400 font-mono">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value)}
            className="bg-[#14141a] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1 font-mono outline-none focus:border-crimson-500 transition-colors"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Code Lines with Smooth Highlighting */}
      <div
        ref={containerRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed select-text"
      >
        {codeLines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLineNumber;

          return (
            <div
              key={lineNum}
              ref={isActive ? activeLineRef : null}
              className={`flex items-center gap-3 px-2 py-0.5 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-crimson-500/25 border-l-4 border-crimson-500 text-white font-medium shadow-sm'
                  : 'text-dark-300 hover:bg-[#121218]/60'
              }`}
            >
              {/* Active Arrow Indicator */}
              <div className="w-4 flex items-center justify-center">
                {isActive ? (
                  <Play className="w-3 h-3 text-crimson-400 fill-crimson-400 animate-pulse" />
                ) : (
                  <span className="w-3" />
                )}
              </div>

              {/* Line Number */}
              <span
                className={`w-6 text-right select-none font-mono text-[11px] ${
                  isActive ? 'text-crimson-400 font-bold' : 'text-dark-500'
                }`}
              >
                {lineNum}
              </span>

              {/* Code Text */}
              <span className="flex-1 font-mono whitespace-pre">{lineText || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
