import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Loader2, 
  ListChecks 
} from 'lucide-react';
import { api, TestCase, JudgeSubmitResult, JudgeCaseResult } from '../services/api';
import { executeUniversal } from '../services/compilerEngine';

interface PracticeJudgeProps {
  programId: number;
  testCases: TestCase[];
  sourceCode: string;
  language: string;
  classroomId?: number;
  onSubmissionComplete?: (result: JudgeSubmitResult) => void;
}

export const PracticeJudge: React.FC<PracticeJudgeProps> = ({
  programId,
  testCases,
  sourceCode,
  language,
  classroomId,
  onSubmissionComplete,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<JudgeSubmitResult | null>(null);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);

  const runLocalJudge = async (): Promise<JudgeSubmitResult> => {
    const caseResults: JudgeCaseResult[] = [];
    let passedCount = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const resp = await executeUniversal({
        language,
        sourceCode,
        customInput: tc.input_data,
      });

      const actualTrimmed = (resp.output || '').trim().replace(/\r\n/g, '\n');
      const expectedTrimmed = (tc.expected_output || '').trim().replace(/\r\n/g, '\n');

      let status: JudgeCaseResult['status'] = 'Failed';
      let errorMsg = resp.error;

      if (resp.status === 'error' && resp.error) {
        status = 'Runtime Error';
      } else if (actualTrimmed === expectedTrimmed) {
        status = 'Passed';
        passedCount++;
      } else {
        status = 'Failed';
      }

      caseResults.push({
        case_index: i + 1,
        is_sample: tc.is_sample,
        input_data: tc.input_data,
        expected_output: tc.expected_output,
        actual_output: resp.output,
        status,
        execution_time_ms: resp.execution_time_ms,
        error_message: errorMsg,
      });
    }

    const totalCount = testCases.length;
    const verdict: JudgeSubmitResult['verdict'] = 
      totalCount === 0 ? 'Accepted' :
      passedCount === totalCount ? 'Accepted' :
      caseResults.some(r => r.status === 'Runtime Error') ? 'Runtime Error' : 'Wrong Answer';

    return {
      program_id: programId,
      passed_count: passedCount,
      total_count: totalCount,
      verdict,
      results: caseResults,
      created_at: new Date().toISOString(),
    };
  };

  const handleSubmit = async () => {
    if (!sourceCode.trim()) return;
    setSubmitting(true);
    setResult(null);

    try {
      const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      let judgeResult: JudgeSubmitResult;

      if (isLocalDev || customBaseUrl) {
        try {
          const res = await api.post<JudgeSubmitResult>(`/api/programs/${programId}/submit`, {
            program_id: programId,
            source_code: sourceCode,
            language,
            classroom_id: classroomId,
          });
          judgeResult = res.data;
        } catch (e) {
          // Fallback to Universal Judge
          judgeResult = await runLocalJudge();
        }
      } else {
        judgeResult = await runLocalJudge();
      }

      setResult(judgeResult);
      if (onSubmissionComplete) {
        onSubmissionComplete(judgeResult);
      }

      // Celebrate 100% pass!
      if (judgeResult.passed_count === judgeResult.total_count && judgeResult.total_count > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Judge submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-dark-700 bg-dark-900 overflow-hidden shadow-lg p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-700">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-accent-emerald" />
            <h3 className="font-semibold text-white text-base">Practice & Check</h3>
          </div>
          <p className="text-xs text-dark-300 mt-0.5">
            {testCases.length} sample check{testCases.length !== 1 ? 's' : ''} available. Test your solution against all checks.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run My Solution Against Checks</span>
            </>
          )}
        </button>
      </div>

      {/* Aggregate Results Banner */}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-dark-850 border border-dark-700 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.verdict === 'Accepted' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>Result:</span>
                  <span className={result.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>
                    {result.verdict}
                  </span>
                </div>
                <div className="text-xs text-dark-300">
                  {result.passed_count} of {result.total_count} checks passed
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-lg font-bold font-mono ${
                result.passed_count === result.total_count ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {result.passed_count}/{result.total_count} Passed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Test Case Item Breakdown */}
      <div className="mt-4 space-y-2.5">
        {result ? (
          result.results.map((c) => {
            const isExpanded = expandedCase === c.case_index;
            return (
              <div
                key={c.case_index}
                className="rounded-xl border border-dark-700/80 bg-dark-850/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedCase(isExpanded ? null : c.case_index)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-dark-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {c.status === 'Passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : c.status === 'Time Limit Exceeded' ? (
                      <Clock className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Check {c.case_index}: {c.status} {c.status === 'Passed' && '✓'}
                      </div>
                      <div className="text-[11px] text-dark-400 font-mono">
                        Time: {c.execution_time_ms} ms {c.is_sample ? '• Sample' : '• Hidden'}
                      </div>
                    </div>
                  </div>

                  <div className="text-dark-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-dark-700/60 bg-dark-900/80 space-y-3 text-xs font-mono animate-fade-in">
                    <div>
                      <span className="text-dark-400 block mb-1">Input:</span>
                      <pre className="p-2.5 rounded-lg bg-dark-950 border border-dark-700 text-dark-200 overflow-x-auto whitespace-pre-wrap">
                        {c.input_data || '(None / standard)'}
                      </pre>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-emerald-400 block mb-1">Expected Output:</span>
                        <pre className="p-2.5 rounded-lg bg-dark-950 border border-dark-700 text-dark-200 overflow-x-auto whitespace-pre-wrap">
                          {c.expected_output}
                        </pre>
                      </div>
                      <div>
                        <span className={c.status === 'Passed' ? 'text-emerald-400' : 'text-rose-400' + ' block mb-1'}>
                          Your Output:
                        </span>
                        <pre className="p-2.5 rounded-lg bg-dark-950 border border-dark-700 text-dark-200 overflow-x-auto whitespace-pre-wrap">
                          {c.actual_output || '(Empty output)'}
                        </pre>
                      </div>
                    </div>
                    {c.error_message && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        {c.error_message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          testCases.map((tc, idx) => (
            <div
              key={tc.id || idx}
              className="p-3 rounded-xl border border-dark-700/70 bg-dark-850/50 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-dark-500"></span>
                <span className="text-dark-200 font-medium font-mono">
                  Check {idx + 1} {tc.is_sample ? '(Sample)' : '(Hidden)'}
                </span>
              </div>
              <div className="text-dark-400 font-mono">
                Click above to test
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
