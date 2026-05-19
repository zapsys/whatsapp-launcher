// ==========================
// 📦 CONFIG
// ==========================
const CACHE_NAME = 'whatsapp-launcher-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/js/app.js',
  '/manifest.json',
  '/icons/logo-192x192.png',
  '/icons/logo-512x512.png',
  '/icons/apple-touch-icon.png'
];
// ==========================
// 🚀 INSTALL
// ==========================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of ASSETS) {
        try {
          await cache.add(url);
          console.log('[SW] Cacheado:', url);
        } catch (err) {
          console.warn('[SW] Falha ao cachear:', url);
        }
      }
    })
  );
});
// ==========================
// 🔄 ACTIVATE
// ==========================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...');

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
// ==========================
// 🌐 FETCH (Cache First)
// ==========================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🔥 NÃO intercepta:
  // - requests não GET
  // - links externos (WhatsApp, APIs, etc)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // ⚠️ evita erro com responses inválidas
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Atualiza cache dinamicamente
          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // fallback offline
          return caches.match('/index.html');
        });
    })
  );
});
