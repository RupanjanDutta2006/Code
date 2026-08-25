import {
  CodeVaultAIProvider,
  AIRequest,
  AIProviderId,
  AIProviderMode,
  GenerationOptions,
} from './types';
import { NemotronProvider } from './providers/NemotronProvider';
import { OfflineAIProvider } from './providers/OfflineAIProvider';
import { AIAvailabilityManager } from './network/AIAvailabilityManager';
import { OfflineModelManager } from './offline/OfflineModelManager';

export class AIController {
  private static instance: AIController;
  private nemotronProvider: NemotronProvider;
  private offlineProvider: OfflineAIProvider;
  private availabilityManager: AIAvailabilityManager;
  private offlineManager: OfflineModelManager;

  private mode: AIProviderMode = 'auto';
  private isGenerating = false;
  private activeProvider: CodeVaultAIProvider | null = null;
  private currentAbortController: AbortController | null = null;

  private constructor() {
    this.nemotronProvider = new NemotronProvider();
    this.offlineProvider = new OfflineAIProvider();
    this.availabilityManager = AIAvailabilityManager.getInstance();
    this.offlineManager = OfflineModelManager.getInstance();
  }

  public static getInstance(): AIController {
    if (!AIController.instance) {
      AIController.instance = new AIController();
    }
    return AIController.instance;
  }

  public setMode(mode: AIProviderMode) {
    this.mode = mode;
  }

  public getMode(): AIProviderMode {
    return this.mode;
  }

  public getIsGenerating(): boolean {
    return this.isGenerating;
  }

  public getActiveProviderId(): AIProviderId {
    if (this.mode === 'online') return 'nemotron';
    if (this.mode === 'offline') return 'offline';
    return this.availabilityManager.isOnlineHealthy() ? 'nemotron' : 'offline';
  }

  public async resolveProvider(): Promise<{ provider: CodeVaultAIProvider; notice?: string }> {
    if (this.mode === 'online') {
      const available = await this.nemotronProvider.isAvailable();
      if (!available) {
        throw new Error('Online AI (NVIDIA Nemotron) is currently unreachable. Check your internet connection or switch to Auto / Offline Mode.');
      }
      return { provider: this.nemotronProvider };
    }

    if (this.mode === 'offline') {
      const available = await this.offlineProvider.isAvailable();
      if (!available) {
        throw new Error('Offline AI is not downloaded yet. Please download the offline AI package in AI settings.');
      }
      return { provider: this.offlineProvider };
    }

    // AUTO Mode resolution
    const isOnline = await this.nemotronProvider.isAvailable();
    if (isOnline) {
      return { provider: this.nemotronProvider };
    }

    // If online is not available, check offline
    const isOfflineReady = await this.offlineProvider.isAvailable();
    if (isOfflineReady) {
      return {
        provider: this.offlineProvider,
        notice: 'Online AI is unavailable. Switched to CodeVault Offline AI.',
      };
    }

    throw new Error('You are currently offline. To use AI without internet, download CodeVault Offline AI from the AI settings panel.');
  }

  /**
   * Unified generation pipeline with double-submit protection & auto-failover
   */
  public async *sendMessage(
    request: AIRequest,
    options?: GenerationOptions
  ): AsyncIterable<{ token: string; provider: AIProviderId; notice?: string }> {
    if (this.isGenerating) {
      console.warn('[AIController] Generation already in progress. Ignoring duplicate trigger.');
      return;
    }

    this.isGenerating = true;
    this.currentAbortController = new AbortController();
    const signal = options?.signal || this.currentAbortController.signal;

    try {
      let { provider, notice } = await this.resolveProvider();
      this.activeProvider = provider;

      if (notice && options?.onStatus) {
        options.onStatus(notice);
      }

      let receivedFirstToken = false;

      try {
        for await (const token of provider.generate(request, { ...options, signal })) {
          if (signal.aborted) break;
          receivedFirstToken = true;
          yield { token, provider: provider.id, notice };
        }
      } catch (err: any) {
        // Safe failover: if primary failed BEFORE producing tokens and we are in AUTO mode
        if (!receivedFirstToken && provider.id === 'nemotron' && this.mode === 'auto' && this.offlineManager.isReady() && !signal.aborted) {
          console.warn('[AIController] Online generation failed before start. Failing over to Offline AI...');
          const failoverNotice = 'Online AI became unavailable. Switched to Offline Mode.';
          if (options?.onStatus) {
            options.onStatus(failoverNotice);
          }
          this.activeProvider = this.offlineProvider;

          for await (const token of this.offlineProvider.generate(request, { ...options, signal })) {
            if (signal.aborted) break;
            yield { token, provider: 'offline', notice: failoverNotice };
          }
        } else {
          throw err;
        }
      }
    } finally {
      this.isGenerating = false;
      this.activeProvider = null;
      this.currentAbortController = null;
    }
  }

  /**
   * Unified Stop Generation halts both online network streams & offline Web Worker inference
   */
  public stopGeneration(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    if (this.activeProvider) {
      this.activeProvider.cancel();
      this.activeProvider = null;
    }
    this.nemotronProvider.cancel();
    this.offlineProvider.cancel();
    this.isGenerating = false;
  }
}
