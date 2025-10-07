import { getFirebase } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
  const { ringId } = req.query || {};
  if (!ringId) return res.status(400).json({ error: 'ringId requerido' });
  try {
    const { db } = getFirebase();
    const snap = await db.collection('rings').doc(ringId).get();
    if (!snap.exists) return res.status(404).json({ error: 'No existe' });
    const data = snap.data();
    return res.status(200).json({ status: data.status, response: data.response || null });
  } catch (e) {
    console.error('Error en ringStatus:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
