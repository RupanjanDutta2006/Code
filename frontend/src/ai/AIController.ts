import {
  CodeVaultAIProvider,
  AIRequest,
  AIProviderId,
  AIProviderMode,
  GenerationOptions,
} from './types';
import { OnlineAIProvider } from './providers/OnlineAIProvider';
import { AIAvailabilityManager } from './network/AIAvailabilityManager';

export class AIController {
  private static instance: AIController;
  private onlineProvider: OnlineAIProvider;
  private availabilityManager: AIAvailabilityManager;

  private isGenerating = false;
  private activeProvider: CodeVaultAIProvider | null = null;
  private currentAbortController: AbortController | null = null;

  private constructor() {
    this.onlineProvider = new OnlineAIProvider();
    this.availabilityManager = AIAvailabilityManager.getInstance();
  }

  public static getInstance(): AIController {
    if (!AIController.instance) {
      AIController.instance = new AIController();
    }
    return AIController.instance;
  }

  public setMode(_mode: AIProviderMode) {
    // Always online — mode setting is a no-op
  }

  public getMode(): AIProviderMode {
    return 'online';
  }

  public getIsGenerating(): boolean {
    return this.isGenerating;
  }

  public getActiveProviderId(): AIProviderId {
    return 'online';
  }

  public async resolveProvider(): Promise<{ provider: CodeVaultAIProvider }> {
    const available = await this.onlineProvider.isAvailable();
    if (!available) {
      throw new Error('CodeVault AI is temporarily unavailable. Please check your internet connection and try again.');
    }
    return { provider: this.onlineProvider };
  }

  /** Unified generation pipeline with double-submit protection */
  public async *sendMessage(
    request: AIRequest,
    options?: GenerationOptions
  ): AsyncIterable<{ token: string; provider: AIProviderId }> {
    if (this.isGenerating) {
      console.warn('[AIController] Generation already in progress. Ignoring duplicate trigger.');
      return;
    }

    this.isGenerating = true;
    this.currentAbortController = new AbortController();
    const signal = options?.signal || this.currentAbortController.signal;

    try {
      const { provider } = await this.resolveProvider();
      this.activeProvider = provider;

      for await (const token of provider.generate(request, { ...options, signal })) {
        if (signal.aborted) break;
        yield { token, provider: 'online' };
      }
    } finally {
      this.isGenerating = false;
      this.activeProvider = null;
      this.currentAbortController = null;
    }
  }

  public stopGeneration(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    if (this.activeProvider) {
      this.activeProvider.cancel();
      this.activeProvider = null;
    }
    this.onlineProvider.cancel();
    this.isGenerating = false;
  }
}