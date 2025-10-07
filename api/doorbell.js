import { getFirebase } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
  const { doorbellId } = req.query || {};
  if (!doorbellId) return res.status(400).json({ error: 'doorbellId requerido' });

  try {
    const { db } = getFirebase();
    const doc = await db.collection('doorbells').doc(doorbellId).get();
    if (!doc.exists) return res.status(404).json({ error: 'No existe' });
    const data = doc.data();
    return res.status(200).json({
      doorbellId: data.doorbellId,
      name: data.name || null,
      isActive: data.isActive,
      qrCodeUrl: data.qrCodeUrl || null,
      location: data.location ? { lat: data.location.latitude, lng: data.location.longitude } : null,
      lastRing: data.lastRing || null,
    });
  } catch (e) {
    console.error('Error leyendo timbre:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
