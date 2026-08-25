export default async function handler(req: any, res: any) {
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

  const roomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  res.status(200).json({
    id: roomId,
    title: req.body?.title || 'Collaborative Session',
    language: req.body?.language || 'python',
    source_code: req.body?.source_code || '# Collaborative Playground\nprint("Collaborating in real-time!")',
    created_at: new Date().toISOString(),
  });
}
