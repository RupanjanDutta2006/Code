import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  bodyClassName?: string;
  role?: 'dialog' | 'alertdialog';
  'aria-label'?: string;
}

const MAX_WIDTH_CLASSES: Record<string, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  full: 'sm:max-w-full',
};

/**
 * ModalPortal
 * 
 * Viewport-level React Portal Modal Component.
 * 
 * Guarantees:
 * 1. Renders directly in `document.body` outside the page hierarchy
 * 2. Locks page/body scroll bulletproofly without horizontal shift or losing position
 * 3. Modal backdrop has z-[1000] and panel has z-[1010] (guaranteed above footer, navbar, bottom-nav)
 * 4. Internal modal body has `overscroll-contain` and `-webkit-overflow-scrolling: touch`
 * 5. Respects 100dvh safe-area-inset on mobile screens (360px - 430px)
 * 6. Supports Escape key and accessible focus / keyboard handling
 */
export const ModalPortal: React.FC<ModalPortalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'lg',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  bodyClassName = '',
  role = 'dialog',
  'aria-label': ariaLabel,
}) => {
  // Lock body scroll when open
  useBodyScrollLock(isOpen);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const maxWidthClass = MAX_WIDTH_CLASSES[maxWidth] || 'sm:max-w-lg';

  const modalContent = (
    <div
      role={role}
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : ariaLabel || 'Modal Dialog'}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain animate-fade-in select-auto"
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        touchAction: 'none',
      }}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {/* Modal Dialog Card / Panel */}
      <div
        className={`relative z-[1010] bg-white dark:bg-[#0e0e13] border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl w-full ${maxWidthClass} shadow-2xl flex flex-col animate-slide-up overflow-hidden ${className}`}
        style={{
          maxHeight: 'calc(100dvh - 12px)',
          touchAction: 'pan-y',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional Modal Header */}
        {(title || icon || showCloseButton) && (
          <div className="sticky top-0 z-10 shrink-0 px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0e0e13]/95 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="p-2 rounded-xl bg-crimson-500/10 text-crimson-500 dark:text-crimson-400 border border-crimson-500/25 shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                {title && (
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate font-sans">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-dark-400 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors shrink-0 touch-target flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Modal Body Container */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-4 overscroll-contain ${bodyClassName}`}
          style={{
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
          }}
        >
          {children}
        </div>

        {/* Optional Sticky Footer Actions */}
        {footer && (
          <div 
            className="sticky bottom-0 z-10 shrink-0 px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0e0e13]/95 backdrop-blur-md flex items-center justify-end gap-2"
            style={{
              paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom, 0px))',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalPortal;