'use strict';
// Bump VERSION whenever bundled content changes. Only Noor-owned caches are touched.
const VERSION = 'v1';
const PREFIX = 'noor-quran-shell-';
const CACHE = PREFIX + VERSION;
const CORE = ['./', 'index.html', 'styles.css?v=23', 'app.js?v=36',
  'data.js?v=9', 'duas-hisn.js?v=2', 'duas-quran.js?v=2', 'quran-text.js?v=3',
  'pwa.js?v=1', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  'icon-maskable-512.png', 'apple-touch-icon.png'];
const absolute = path => new URL(path, self.registration.scope).href;
const CORE_URLS = new Set(CORE.map(absolute));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(
    CORE.map(path => new Request(absolute(path), {cache: 'reload'}))
  )));
  // No skipWaiting: existing tabs keep their matching code until closed.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // Never cache chats, API calls, audio, user submissions or other projects.
  if (req.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(req);
        if (response.ok) return response;
      } catch (_) {}
      return (await caches.open(CACHE)).match(absolute('index.html'));
    })());
    return;
  }
  if (!CORE_URLS.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(req)) || fetch(req);
  })());
});
