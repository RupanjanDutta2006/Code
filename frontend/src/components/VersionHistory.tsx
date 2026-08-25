import React, { useState, useEffect } from 'react';
import { History, GitCommit, ArrowLeftRight, X, Clock } from 'lucide-react';
import { api, ProgramVersion, DiffResponse } from '../services/api';
import { DiffViewer } from './DiffViewer';

interface VersionHistoryProps {
  programId: number;
  language: string;
  onClose: () => void;
  onRestoreVersion?: (code: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  programId,
  language,
  onClose,
  onRestoreVersion,
}) => {
  const [versions, setVersions] = useState<ProgramVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedV1, setSelectedV1] = useState<number | null>(null);
  const [selectedV2, setSelectedV2] = useState<number | null>(null);
  const [diffData, setDiffData] = useState<DiffResponse | null>(null);
  const [diffLoading, setDiffLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await api.get<ProgramVersion[]>(`/api/programs/${programId}/versions`);
        setVersions(res.data);
        if (res.data.length >= 2) {
          setSelectedV1(res.data[0].id);
          setSelectedV2(res.data[1].id);
        } else if (res.data.length === 1) {
          setSelectedV1(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load versions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [programId]);

  useEffect(() => {
    if (selectedV1 && selectedV2 && selectedV1 !== selectedV2) {
      const fetchDiff = async () => {
        setDiffLoading(true);
        try {
          const res = await api.get<DiffResponse>(
            `/api/programs/${programId}/versions/${selectedV1}/diff?compare_to=${selectedV2}`
          );
          setDiffData(res.data);
        } catch (err) {
          console.error('Failed to fetch diff:', err);
        } finally {
          setDiffLoading(false);
        }
      };
      fetchDiff();
    } else {
      setDiffData(null);
    }
  }, [programId, selectedV1, selectedV2]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-900 border border-light-border dark:border-dark-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up transition-colors duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-light-secondary dark:bg-dark-850 border-b border-light-border dark:border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-light-blueSoft dark:bg-brand-500/20 text-light-blue dark:text-brand-400 flex items-center justify-center border border-light-blueBorder/40 dark:border-transparent">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-light-textStrong dark:text-white">Past Versions</h2>
              <p className="text-xs text-light-textSecondary dark:text-dark-300">
                Track all revisions and inspect what changed between any two versions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white hover:bg-light-secondary dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Version Selector Chips */}
          <div>
            <label className="text-xs font-bold text-light-textSecondary dark:text-dark-300 uppercase tracking-wider block mb-3 font-mono">
              Select Versions to Compare
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {versions.map((v, idx) => {
                const isV1 = selectedV1 === v.id;
                const isV2 = selectedV2 === v.id;
                return (
                  <div
                    key={v.id}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-card-light ${
                      isV1 || isV2
                        ? 'border-light-blue bg-light-blueSoft dark:border-brand-500 dark:bg-brand-500/10 shadow-sm'
                        : 'border-light-border bg-white hover:bg-light-secondary dark:border-dark-700 dark:bg-dark-850 dark:hover:bg-dark-800'
                    }`}
                    onClick={() => {
                      if (!selectedV1) setSelectedV1(v.id);
                      else if (!selectedV2 && selectedV1 !== v.id) setSelectedV2(v.id);
                      else if (selectedV1 === v.id) setSelectedV1(selectedV2);
                      else setSelectedV2(v.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-light-textStrong dark:text-white">
                        v{v.version_number} {idx === 0 && <span className="text-xs text-light-blue dark:text-brand-400 font-sans font-normal">(Current)</span>}
                      </span>
                      <div className="flex gap-1">
                        {isV1 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-transparent font-mono">From</span>}
                        {isV2 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-transparent font-mono">To</span>}
                      </div>
                    </div>
                    <div className="text-xs text-light-textSecondary dark:text-dark-300 mt-1 truncate">
                      {v.commit_message || 'Revision'}
                    </div>
                    <div className="text-[10px] text-light-textMuted dark:text-dark-400 mt-1.5 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(v.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diff Representation */}
          {diffData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-light-textStrong dark:text-white">
                  <ArrowLeftRight className="w-4 h-4 text-light-blue dark:text-brand-400" />
                  <span>Comparing Version {diffData.from_version} to Version {diffData.to_version}</span>
                </div>
                {onRestoreVersion && (
                  <button
                    onClick={() => {
                      onRestoreVersion(diffData.old_code);
                      onClose();
                    }}
                    className="px-3 py-1 rounded-xl bg-light-secondary hover:bg-white text-light-textNormal hover:text-light-textStrong border border-light-border dark:bg-dark-800 dark:hover:bg-dark-750 dark:text-dark-200 text-xs font-semibold transition-colors shadow-card-light"
                  >
                    Restore v{diffData.from_version} Code
                  </button>
                )}
              </div>

              <DiffViewer
                originalCode={diffData.old_code}
                modifiedCode={diffData.new_code}
                language={language}
                originalTitle={`Version ${diffData.from_version}`}
                modifiedTitle={`Version ${diffData.to_version}`}
                height="350px"
              />
            </div>
          ) : versions.length < 2 ? (
            <div className="p-8 text-center text-light-textSecondary dark:text-dark-400 bg-light-secondary dark:bg-dark-850 rounded-2xl border border-light-border dark:border-dark-700">
              Only one version exists for this program so far. Every time you save an edit or import a newer file, a new revision will appear here automatically!
            </div>
          ) : (
            <div className="p-8 text-center text-light-textSecondary dark:text-dark-400 bg-light-secondary dark:bg-dark-850 rounded-2xl border border-light-border dark:border-dark-700">
              Select any two version cards above to compare what changed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
