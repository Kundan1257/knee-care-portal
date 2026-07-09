const CACHE_NAME = 'knee-care-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 🎯 Step A: Initialize and Pre-Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Forces the fresh service worker to take over instantly
});

// 🎯 Step B: Activate and prune old historical data blocks
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
  self.clients.claim(); // Take immediate control of all open browser tabs
});

// 🎯 Step C: The mandatory Fetch Interceptor that satisfies Android Chrome
self.addEventListener('fetch', (event) => {
  // Only intercept standard web page asset requests
  if (event.request.mode === 'navigate' || event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).catch(() => {
          return caches.match('/index.html');
        });
      })
    );
  }
});
