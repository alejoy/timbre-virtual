import { getFirebase } from './_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const body = await readJson(req);
    const { doorbellId, visitorSessionId, ringLocation } = body;
    if (!doorbellId || !visitorSessionId || !ringLocation) {
      return res.status(400).json({ error: 'doorbellId, visitorSessionId y ringLocation requeridos' });
    }
    const { lat, lng } = ringLocation || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'ringLocation inválida' });
    }

    const { db, GeoPoint, Timestamp } = getFirebase();

    const doorbellSnap = await db.collection('doorbells').doc(doorbellId).get();
    if (!doorbellSnap.exists) return res.status(404).json({ error: 'Timbre no existe' });
    const doorbell = doorbellSnap.data();

    if (!doorbell.isActive) return res.status(403).json({ error: 'El timbre digital está desactivado en este momento.' });

    const now = Timestamp.now();

    // Rate limiting: 1 ring per minute per visitorSessionId per doorbell
    const oneMinuteAgo = Timestamp.fromMillis(now.toMillis() - 60 * 1000);
    const recentQuery = await db.collection('rings')
      .where('doorbellId', '==', doorbellId)
      .where('visitorSessionId', '==', visitorSessionId)
      .where('timestamp', '>=', oneMinuteAgo)
      .limit(1)
      .get();
    if (!recentQuery.empty) {
      return res.status(429).json({ error: 'Por favor, espera 1 minuto entre toques.' });
    }

    // Geofence: within 50 meters
    const distance = haversineMeters(
      doorbell.location.latitude,
      doorbell.location.longitude,
      lat,
      lng
    );
    if (distance > 50) {
      return res.status(403).json({ error: 'Parece que no estás cerca de la puerta. Acércate para tocar.' });
    }

    const ringDoc = db.collection('rings').doc();
    await ringDoc.set({
      id: ringDoc.id,
      doorbellId,
      timestamp: now,
      visitorSessionId,
      status: 'PENDING',
      response: null,
      ringLocation: new GeoPoint(lat, lng)
    });

    await doorbellSnap.ref.update({ lastRing: now });

    // Notify owner devices via FCM
    await sendNotificationToOwner(doorbell.ownerId, {
      title: '¡Timbre en tu puerta!',
      body: doorbell.name ? `Casa ${doorbell.name}` : 'Timbre digital',
      data: { ringId: ringDoc.id, doorbellId }
    });

    return res.status(200).json({ ok: true, ringId: ringDoc.id });
  } catch (e) {
    console.error('Error en ring:', e);
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

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function sendNotificationToOwner(ownerId, payload) {
  try {
    const { db, messaging } = getFirebase();
    const ownerDoc = await db.collection('owners').doc(ownerId).get();
    if (!ownerDoc.exists) return;
    const tokens = ownerDoc.data().tokens || [];
    if (!tokens.length) return;
    await messaging.sendEachForMulticast({ tokens, notification: { title: payload.title, body: payload.body }, data: payload.data });
  } catch (e) {
    console.error('FCM error:', e);
  }
}
