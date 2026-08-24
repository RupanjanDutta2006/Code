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
  createdAt: number;
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
  storageEstimateMB?: number;
  availableStorageMB?: number;
  supported: boolean;
  reason?: string;
}

export type ModelDownloadStatus = 'not_downloaded' | 'downloading' | 'ready' | 'error' | 'updating';

export interface OfflineModelState {
  modelId: string;
  modelName: string;
  quantization: string;
  sizeMB: number;
  status: ModelDownloadStatus;
  progress: number; // 0 to 100
  progressText?: string;
  downloadedAt?: number;
  version: string;
  lastError?: string;
}

export interface WorkerRequest {
  type: 'INIT' | 'GENERATE' | 'CANCEL' | 'UNLOAD' | 'CHECK_STATUS';
  requestId?: string;
  modelId?: string;
  messages?: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
}

export interface WorkerResponse {
  type: 'INIT_PROGRESS' | 'READY' | 'TOKEN' | 'COMPLETE' | 'ERROR' | 'UNLOADED';
  requestId?: string;
  progress?: number;
  progressText?: string;
  token?: string;
  fullText?: string;
  error?: string;
}
