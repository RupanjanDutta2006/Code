import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Maximize2, X, Sparkles } from 'lucide-react';

interface MobileLandscapeOnboardingProps {
  isMobile: boolean;
  isPortrait: boolean;
  isFullscreen: boolean;
  onEnterFullscreen: () => void;
  onDismissPortrait?: () => void;
}

const STORAGE_KEY = 'myclass_portrait_preferred';

export const MobileLandscapeOnboarding: React.FC<MobileLandscapeOnboardingProps> = ({
  isMobile,
  isPortrait,
  isFullscreen,
  onEnterFullscreen,
  onDismissPortrait,
}) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  const [showRotateHint, setShowRotateHint] = useState<boolean>(true);

  // If phone is rotated to landscape, auto-dismiss onboarding
  useEffect(() => {
    if (!isPortrait) {
      setShowRotateHint(false);
    }
  }, [isPortrait]);

  const handleContinuePortrait = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    if (onDismissPortrait) onDismissPortrait();
  };

  const handleOpenFullscreen = () => {
    onEnterFullscreen();
  };

  // Case 1: Already in fullscreen but device is still held in portrait (e.g. iOS fallback)
  if (isFullscreen && isPortrait && showRotateHint) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-white shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 animate-pulse">
            <RotateCw className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-amber-300">Rotate Phone to Landscape</p>
            <p className="text-[11px] text-slate-300">For side-by-side code & simulation</p>
          </div>
        </div>
        <button
          onClick={() => setShowRotateHint(false)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Case 2: Mobile in portrait, not yet dismissed
  if (isMobile && isPortrait && !dismissed && !isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-sm rounded-3xl liquid-glass border border-brand-500/30 p-6 shadow-2xl space-y-5 text-center relative overflow-hidden">
          {/* Subtle glow backdrop */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Header */}
          <div className="flex justify-center">
            <div className="relative p-4 rounded-3xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <Smartphone className="w-8 h-8 rotate-90 transition-transform duration-500" />
              <RotateCw className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          {/* Text Details */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Better in Landscape
            </h3>
            <p className="text-xs text-slate-600 dark:text-dark-300 leading-relaxed">
              Rotate your phone horizontally to watch source code and animated simulation simultaneously side-by-side.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleOpenFullscreen}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-transform active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Open Fullscreen Mode</span>
            </button>

            <button
              onClick={handleContinuePortrait}
              className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-slate-500 dark:text-dark-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Continue in Portrait
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
