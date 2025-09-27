// public/sw.js - Service Worker para TechStore PWA
const CACHE_NAME = 'techstore-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Recursos críticos para cachear
const CORE_CACHE_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL,
  // Iconos
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Fuentes críticas
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Recursos de productos para cachear dinámicamente
const PRODUCT_CACHE = 'techstore-products-v1';
const API_CACHE = 'techstore-api-v1';
const IMAGE_CACHE = 'techstore-images-v1';

// URLs que NO deben cachearse
const EXCLUDED_URLS = [
  '/admin',
  '/api/admin',
  '/api/auth',
  '/api/payments'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core resources');
        return cache.addAll(CORE_CACHE_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Core resources cached');
        // Forzar activación inmediata
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching core resources', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminar caches antiguas
            if (cacheName !== CACHE_NAME && 
                cacheName !== PRODUCT_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        // Tomar control inmediato de todas las páginas
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar URLs excluidas
  if (EXCLUDED_URLS.some(excludedUrl => url.pathname.startsWith(excludedUrl))) {
    return;
  }

  // Estrategia Cache-First para recursos estáticos
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estrategia Network-First para imágenes
  if (request.destination === 'image') {
    event.respondWith(networkFirstImage(request));
    return;
  }

  // Estrategia Network-First para API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // Estrategia Network-First para navegación
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Default: Cache-First
  event.respondWith(cacheFirst(request));
});

// Estrategia Cache-First
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Actualizar cache en background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignorar errores de red en background
      });
      
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.error('Cache-First strategy failed:', error);
    return new Response('Recurso no disponible offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estrategia Network-First para navegación
async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Mostrar página offline personalizada
    const offlineResponse = await cache.match(OFFLINE_URL);
    return offlineResponse || new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estrategia Network-First para imágenes
async function networkFirstImage(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Imagen placeholder offline
    return new Response(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">
          Imagen no disponible offline
        </text>
      </svg>
    `, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

// Estrategia Network-First para API
async function networkFirstAPI(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    if (request.method === 'GET') {
      const cache = await caches.open(API_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Agregar header para indicar que es una respuesta cacheada
        const response = cachedResponse.clone();
        response.headers.set('X-Cached-Response', 'true');
        return response;
      }
    }
    
    // Para requests que no son GET o no tienen cache, devolver error estructurado
    return new Response(JSON.stringify({
      error: 'Sin conexión',
      message: 'Esta función requiere conexión a internet',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Sincronización en background
self.addEventListener('sync', event => {
  console.log('Background Sync:', event.tag);
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Sincronizar carrito cuando se recupere la conexión
async function syncCart() {
  try {
    const pendingActions = await getStoredData('pending-cart-actions');
    
    if (pendingActions && pendingActions.length > 0) {
      for (const action of pendingActions) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action)
        });
      }
      
      // Limpiar acciones pendientes
      await clearStoredData('pending-cart-actions');
      
      // Notificar a la aplicación
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CART_SYNCED',
            message: 'Carrito sincronizado exitosamente'
          });
        });
      });
    }
  } catch (error) {
    console.error('Error syncing cart:', error);
  }
}

// Sincronizar pedidos pendientes
async function syncOrders() {
  try {
    const pendingOrders = await getStoredData('pending-orders');
    
    if (pendingOrders && pendingOrders.length > 0) {
      for (const order of pendingOrders) {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          // Remover pedido de la lista de pendientes
          await removeStoredData('pending-orders', order.id);
        }
      }
    }
  } catch (error) {
    console.error('Error syncing orders:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: 'Tienes nuevas ofertas disponibles en TechStore',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: '/icons/notification-image.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Ofertas',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/action-close.png'
      }
    ]
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.title = payload.title || 'TechStore';
      options.data = { ...options.data, ...payload.data };
    } catch (error) {
      console.error('Error parsing push payload:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('TechStore', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/ofertas')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
  } else {
    // Click en la notificación principal
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utilidades para IndexedDB
async function getStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TechStoreDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readonly');
      const store = transaction.objectStore('offline-data');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.value);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'key' });
      }
    };
  });
}

async function clearStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TechStoreDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readwrite');
      const store = transaction.objectStore('offline-data');
      const deleteRequest = store.delete(key);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

async function removeStoredData(key, itemId) {
  const data = await getStoredData(key);
  if (data && Array.isArray(data)) {
    const filteredData = data.filter(item => item.id !== itemId);
    await storeData(key, filteredData);
  }
}

// Escuchar mensajes desde la aplicación
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_PRODUCT') {
    // Cachear producto específico
    cacheProduct(event.data.productUrl);
  }
});

// Cachear producto específico
async function cacheProduct(productUrl) {
  try {
    const cache = await caches.open(PRODUCT_CACHE);
    await cache.add(productUrl);
    console.log('Product cached:', productUrl);
  } catch (error) {
    console.error('Error caching product:', error);
  }
}