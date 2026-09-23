const CACHE_NAME = "tsertos-crm-pwa-v9.9.15";
const APP_SHELL = [
  "./",
  "./index.html",
  "./jszip.min.js?v=9.9.15",
  "./receipt-xlsx.js?v=9.9.15",
  "./local-supabase.js?v=9.9.15",
  "./auto-policies-seed.js?v=9.9.15",
  "./manifest.webmanifest?v=9.9.15",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png?v=9.9.15"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/recover.html")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(response => response || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});
