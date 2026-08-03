const CACHE_NAME = 'train-tracker-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/offline.html' // অফলাইন পেজটি ক্যাশে যুক্ত করা হলো
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate Event
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
});

// Fetch Event (Network First, fallback to cache, or show offline.html)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            // যদি ক্যাশে ফাইল না থাকে এবং রিকোয়েস্টটি কোনো পেজের হয়, তবে সুন্দর অফলাইন পেজ দেখাবে
            if (response) {
              return response;
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
