const CACHE_NAME = 'biblia-pro-v3'; // Versiune nouă pentru refresh
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// --- MODIFICAREA AICI: LOGICA PENTRU CLICK PE NOTIFICARE ---
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Aici am adăugat calea exactă a repository-ului tău
  const rootUrl = new URL('/Biblia-interactiva/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Verificăm dacă aplicația este deja deschisă
      for (let client of windowClients) {
        if (client.url === rootUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Dacă nu este deschisă, o deschidem la adresa corectă
      if (clients.openWindow) {
        return clients.openWindow(rootUrl);
      }
    })
  );
});
