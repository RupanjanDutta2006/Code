/**
 * CodeVault Pro - Unified AI Architecture Types
 * Powering ONE CodeVault AI with Online (NVIDIA Nemotron) + Offline (Browser Runtime) Hybrid Providers.
 */

export type AIProviderId = 'nemotron' | 'offline';
export type AIProviderMode = 'auto' | 'online' | 'offline';

export type AIHealthStatus =
  | 'ONLINE_HEALTHY'
  | 'ONLINE_CHECKING'
  | 'PROVIDER_UNAVAILABLE'
  | 'OFFLINE'
  | 'OFFLINE_AI_READY'
  | 'OFFLINE_AI_NOT_READY'
  | 'SWITCHING_PROVIDER';

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

export interface OfflineAICapabilities {
  webGPU: boolean;
  wasm: boolean;
  persistentStorage: boolean;
  storageEstimateMB: number;
  availableStorageMB: number;
  supported: boolean;
  reason?: string;
}

export interface OfflineModelState {
  modelId: string;
  modelName: string;
  quantization: string;
  sizeMB: number;
  status: 'not_downloaded' | 'downloading' | 'ready' | 'error';
  progress: number;
  progressText?: string;
  downloadedAt?: number;
  version?: string;
  error?: string;
}

export type WorkerRequestType = 'INIT' | 'DOWNLOAD' | 'GENERATE' | 'CANCEL' | 'TEST' | 'PURGE' | 'UNLOAD';

export interface WorkerRequest {
  id?: string;
  requestId?: string;
  type: WorkerRequestType;
  modelId?: string;
  request?: AIRequest;
  prompt?: string;
  messages?: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
}

export type WorkerResponseType =
  | 'INIT_PROGRESS'
  | 'READY'
  | 'TOKEN'
  | 'COMPLETE'
  | 'ERROR'
  | 'UNLOADED'
  | 'DOWNLOAD_PROGRESS'
  | 'DOWNLOAD_COMPLETE'
  | 'TEST_RESULT'
  | 'INIT_COMPLETE';

export interface WorkerResponse {
  id?: string;
  requestId?: string;
  type: WorkerResponseType;
  progress?: number;
  progressText?: string;
  token?: string;
  fullText?: string;
  fullResponse?: string;
  error?: string;
  success?: boolean;
}
