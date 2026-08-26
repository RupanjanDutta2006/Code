import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import {
  StudyMaterial,
  saveMaterial,
  isMaterialDownloaded,
  deleteMaterial,
} from '../services/studyMaterialsStorage';
import { useAuth } from '../context/AuthContext';

interface OfflineDownloadButtonProps {
  resourceId: string;
  resourceType: StudyMaterial['resourceType'];
  title: string;
  content: string;
  language?: string;
  mimeType?: string;
  classroomId?: string;
  classroomName?: string;
  tags?: string[];
  className?: string;
}

export const OfflineDownloadButton: React.FC<OfflineDownloadButtonProps> = ({
  resourceId,
  resourceType,
  title,
  content,
  language,
  mimeType,
  classroomId,
  classroomName,
  tags,
  className = '',
}) => {
  const { user } = useAuth();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    isMaterialDownloaded(resourceId).then((v) => {
      setIsDownloaded(v);
      setIsLoading(false);
    });
  }, [resourceId, user]);

  if (!user || isLoading) return null;

  const handleDownload = async () => {
    setIsSaving(true);
    try {
      await saveMaterial({
        resourceId,
        resourceType,
        title,
        userUid: user.uid,
        classroomId,
        classroomName,
        content,
        language,
        mimeType: mimeType || 'text/plain',
        downloadedAt: Date.now(),
        sizeBytes: new TextEncoder().encode(content).length,
        tags,
      });
      setIsDownloaded(true);
    } catch (err) {
      console.error('[OfflineDownload] Failed to save material:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    try {
      await deleteMaterial(resourceId);
      setIsDownloaded(false);
    } catch (err) {
      console.error('[OfflineDownload] Failed to remove material:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isDownloaded) {
    return (
      <button
        onClick={handleRemove}
        disabled={isSaving}
        title="Remove offline copy"
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 dark:hover:text-red-400 transition-colors ${className}`}
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        <span>Saved Offline</span>
        {!isSaving && <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isSaving}
      title="Download for offline reading"
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-light-secondary dark:bg-slate-800/50 border border-light-border dark:border-slate-700/50 text-light-textNormal dark:text-slate-400 hover:text-light-blue dark:hover:text-blue-400 hover:border-light-blue/40 dark:hover:border-blue-500/40 transition-colors ${className}`}
    >
      {isSaving ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>{isSaving ? 'Saving...' : 'Download Offline'}</span>
    </button>
  );
};