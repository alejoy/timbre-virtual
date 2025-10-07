export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });
  const cfg = {
    firebase: {
      apiKey: process.env.FIREBASE_CLIENT_API_KEY || null,
      authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN || null,
      projectId: process.env.FIREBASE_PROJECT_ID || null,
      messagingSenderId: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID || null,
      appId: process.env.FIREBASE_CLIENT_APP_ID || null,
    },
    vapidKey: process.env.FIREBASE_WEB_PUSH_CERTIFICATE || process.env.FCM_VAPID_KEY || null,
  };
  return res.status(200).json(cfg);
}
