const CACHE_NAME = 'outliner-live-demo-v1';
const APP_SHELL = [
  './',
  './index.html',
  './demo/style.css?v=1.0.3',
  './demo/script.js?v=1.0.1',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/FlashMelodylogo_red_circle.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)
      .then((response) => {
        if (new URL(event.request.url).origin !== self.location.origin) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match('./index.html')))
  );
});
