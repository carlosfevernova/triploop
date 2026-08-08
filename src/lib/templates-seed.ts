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

export type Region = 'california' | 'nevada' | 'arizona' | 'southwest' | 'utah' | 'spain';

export interface SeedTemplate {
  slug: string;                // URL: /california/san-francisco-classic-5-days
  region: Region;
  title: string;
  seo_description: string;
  seo_keywords: string[];
  origin_city: string;
  destination_city: string;
  days_count: number;
  hero_image_url: string;      // Unsplash direct URLs (comercial OK)
  stops: SeedStop[];
}

export const REGION_META: Record<Region, {
  slug: string; name_en: string; name_es: string;
  tagline_en: string; tagline_es: string;
  hero_image: string;
}> = {
  california: {
    slug: 'california', name_en: 'California', name_es: 'California',
    tagline_en: 'PCH, Yosemite, Napa and everything in between.',
    tagline_es: 'PCH, Yosemite, Napa y todo lo demás.',
    hero_image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80'
  },
  nevada: {
    slug: 'nevada', name_en: 'Nevada', name_es: 'Nevada',
    tagline_en: 'Las Vegas, Lake Tahoe, Reno and the loneliest highway in America.',
    tagline_es: 'Las Vegas, Lake Tahoe, Reno y la carretera más solitaria de USA.',
    hero_image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1200&q=80'
  },
  arizona: {
    slug: 'arizona', name_en: 'Arizona', name_es: 'Arizona',
    tagline_en: 'Grand Canyon, Sedona, Antelope Canyon and the Sonoran desert.',
    tagline_es: 'Grand Canyon, Sedona, Antelope Canyon y el desierto de Sonora.',
    hero_image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80'
  },
  southwest: {
    slug: 'southwest', name_en: 'US Southwest', name_es: 'Suroeste USA',
    tagline_en: 'Multi-state Grand Circle: 5 states, 8 national parks, one epic loop.',
    tagline_es: 'Gran Circuito multi-estado: 5 estados, 8 parques nacionales, un solo viaje épico.',
    hero_image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&q=80'
  },
  utah: {
    slug: 'utah', name_en: 'Utah', name_es: 'Utah',
    tagline_en: 'Zion, Bryce, Arches — the Mighty 5 and Utah\'s red rock playground.',
    tagline_es: 'Zion, Bryce, Arches — los Mighty 5 y el patio de recreo de rocas rojas de Utah.',
    hero_image: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=1200&q=80'
  },
  spain: {
    slug: 'spain', name_en: 'Spain', name_es: 'España',
    tagline_en: 'Madrid, Barcelona, Andalucía, and the Camino de Santiago — tapas + history + coast.',
    tagline_es: 'Madrid, Barcelona, Andalucía y el Camino de Santiago — tapas, historia y costa.',
    hero_image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80'
  }
};

export const CALIFORNIA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'san-francisco-classic-5-days',
    region: 'california',
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
    region: 'california',
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
    region: 'california',
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
    region: 'california',
    title: 'Pacific Coast Highway — 5 days',
    seo_description: 'The definitive PCH road trip: San Francisco to Los Angeles via Monterey, Big Sur, Hearst Castle and Santa Barbara. 5 days of the most photographed coastline in America.',
    seo_keywords: ['pacific coast highway road trip', 'pch itinerary 5 days', 'big sur monterey santa barbara', 'california coast drive'],
    origin_city: 'San Francisco',
    destination_city: 'Los Angeles',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?w=1200&q=80',
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
    region: 'california',
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
    region: 'california',
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
    region: 'california',
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
    region: 'california',
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

