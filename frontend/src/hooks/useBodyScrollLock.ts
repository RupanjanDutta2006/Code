import { useEffect, useRef } from 'react';

/**
 * Global lock tracking so nested modals do not conflict.
 */
let activeLockCount = 0;
let preservedScrollY = 0;
let originalBodyStyles: {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  height: string;
  overflow: string;
  paddingRight: string;
} | null = null;
let originalHtmlOverflow = '';

/**
 * useBodyScrollLock
 * 
 * Bulletproof iOS / Android / Chrome / Safari viewport scroll locking.
 * 
 * Features:
 * - Locks the window / body scroll completely when `isLocked = true`
 * - Prevents background page and ambient glow from moving on touch swipe
 * - Preserves the exact scroll position and restores it seamlessly on close
 * - Prevents desktop layout shift by compensating scrollbar width
 * - Cleans up reliably on component unmount and route changes
 */
export function useBodyScrollLock(isLocked: boolean): void {
  const isCurrentlyLocked = useRef(false);

  useEffect(() => {
    if (!isLocked) {
      if (isCurrentlyLocked.current) {
        unlock();
        isCurrentlyLocked.current = false;
      }
      return;
    }

    // Apply lock
    if (!isCurrentlyLocked.current) {
      lock();
      isCurrentlyLocked.current = true;
    }

    return () => {
      if (isCurrentlyLocked.current) {
        unlock();
        isCurrentlyLocked.current = false;
      }
    };
  }, [isLocked]);
}

function lock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (activeLockCount === 0) {
    // Record current scroll position
    preservedScrollY = window.scrollY || document.documentElement.scrollTop || 0;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    originalHtmlOverflow = document.documentElement.style.overflow;
    originalBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      height: document.body.style.height,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    // Lock html & body
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${preservedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  activeLockCount++;
}

function unlock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  activeLockCount = Math.max(0, activeLockCount - 1);

  if (activeLockCount === 0 && originalBodyStyles) {
    // Restore styles
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.position = originalBodyStyles.position;
    document.body.style.top = originalBodyStyles.top;
    document.body.style.left = originalBodyStyles.left;
    document.body.style.right = originalBodyStyles.right;
    document.body.style.width = originalBodyStyles.width;
    document.body.style.height = originalBodyStyles.height;
    document.body.style.overflow = originalBodyStyles.overflow;
    document.body.style.paddingRight = originalBodyStyles.paddingRight;

    originalBodyStyles = null;

    // Restore exact scroll position
    window.scrollTo({
      top: preservedScrollY,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }
}

/**
 * Emergency reset utility to ensure scroll lock is NEVER left dangling
 * (e.g. on global error or route transitions).
 */
export function forceUnlockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  activeLockCount = 1;
  unlock();
}