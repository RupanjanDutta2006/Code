import React from 'react';
import { Zap, MessageSquare } from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';

export const AIChatFloatingButton: React.FC = () => {
  const { isOpen, toggleChat, isStreaming } = useAIChat();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={toggleChat}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/30 border border-emerald-400/30 backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95"
        title="Open NVIDIA Nemotron AI Chat"
      >
        {/* Glow pulse ring */}
        <span className="absolute -inset-0.5 rounded-2xl bg-emerald-400 opacity-30 group-hover:opacity-60 blur-sm transition-opacity" />

        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center border border-white/20">
            <Zap className={`w-3.5 h-3.5 fill-current ${isStreaming ? 'animate-bounce' : ''}`} />
          </div>
          <span className="tracking-tight">Nemotron AI</span>
        </div>

        {/* Status Dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
        </span>
      </button>
    </div>
  );
};
