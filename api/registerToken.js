import { getFirebase } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const body = await readJson(req);
    const { ownerId, token } = body;
    if (!ownerId || !token) return res.status(400).json({ error: 'ownerId y token requeridos' });

    const { db, FieldValue } = getFirebase();
    await db.collection('owners').doc(ownerId).set({
      ownerId,
      tokens: FieldValue.arrayUnion(token),
      updatedAt: new Date()
    }, { merge: true });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Error registrando token:', e);
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
