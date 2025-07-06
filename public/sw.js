
const CACHE_NAME = 'used-market-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event with network-first strategy for API calls
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If request is successful, clone and cache it
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(function() {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png',
      badge: '/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png',
      tag: data.tag || 'default',
      data: data.data || {},
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const data = event.notification.data;
  
  event.waitUntil(
    clients.matchAll().then(function(clientList) {
      if (data.actionUrl) {
        // Open the specific URL if provided
        return clients.openWindow(data.actionUrl);
      } else {
        // Focus existing window or open new one
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }
    })
  );
});
