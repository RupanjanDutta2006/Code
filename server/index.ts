import express, { Request, Response } from 'express';
import cors from 'cors';
import { executeCode, SUPPORTED_LANGUAGES } from './compilerService';

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

// AI explain & fix endpoint
app.post('/api/ai/explain', (req: Request, res: Response) => {
  const { language, source_code, code } = req.body;
  const rawCode = source_code || code || '';
  const lines = rawCode ? rawCode.split('\n').length : 0;
  res.json({
    provider: 'CodeVault Pro Assistant',
    explanation: `Code Analysis for ${language ? String(language).toUpperCase() : 'Language'}:\n- Source contains ${lines} line(s).\n- Ready for cloud sandbox compilation.`,
    disclaimer: 'Advisory analysis only.',
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CodeVault Server listening on http://localhost:${PORT}`);
  });
}

export default app;
