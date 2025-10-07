import { getFirebase } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const body = await readJson(req);
    const { ringId, response } = body;
    if (!ringId || !response || typeof response !== 'string' || response.length > 50) {
      return res.status(400).json({ error: 'ringId y response (<=50 chars) requeridos' });
    }

    const { db } = getFirebase();
    const ringRef = db.collection('rings').doc(ringId);
    const ringSnap = await ringRef.get();
    if (!ringSnap.exists) return res.status(404).json({ error: 'Ring no existe' });

    await ringRef.update({ status: 'REPLIED', response });

    // could also notify visitor via a public channel if needed
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Error en respond:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}
