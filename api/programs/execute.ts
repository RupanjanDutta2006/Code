import type { IncomingMessage, ServerResponse } from 'http';
import { executeCode, ExecuteServiceRequest } from '../../server/compilerService';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      status: 'error',
      stdout: '',
      stderr: 'Method Not Allowed. Use POST.',
      output: '',
      error: 'Method Not Allowed. Use POST.',
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: 0,
      executionTime: 0,
      memory: 0,
      stage: 'validation',
      cached: false,
    });
    return;
  }

  try {
    let body: ExecuteServiceRequest = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const result = await executeCode(body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(200).json({
      status: 'error',
      stdout: '',
      stderr: err.message || 'Internal execution failure.',
      output: '',
      error: err.message || 'Internal execution failure.',
      exitCode: 1,
      exit_code: 1,
      execution_time_ms: 0,
      executionTime: 0,
      memory: 0,
      stage: 'runtime',
      error_type: 'ServerError',
      cached: false,
    });
  }
}
