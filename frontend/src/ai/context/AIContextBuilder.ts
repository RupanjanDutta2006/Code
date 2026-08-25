import { AIRequest, AIProviderId, ChatMessage } from '../types';

/**
 * Filter out sensitive content (API keys, .env secrets, private tokens)
 */
export function sanitizeContextText(text: string): string {
  if (!text) return '';
  return text
    .replace(/(api[_-]?key|secret|token|password|auth|jwt)["']?\s*[:=]\s*["']?([a-zA-Z0-9_\-\.]{4,})["']?/gi, '$1=***REDACTED***')
    .replace(/ghp_[a-zA-Z0-9]{36}/g, 'ghp_***REDACTED***')
    .replace(/nvapi-[a-zA-Z0-9_\-]{16,}/g, 'nvapi-***REDACTED***')
    .replace(/AIza[0-9A-Za-z-_]{35}/g, 'AIza***REDACTED***');
}

export class AIContextBuilder {
  public static readonly ONLINE_SYSTEM_PROMPT = 
    `You are CodeVault AI, an expert computer science tutor and programming assistant. ` +
    `Help students write clean, readable, efficient code, understand data structures & algorithms (DSA), ` +
    `debug compiler/runtime errors, and master software development concepts. ` +
    `Provide well-commented code snippets with time and space complexity explanations where appropriate.`;

  public static readonly OFFLINE_SYSTEM_PROMPT = 
    `You are CodeVault Offline AI, a lightweight on-device coding tutor running completely locally without internet. ` +
    `Help students understand programming concepts, loops, functions, arrays, DSA, and fix compiler errors. ` +
    `Keep code explanations clear, concise, and pedagogical.`;

  /**
   * Builds the formatted message array adapted to provider constraints.
   */
  public static buildMessages(
    request: AIRequest,
    provider: AIProviderId
  ): { role: string; content: string }[] {
    const isOffline = provider === 'offline';
    const systemPrompt = request.systemPrompt || (isOffline ? this.OFFLINE_SYSTEM_PROMPT : this.ONLINE_SYSTEM_PROMPT);

    const formatted: { role: string; content: string }[] = [];
    formatted.push({ role: 'system', content: systemPrompt });

    // History trimming strategy
    const rawHistory = request.messages || [];
    const maxHistoryMessages = isOffline ? 4 : 12; // Offline trims to last 4 messages to preserve local context window
    const recentHistory = rawHistory.slice(-maxHistoryMessages);

    for (let i = 0; i < recentHistory.length; i++) {
      const msg = recentHistory[i];
      const isLast = i === recentHistory.length - 1;
      let text = sanitizeContextText(msg.content);

      // If last user message, append attached code/errors
      if (isLast && msg.role === 'user') {
        let contextSuffix = '';
        if (request.language && request.activeCode) {
          const codeSnippet = isOffline ? request.activeCode.slice(0, 1500) : request.activeCode;
          contextSuffix += `\n\n[Active Code (${request.language.toUpperCase()})]:\n\`\`\`${request.language}\n${codeSnippet}\n\`\`\``;
        }
        if (request.lastError) {
          const errSnippet = isOffline ? request.lastError.slice(0, 500) : request.lastError;
          contextSuffix += `\n\n[Compiler Error]:\n\`\`\`\n${errSnippet}\n\`\`\``;
        }
        text += contextSuffix;
      }

      if (text.trim()) {
        formatted.push({
          role: msg.role === 'system' ? 'user' : msg.role,
          content: text,
        });
      }
    }

    return formatted;
  }
}
