/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// These values must be injected via env and replaced at build/deploy if using client SDK.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Optional: handle background messages if you later use client FCM
// firebase.initializeApp({
//   apiKey: 'xxx',
//   authDomain: 'xxx',
//   projectId: 'xxx',
//   messagingSenderId: 'xxx',
//   appId: 'xxx'
// });
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     data: payload.data,
//   });
// });
