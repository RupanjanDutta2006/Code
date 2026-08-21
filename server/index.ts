import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', engine: 'Node.js Express TypeScript', version: '2.0.0' });
});

// Universal Execution Endpoint for all 11 languages
app.post('/api/programs/execute', async (req: Request, res: Response) => {
  const { language, source_code, custom_input } = req.body;
  const startTime = Date.now();

  try {
    const pLanguage = (language || 'python').toLowerCase();
    const pReq = {
      language: pLanguage === 'cpp' || pLanguage === 'c++' ? 'c++' : pLanguage === 'sql' ? 'sqlite3' : pLanguage,
      version: '*',
      files: [{ content: source_code || '' }],
      stdin: custom_input || '',
    };

    const upstream = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pReq),
    });

    const elapsed = Date.now() - startTime;

    if (!upstream.ok) {
      return res.status(200).json({
        status: 'error',
        output: '',
        error: `Remote runner returned status ${upstream.status}`,
        execution_time_ms: elapsed,
      });
    }

    const data = await upstream.json();
    const run = data.run || {};

    res.json({
      status: run.code === 0 ? 'success' : 'error',
      output: run.stdout || '',
      error: run.stderr || (data.compile && data.compile.stderr) || '',
      execution_time_ms: elapsed,
      exit_code: run.code ?? 0,
    });
  } catch (err: any) {
    res.status(200).json({
      status: 'error',
      output: '',
      error: err.message || 'Execution error',
      execution_time_ms: Date.now() - startTime,
      exit_code: 1,
    });
  }
});

// AI explain & fix
app.post('/api/ai/explain', (req: Request, res: Response) => {
  const { language, source_code } = req.body;
  res.json({
    provider: 'CodeVault Pro Assistant',
    explanation: `Code Analysis for ${language?.toUpperCase() || 'Language'}:\n- Contains ${source_code ? source_code.split('\n').length : 0} lines.\n- Clean logic flow and standard library usage.`,
    disclaimer: 'Advisory analysis only.',
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 CodeVault Node.js server listening on http://localhost:${PORT}`);
  });
}

export default app;
