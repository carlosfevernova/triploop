/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist, CacheFirst, NetworkFirst, ExpirationPlugin, CacheableResponsePlugin } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined };

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Map tiles (Carto Voyager) — CacheFirst, gran capacidad para parques offline
    {
      matcher: /^https?:\/\/[abcd]?\.?basemaps\.cartocdn\.com\/.*\.png$/i,
      handler: new CacheFirst({
        cacheName: 'map-tiles',
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 4000, maxAgeSeconds: 60 * 60 * 24 * 30 }) // 30d, hasta ~4k tiles
        ]
      })
    },
    // Google Places photos — CacheFirst, comprimidas
    {
      matcher: /^https:\/\/places\.googleapis\.com\/v1\/places\/.*\/media/i,
      handler: new CacheFirst({
        cacheName: 'poi-photos',
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 })
        ]
      })
    },
    // Unsplash hero images — CacheFirst
    {
      matcher: /^https:\/\/images\.unsplash\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: 'hero-images',
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 60 })
        ]
      })
    },
    // Trip API (leer) — NetworkFirst con fallback cache
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/trips/') && !url.pathname.includes('/fork'),
      method: 'GET',
      handler: new NetworkFirst({
        cacheName: 'trip-api',
        networkTimeoutSeconds: 4,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 })
        ]
      })
    },
    ...defaultCache
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }){ return request.destination === 'document'; }
      }
    ]
  }
});

serwist.addEventListeners();
