/**
 * CodeVault AI - Server-Side Rate Limiter & Abuse Protection
 */

export interface RateLimitResult {
  allowed: boolean;
  statusCode?: number;
  error?: string;
  message?: string;
  retryAfter?: number;
  remaining?: number;
}

interface ClientRecord {
  timestamps: number[];
  activeRequests: number;
}

// In-process cache with auto-cleanup
const clientStore = new Map<string, ClientRecord>();

// Configuration Defaults
export const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequestsPerWindow: 10, // 10 requests per minute
  maxConcurrentPerClient: 1, // Max 1 active in-flight request
  maxMessageLength: 4000, // Max 4,000 chars per user prompt
  maxCodeLength: 50000, // Max 50,000 chars attached code (~1,500 lines)
  timeoutMs: 45000, // 45 seconds timeout
};

// Periodic cleanup of stale client records (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clientStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_CONFIG.windowMs);
      if (record.timestamps.length === 0 && record.activeRequests <= 0) {
        clientStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Extracts privacy-conscious unique client key from request (User Token or IP)
 */
export function getClientIdentifier(req: any): string {
  // If user is authenticated with Bearer token, hash token as ID
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token.length > 10) {
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      return `user_${Math.abs(hash)}`;
    }
  }

  // Fallback to client IP from standard proxy headers
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return `ip_${forwarded.split(',')[0].trim()}`;
  }

  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string') {
    return `ip_${realIp.trim()}`;
  }

  return `ip_${req.socket?.remoteAddress || 'anonymous'}`;
}

/**
 * Validates input sizes and checks for forbidden content
 */
export function validateAIInput(messages: any[], sourceCode?: string): { valid: boolean; error?: string; message?: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      valid: false,
      error: 'INVALID_REQUEST',
      message: 'Message cannot be empty. Please ask a coding or learning question.',
    };
  }

  // Check latest user message length
  const lastUserMsg = [...messages].reverse().find((m) => m?.role === 'user');
  const userText = String(lastUserMsg?.content || '').trim();

  if (!userText) {
    return {
      valid: false,
      error: 'EMPTY_MESSAGE',
      message: 'Message cannot be empty.',
    };
  }

  if (userText.length > RATE_LIMIT_CONFIG.maxMessageLength) {
    return {
      valid: false,
      error: 'MESSAGE_TOO_LARGE',
      message: `Your message exceeds the maximum allowed length of ${RATE_LIMIT_CONFIG.maxMessageLength} characters. Please shorten it.`,
    };
  }

  // Check attached code length
  if (sourceCode && sourceCode.length > RATE_LIMIT_CONFIG.maxCodeLength) {
    return {
      valid: false,
      error: 'CODE_TOO_LARGE',
      message: `Attached code exceeds the maximum limit of ${RATE_LIMIT_CONFIG.maxCodeLength} characters. Please select a smaller function or snippet.`,
    };
  }

  // Sensitive keyword security guard
  const lowerText = userText.toLowerCase();
  const lowerCode = (sourceCode || '').toLowerCase();
  if (
    lowerText.includes('nvidia_api_key') ||
    lowerText.includes('secret_key=') ||
    lowerCode.includes('nvidia_api_key') ||
    lowerCode.includes('begin rsa private key')
  ) {
    return {
      valid: false,
      error: 'SECURITY_RESTRICTION',
      message: 'Security Notice: Messages containing private keys or credentials cannot be processed.',
    };
  }

  return { valid: true };
}

/**
 * Checks rate limits & concurrency limits
 */
export function checkRateLimit(clientId: string): RateLimitResult {
  const now = Date.now();
  let record = clientStore.get(clientId);

  if (!record) {
    record = { timestamps: [], activeRequests: 0 };
    clientStore.set(clientId, record);
  }

  // Filter timestamps within sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_CONFIG.windowMs);

  // 1. Check Burst / Concurrency Protection
  if (record.activeRequests >= RATE_LIMIT_CONFIG.maxConcurrentPerClient) {
    return {
      allowed: false,
      statusCode: 429,
      error: 'CONCURRENT_REQUEST_LIMIT',
      message: 'You already have an active CodeVault AI generation in progress. Please wait for it to finish.',
      retryAfter: 3,
    };
  }

  // 2. Check Sliding Window Limit
  if (record.timestamps.length >= RATE_LIMIT_CONFIG.maxRequestsPerWindow) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((RATE_LIMIT_CONFIG.windowMs - (now - oldestTimestamp)) / 1000));

    return {
      allowed: false,
      statusCode: 429,
      error: 'RATE_LIMITED',
      message: "You're sending messages too quickly. Please wait a moment and try again.",
      retryAfter: retryAfterSeconds,
    };
  }

  // Record allowed request
  record.timestamps.push(now);
  record.activeRequests++;

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequestsPerWindow - record.timestamps.length,
  };
}

/**
 * Decrements active concurrency count when generation finishes or errors
 */
export function releaseRateLimit(clientId: string): void {
  const record = clientStore.get(clientId);
  if (record) {
    record.activeRequests = Math.max(0, record.activeRequests - 1);
  }
}
