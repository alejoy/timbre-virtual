import { getFirebase } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
  const { ownerId } = req.query || {};
  if (!ownerId) return res.status(400).json({ error: 'ownerId requerido' });
  try {
    const { db } = getFirebase();
    const qs = await db.collection('doorbells').where('ownerId', '==', ownerId).get();
    const items = qs.docs.map(d => {
      const v = d.data();
      return {
        doorbellId: v.doorbellId,
        name: v.name || null,
        isActive: v.isActive,
        qrCodeUrl: v.qrCodeUrl || null,
        location: v.location ? { lat: v.location.latitude, lng: v.location.longitude } : null,
        lastRing: v.lastRing || null,
      };
    });
    return res.status(200).json({ doorbells: items });
  } catch (e) {
    console.error('Error list doorbells:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
