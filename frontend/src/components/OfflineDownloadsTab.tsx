import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Trash2,
  BookOpen,
  Code2,
  FileText,
  Clipboard,
  Loader2,
  HardDriveDownload,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import {
  StudyMaterial,
  getMaterialsByUser,
  deleteMaterial,
  getTotalStorageBytes,
  formatBytes,
} from '../services/studyMaterialsStorage';
import { useAuth } from '../context/AuthContext';

const TYPE_ICONS: Record<StudyMaterial['resourceType'], React.ReactNode> = {
  lesson: <BookOpen className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  pdf: <Clipboard className="w-4 h-4" />,
  'code-snippet': <Code2 className="w-4 h-4" />,
  assignment: <FileText className="w-4 h-4" />,
};

const TYPE_COLORS: Record<StudyMaterial['resourceType'], string> = {
  lesson: 'text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
  note: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
  pdf: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/25',
  'code-snippet': 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  assignment: 'text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/25',
};

export const OfflineDownloadsTab: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBytes, setTotalBytes] = useState(0);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMaterials = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const list = await getMaterialsByUser(user.uid);
      list.sort((a, b) => b.downloadedAt - a.downloadedAt);
      setMaterials(list);
      const bytes = await getTotalStorageBytes(user.uid);
      setTotalBytes(bytes);
    } catch (err) {
      console.error('[OfflineDownloads] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadMaterials(); }, [loadMaterials]);

  const handleDelete = async (resourceId: string) => {
    setDeletingId(resourceId);
    try {
      await deleteMaterial(resourceId);
      setMaterials((prev) => prev.filter((m) => m.resourceId !== resourceId));
      if (viewingId === resourceId) setViewingId(null);
      const updated = await getTotalStorageBytes(user!.uid);
      setTotalBytes(updated);
    } catch (err) {
      console.error('[OfflineDownloads] Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const viewingMaterial = viewingId ? materials.find((m) => m.resourceId === viewingId) : null;

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-light-blue dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-light-textStrong dark:text-white flex items-center gap-2">
            <HardDriveDownload className="w-4 h-4 text-light-blue dark:text-blue-400" />
            Offline Downloads
          </h3>
          <p className="text-xs text-light-textSecondary dark:text-dark-400 mt-0.5">
            {materials.length} item{materials.length !== 1 ? 's' : ''} · {formatBytes(totalBytes)} used
          </p>
        </div>
        <button
          onClick={loadMaterials}
          className="p-1.5 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-800 text-light-textMuted dark:text-dark-400 hover:text-light-textStrong dark:hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-light-secondary dark:bg-dark-800 flex items-center justify-center">
            <WifiOff className="w-7 h-7 text-light-textMuted dark:text-dark-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-light-textStrong dark:text-white">No offline materials yet</p>
            <p className="text-xs text-light-textSecondary dark:text-dark-400 mt-1 max-w-[260px]">
              Tap "Download Offline" on any lesson, note, or code snippet to save it for offline reading.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Material list */}
          <div className="space-y-2">
            {materials.map((m) => (
              <div
                key={m.resourceId}
                className="rounded-xl border border-light-border dark:border-dark-700 bg-white dark:bg-dark-900 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Type badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${TYPE_COLORS[m.resourceType]}`}>
                    {TYPE_ICONS[m.resourceType]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-light-textStrong dark:text-white truncate">{m.title}</p>
                    <p className="text-[10px] text-light-textSecondary dark:text-dark-400 mt-0.5">
                      {m.classroomName && <span className="mr-1.5">{m.classroomName} ·</span>}
                      {formatBytes(m.sizeBytes)} · {new Date(m.downloadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingId(viewingId === m.resourceId ? null : m.resourceId)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-light-secondary dark:bg-dark-800 text-light-textNormal dark:text-dark-300 hover:text-light-blue dark:hover:text-blue-400 border border-light-border dark:border-dark-700 transition-colors"
                    >
                      {viewingId === m.resourceId ? 'Hide' : 'View'}
                    </button>
                    <button
                      onClick={() => handleDelete(m.resourceId)}
                      disabled={deletingId === m.resourceId}
                      className="p-1.5 rounded-lg text-light-textMuted dark:text-dark-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove offline copy"
                    >
                      {deletingId === m.resourceId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline viewer */}
                {viewingId === m.resourceId && (
                  <div className="border-t border-light-border dark:border-dark-700 bg-light-bg dark:bg-dark-950 p-3">
                    {m.resourceType === 'code-snippet' ? (
                      <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed overflow-x-auto">
                        {m.content}
                      </pre>
                    ) : (
                      <div className="text-xs text-light-textStrong dark:text-dark-200 whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};