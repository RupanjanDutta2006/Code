import { useState, useEffect, useCallback } from 'react';

export interface DeviceLayoutState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  supportsFullscreen: boolean;
  supportsOrientationLock: boolean;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Capability-based responsive layout and orientation hook.
 * Detects device form factors using touch capabilities, viewport dimensions,
 * and media query signals without depending on brittle User-Agent strings.
 */
export function useDeviceLayout(): DeviceLayoutState {
  const getLayoutState = useCallback((): DeviceLayoutState => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        supportsFullscreen: false,
        supportsOrientationLock: false,
        screenWidth: 1280,
        screenHeight: 800,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Detect touch / coarse pointer capabilities
    const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Orientation detection using matchMedia and aspect ratio fallback
    const landscapeMedia = window.matchMedia?.('(orientation: landscape)').matches;
    const isLandscape = landscapeMedia !== undefined ? landscapeMedia : width > height;
    const isPortrait = !isLandscape;

    // Breakpoint heuristics combined with touch capability
    const isSmallScreen = width <= 768;
    const isMediumScreen = width > 768 && width <= 1024;

    // Mobile: Small screen or coarse pointer on small-to-medium viewport
    const isMobile = isSmallScreen || (hasCoarsePointer && width < 900 && isPortrait);
    // Tablet: Medium viewport with touch or standard tablet range
    const isTablet = !isMobile && (isMediumScreen || (hasTouch && width <= 1180));
    // Desktop: Large screen with precision pointer
    const isDesktop = !isMobile && !isTablet;

    const supportsFullscreen = Boolean(
      typeof document !== 'undefined' &&
        (document.fullscreenEnabled || (document as any).webkitFullscreenEnabled)
    );

    const supportsOrientationLock = Boolean(
      typeof screen !== 'undefined' &&
        screen.orientation &&
        typeof (screen.orientation as any).lock === 'function'
    );

    return {
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape,
      supportsFullscreen,
      supportsOrientationLock,
      screenWidth: width,
      screenHeight: height,
    };
  }, []);

  const [layout, setLayout] = useState<DeviceLayoutState>(getLayoutState);

  useEffect(() => {
    const handleUpdate = () => {
      setLayout(getLayoutState());
    };

    window.addEventListener('resize', handleUpdate, { passive: true });
    window.addEventListener('orientationchange', handleUpdate, { passive: true });

    // Also listen to matchMedia orientation changes
    const orientationMql = window.matchMedia?.('(orientation: landscape)');
    if (orientationMql?.addEventListener) {
      orientationMql.addEventListener('change', handleUpdate);
    } else if (orientationMql?.addListener) {
      orientationMql.addListener(handleUpdate);
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('orientationchange', handleUpdate);
      if (orientationMql?.removeEventListener) {
        orientationMql.removeEventListener('change', handleUpdate);
      } else if (orientationMql?.removeListener) {
        orientationMql.removeListener(handleUpdate);
      }
    };
  }, [getLayoutState]);

  return layout;
}
