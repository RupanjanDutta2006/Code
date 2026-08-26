/**
 * CodeVault Pro — AI Architecture Types
 * CodeVault AI is an online-only cloud AI service.
 */

export type AIProviderId = 'online';
export type AIProviderMode = 'online';

export type AIHealthStatus =
  | 'ONLINE_HEALTHY'
  | 'ONLINE_CHECKING'
  | 'PROVIDER_UNAVAILABLE'
  | 'OFFLINE';

export interface CodeAttachment {
  type: 'code' | 'error' | 'lesson' | 'terminal';
  title: string;
  content: string;
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider?: AIProviderId;
  model?: string;
  attachments?: CodeAttachment[];
  attachment?: CodeAttachment;
  createdAt?: number;
  timestamp?: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface AIRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
  activeCode?: string;
  language?: string;
  lastError?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerationOptions {
  signal?: AbortSignal;
  onToken?: (token: string) => void;
  onStatus?: (status: string) => void;
}

export interface CodeVaultAIProvider {
  id: AIProviderId;
  name: string;
  isAvailable(): Promise<boolean>;
  generate(request: AIRequest, options?: GenerationOptions): AsyncIterable<string>;
  cancel(): Promise<void> | void;
}
