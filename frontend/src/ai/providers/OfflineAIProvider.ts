import { CodeVaultAIProvider, AIRequest, GenerationOptions } from '../types';
import { AIContextBuilder } from '../context/AIContextBuilder';
import { OfflineModelManager } from '../offline/OfflineModelManager';

export class OfflineAIProvider implements CodeVaultAIProvider {
  public readonly id = 'offline';
  public readonly name = 'CodeVault Offline AI';
  private manager: OfflineModelManager;
  private currentAbortController: AbortController | null = null;

  constructor() {
    this.manager = OfflineModelManager.getInstance();
  }

  public async isAvailable(): Promise<boolean> {
    return this.manager.isReady();
  }

  public async *generate(
    request: AIRequest,
    options?: GenerationOptions
  ): AsyncIterable<string> {
    this.currentAbortController = new AbortController();
    const signal = options?.signal || this.currentAbortController.signal;

    const messages = AIContextBuilder.buildMessages(request, 'offline');

    // Create a queue for streaming tokens
    const tokenQueue: string[] = [];
    let isComplete = false;
    let error: Error | null = null;
    let notifyNext: (() => void) | null = null;

    const onToken = (token: string) => {
      tokenQueue.push(token);
      if (options?.onToken) {
        options.onToken(token);
      }
      if (notifyNext) {
        notifyNext();
        notifyNext = null;
      }
    };

    this.manager.generate(messages, { onToken, signal })
      .then(() => {
        isComplete = true;
        if (notifyNext) {
          notifyNext();
          notifyNext = null;
        }
      })
      .catch((err) => {
        error = err;
        isComplete = true;
        if (notifyNext) {
          notifyNext();
          notifyNext = null;
        }
      });

    while (!isComplete || tokenQueue.length > 0) {
      if (signal.aborted) {
        break;
      }

      if (tokenQueue.length > 0) {
        const chunk = tokenQueue.shift()!;
        yield chunk;
      } else if (!isComplete) {
        await new Promise<void>((resolve) => {
          notifyNext = resolve;
        });
      }
    }

    if (error && !signal.aborted) {
      throw error;
    }
  }

  public cancel(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    this.manager.cancel();
  }
}
