const CACHE_NAME = 'knee-care-v4'; // 🟢 Incremented version layer to flush out older cache locks instantly
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🟢 NEW NETWORK-FIRST HOOK: Pulls fresh live network assets instantly, falls back to offline cache gracefully
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 🟢 BACKGROUND PUSH LISTENER: Wakes up to catch and display automated alerts natively on user home screens
self.addEventListener('push', (event) => {
  let pushData = { title: 'Knee-Care Portal Update', body: 'New physical recovery routines are now active!' };
  
  try {
    if (event.data) {
      pushData = event.data.json();
    }
  } catch (parseErr) {
    if (event.data) {
      pushData.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: pushData.body,
    icon: '/icon-192.png', // Maps cleanly to your PWA manifest brand assets
    badge: '/icon-192.png',
    vibrate:,
    data: { dateOfArrival: Date.now() }
  };

  event.waitUntil(
    self.registration.showNotification(pushData.title, notificationOptions)
  );
});

// 🟢 NOTIFICATION CLICK HANDLER: Redirects users cleanly to your portal the instant they tap the alert bubble
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Instantly dismisses the bubble natively from the screen layout row

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a portal window is already open in a background tab, focus it natively
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If no active tab is found, launch a fresh browser instance cleanly
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
