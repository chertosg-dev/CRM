const CACHE_NAME = "tsertos-crm-pwa-v9.11.4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./jszip.min.js?v=9.11.4",
  "./receipt-xlsx.js?v=9.11.4",
  "./local-supabase.js?v=9.11.4",
  "./auto-policies-seed.js?v=9.11.4",
  "./forms-library.css?v=9.11.4",
  "./forms-library.js?v=9.11.4",
  "./manifest.webmanifest?v=9.11.4",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png?v=9.11.4"
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
  if (request.method !== "GET") return;

  const isPdfEngine =
    ((url.hostname === "cdn.jsdelivr.net" || url.hostname === "unpkg.com") && url.pathname.includes("/pdf-lib@1.17.1/dist/pdf-lib.min.js")) ||
    ((url.hostname === "cdn.jsdelivr.net" || url.hostname === "cdnjs.cloudflare.com") && (url.pathname.includes("pdfjs-dist") || url.pathname.includes("/pdf.js/")));

  if (isPdfEngine) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;
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
