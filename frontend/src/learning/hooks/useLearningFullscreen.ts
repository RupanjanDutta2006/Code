import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseLearningFullscreenReturn {
  isFullscreen: boolean;
  isOrientationLocked: boolean;
  lockFailed: boolean;
  enterFullscreen: (targetElement?: HTMLElement | null) => Promise<boolean>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: (targetElement?: HTMLElement | null) => Promise<void>;
}

/**
 * Reusable Fullscreen and Landscape Orientation Lock hook.
 * Gracefully handles browser security gesture requirements and platform discrepancies
 * (e.g. Android Chrome vs iOS Safari).
 */
export function useLearningFullscreen(): UseLearningFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
  });

  const [isOrientationLocked, setIsOrientationLocked] = useState<boolean>(false);
  const [lockFailed, setLockFailed] = useState<boolean>(false);
  const lockedRef = useRef<boolean>(false);

  // Sync state with browser fullscreenchange events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(
        document.fullscreenElement || (document as any).webkitFullscreenElement
      );
      setIsFullscreen(active);

      // If user exited fullscreen via system gesture or Escape key, release orientation lock
      if (!active && lockedRef.current) {
        try {
          if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
            (screen.orientation as any).unlock();
          }
        } catch {
          // ignore
        }
        lockedRef.current = false;
        setIsOrientationLocked(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const attemptOrientationLock = useCallback(async (): Promise<boolean> => {
    try {
      if (
        typeof screen !== 'undefined' &&
        screen.orientation &&
        typeof (screen.orientation as any).lock === 'function'
      ) {
        await (screen.orientation as any).lock('landscape');
        lockedRef.current = true;
        setIsOrientationLocked(true);
        setLockFailed(false);
        return true;
      }
    } catch (err) {
      // Orientation lock unsupported or rejected (common on iOS/desktop)
      setLockFailed(true);
      setIsOrientationLocked(false);
    }
    return false;
  }, []);

  const enterFullscreen = useCallback(
    async (targetElement?: HTMLElement | null): Promise<boolean> => {
      const elem = targetElement || document.documentElement;
      let success = false;

      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
          success = true;
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
          success = true;
        }
      } catch (err) {
        console.warn('[LearningFullscreen] Fullscreen request rejected or unavailable:', err);
      }

      // After user gesture triggers fullscreen, attempt orientation lock to landscape
      await attemptOrientationLock();

      return success;
    },
    [attemptOrientationLock]
  );

  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen && (document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      }
    } catch (err) {
      console.warn('[LearningFullscreen] Exit fullscreen error:', err);
    }

    if (lockedRef.current) {
      try {
        if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
          (screen.orientation as any).unlock();
        }
      } catch {
        // ignore
      }
      lockedRef.current = false;
      setIsOrientationLocked(false);
    }
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(
    async (targetElement?: HTMLElement | null): Promise<void> => {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await enterFullscreen(targetElement);
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  );

  return {
    isFullscreen,
    isOrientationLocked,
    lockFailed,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
