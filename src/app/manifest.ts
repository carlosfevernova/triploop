import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TripLoop — California Road Trip Planner',
    short_name: 'TripLoop',
    description: 'Smart California road trips for international travelers. Works offline in national parks.',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#FF5A5F',
    categories: ['travel', 'navigation', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcuts: [
      { name: 'My trips', short_name: 'Trips', url: '/en/my-trips', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Plan new trip', short_name: 'New', url: '/en/trip/new', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'California itineraries', short_name: 'California', url: '/en/california', icons: [{ src: '/icon-192.png', sizes: '192x192' }] }
    ],
    screenshots: [
      { src: '/screenshot-mobile.png', sizes: '1080x1920', type: 'image/png', form_factor: 'narrow' }
    ]
  };
}
