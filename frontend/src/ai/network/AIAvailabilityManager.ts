import { AIHealthStatus } from '../types';

type HealthListener = (status: AIHealthStatus) => void;

export class AIAvailabilityManager {
  private static instance: AIAvailabilityManager;
  private status: AIHealthStatus = navigator.onLine ? 'ONLINE_CHECKING' : 'OFFLINE';
  private listeners: Set<HealthListener> = new Set();
  private checkInterval: any = null;
  private isChecking = false;

  private constructor() {
    this.setupListeners();
    this.checkHealth();
    // Poll health periodically when window is active
    this.checkInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        this.checkHealth();
      }
    }, 45000);
  }

  public static getInstance(): AIAvailabilityManager {
    if (!AIAvailabilityManager.instance) {
      AIAvailabilityManager.instance = new AIAvailabilityManager();
    }
    return AIAvailabilityManager.instance;
  }

  private setupListeners() {
    window.addEventListener('online', () => {
      this.setStatus('ONLINE_CHECKING');
      this.checkHealth();
    });

    window.addEventListener('offline', () => {
      this.setStatus('OFFLINE');
    });
  }

  public getStatus(): AIHealthStatus {
    return this.status;
  }

  public isOnlineHealthy(): boolean {
    return this.status === 'ONLINE_HEALTHY';
  }

  public async checkHealth(): Promise<boolean> {
    if (!navigator.onLine) {
      this.setStatus('OFFLINE');
      return false;
    }

    if (this.isChecking) return this.status === 'ONLINE_HEALTHY';
    this.isChecking = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch('/api/ai/health', {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (resp && resp.ok) {
        this.setStatus('ONLINE_HEALTHY');
        this.isChecking = false;
        return true;
      } else {
        this.setStatus('PROVIDER_UNAVAILABLE');
        this.isChecking = false;
        return false;
      }
    } catch {
      this.setStatus('PROVIDER_UNAVAILABLE');
      this.isChecking = false;
      return false;
    }
  }

  public subscribe(listener: HealthListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  private setStatus(newStatus: AIHealthStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.listeners.forEach((l) => l(newStatus));
    }
  }
}
