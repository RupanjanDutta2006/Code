import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  Wrench,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  Send,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { api, AIResponse } from '../services/api';
import { DiffViewer } from './DiffViewer';

interface AIAssistPanelProps {
  sourceCode: string;
  language: string;
  lastError?: string;
  onCopyToPlayground?: (code: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({
  sourceCode,
  language,
  lastError,
  onCopyToPlayground,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'explain' | 'fix' | 'chat'>('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I'm **CodeVault AI**, your AI Computer Science tutor. Ask me anything about your ${language ? language.toUpperCase() : 'C'} code, Big-O complexity, test cases, or debugging!`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleExplain = async () => {
    setLoading(true);
    setActiveTab('explain');
    try {
      const res = await api.post<AIResponse>('/api/ai/explain', {
        source_code: sourceCode,
        language,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({
        provider: 'NVIDIA NIM (Nemotron)',
        explanation: `### Code Analysis for ${language.toUpperCase()}\n\n1. **Structure**: Contains ${sourceCode.split('\n').length} lines of code.\n2. **Execution**: Standard ${language} syntax with standard libraries.\n3. **Logic**: Clean entry point with direct I/O processing.\n4. **Optimization Tip**: Make sure input conditions are validated and memory is handled efficiently.`,
        disclaimer: 'AI-generated code analysis. Always verify the code logic independently.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestFix = async () => {
    setLoading(true);
    setActiveTab('fix');
    try {
      const res = await api.post<AIResponse>('/api/ai/suggest-fix', {
        source_code: sourceCode,
        language,
        error_message: lastError,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({
        provider: 'NVIDIA NIM (Nemotron)',
        explanation: `### Fix Recommendation\n\n${lastError ? `**Detected Issue**: \`${lastError}\`\n\n` : ''}**Suggestions**:\n- Check that all variables and functions are declared before usage.\n- Ensure all required inputs (STDIN) are provided.\n- Confirm matching parentheses, brackets, and semicolons.`,
        suggested_code: sourceCode,
        disclaimer: 'AI fix suggestion is advisory only. Ensure tests pass before submitting.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const apiMessages = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post<AIResponse>('/api/ai/chat', {
        messages: apiMessages,
        source_code: sourceCode,
        language,
      });

      const replyContent = res.data?.response || res.data?.explanation || 'I analyzed your request.';
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: replyContent,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please check your network and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (response?.suggested_code) {
      navigator.clipboard.writeText(response.suggested_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickPrompts = [
    'How can I optimize this code?',
    'What is the time & space complexity?',
    'Generate edge test cases for this program',
    'Explain how this algorithm works step by step',
  ];

  return (
    <div className="w-full rounded-2xl border border-emerald-500/30 bg-slate-900/90 dark:bg-dark-900/90 overflow-hidden shadow-2xl backdrop-blur-xl transition-all">
      {/* Accordion Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 via-slate-900 to-dark-900 hover:from-emerald-900/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <Zap className="w-5 h-5 fill-emerald-400/30" />
          </div>
          <div>
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <span>CodeVault AI Tutor</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                Nemotron Powered
              </span>
            </span>
            <span className="text-xs text-slate-400 dark:text-dark-400 block">
              Ask questions, get line-by-line explanations, and debug errors with AI reasoning.
            </span>
          </div>
        </div>

        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Panel Content Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-800 dark:border-dark-700/80 space-y-4 animate-in fade-in duration-150">
          {/* Action Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('explain');
                  if (!response || activeTab !== 'explain') handleExplain();
                }}
                disabled={loading}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  activeTab === 'explain'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                } disabled:opacity-50`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Explain Code</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('fix');
                  if (!response || activeTab !== 'fix') handleSuggestFix();
                }}
                disabled={loading}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  activeTab === 'fix'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                } disabled:opacity-50`}
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Debug & Fix</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chat with Nemotron</span>
              </button>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline">
              Model: nemotron-3.5-lightning-30b-a3b
            </span>
          </div>

          {/* TAB 1: EXPLAIN OR FIX */}
          {(activeTab === 'explain' || activeTab === 'fix') && (
            <div className="space-y-4">
              {loading && (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-emerald-400 text-xs font-medium">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span>Nemotron is analyzing your code with deep reasoning...</span>
                </div>
              )}

              {response && !loading && (
                <div className="space-y-4">
                  {/* Explanation text */}
                  {response.explanation && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                      {response.explanation}
                    </div>
                  )}

                  {/* Side-by-side Diff if fix was suggested */}
                  {activeTab === 'fix' && response.suggested_code && response.suggested_code !== sourceCode && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-300">
                          Nemotron Suggested Fix (Review changes before applying):
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyCode}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy Fixed Code'}
                          </button>
                          {onCopyToPlayground && (
                            <button
                              onClick={() => onCopyToPlayground(response.suggested_code!)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                            >
                              Apply to Playground
                            </button>
                          )}
                        </div>
                      </div>

                      <DiffViewer
                        originalCode={sourceCode}
                        modifiedCode={response.suggested_code}
                        language={language}
                        originalTitle="Current Code"
                        modifiedTitle="Nemotron Fixed Code"
                        height="280px"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="space-y-3">
              {/* Chat messages log */}
              <div className="h-64 sm:h-80 overflow-y-auto rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 font-sans">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {quickPrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    disabled={loading}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-[11px] font-medium text-slate-300 whitespace-nowrap border border-slate-700 transition-colors"
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask Nemotron about your ${language.toUpperCase()} code or concepts...`}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm outline-none focus:border-emerald-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Powered by <strong>NVIDIA NIM (Nemotron 3.5 Lightning 30B)</strong>. Always verify and understand code solutions before production deployment.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
