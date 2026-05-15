const CACHE_NAME = 'whatsapp-pwa-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '../',
        '../index.html',
        '../manifest.json',
        '../icons/logo-192x192.png'
      ]);
    })
  );
});

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
