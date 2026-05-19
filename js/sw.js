const CACHE_NAME = 'whatsapp-launcher-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/js/app.js',
  '/icons/logo-192x192.png',
  '/icons/logo-512x512.png'
];
// =====================
// 📦 INSTALL
// =====================
self.addEventListener('install', event => {
  self.skipWaiting(); // ativa imediatamente

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});
// =====================
// ⚡ ACTIVATE
// =====================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // controla todas as abas abertas
});
// ==========================
// 🌐 FETCH (network-first)
// ==========================
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
