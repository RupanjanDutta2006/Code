import { CodeVaultAIProvider, AIRequest, GenerationOptions } from '../types';
import { AIContextBuilder } from '../context/AIContextBuilder';
import { AIAvailabilityManager } from '../network/AIAvailabilityManager';

export class OnlineAIProvider implements CodeVaultAIProvider {
  public readonly id = 'online' as const;
  public readonly name = 'CodeVault AI';
  private currentAbortController: AbortController | null = null;

  public async isAvailable(): Promise<boolean> {
    return AIAvailabilityManager.getInstance().isOnlineHealthy();
  }

  public async *generate(
    request: AIRequest,
    options?: GenerationOptions
  ): AsyncIterable<string> {
    this.currentAbortController = new AbortController();
    const signal = options?.signal || this.currentAbortController.signal;

    const messages = AIContextBuilder.buildMessages(request, 'online');

    const payload = {
      messages,
      system_prompt: request.systemPrompt,
      language: request.language,
      source_code: request.activeCode,
      error_message: request.lastError,
    };

    const resp = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => 'Network error');
      throw new Error(`CodeVault AI unavailable (${resp.status}): ${errText}`);
    }

    const data = await resp.json();
    const fullText = data.response || data.content || data.message || '';

    // Stream text in small chunks for smooth token UX
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (signal.aborted) break;
      const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
      if (options?.onToken) options.onToken(chunk);
      yield chunk;
      await new Promise((r) => setTimeout(r, 12));
    }
  }

  public cancel(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }
}