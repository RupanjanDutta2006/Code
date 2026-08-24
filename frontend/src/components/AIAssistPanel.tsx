import React, { useState } from 'react';
import { Sparkles, HelpCircle, Wrench, AlertTriangle, ChevronDown, ChevronUp, Loader2, Copy, Check, MessageSquare } from 'lucide-react';
import { api, AIResponse } from '../services/api';
import { DiffViewer } from './DiffViewer';
import { useAIChat } from '../context/AIChatContext';

interface AIAssistPanelProps {
  sourceCode: string;
  language: string;
  lastError?: string;
  onCopyToPlayground?: (code: string) => void;
}

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({
  sourceCode,
  language,
  lastError,
  onCopyToPlayground,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { setIsOpen: setChatOpen, sendMessage, setActiveAttachment } = useAIChat();

  const handleOpenFullChat = () => {
    setActiveAttachment({
      type: 'code',
      title: `${language.toUpperCase()} Program`,
      content: sourceCode,
      language,
    });
    setChatOpen(true);
  };

  const handleExplain = async () => {
    setLoading(true);
    setActiveAction('explain');
    try {
      const res = await api.post<AIResponse>('/api/ai/explain', {
        source_code: sourceCode,
        language,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({
        provider: 'CodeVault Assistant (Built-in)',
        explanation: `### Code Analysis for ${language.toUpperCase()}\n\n1. **Structure**: Contains ${sourceCode.split('\n').length} lines of code.\n2. **Execution**: Uses standard ${language} syntax.\n3. **Logic Flow**: Direct I/O and processing pipeline.\n4. **Tip**: Validate all loop bounds and verify handling of empty/edge inputs.`,
        disclaimer: 'AI-generated code analysis is provided for educational assistance. Always verify the code logic independently.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestFix = async () => {
    setLoading(true);
    setActiveAction('fix');
    try {
      const res = await api.post<AIResponse>('/api/ai/suggest-fix', {
        source_code: sourceCode,
        language,
        error_message: lastError,
      });
      setResponse(res.data);
    } catch (err) {
      setResponse({
        provider: 'CodeVault Assistant (Built-in)',
        explanation: `### Fix Recommendation\n\n${lastError ? `**Detected Issue**: \`${lastError}\`\n\n` : ''}**Suggestions**:\n- Check that all variables and functions are declared before usage.\n- Ensure required inputs (STDIN) are provided.\n- Confirm matching parentheses, brackets, and semicolons if applicable.`,
        suggested_code: sourceCode,
        disclaimer: 'AI fix suggestion is advisory only. Ensure tests pass before submitting.',
      });
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

  return (
    <div className="w-full rounded-xl border border-indigo-500/30 bg-dark-900/90 overflow-hidden shadow-lg">
      {/* Accordion Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 to-dark-900 hover:from-indigo-900/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white text-sm flex items-center gap-2">
              Ask for Help (CodeVault AI)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                Hybrid AI
              </span>
            </span>
            <span className="text-xs text-dark-400 block">
              Get an explanation or targeted fix suggestion without modifying your original code.
            </span>
          </div>
        </div>

        <div className="text-dark-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Panel Content Body */}
      {isOpen && (
        <div className="p-5 border-t border-dark-700/80 space-y-4 animate-slide-up">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 items-center justify-between">
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleExplain}
                disabled={loading}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                  activeAction === 'explain'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-dark-800 text-dark-200 border-dark-700 hover:bg-dark-750 hover:text-white'
                } disabled:opacity-50`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Explain this code
              </button>

              <button
                onClick={handleSuggestFix}
                disabled={loading}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                  activeAction === 'fix'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-dark-800 text-dark-200 border-dark-700 hover:bg-dark-750 hover:text-white'
                } disabled:opacity-50`}
              >
                <Wrench className="w-4 h-4 text-accent-amber" />
                Why did my code fail / Suggest a fix
              </button>
            </div>

            <button
              onClick={handleOpenFullChat}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Chat in CodeVault AI
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-indigo-400 text-sm font-medium">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing code and generating response...</span>
            </div>
          )}

          {/* AI Response Output */}
          {response && !loading && (
            <div className="space-y-4">
              {/* Text explanation */}
              {response.explanation && (
                <div className="p-4 rounded-xl bg-dark-950 border border-dark-700 text-sm text-dark-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {response.explanation}
                </div>
              )}

              {/* Side-by-side Diff if fix was suggested */}
              {response.suggested_code && response.suggested_code !== sourceCode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300">
                      Suggested Fix (Review what changed before using):
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyCode}
                        className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 text-xs flex items-center gap-1.5 transition-colors border border-dark-700"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Fixed Code'}
                      </button>
                      {onCopyToPlayground && (
                        <button
                          onClick={() => onCopyToPlayground(response.suggested_code!)}
                          className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors"
                        >
                          Open in Playground
                        </button>
                      )}
                    </div>
                  </div>

                  <DiffViewer
                    originalCode={sourceCode}
                    modifiedCode={response.suggested_code}
                    language={language}
                    originalTitle="Current Code"
                    modifiedTitle="AI Suggested Fix"
                    height="280px"
                  />
                </div>
              )}

              {/* Mandatory AI Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  ⚠ <strong>AI-generated.</strong> May be incorrect. Always verify and understand the solution before relying on it.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
