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

<<<<<<< HEAD
// AI Health Check
app.get(['/api/ai/health', '/api/ai-health'], (_req: Request, res: Response) => {
  const hasNvidia = Boolean(process.env.NVIDIA_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenai = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    status: 'ok',
    service: 'CodeVault AI Online Service',
    primary_provider: 'NVIDIA Nemotron',
    online_available: hasNvidia || hasGemini || hasOpenai,
    version: '2.1.0',
  });
});

// AI Chat endpoint (NVIDIA Nemotron Online Provider)
app.post(['/api/ai/chat', '/api/ai/stream'], async (req: Request, res: Response) => {
  const { messages, system_prompt, language, source_code, error_message } = req.body;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
  const nvidiaModel = process.env.NVIDIA_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct';

  const formattedMessages: any[] = [];
  formattedMessages.push({
    role: 'system',
    content: system_prompt || (
      'You are CodeVault AI, an expert computer science tutor and programming assistant. ' +
      'Help students write clean, efficient code, understand DSA, debug compiler errors, and master concepts. ' +
      'Provide clear, well-commented code examples with time/space complexity where appropriate.'
    ),
  });

  if (Array.isArray(messages)) {
    for (const msg of messages) {
      formattedMessages.push({
        role: msg.role || 'user',
        content: msg.content || '',
      });
    }
  }

  // Attach context
  let contextSuffix = '';
  if (language && source_code) {
    contextSuffix += `\n\n[Attached Code (${String(language).toUpperCase()})]:\n\`\`\`${language}\n${source_code}\n\`\`\``;
  }
  if (error_message) {
    contextSuffix += `\n\n[Compiler Error]:\n\`\`\`\n${error_message}\n\`\`\``;
  }
  if (contextSuffix && formattedMessages.length > 0) {
    formattedMessages[formattedMessages.length - 1].content += contextSuffix;
  }

  // 1. Primary: NVIDIA Nemotron
  if (nvidiaKey) {
    try {
      const upstream = await fetch(`${nvidiaBaseUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nvidiaKey}`,
        },
        body: JSON.stringify({
          model: nvidiaModel,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 2048,
          top_p: 0.95,
        }),
      });

      if (upstream.ok) {
        const data: any = await upstream.json();
        const content = data.choices?.[0]?.message?.content || '';
        return res.json({
          provider: 'NVIDIA Nemotron',
          message: content,
          content,
          model: nvidiaModel,
          disclaimer: 'Powered by CodeVault AI (NVIDIA Nemotron).',
        });
      }
    } catch (err: any) {
      console.warn('[NVIDIA Nemotron API Error]', err.message);
    }
  }

  // 2. Fallback: Local advisory response
  const lastUserMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '';
  const fallbackText = `Code Analysis & Guidance:\n- Prompt: "${lastUserMsg.substring(0, 80)}..."\n\nTo enable full cloud reasoning, configure your NVIDIA Nemotron API Key in your environment settings, or download CodeVault Offline AI in the AI settings panel for 100% on-device local inference.`;

  res.json({
    provider: 'CodeVault Assistant',
    message: fallbackText,
    content: fallbackText,
    disclaimer: 'Advisory response.',
  });
});

// AI explain & fix endpoint
app.post('/api/ai/explain', (req: Request, res: Response) => {
  const { language, source_code, code } = req.body;
  const rawCode = source_code || code || '';
  const lines = rawCode ? rawCode.split('\n').length : 0;
=======
// ==========================================
// CodeVault AI Endpoints (Powered by Nemotron)
// ==========================================

// AI Health Diagnostic
app.get('/api/ai/health', (_req: Request, res: Response) => {
>>>>>>> 611aab4dcee9a9d5de9509ea61c5ad984c6d2c4f
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