// ══════════════════════════════════════════
// NEVADA
// ══════════════════════════════════════════
export const NEVADA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'las-vegas-weekend-3-days',
    region: 'nevada',
    title: 'Las Vegas Weekend — 3 days',
    seo_description: 'The definitive 3-day Vegas trip: Strip icons at night, Fremont Street Old Vegas, Red Rock Canyon morning drive and a day at Hoover Dam. Practical for first-timers.',
    seo_keywords: ['las vegas 3 day itinerary', 'vegas weekend trip', 'red rock canyon hoover dam', 'first time las vegas'],
    origin_city: 'Las Vegas',
    destination_city: 'Hoover Dam',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1200&q=80',
    stops: [
      { name: 'Las Vegas Strip (Bellagio)', lat: 36.1129, lng: -115.1767, duration_min: 240, category: 'city' },
      { name: 'Fremont Street Experience', lat: 36.1707, lng: -115.1443, duration_min: 180, category: 'attraction' },
      { name: 'Red Rock Canyon Scenic Loop', lat: 36.1358, lng: -115.4270, duration_min: 240, category: 'nature' },
      { name: 'Hoover Dam', lat: 36.0161, lng: -114.7377, duration_min: 180, category: 'attraction' },
      { name: 'Neon Museum (Boneyard)', lat: 36.1830, lng: -115.1330, duration_min: 90, category: 'attraction' }
    ]
  },
  {
    slug: 'lake-tahoe-weekend-4-days',
    region: 'nevada',
    title: 'Lake Tahoe — 4 days',
    seo_description: 'A 4-day Lake Tahoe getaway on both sides of the border: Emerald Bay overlook, Sand Harbor beach, Heavenly Gondola and a scenic drive around the lake.',
    seo_keywords: ['lake tahoe 4 days itinerary', 'tahoe road trip', 'emerald bay sand harbor', 'heavenly gondola south lake'],
    origin_city: 'South Lake Tahoe',
    destination_city: 'Incline Village',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1523057530100-383d7fbc77a1?w=1200&q=80',
    stops: [
      { name: 'Emerald Bay State Park', lat: 38.9539, lng: -120.1055, duration_min: 180, category: 'nature' },
      { name: 'Heavenly Gondola', lat: 38.9548, lng: -119.9407, duration_min: 240, category: 'attraction' },
      { name: 'Sand Harbor Beach', lat: 39.1978, lng: -119.9317, duration_min: 240, category: 'nature' },
      { name: 'Cave Rock', lat: 39.0526, lng: -119.9491, duration_min: 60, category: 'nature' },
      { name: 'Incline Village', lat: 39.2508, lng: -119.9718, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'nevada-loop-vegas-reno-7-days',
    region: 'nevada',
    title: 'Nevada Loop: Vegas → Reno — 7 days',
    seo_description: 'A 7-day Nevada road trip covering Vegas, the loneliest highway in America (Highway 50), Great Basin National Park, Virginia City ghost mining town and Reno.',
    seo_keywords: ['nevada road trip 7 days', 'highway 50 loneliest road', 'great basin national park', 'reno virginia city'],
    origin_city: 'Las Vegas',
    destination_city: 'Reno',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=1200&q=80',
    stops: [
      { name: 'Las Vegas', lat: 36.1147, lng: -115.1728, duration_min: 480, category: 'city' },
      { name: 'Valley of Fire State Park', lat: 36.4297, lng: -114.5230, duration_min: 240, category: 'nature' },
      { name: 'Great Basin National Park', lat: 38.9833, lng: -114.3000, duration_min: 480, category: 'nature' },
      { name: 'Highway 50 (Loneliest Road)', lat: 39.4600, lng: -117.4600, duration_min: 300, category: 'attraction' },
      { name: 'Virginia City', lat: 39.3097, lng: -119.6494, duration_min: 240, category: 'attraction' },
      { name: 'Reno', lat: 39.5296, lng: -119.8138, duration_min: 300, category: 'city' }
    ]
  }
];

// ══════════════════════════════════════════
// ARIZONA
// ══════════════════════════════════════════
export const ARIZONA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'grand-canyon-weekend-3-days',
    region: 'arizona',
    title: 'Grand Canyon Weekend — 3 days',
    seo_description: 'A perfectly-paced 3-day Grand Canyon trip: South Rim highlights, sunset at Hopi Point, Bright Angel Trail (rim), and a day trip to Sedona red rocks.',
    seo_keywords: ['grand canyon 3 day itinerary', 'grand canyon south rim weekend', 'bright angel trail hopi point', 'first time grand canyon'],
    origin_city: 'Grand Canyon Village',
    destination_city: 'Sedona',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
    stops: [
      { name: 'Grand Canyon Village (South Rim)', lat: 36.0544, lng: -112.1401, duration_min: 300, category: 'nature' },
      { name: 'Hopi Point (sunset)', lat: 36.0700, lng: -112.1478, duration_min: 90, category: 'nature' },
      { name: 'Desert View Watchtower', lat: 36.0439, lng: -111.8256, duration_min: 90, category: 'attraction' },
      { name: 'Bright Angel Trail (rim walk)', lat: 36.0570, lng: -112.1428, duration_min: 180, category: 'nature' },
      { name: 'Sedona (Cathedral Rock)', lat: 34.8225, lng: -111.7908, duration_min: 240, category: 'nature' }
    ]
  },
  {
    slug: 'sedona-flagstaff-4-days',
    region: 'arizona',
    title: 'Sedona & Flagstaff — 4 days',
    seo_description: 'A 4-day Northern Arizona escape: Sedona red rock hikes, Devil\'s Bridge, Slide Rock State Park, Oak Creek Canyon scenic drive and Flagstaff historic downtown.',
    seo_keywords: ['sedona flagstaff 4 days', 'sedona red rocks itinerary', 'devils bridge oak creek', 'flagstaff arizona weekend'],
    origin_city: 'Sedona',
    destination_city: 'Flagstaff',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&q=80',
    stops: [
      { name: 'Cathedral Rock (Sedona)', lat: 34.8225, lng: -111.7908, duration_min: 180, category: 'nature' },
      { name: "Devil's Bridge Trail", lat: 34.9017, lng: -111.8115, duration_min: 240, category: 'nature' },
      { name: 'Slide Rock State Park', lat: 34.9451, lng: -111.7529, duration_min: 180, category: 'nature' },
      { name: 'Oak Creek Canyon Scenic Drive', lat: 35.0300, lng: -111.7300, duration_min: 120, category: 'nature' },
      { name: 'Flagstaff Historic Downtown', lat: 35.1983, lng: -111.6513, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'arizona-highlights-5-days',
    region: 'arizona',
    title: 'Arizona Highlights — 5 days',
    seo_description: '5 days across Arizona\'s greatest hits: Antelope Canyon, Horseshoe Bend, Monument Valley, Grand Canyon and Sedona. Includes Navajo Nation booking tips.',
    seo_keywords: ['arizona 5 day road trip', 'antelope canyon horseshoe bend', 'monument valley grand canyon sedona', 'northern arizona itinerary'],
    origin_city: 'Page',
    destination_city: 'Sedona',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80',
    stops: [
      { name: 'Antelope Canyon (Upper)', lat: 36.8619, lng: -111.3743, duration_min: 90, category: 'nature' },
      { name: 'Horseshoe Bend', lat: 36.8791, lng: -111.5104, duration_min: 90, category: 'nature' },
      { name: 'Monument Valley', lat: 36.9980, lng: -110.0985, duration_min: 300, category: 'nature' },
      { name: 'Grand Canyon (South Rim)', lat: 36.0544, lng: -112.1401, duration_min: 480, category: 'nature' },
      { name: 'Sedona (Cathedral Rock)', lat: 34.8225, lng: -111.7908, duration_min: 300, category: 'nature' }
    ]
  }
];

// ══════════════════════════════════════════
// SOUTHWEST MULTI-STATE (Grand Circle)
// ══════════════════════════════════════════
export const SOUTHWEST_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'us-southwest-grand-circle-10-days',
    region: 'southwest',
    title: 'US Southwest Grand Circle — 10 days',
    seo_description: 'The legendary 10-day Grand Circle loop from Las Vegas: Zion, Bryce, Antelope Canyon, Monument Valley, Grand Canyon, Sedona. 5 states, 8 national parks, one road trip.',
    seo_keywords: ['grand circle 10 day itinerary', 'southwest usa road trip', 'zion bryce grand canyon loop', '5 states national parks'],
    origin_city: 'Las Vegas',
    destination_city: 'Las Vegas',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&q=80',
    stops: [
      { name: 'Las Vegas', lat: 36.1147, lng: -115.1728, duration_min: 480, category: 'city' },
      { name: 'Zion National Park', lat: 37.2982, lng: -113.0263, duration_min: 720, category: 'nature' },
      { name: 'Bryce Canyon National Park', lat: 37.5930, lng: -112.1871, duration_min: 480, category: 'nature' },
      { name: 'Antelope Canyon (Page, AZ)', lat: 36.8619, lng: -111.3743, duration_min: 180, category: 'nature' },
      { name: 'Horseshoe Bend', lat: 36.8791, lng: -111.5104, duration_min: 90, category: 'nature' },
      { name: 'Monument Valley', lat: 36.9980, lng: -110.0985, duration_min: 480, category: 'nature' },
      { name: 'Grand Canyon (South Rim)', lat: 36.0544, lng: -112.1401, duration_min: 720, category: 'nature' },
      { name: 'Sedona', lat: 34.8697, lng: -111.7610, duration_min: 480, category: 'nature' },
      { name: 'Las Vegas (return)', lat: 36.1147, lng: -115.1728, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'route-66-classic-14-days',
    region: 'southwest',
    title: 'Route 66 Classic — 14 days',
    seo_description: 'The classic 14-day Route 66 road trip Chicago to Santa Monica across 8 states: Cadillac Ranch, Meteor Crater, Painted Desert, Petrified Forest and ends at the PCH.',
    seo_keywords: ['route 66 road trip 14 days', 'chicago to santa monica', 'cadillac ranch meteor crater', 'historic route 66 itinerary'],
    origin_city: 'Chicago',
    destination_city: 'Santa Monica',
    days_count: 14,
    hero_image_url: 'https://images.unsplash.com/photo-1508361727343-ca787442dcd7?w=1200&q=80',
    stops: [
      { name: 'Chicago (Route 66 Sign)', lat: 41.8781, lng: -87.6298, duration_min: 480, category: 'city' },
      { name: 'St. Louis (Gateway Arch)', lat: 38.6247, lng: -90.1848, duration_min: 300, category: 'attraction' },
      { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164, duration_min: 300, category: 'city' },
      { name: 'Cadillac Ranch (Amarillo TX)', lat: 35.1872, lng: -101.9871, duration_min: 60, category: 'attraction' },
      { name: 'Santa Fe (NM)', lat: 35.6870, lng: -105.9378, duration_min: 480, category: 'city' },
      { name: 'Petrified Forest National Park', lat: 34.9099, lng: -109.8068, duration_min: 240, category: 'nature' },
      { name: 'Meteor Crater (AZ)', lat: 35.0273, lng: -111.0225, duration_min: 90, category: 'attraction' },
      { name: 'Grand Canyon (South Rim)', lat: 36.0544, lng: -112.1401, duration_min: 480, category: 'nature' },
      { name: 'Las Vegas', lat: 36.1147, lng: -115.1728, duration_min: 480, category: 'city' },
      { name: 'Santa Monica Pier', lat: 34.0100, lng: -118.4962, duration_min: 240, category: 'attraction' }
    ]
  }
];

// ══════════════════════════════════════════
// UTAH
// ══════════════════════════════════════════
export const UTAH_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'zion-national-park-3-days',
    region: 'utah',
    title: 'Zion National Park — 3 days',
    seo_description: '3-day Zion trip from Las Vegas: Angels Landing (permit required 2026), The Narrows wade, Emerald Pools + Watchman sunset. Springdale lodging + shuttle logistics.',
    seo_keywords: ['zion 3 day itinerary', 'zion national park weekend', 'angels landing narrows', 'zion from vegas'],
    origin_city: 'Springdale',
    destination_city: 'Springdale',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=1200&q=80',
    stops: [
      { name: 'Zion Canyon Visitor Center', lat: 37.2003, lng: -112.9871, duration_min: 60, category: 'nature' },
      { name: 'Angels Landing (permit req)', lat: 37.2694, lng: -112.9500, duration_min: 300, category: 'nature' },
      { name: 'The Narrows (Riverside Walk)', lat: 37.2856, lng: -112.9469, duration_min: 240, category: 'nature' },
      { name: 'Emerald Pools Trail', lat: 37.2515, lng: -112.9645, duration_min: 150, category: 'nature' },
      { name: 'Watchman Overlook (sunset)', lat: 37.1988, lng: -112.9856, duration_min: 60, category: 'nature' }
    ]
  },
  {
    slug: 'bryce-canyon-weekend-3-days',
    region: 'utah',
    title: 'Bryce Canyon Weekend — 3 days',
    seo_description: '3 days at Bryce Canyon: sunrise Bryce Point (essential), Navajo/Queens Garden Loop, Rainbow Point drive and stargazing (Dark Sky Park). Best May-Oct.',
    seo_keywords: ['bryce canyon 3 day trip', 'bryce canyon sunrise', 'navajo queens garden loop', 'bryce canyon stargazing'],
    origin_city: 'Bryce Canyon City',
    destination_city: 'Bryce Canyon City',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=1200&q=80',
    stops: [
      { name: 'Bryce Point (sunrise)', lat: 37.6047, lng: -112.1553, duration_min: 90, category: 'nature' },
      { name: 'Navajo/Queens Garden Loop', lat: 37.6285, lng: -112.1671, duration_min: 240, category: 'nature' },
      { name: 'Sunset Point', lat: 37.6237, lng: -112.1642, duration_min: 60, category: 'nature' },
      { name: 'Rainbow Point Scenic Drive', lat: 37.4756, lng: -112.2437, duration_min: 180, category: 'nature' },
      { name: 'Inspiration Point (stargazing)', lat: 37.6118, lng: -112.1615, duration_min: 120, category: 'nature' }
    ]
  },
  {
    slug: 'utah-mighty-5-national-parks-10-days',
    region: 'utah',
    title: 'Utah Mighty 5 — 10 days',
    seo_description: 'The definitive 10-day Utah National Parks road trip: Zion → Bryce → Capitol Reef → Arches → Canyonlands. All 5 mighty parks with real driving times.',
    seo_keywords: ['utah mighty 5 road trip', 'utah national parks 10 days', 'zion bryce arches canyonlands capitol reef', 'utah parks itinerary'],
    origin_city: 'Las Vegas',
    destination_city: 'Moab',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=1200&q=80',
    stops: [
      { name: 'Las Vegas', lat: 36.1147, lng: -115.1728, duration_min: 240, category: 'city' },
      { name: 'Zion National Park', lat: 37.2982, lng: -113.0263, duration_min: 720, category: 'nature' },
      { name: 'Bryce Canyon National Park', lat: 37.5930, lng: -112.1871, duration_min: 480, category: 'nature' },
      { name: 'Capitol Reef National Park', lat: 38.3667, lng: -111.2615, duration_min: 480, category: 'nature' },
      { name: 'Arches National Park (Delicate Arch)', lat: 38.7331, lng: -109.5925, duration_min: 480, category: 'nature' },
      { name: 'Canyonlands (Island in the Sky)', lat: 38.3269, lng: -109.8783, duration_min: 480, category: 'nature' },
      { name: 'Moab', lat: 38.5733, lng: -109.5498, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'salt-lake-park-city-weekend-3-days',
    region: 'utah',
    title: 'Salt Lake + Park City Weekend — 3 days',
    seo_description: 'City escape 3-day trip: Temple Square, Bonneville Salt Flats drive, Park City Main Street, and Deer Valley/Empire Pass scenic drive. Perfect winter ski add-on.',
    seo_keywords: ['salt lake city 3 days', 'park city weekend', 'temple square bonneville salt flats', 'utah city break'],
    origin_city: 'Salt Lake City',
    destination_city: 'Park City',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1518533954129-7774297db60a?w=1200&q=80',
    stops: [
      { name: 'Temple Square', lat: 40.7708, lng: -111.8910, duration_min: 120, category: 'attraction' },
      { name: 'Utah State Capitol', lat: 40.7772, lng: -111.8879, duration_min: 60, category: 'attraction' },
      { name: 'Bonneville Salt Flats', lat: 40.7500, lng: -113.8500, duration_min: 180, category: 'nature' },
      { name: 'Park City Historic Main Street', lat: 40.6461, lng: -111.4980, duration_min: 240, category: 'city' },
      { name: 'Empire Pass Scenic Drive', lat: 40.5983, lng: -111.4869, duration_min: 120, category: 'nature' }
    ]
  }
];

// ══════════════════════════════════════════
// ESPAÑA (primera región europea)
// ══════════════════════════════════════════
export const SPAIN_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'madrid-escapada-fin-de-semana-3-days',
    region: 'spain',
    title: 'Madrid Weekend Escape — 3 days',
    seo_description: '3 days from Madrid with day trips to Toledo and Segovia: Prado, Plaza Mayor, Retiro, Toledo old town + Segovia Alcázar. Practical for first-time visitors.',
    seo_keywords: ['madrid 3 day itinerary', 'madrid weekend trip', 'madrid toledo segovia day trip', 'first time madrid'],
    origin_city: 'Madrid',
    destination_city: 'Madrid',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80',
    stops: [
      { name: 'Plaza Mayor + Puerta del Sol', lat: 40.4155, lng: -3.7074, duration_min: 120, category: 'city' },
      { name: 'Museo del Prado', lat: 40.4138, lng: -3.6921, duration_min: 240, category: 'attraction' },
      { name: 'Parque del Retiro', lat: 40.4152, lng: -3.6844, duration_min: 180, category: 'nature' },
      { name: 'Toledo (Casco Histórico)', lat: 39.8628, lng: -4.0273, duration_min: 360, category: 'city' },
      { name: 'Segovia (Alcázar + Acueducto)', lat: 40.9420, lng: -4.1088, duration_min: 300, category: 'attraction' }
    ]
  },
  {
    slug: 'barcelona-modernista-3-days',
    region: 'spain',
    title: 'Barcelona Modernista — 3 days',
    seo_description: '3 days in Barcelona: Sagrada Família (book weeks ahead), Park Güell, Gothic Quarter tapas, Montserrat mountain and Sitges coastal escape. Ready for the Gaudí lover.',
    seo_keywords: ['barcelona 3 day itinerary', 'barcelona sagrada familia park guell', 'gaudi barcelona weekend', 'barcelona montserrat sitges'],
    origin_city: 'Barcelona',
    destination_city: 'Sitges',
    days_count: 3,
    hero_image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
    stops: [
      { name: 'Sagrada Família', lat: 41.4036, lng: 2.1744, duration_min: 180, category: 'attraction' },
      { name: 'Park Güell', lat: 41.4145, lng: 2.1527, duration_min: 180, category: 'attraction' },
      { name: 'Barrio Gótico + Rambla', lat: 41.3833, lng: 2.1770, duration_min: 240, category: 'city' },
      { name: 'La Boqueria (tapas)', lat: 41.3820, lng: 2.1717, duration_min: 120, category: 'food' },
      { name: 'Montserrat', lat: 41.5921, lng: 1.8375, duration_min: 300, category: 'nature' },
      { name: 'Sitges', lat: 41.2374, lng: 1.8058, duration_min: 240, category: 'city' }
    ]
  },
  {
    slug: 'andalucia-grand-tour-7-days',
    region: 'spain',
    title: 'Andalucía Grand Tour — 7 days',
    seo_description: '7-day Andalusia road trip: Sevilla flamenco + Alcázar, Córdoba Mezquita, Granada Alhambra (book 3 months ahead), Ronda cliff bridge, Málaga beach finale.',
    seo_keywords: ['andalucia 7 day road trip', 'sevilla cordoba granada malaga', 'alhambra granada itinerary', 'andalucia southern spain trip'],
    origin_city: 'Sevilla',
    destination_city: 'Málaga',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80',
    stops: [
      { name: 'Sevilla (Alcázar + Catedral)', lat: 37.3826, lng: -5.9922, duration_min: 480, category: 'city' },
      { name: 'Córdoba (Mezquita)', lat: 37.8794, lng: -4.7793, duration_min: 300, category: 'attraction' },
      { name: 'Granada (Alhambra)', lat: 37.1773, lng: -3.5986, duration_min: 480, category: 'attraction' },
      { name: 'Nerja (Balcón de Europa)', lat: 36.7500, lng: -3.8770, duration_min: 240, category: 'city' },
      { name: 'Ronda (Puente Nuevo)', lat: 36.7422, lng: -5.1668, duration_min: 300, category: 'attraction' },
      { name: 'Marbella / Puerto Banús', lat: 36.5099, lng: -4.8850, duration_min: 240, category: 'city' },
      { name: 'Málaga (Alcazaba + Playa)', lat: 36.7213, lng: -4.4213, duration_min: 360, category: 'city' }
    ]
  },
  {
    slug: 'camino-santiago-highlights-10-days',
    region: 'spain',
    title: 'Camino de Santiago Highlights — 10 days',
    seo_description: '10-day drive along the Camino Francés from Pamplona to Santiago: Burgos cathedral, León Gothic, El Bierzo wine, Portomarín and Santiago finale. Perfect first Camino intro.',
    seo_keywords: ['camino de santiago 10 days road trip', 'camino frances driving itinerary', 'pamplona to santiago compostela', 'camino santiago highlights'],
    origin_city: 'Pamplona',
    destination_city: 'Santiago de Compostela',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
    stops: [
      { name: 'Pamplona', lat: 42.8125, lng: -1.6458, duration_min: 300, category: 'city' },
      { name: 'Logroño (La Rioja)', lat: 42.4650, lng: -2.4456, duration_min: 240, category: 'food' },
      { name: 'Burgos (Catedral)', lat: 42.3400, lng: -3.7040, duration_min: 300, category: 'attraction' },
      { name: 'León (Catedral Gótica)', lat: 42.5987, lng: -5.5671, duration_min: 300, category: 'attraction' },
      { name: 'Ponferrada (Castillo Templario)', lat: 42.5461, lng: -6.5951, duration_min: 240, category: 'attraction' },
      { name: 'O Cebreiro (mirador)', lat: 42.7078, lng: -7.0432, duration_min: 120, category: 'nature' },
      { name: 'Portomarín', lat: 42.8072, lng: -7.6157, duration_min: 180, category: 'city' },
      { name: 'Santiago de Compostela (Catedral)', lat: 42.8806, lng: -8.5449, duration_min: 480, category: 'attraction' }
    ]
  }
];

// Unified export para el seed endpoint
export const ALL_TEMPLATES: SeedTemplate[] = [
  ...CALIFORNIA_TEMPLATES,
  ...NEVADA_TEMPLATES,
  ...ARIZONA_TEMPLATES,
  ...SOUTHWEST_TEMPLATES,
  ...UTAH_TEMPLATES,
  ...SPAIN_TEMPLATES
];
