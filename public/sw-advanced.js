const CACHE_NAME = 'used-market-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const API_CACHE = 'api-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/lovable-uploads/4e530486-e6cb-4ca6-8a3f-9658a5975dee.png',
  '/favicon.ico'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/user'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/api/') || API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    // API requests - network first with cache fallback
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (request.destination === 'image') {
    // Images - cache first
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  } else {
    // Other requests - network first
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-products') {
    event.waitUntil(syncProducts());
  } else if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncProducts() {
  try {
    // Get pending product submissions from IndexedDB
    const pendingProducts = await getPendingFromIndexedDB('products');
    
    for (const product of pendingProducts) {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product.data)
        });
        
        // Remove from pending queue
        await removeFromIndexedDB('products', product.id);
      } catch (error) {
        console.error('Failed to sync product:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncMessages() {
  try {
    const pendingMessages = await getPendingFromIndexedDB('messages');
    
    for (const message of pendingMessages) {
      try {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message.data)
        });
        
        await removeFromIndexedDB('messages', message.id);
      } catch (error) {
        console.error('Failed to sync message:', error);
      }
    }
  } catch (error) {
    console.error('Message sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getPendingFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UsedMarketOffline', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAll = store.getAll();
      
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

async function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UsedMarketOffline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}
