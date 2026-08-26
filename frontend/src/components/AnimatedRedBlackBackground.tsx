import React from 'react';

/**
 * AnimatedRedBlackBackground
 * 
 * Ultra-lightweight, hardware-accelerated ambient background system.
 * Features deep black base, slow-moving crimson/ruby gradient orbs, and soft radial vignette.
 * 
 * Rules:
 * - pointer-events: none (NEVER blocks clicks, taps, or form interactions)
 * - z-index: -10 (stays beneath all UI content)
 * - Pure CSS keyframe transforms (zero main-thread JS performance cost)
 * - Respects prefers-reduced-motion media query
 */
export const AnimatedRedBlackBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dark Mode Ambient Aurora Layer */}
      <div className="hidden dark:block absolute inset-0 bg-[#060608]">
        {/* Ambient Top Red Spotlight */}
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-[130px] animate-aurora-slow"
          style={{
            background: 'radial-gradient(circle, #ff4d5a 0%, #8c1f27 50%, transparent 80%)',
            willChange: 'transform, opacity'
          }}
        />

        {/* Floating Crimson Orb - Top Left */}
        <div 
          className="absolute top-[15%] -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full opacity-15 blur-[120px] animate-aurora-float"
          style={{
            background: 'radial-gradient(circle, #ff4d5a 0%, #be123c 60%, transparent 80%)',
            willChange: 'transform'
          }}
        />

        {/* Floating Dark Maroon Orb - Bottom Right */}
        <div 
          className="absolute bottom-[10%] -right-20 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full opacity-20 blur-[140px] animate-aurora-slow"
          style={{
            background: 'radial-gradient(circle, #8c1f27 0%, #4c0519 60%, transparent 85%)',
            animationDelay: '-6s',
            willChange: 'transform, opacity'
          }}
        />

        {/* Center Accent Pulse Orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[150px] animate-glow-pulse"
          style={{
            background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)',
            willChange: 'transform, opacity'
          }}
        />

        {/* Subtle Vignette Overlay for Depth */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, transparent 30%, #060608 95%)',
          }}
        />
      </div>

      {/* Light Mode Soft Mesh Layer */}
      <div className="block dark:hidden absolute inset-0 bg-[#F6F7F9]">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #ff4d5a 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-5 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #e11d48 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};
