import { getFirebase } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const body = await readJson(req);
    const { doorbellId, ownerId, isActive } = body;
    if (!doorbellId || !ownerId || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'doorbellId, ownerId e isActive requeridos' });
    }
    const { db } = getFirebase();
    const ref = db.collection('doorbells').doc(doorbellId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'No existe' });
    const data = snap.data();
    if (data.ownerId !== ownerId) return res.status(403).json({ error: 'Prohibido' });
    await ref.update({ isActive });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Error toggleActive:', e);
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
