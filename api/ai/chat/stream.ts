import { streamChatWithNemotron } from '../../../server/aiService';
import {
  getClientIdentifier,
  checkRateLimit,
  releaseRateLimit,
  validateAIInput,
} from '../../../server/rateLimiter';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const { messages, message, source_code, language, context } = body;
  const normalizedMessages = Array.isArray(messages)
    ? messages
    : [{ role: 'user', content: String(message || '') }];

  // 1. Validate Input
  const validation = validateAIInput(normalizedMessages, source_code);
  if (!validation.valid) {
    res.status(400).json({ error: validation.error, message: validation.message });
    return;
  }

  // 2. Check Rate Limit
  const clientId = getClientIdentifier(req);
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    if (rateCheck.retryAfter) {
      res.setHeader('Retry-After', String(rateCheck.retryAfter));
    }
    res.status(rateCheck.statusCode || 429).json({
      error: rateCheck.error,
      message: rateCheck.message,
      retryAfter: rateCheck.retryAfter,
    });
    return;
  }

  // SSE Response Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    await streamChatWithNemotron(
      {
        messages: normalizedMessages,
        source_code,
        language,
        context,
      },
      (token: string) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
      () => {
        res.write('data: [DONE]\n\n');
        res.end();
      },
      (err: any) => {
        console.error('[API /api/ai/chat/stream Error]:', err.message);
        res.write(`data: ${JSON.stringify({ error: err.message || 'Stream error' })}\n\n`);
        res.end();
      }
    );
  } finally {
    releaseRateLimit(clientId);
  }
}
