const CACHE_NAME = 'v1';
const urlsToCache = [
  '/75-strong-kids/',
  '/75-strong-kids/index.html',
  '/75-strong-kids/manifest.json',
  '/75-strong-kids/icons/icon-192.png',
  '/75-strong-kids/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
