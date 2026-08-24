import { OfflineModelState } from '../types';

const STORAGE_KEY = 'codevault_offline_ai_state';
const DB_NAME = 'codevault_ai_db';
const STORE_NAME = 'models_meta';

export const DEFAULT_OFFLINE_MODEL: OfflineModelState = {
  modelId: 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC',
  modelName: 'CodeVault Qwen Coder 0.5B',
  quantization: 'q4f16_1 (4-bit quantized)',
  sizeMB: 360,
  status: 'not_downloaded',
  progress: 0,
  version: '2.1.0',
};

export class OfflineStorage {
  private static openDB(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        return resolve(null);
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'modelId' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  public static async loadModelState(): Promise<OfflineModelState> {
    try {
      const db = await this.openDB();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(DEFAULT_OFFLINE_MODEL.modelId);
          req.onsuccess = () => {
            if (req.result) {
              resolve(req.result);
            } else {
              resolve(this.loadFromLocalStorage());
            }
          };
          req.onerror = () => resolve(this.loadFromLocalStorage());
        });
      }
    } catch {
      // Fallback
    }
    return this.loadFromLocalStorage();
  }

  private static loadFromLocalStorage(): OfflineModelState {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item);
      }
    } catch {
      // Ignore
    }
    return { ...DEFAULT_OFFLINE_MODEL };
  }

  public static async saveModelState(state: OfflineModelState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(state);
      }
    } catch (e) {
      console.warn('Failed to save offline model state:', e);
    }
  }

  public static async purgeModelCache(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (window.caches) {
        const keys = await caches.keys();
        for (const k of keys) {
          if (k.includes('webllm') || k.includes('mlc') || k.includes('model')) {
            await caches.delete(k);
          }
        }
      }
      const db = await this.openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(DEFAULT_OFFLINE_MODEL.modelId);
      }
    } catch (e) {
      console.error('Error purging model cache:', e);
    }
  }
}
