import { OfflineModelState, WorkerRequest, WorkerResponse } from '../types';
import { OfflineStorage, DEFAULT_OFFLINE_MODEL } from './OfflineStorage';
import { CapabilityDetector } from './CapabilityDetector';

export class OfflineModelManager {
  private static instance: OfflineModelManager;
  private worker: Worker | null = null;
  private state: OfflineModelState = { ...DEFAULT_OFFLINE_MODEL };
  private listeners: Set<(state: OfflineModelState) => void> = new Set();
  private pendingRequests: Map<string, { resolve: (val: any) => void; reject: (err: any) => void; onToken?: (t: string) => void }> = new Map();

  private constructor() {
    this.init();
  }

  public static getInstance(): OfflineModelManager {
    if (!OfflineModelManager.instance) {
      OfflineModelManager.instance = new OfflineModelManager();
    }
    return OfflineModelManager.instance;
  }

  private async init() {
    this.state = await OfflineStorage.loadModelState();
    this.notify();
  }

  public getState(): OfflineModelState {
    return this.state;
  }

  public isReady(): boolean {
    return this.state.status === 'ready';
  }

  public subscribe(listener: (state: OfflineModelState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
    OfflineStorage.saveModelState(this.state);
  }

  private getWorker(): Worker {
    if (!this.worker) {
      // Use Vite worker import
      this.worker = new Worker(new URL('./offlineWorker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = (e) => {
        console.error('[Offline AI Worker Error]', e);
      };
    }
    return this.worker;
  }

  private handleWorkerMessage(event: MessageEvent<WorkerResponse>) {
    const data = event.data;

    switch (data.type) {
      case 'INIT_PROGRESS': {
        this.state.status = 'downloading';
        this.state.progress = data.progress ?? this.state.progress;
        this.state.progressText = data.progressText || 'Preparing model weights...';
        this.notify();
        break;
      }

      case 'READY': {
        this.state.status = 'ready';
        this.state.progress = 100;
        this.state.progressText = 'CodeVault Offline AI is ready for use.';
        this.state.downloadedAt = Date.now();
        this.notify();
        break;
      }

      case 'TOKEN': {
        if (data.requestId && this.pendingRequests.has(data.requestId)) {
          const req = this.pendingRequests.get(data.requestId)!;
          if (req.onToken && data.token) {
            req.onToken(data.token);
          }
        }
        break;
      }

      case 'COMPLETE': {
        if (data.requestId && this.pendingRequests.has(data.requestId)) {
          const req = this.pendingRequests.get(data.requestId)!;
          this.pendingRequests.delete(data.requestId);
          req.resolve(data.fullText || '');
        }
        break;
      }

      case 'ERROR': {
        if (data.requestId && this.pendingRequests.has(data.requestId)) {
          const req = this.pendingRequests.get(data.requestId)!;
          this.pendingRequests.delete(data.requestId);
          req.reject(new Error(data.error || 'Offline generation error'));
        }
        break;
      }
    }
  }

  public async downloadModel(): Promise<void> {
    const caps = await CapabilityDetector.detect();
    if (!caps.supported) {
      throw new Error(caps.reason || 'Hardware acceleration is not supported on this browser.');
    }

    await CapabilityDetector.requestPersistence();

    this.state.status = 'downloading';
    this.state.progress = 0;
    this.state.progressText = 'Starting download of CodeVault Offline AI package (~360 MB)...';
    this.notify();

    const worker = this.getWorker();
    worker.postMessage({
      type: 'INIT',
      modelId: this.state.modelId,
    } as WorkerRequest);
  }

  public async removeModel(): Promise<void> {
    if (this.worker) {
      this.worker.postMessage({ type: 'UNLOAD' } as WorkerRequest);
      this.worker.terminate();
      this.worker = null;
    }
    await OfflineStorage.purgeModelCache();
    this.state = {
      ...DEFAULT_OFFLINE_MODEL,
      status: 'not_downloaded',
      progress: 0,
      progressText: undefined,
      downloadedAt: undefined,
    };
    this.notify();
  }

  public async testOfflineAI(): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker();
      const requestId = 'test_' + Date.now();

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
      });

      worker.postMessage({
        type: 'GENERATE',
        requestId,
        messages: [
          { role: 'system', content: 'You are CodeVault Offline AI.' },
          { role: 'user', content: 'Reply exactly with: OFFLINE_AI_OK' }
        ],
        maxTokens: 50,
      } as WorkerRequest);
    });
  }

  public generate(
    messages: { role: string; content: string }[],
    options?: { onToken?: (token: string) => void; signal?: AbortSignal }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker();
      const requestId = 'req_' + Math.random().toString(36).substring(2, 9);

      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          this.cancel(requestId);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        onToken: options?.onToken,
      });

      worker.postMessage({
        type: 'GENERATE',
        requestId,
        messages,
        maxTokens: 1024,
      } as WorkerRequest);
    });
  }

  public cancel(requestId?: string): void {
    if (this.worker) {
      this.worker.postMessage({
        type: 'CANCEL',
        requestId,
      } as WorkerRequest);
    }
  }
}
