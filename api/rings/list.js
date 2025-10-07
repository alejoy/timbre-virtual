import { getFirebase } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
  const { doorbellId, ownerId, limit } = req.query || {};
  if (!doorbellId || !ownerId) return res.status(400).json({ error: 'doorbellId y ownerId requeridos' });
  try {
    const { db } = getFirebase();
    const doorbell = await db.collection('doorbells').doc(doorbellId).get();
    if (!doorbell.exists) return res.status(404).json({ error: 'Timbre no existe' });
    if (doorbell.data().ownerId !== ownerId) return res.status(403).json({ error: 'Prohibido' });

    const lim = Math.min(parseInt(limit || '20', 10), 100);
    const qs = await db.collection('rings')
      .where('doorbellId', '==', doorbellId)
      .orderBy('timestamp', 'desc')
      .limit(lim)
      .get();

    const items = qs.docs.map(d => {
      const v = d.data();
      return {
        id: v.id,
        timestamp: v.timestamp ? v.timestamp.toDate().toISOString() : null,
        status: v.status,
        response: v.response || null,
        ringLocation: v.ringLocation ? { lat: v.ringLocation.latitude, lng: v.ringLocation.longitude } : null,
      };
    });

    return res.status(200).json({ rings: items });
  } catch (e) {
    console.error('Error list rings:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
