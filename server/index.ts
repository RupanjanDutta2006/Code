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

// AI Health Diagnostic (Safe - no secrets exposed)
app.get(['/api/ai/health', '/api/ai-health'], (_req: Request, res: Response) => {
  res.json({
    service: 'CodeVault AI',
    configured: Boolean(NVIDIA_CONFIG.apiKey),
    online_available: Boolean(NVIDIA_CONFIG.apiKey),
    provider: 'nemotron',
    model: NVIDIA_CONFIG.model,
    status: 'ready',
    version: '2.1.0',
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

  // Set SSE HTTP Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
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
        console.error('[Streaming Error]:', err.message);
        res.write(`data: ${JSON.stringify({ error: err.message || 'Stream generation failed' })}\n\n`);
        res.end();
      }
    );
  } catch (err: any) {
    console.error('[Unhandled SSE Error]:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message || 'Internal server error' })}\n\n`);
    res.end();
  } finally {
    releaseRateLimit(clientId);
  }
});

// ==========================================
// Developer GitHub Authorization Endpoints
// ==========================================
import { GitHubService } from './githubService';

app.get('/api/github/status', (_req: Request, res: Response) => {
  res.json(GitHubService.getStatus());
});

app.get('/api/github/auth-url', (req: Request, res: Response) => {
  const role = req.query.role === 'contributor' ? 'contributor' : 'main';
  try {
    const result = GitHubService.createAuthUrl(role);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/github/callback', async (req: Request, res: Response) => {
  const { code, state, error, error_description } = req.query;
  const frontendUrl = process.env.FRONTEND_DEV_URL || 'http://localhost:5173/developer/github-connect';

  if (error) {
    return res.redirect(`${frontendUrl}?status=error&message=${encodeURIComponent(String(error_description || error))}`);
  }

  if (!code || !state) {
    return res.redirect(`${frontendUrl}?status=error&message=Missing+code+or+state+parameter`);
  }

  try {
    const result = await GitHubService.handleCallback(String(code), String(state));
    return res.redirect(result.redirect_url);
  } catch (err: any) {
    return res.redirect(`${frontendUrl}?status=error&message=${encodeURIComponent(err.message)}`);
  }
});

app.post('/api/github/select-repo', (req: Request, res: Response) => {
  const { role, repo_full_name } = req.body;
  try {
    const result = GitHubService.selectRepo(role === 'contributor' ? 'contributor' : 'main', repo_full_name);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/github/disconnect', (req: Request, res: Response) => {
  const { role } = req.body;
  res.json(GitHubService.disconnect(role === 'contributor' ? 'contributor' : 'main'));
});

app.get('/api/github/test-connection', async (req: Request, res: Response) => {
  const role = req.query.role === 'contributor' ? 'contributor' : 'main';
  const result = await GitHubService.testConnection(role);
  res.json(result);
});

// Start Server if run directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 CodeVault Server running on port ${PORT}`);
    console.log(`⚡ Compiler: Wandbox Universal Engine`);
    console.log(`🤖 AI Service: NVIDIA Nemotron (${NVIDIA_CONFIG.model})`);
    console.log(`🔐 Key Configured: ${Boolean(NVIDIA_CONFIG.apiKey)}`);
    console.log(`=========================================`);
  });
}

export default app;
