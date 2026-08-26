import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CodeVault Uncaught Component Error]', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-light-bg dark:bg-[#060608] text-slate-800 dark:text-dark-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e0e13] border border-rose-500/30 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
              <p className="text-xs text-slate-500 dark:text-dark-400">
                CodeVault encountered an unexpected interface error. We have logged this event.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-950 text-left overflow-x-auto text-[11px] font-mono text-rose-600 dark:text-rose-400 max-h-32 border border-slate-200 dark:border-white/5">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-white text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-red-sm flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
