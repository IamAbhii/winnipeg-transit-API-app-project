const filesToCache = [
  '/',
  'main.js',
  'index.html',
  'app.css',
  'fun-icon.png',
];

const currentCache = 'pages-cache-v2';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');

  event.waitUntil(
    caches.open(currentCache)
    .then(cache => {
      console.log('hi')
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName != currentCache;
        }).map(function (cacheName) {
          console.log('hi2')
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(currentCache).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          console.log('hi from fetch')
          return response;
        });
      });
    })
  );
});