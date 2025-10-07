import { getFirebase } from '../_firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { ownerId, name, location } = await readJson(req);
    if (!ownerId || !location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return res.status(400).json({ error: 'ownerId y location {lat,lng} son requeridos' });
    }

    const { db, GeoPoint } = getFirebase();

    const doorbellRef = db.collection('doorbells').doc();
    const doorbellId = doorbellRef.id;

    const qrCodeUrl = `${getBaseUrl(req)}/ring/${doorbellId}`;

    await doorbellRef.set({
      doorbellId,
      ownerId,
      name: name || null,
      isActive: true,
      qrCodeUrl,
      location: new GeoPoint(location.lat, location.lng),
      lastRing: null,
      createdAt: new Date()
    });

    return res.status(200).json({ doorbellId, qrCodeUrl });
  } catch (err) {
    console.error('Error creando timbre:', err);
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

function getBaseUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`;
}
