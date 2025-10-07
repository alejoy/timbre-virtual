import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, GeoPoint, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

function init() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, '\n') : undefined;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('[firebase-admin] Missing credentials env vars. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
      throw new Error('Firebase Admin not configured');
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey })
    });
  }
}

export function getFirebase() {
  init();
  const db = getFirestore();
  const messaging = getMessaging();
  return { db, messaging, GeoPoint, Timestamp, FieldValue };
}
