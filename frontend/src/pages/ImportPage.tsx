import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  UploadCloud, 
  FileCode, 
  Folder, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api, ImportResult } from '../services/api';

interface FilePreview {
  path: string;
  name: string;
  size: number;
  content: string;
  language: string | null;
  status: 'valid' | 'ignored';
}

const EXT_TO_LANG: Record<string, string> = {
  '.py': 'python',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.c': 'c',
  '.java': 'java',
  '.js': 'javascript',
  '.ts': 'typescript',
  '.go': 'go',
  '.rs': 'rust',
  '.kt': 'kotlin',
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.sql': 'sql',
};

const IGNORE_PATTERNS = ['.git', 'node_modules', '__pycache__', 'target', '.pytest_cache', 'dist', 'bin', '.vscode'];

export const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FilePreview[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const processFiles = async (fileList: FileList) => {
    const previews: FilePreview[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const relPath = f.webkitRelativePath || f.name;
      
      // Check ignore
      const isIgnored = IGNORE_PATTERNS.some((pattern) => relPath.includes(pattern));
      const ext = '.' + relPath.split('.').pop()?.toLowerCase();
      const lang = EXT_TO_LANG[ext] || null;

      if (isIgnored || !lang) {
        previews.push({
          path: relPath,
          name: f.name,
          size: f.size,
          content: '',
          language: lang,
          status: 'ignored',
        });
        continue;
      }

      try {
        const text = await f.text();
        previews.push({
          path: relPath,
          name: f.name,
          size: f.size,
          content: text,
          language: lang,
          status: 'valid',
        });
      } catch (err) {
        console.error('Failed reading file:', f.name, err);
      }
    }

    setFiles(previews);
    setImportResult(null);
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleStartImport = async () => {
    const validFiles = files.filter((f) => f.status === 'valid' && f.content);
    if (validFiles.length === 0) return;

    setImporting(true);
    try {
      const payload = validFiles.map((f) => ({
        path: f.path,
        content: f.content,
      }));

      const res = await api.post<ImportResult>('/api/import/files', payload);
      setImportResult(res.data);
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setImporting(false);
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setImporting(true);
    try {
      const res = await api.post<ImportResult>('/api/import/zip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(res.data);
    } catch (err) {
      console.error('Zip import failed:', err);
    } finally {
      setImporting(false);
    }
  };

  const validCount = files.filter((f) => f.status === 'valid').length;
  const ignoredCount = files.filter((f) => f.status === 'ignored').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <FolderPlus className="w-7 h-7 text-accent-cyan" />
          Import Folder into My Code
        </h1>
        <p className="text-sm text-dark-300 mt-1">
          Select a local code folder or drag-and-drop a zip file. CodeVault automatically scans files, detects languages, categorizes topics, and preserves subfolders.
        </p>
      </div>

      {/* Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Local Folder Selector */}
        <div
          onClick={() => folderInputRef.current?.click()}
          className="p-8 rounded-2xl border-2 border-dashed border-dark-700 hover:border-brand-500/80 bg-dark-900/60 hover:bg-dark-900 transition-all text-center flex flex-col items-center justify-center cursor-pointer group space-y-3"
        >
          <input
            ref={folderInputRef}
            type="file"
            multiple
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            className="hidden"
            onChange={handleFolderSelect}
          />
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform flex items-center justify-center border border-brand-500/20">
            <Folder className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Select Folder from Computer</h3>
            <p className="text-xs text-dark-400 mt-1">
              Select any project folder (e.g. <code>DSA/</code>, <code>College_Work/</code>)
            </p>
          </div>
        </div>

        {/* Zip File Uploader */}
        <div
          onClick={() => zipInputRef.current?.click()}
          className="p-8 rounded-2xl border-2 border-dashed border-dark-700 hover:border-accent-cyan/80 bg-dark-900/60 hover:bg-dark-900 transition-all text-center flex flex-col items-center justify-center cursor-pointer group space-y-3"
        >
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleZipUpload}
          />
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-accent-cyan group-hover:scale-110 transition-transform flex items-center justify-center border border-cyan-500/20">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Upload .ZIP Archive</h3>
            <p className="text-xs text-dark-400 mt-1">
              Upload a zipped folder of source code files
            </p>
          </div>
        </div>
      </div>

      {/* Ignore Rules Banner */}
      <div className="p-4 rounded-xl bg-dark-900 border border-dark-700/80 flex items-start gap-3 text-xs text-dark-300">
        <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Smart Filtering Active:</span> Non-source binaries, <code>.git/</code>, <code>node_modules/</code>, <code>__pycache__/</code>, and <code>target/</code> directories are automatically skipped. If you import an existing file with updated content, CodeVault automatically creates a new version revision.
        </div>
      </div>

      {/* Import Result Banner */}
      {importResult && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-slide-up">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>Folder Import Successful!</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-dark-950/80 rounded-xl border border-dark-700 text-center">
              <span className="text-dark-400 block">Programs Added</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {importResult.imported_count}
              </span>
            </div>
            <div className="p-3 bg-dark-950/80 rounded-xl border border-dark-700 text-center">
              <span className="text-dark-400 block">Folders Created</span>
              <span className="text-lg font-bold font-mono text-white">
                {importResult.folders_created}
              </span>
            </div>
            <div className="p-3 bg-dark-950/80 rounded-xl border border-dark-700 text-center">
              <span className="text-dark-400 block">Deduplicated/Skipped</span>
              <span className="text-lg font-bold font-mono text-dark-300">
                {importResult.skipped_count}
              </span>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => navigate('/my-programs')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>View My Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Scanned Files Preview List */}
      {files.length > 0 && !importResult && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Scanned Files ({files.length})</h3>
              <p className="text-xs text-dark-400">
                {validCount} ready to import, {ignoredCount} filtered out.
              </p>
            </div>

            <button
              onClick={handleStartImport}
              disabled={importing || validCount === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import {validCount} Programs</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-dark-700 bg-dark-900 overflow-hidden divide-y divide-dark-750 max-h-[400px] overflow-y-auto">
            {files.map((file, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 truncate max-w-md">
                  <FileCode className={`w-4 h-4 ${file.status === 'valid' ? 'text-brand-400' : 'text-dark-500'}`} />
                  <span className={`truncate ${file.status === 'valid' ? 'text-white font-medium' : 'text-dark-400 line-through'}`}>
                    {file.path}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {file.language ? (
                    <span className="px-2 py-0.5 rounded bg-dark-800 text-dark-200 uppercase font-semibold text-[10px]">
                      {file.language}
                    </span>
                  ) : (
                    <span className="text-[10px] text-dark-500">Unsupported</span>
                  )}

                  <span className={file.status === 'valid' ? 'text-emerald-400 text-[11px]' : 'text-dark-500 text-[11px]'}>
                    {file.status === 'valid' ? 'Ready' : 'Ignored'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
