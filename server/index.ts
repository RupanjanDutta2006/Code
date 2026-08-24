import express, { Request, Response } from 'express';
import cors from 'cors';
import { executeCode, SUPPORTED_LANGUAGES } from './compilerService';
import {
  chatWithNemotron,
  streamChatWithNemotron,
  explainCodeWithNemotron,
  suggestFixWithNemotron,
  NVIDIA_CONFIG,
} from './aiService';
import {
  getClientIdentifier,
  checkRateLimit,
  releaseRateLimit,
  validateAIInput,
} from './rateLimiter';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    engine: 'CodeVault Cloud Compiler Service (Wandbox)',
    supported_languages: SUPPORTED_LANGUAGES,
    ai_service: 'CodeVault AI',
    ai_provider: 'nvidia',
    ai_model: NVIDIA_CONFIG.model,
    version: '2.1.0',
  });
});

// Universal Execution Endpoints
const handleExecute = async (req: Request, res: Response) => {
  const result = await executeCode(req.body);
  res.status(200).json(result);
};

app.post('/api/run', handleExecute);
app.post('/api/programs/execute', handleExecute);
app.post('/api/execute', handleExecute);

// Execution stop endpoint
app.post(['/api/execute/stop', '/api/programs/execute/stop'], (req: Request, res: Response) => {
  const execution_id = req.body?.execution_id || req.body?.executionId || 'unknown';
  res.json({
    status: 'stopped',
    execution_id,
  });
});

// ==========================================
// CodeVault AI Endpoints (Powered by Nemotron)
// ==========================================

// AI Health Diagnostic
app.get('/api/ai/health', (_req: Request, res: Response) => {
  res.json({
    service: 'CodeVault AI',
    configured: Boolean(NVIDIA_CONFIG.apiKey),
    provider: 'nemotron',
    model: NVIDIA_CONFIG.model,
    status: 'ready',
  });
});

// AI Explain Code
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { language, source_code, code, context } = req.body;
  const rawCode = source_code || code || '';
  const result = await explainCodeWithNemotron({
    source_code: rawCode,
    language: language || 'c',
    context,
  });
  res.json(result);
});

// AI Suggest Fix
app.post('/api/ai/suggest-fix', async (req: Request, res: Response) => {
  const { language, source_code, code, error_message, input_data, expected_output } = req.body;
  const rawCode = source_code || code || '';
  const result = await suggestFixWithNemotron({
    source_code: rawCode,
    language: language || 'c',
    error_message,
    input_data,
    expected_output,
  });
  res.json(result);
});

// AI Interactive Chat (Standard Non-Streaming)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages, message, source_code, language, context } = req.body;
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

  try {
    const result = await chatWithNemotron({
      messages: normalizedMessages,
      source_code,
      language,
      context,
    });
    res.json(result);
  } finally {
    releaseRateLimit(clientId);
  }
});

// AI Interactive Chat (Real-Time SSE Streaming)
app.post('/api/ai/chat/stream', async (req: Request, res: Response) => {
  const { messages, message, source_code, language, context } = req.body;
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
        res.write(`data: ${JSON.stringify({ error: err.message || 'Stream error' })}\n\n`);
        res.end();
      }
    );
  } finally {
    releaseRateLimit(clientId);
  }
});

// AI Config Info
app.get('/api/ai/config', (_req: Request, res: Response) => {
  res.json({
    provider: 'nvidia',
    model: NVIDIA_CONFIG.model,
    baseURL: NVIDIA_CONFIG.baseURL,
    reasoningBudget: NVIDIA_CONFIG.reasoningBudget,
    enableThinking: NVIDIA_CONFIG.enableThinking,
    temperature: NVIDIA_CONFIG.temperature,
    topP: NVIDIA_CONFIG.topP,
    maxTokens: NVIDIA_CONFIG.maxTokens,
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CodeVault Server listening on http://localhost:${PORT}`);
  });
}

export default app;
