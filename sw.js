self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
  // এখানে ক্যাশিং বা ফেচ রিকোয়েস্ট হ্যান্ডেল করা হবে
});
