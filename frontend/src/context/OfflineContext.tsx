import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ExecuteResult } from '../services/api';

export interface QueuedRun {
  id: string;
  language: string;
  sourceCode: string;
  customInput: string;
  programId?: number;
  timestamp: number;
}

interface OfflineContextType {
  isOnline: boolean;
  queuedRuns: QueuedRun[];
  queueRun: (run: Omit<QueuedRun, 'id' | 'timestamp'>) => void;
  runQueuedRuns: () => Promise<void>;
  clearQueue: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queuedRuns, setQueuedRuns] = useState<QueuedRun[]>(() => {
    const saved = localStorage.getItem('codevault_queued_runs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      runQueuedRuns();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedRuns]);

  useEffect(() => {
    localStorage.setItem('codevault_queued_runs', JSON.stringify(queuedRuns));
  }, [queuedRuns]);

  const queueRun = (run: Omit<QueuedRun, 'id' | 'timestamp'>) => {
    const newEntry: QueuedRun = {
      ...run,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setQueuedRuns((prev) => [...prev, newEntry]);
  };

  const runQueuedRuns = async () => {
    if (queuedRuns.length === 0 || !navigator.onLine) return;
    const toProcess = [...queuedRuns];
    setQueuedRuns([]);

    for (const item of toProcess) {
      try {
        await api.post<ExecuteResult>('/api/programs/execute', {
          language: item.language,
          source_code: item.sourceCode,
          custom_input: item.customInput,
          program_id: item.programId,
        });
      } catch (err) {
        console.error('Failed to execute queued run:', err);
      }
    }
  };

  const clearQueue = () => setQueuedRuns([]);

  return (
    <OfflineContext.Provider value={{ isOnline, queuedRuns, queueRun, runQueuedRuns, clearQueue }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
