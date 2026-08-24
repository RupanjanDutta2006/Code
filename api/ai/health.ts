import { NVIDIA_CONFIG } from '../../server/aiService';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    service: 'CodeVault AI',
    configured: Boolean(NVIDIA_CONFIG.apiKey),
    provider: 'nemotron',
    model: NVIDIA_CONFIG.model,
    status: 'ready',
  });
}
