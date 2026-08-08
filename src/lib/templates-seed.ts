// Iconic California trip templates para programmatic SEO.
// Coordenadas verificadas contra Google Maps 2026.

export interface SeedStop {
  name: string;
  address?: string;
  lat: number;
  lng: number;
  duration_min?: number;
  category?: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'other';
}

export interface SeedTemplate {
  slug: string;                // URL: /california/san-francisco-classic-5-days
  title: string;
  seo_description: string;
  seo_keywords: string[];
  origin_city: string;
  destination_city: string;
  days_count: number;
  hero_image_url: string;      // Unsplash direct URLs (comercial OK)
  stops: SeedStop[];
}

export const CALIFORNIA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'san-francisco-classic-5-days',
    title: 'San Francisco Classic — 5 days',
    seo_description: 'The definitive 5-day San Francisco road trip: Golden Gate, Alcatraz, Muir Woods, Napa Valley and Sausalito. Real driving times, tax-included prices, works in metric or imperial.',
    seo_keywords: ['san francisco itinerary 5 days', 'sf road trip', 'california bay area trip', 'muir woods napa itinerary'],
    origin_city: 'San Francisco',
    destination_city: 'Napa Valley',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&q=80',
    stops: [
      { name: 'Fisherman\'s Wharf', lat: 37.808, lng: -122.4177, duration_min: 120, category: 'attraction' },
      { name: 'Alcatraz Island', lat: 37.8267, lng: -122.4230, duration_min: 180, category: 'attraction' },
      { name: 'Golden Gate Bridge', lat: 37.8199, lng: -122.4783, duration_min: 60, category: 'attraction' },
      { name: 'Muir Woods National Monument', lat: 37.8917, lng: -122.5717, duration_min: 150, category: 'nature' },
      { name: 'Sausalito', lat: 37.8590, lng: -122.4852, duration_min: 180, category: 'city' },
      { name: 'Napa Valley', lat: 38.5025, lng: -122.2654, duration_min: 480, category: 'food' }
    ]
  },
  {
    slug: 'los-angeles-highlights-4-days',
    title: 'Los Angeles Highlights — 4 days',
    seo_description: '4 days in LA the local way: Griffith at sunset, Venice boardwalk, Santa Monica pier, Hollywood, and Beverly Hills. Drive times factor in real traffic (not the Maps lie).',
    seo_keywords: ['los angeles itinerary 4 days', 'la road trip', 'hollywood venice santa monica', 'griffith observatory sunset'],
    origin_city: 'Los Angeles',
    destination_city: 'Santa Monica',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80',
    stops: [
      { name: 'Hollywood Walk of Fame', lat: 34.1017, lng: -118.3407, duration_min: 90, category: 'attraction' },
      { name: 'Griffith Observatory', lat: 34.1184, lng: -118.3004, duration_min: 120, category: 'attraction' },
      { name: 'Getty Center', lat: 34.0780, lng: -118.4741, duration_min: 240, category: 'attraction' },
      { name: 'Beverly Hills (Rodeo Drive)', lat: 34.0696, lng: -118.4008, duration_min: 90, category: 'city' },
      { name: 'Venice Beach Boardwalk', lat: 33.9850, lng: -118.4695, duration_min: 150, category: 'attraction' },
      { name: 'Santa Monica Pier', lat: 34.0100, lng: -118.4962, duration_min: 120, category: 'attraction' }
    ]
  },
  {
    slug: 'san-diego-sunny-3-days',
    title: 'San Diego Sunny — 3 days',
    seo_description: 'A sun-first 3-day San Diego trip: La Jolla Cove seals, Balboa Park museums, Coronado Beach and Old Town tacos. Perfect for families and first-time visitors.',
    seo_keywords: ['san diego itinerary 3 days', 'la jolla balboa park', 'coronado old town san diego', 'family trip san diego'],
    origin_city: 'San Diego',
    destination_city: 'Coronado',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80',
    stops: [
      { name: 'La Jolla Cove', lat: 32.8508, lng: -117.2723, duration_min: 180, category: 'nature' },
      { name: 'Balboa Park', lat: 32.7341, lng: -117.1442, duration_min: 240, category: 'attraction' },
      { name: 'Old Town San Diego', lat: 32.7549, lng: -117.1965, duration_min: 120, category: 'food' },
      { name: 'Coronado Beach', lat: 32.6859, lng: -117.1831, duration_min: 180, category: 'nature' },
      { name: 'USS Midway Museum', lat: 32.7137, lng: -117.1751, duration_min: 180, category: 'attraction' }
    ]
  },
  {
    slug: 'pacific-coast-highway-5-days',
    title: 'Pacific Coast Highway — 5 days',
    seo_description: 'The definitive PCH road trip: San Francisco to Los Angeles via Monterey, Big Sur, Hearst Castle and Santa Barbara. 5 days of the most photographed coastline in America.',
    seo_keywords: ['pacific coast highway road trip', 'pch itinerary 5 days', 'big sur monterey santa barbara', 'california coast drive'],
    origin_city: 'San Francisco',
    destination_city: 'Los Angeles',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1590093060686-e7c2f00e35c1?w=1200&q=80',
    stops: [
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194, duration_min: 300, category: 'city' },
      { name: 'Monterey Bay Aquarium', lat: 36.6182, lng: -121.9017, duration_min: 240, category: 'attraction' },
      { name: 'Bixby Bridge (Big Sur)', lat: 36.3717, lng: -121.9027, duration_min: 90, category: 'nature' },
      { name: 'McWay Falls', lat: 36.1573, lng: -121.6716, duration_min: 60, category: 'nature' },
      { name: 'Hearst Castle', lat: 35.6852, lng: -121.1683, duration_min: 180, category: 'attraction' },
      { name: 'Santa Barbara', lat: 34.4208, lng: -119.6982, duration_min: 240, category: 'city' },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, duration_min: 300, category: 'city' }
    ]
  },
  {
    slug: 'yosemite-weekend-3-days',
    title: 'Yosemite Weekend — 3 days',
    seo_description: 'Yosemite Valley in 3 days: Tunnel View sunrise, Glacier Point sunset, Half Dome basin walk and the Mist Trail. Includes booking tips and offline map coverage.',
    seo_keywords: ['yosemite 3 days itinerary', 'yosemite weekend trip', 'glacier point tunnel view', 'yosemite mist trail'],
    origin_city: 'Yosemite Valley',
    destination_city: 'Yosemite Valley',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=1200&q=80',
    stops: [
      { name: 'Tunnel View', lat: 37.7154, lng: -119.6773, duration_min: 60, category: 'nature' },
      { name: 'Yosemite Valley (Half Dome view)', lat: 37.7456, lng: -119.5936, duration_min: 300, category: 'nature' },
      { name: 'Bridalveil Fall', lat: 37.7169, lng: -119.6469, duration_min: 60, category: 'nature' },
      { name: 'Glacier Point', lat: 37.7274, lng: -119.5735, duration_min: 120, category: 'nature' },
      { name: 'Mariposa Grove of Giant Sequoias', lat: 37.5087, lng: -119.6076, duration_min: 240, category: 'nature' }
    ]
  },
  {
    slug: 'death-valley-vegas-4-days',
    title: 'Death Valley + Las Vegas — 4 days',
    seo_description: 'Otherworldly 4-day loop: Zabriskie Point sunrise, Badwater salt flats, Artist Palette drive, then unwind on the Las Vegas Strip. Avoid summer (>50°C).',
    seo_keywords: ['death valley itinerary 4 days', 'death valley las vegas trip', 'zabriskie badwater artist palette', 'california nevada road trip'],
    origin_city: 'Death Valley',
    destination_city: 'Las Vegas',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=1200&q=80',
    stops: [
      { name: 'Zabriskie Point', lat: 36.4200, lng: -116.8114, duration_min: 90, category: 'nature' },
      { name: 'Badwater Basin', lat: 36.2298, lng: -116.7669, duration_min: 60, category: 'nature' },
      { name: 'Artist\'s Palette', lat: 36.3610, lng: -116.7893, duration_min: 60, category: 'nature' },
      { name: 'Dante\'s View', lat: 36.2201, lng: -116.7275, duration_min: 45, category: 'nature' },
      { name: 'Las Vegas Strip', lat: 36.1147, lng: -115.1728, duration_min: 480, category: 'city' }
    ]
  },
  {
    slug: 'grand-california-loop-14-days',
    title: 'The Grand California Loop — 14 days',
    seo_description: 'The ultimate 14-day California road trip: LA → San Diego → Joshua Tree → Vegas → Yosemite → San Francisco → Big Sur → back to LA. The trip you actually flew here for.',
    seo_keywords: ['california 14 day road trip', 'grand california loop', 'ultimate california itinerary', 'california 2 week trip'],
    origin_city: 'Los Angeles',
    destination_city: 'Los Angeles',
    days_count: 14,
    hero_image_url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80',
    stops: [
      { name: 'Los Angeles (start)', lat: 34.0522, lng: -118.2437, duration_min: 480, category: 'city' },
      { name: 'San Diego', lat: 32.7157, lng: -117.1611, duration_min: 720, category: 'city' },
      { name: 'Joshua Tree National Park', lat: 33.8734, lng: -115.9010, duration_min: 480, category: 'nature' },
      { name: 'Las Vegas', lat: 36.1147, lng: -115.1728, duration_min: 720, category: 'city' },
      { name: 'Death Valley (Zabriskie Point)', lat: 36.4200, lng: -116.8114, duration_min: 240, category: 'nature' },
      { name: 'Yosemite Valley', lat: 37.7456, lng: -119.5936, duration_min: 720, category: 'nature' },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194, duration_min: 720, category: 'city' },
      { name: 'Napa Valley', lat: 38.5025, lng: -122.2654, duration_min: 360, category: 'food' },
      { name: 'Monterey', lat: 36.6002, lng: -121.8947, duration_min: 240, category: 'city' },
      { name: 'Big Sur (Bixby Bridge)', lat: 36.3717, lng: -121.9027, duration_min: 180, category: 'nature' },
      { name: 'Hearst Castle', lat: 35.6852, lng: -121.1683, duration_min: 180, category: 'attraction' },
      { name: 'Santa Barbara', lat: 34.4208, lng: -119.6982, duration_min: 300, category: 'city' },
      { name: 'Los Angeles (end)', lat: 34.0522, lng: -118.2437, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'napa-sonoma-wine-weekend',
    title: 'Napa & Sonoma Wine Weekend — 3 days',
    seo_description: 'A romantic 3-day wine country escape from San Francisco: 3 Napa wineries, Sonoma Plaza, Muir Woods redwoods and Silverado Trail sunset drive.',
    seo_keywords: ['napa sonoma weekend', 'wine country 3 days', 'san francisco to napa itinerary', 'silverado trail scenic route'],
    origin_city: 'San Francisco',
    destination_city: 'Sonoma',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
    stops: [
      { name: 'Muir Woods National Monument', lat: 37.8917, lng: -122.5717, duration_min: 120, category: 'nature' },
      { name: 'Napa (Downtown)', lat: 38.2975, lng: -122.2869, duration_min: 240, category: 'city' },
      { name: 'Castello di Amorosa', lat: 38.5701, lng: -122.5442, duration_min: 180, category: 'food' },
      { name: 'Silverado Trail (Calistoga)', lat: 38.5788, lng: -122.5794, duration_min: 90, category: 'food' },
      { name: 'Sonoma Plaza', lat: 38.2913, lng: -122.4581, duration_min: 240, category: 'food' }
    ]
  }
];
