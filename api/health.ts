import { SUPPORTED_LANGUAGES } from '../server/compilerService';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    engine: 'CodeVault Cloud Compiler Service (Wandbox)',
    supported_languages: SUPPORTED_LANGUAGES,
    version: '2.1.0',
  });
}
