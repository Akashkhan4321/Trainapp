const CACHE_NAME = 'train-tracker-v3';
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './train.png',
  './manifest.json'
];

// ১. ইনস্টল করার সময় সাবধানে ক্যাশ করা (কোনো ফাইল মিসিং থাকলেও যেন ক্র্যাশ না করে)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.log('Failed to cache: ', url, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// ২. অ্যাক্টিভেট হওয়ার সময় পুরনো ক্যাশ ক্লিন করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ৩. ফেচ এবং অফলাইন হ্যান্ডেল করার লজিক
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ইন্টারনেট থাকলে রেসপন্স রিটার্ন করবে
        return response;
      })
      .catch(() => {
        // ইন্টারনেট না থাকলে ক্যাশ থেকে খোঁজা
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // যদি পেজ রিকোয়েস্ট হয় এবং ক্যাশে না থাকে, তবে offline.html দেখাবে
          if (event.request.mode === 'navigate') {
            return caches.match('./offline.html');
          }
        });
      })
  );
});
