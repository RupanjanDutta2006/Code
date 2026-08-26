export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    service: 'CodeVault AI',
    configured: Boolean(process.env.NVIDIA_API_KEY),
    status: 'ready',
  });
}