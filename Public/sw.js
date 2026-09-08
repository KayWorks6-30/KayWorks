const CACHE_NAME = 'kayworks-v2-shell';
const SHELL = [
  './',
  'index.html',
  'apps.html',
  'lab.html',
  'about.html',
  'technical.html',
  'css/app.css',
  'js/app.js',
  'manifest.webmanifest',
  'assets/raccoon-mark.svg',
  'assets/raccoon-mascot.svg',
  'assets/raccoon-192.png',
  'assets/raccoon-512.png',
  'assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
