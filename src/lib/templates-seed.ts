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

export type Region = 'california' | 'nevada' | 'arizona' | 'southwest' | 'utah' | 'spain' | 'pacific-northwest' | 'northeast' | 'southeast' | 'rockies' | 'italy' | 'iceland' | 'ireland' | 'australia' | 'new-zealand' | 'germany' | 'mexico' | 'chile' | 'argentina' | 'peru' | 'japan' | 'canada' | 'scotland' | 'morocco';

export type BestSeason = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round' | 'shoulder';
export type Difficulty = 'easy' | 'moderate' | 'challenging' | 'epic';

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
  highway_notes?: string[];    // "I-90", "US-101", "PCH (Highway 1)" — S27
  best_season?: BestSeason;    // S36: cuándo es mejor hacerlo
  difficulty?: Difficulty;     // S36: exigencia (novato → épica)
  total_distance_km?: number;  // S36: distancia total aproximada
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
  },
  'pacific-northwest': {
    slug: 'pacific-northwest', name_en: 'Pacific Northwest', name_es: 'Pacific Northwest',
    tagline_en: 'Seattle, Portland, Olympic + Mt. Rainier — evergreen coast on I-5 and US-101.',
    tagline_es: 'Seattle, Portland, Olympic y Mt. Rainier — costa siempreverde por I-5 y US-101.',
    hero_image: 'https://images.unsplash.com/photo-1502175353174-a7a1a03b1b7e?w=1200&q=80'
  },
  northeast: {
    slug: 'northeast', name_en: 'Northeast USA', name_es: 'Noreste USA',
    tagline_en: 'New England fall foliage, Boston to Acadia on I-93 and Kancamagus Highway.',
    tagline_es: 'Otoño en New England, Boston a Acadia por I-93 y Kancamagus Highway.',
    hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  },
  southeast: {
    slug: 'southeast', name_en: 'Southeast USA', name_es: 'Sureste USA',
    tagline_en: 'Florida Keys Overseas Highway, Blue Ridge Parkway — beaches + mountains.',
    tagline_es: 'Overseas Highway de los Florida Keys, Blue Ridge Parkway — playas y montañas.',
    hero_image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80'
  },
  rockies: {
    slug: 'rockies', name_en: 'Rocky Mountains', name_es: 'Montañas Rocosas',
    tagline_en: 'Glacier, Yellowstone, Grand Teton — going-to-the-sun on US-2 and I-90.',
    tagline_es: 'Glacier, Yellowstone, Grand Teton — going-to-the-sun por US-2 e I-90.',
    hero_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'
  },
  italy: {
    slug: 'italy', name_en: 'Italy 🇮🇹', name_es: 'Italia 🇮🇹',
    tagline_en: 'Amalfi Coast SS163, Tuscany hills, Cinque Terre — UNESCO scenic drives.',
    tagline_es: 'Costa Amalfitana SS163, colinas de Toscana, Cinque Terre — drives UNESCO.',
    hero_image: 'https://images.unsplash.com/photo-1533904333078-4c0d040e6c22?w=1200&q=80'
  },
  iceland: {
    slug: 'iceland', name_en: 'Iceland 🇮🇸', name_es: 'Islandia 🇮🇸',
    tagline_en: 'Ring Road (Route 1) — 1,322 km · glaciers, waterfalls, volcanoes, black sand.',
    tagline_es: 'Ring Road (Ruta 1) — 1,322 km · glaciares, cascadas, volcanes, playa negra.',
    hero_image: 'https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?w=1200&q=80'
  },
  ireland: {
    slug: 'ireland', name_en: 'Ireland 🇮🇪', name_es: 'Irlanda 🇮🇪',
    tagline_en: 'Ring of Kerry N70 179 km · Wild Atlantic Way · Cliffs of Moher.',
    tagline_es: 'Ring of Kerry N70 179 km · Wild Atlantic Way · Cliffs of Moher.',
    hero_image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200&q=80'
  },
  australia: {
    slug: 'australia', name_en: 'Australia 🇦🇺', name_es: 'Australia 🇦🇺',
    tagline_en: 'Great Ocean Road B100 · Twelve Apostles · Sydney to Melbourne.',
    tagline_es: 'Great Ocean Road B100 · Doce Apóstoles · Sydney a Melbourne.',
    hero_image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80'
  },
  'new-zealand': {
    slug: 'new-zealand', name_en: 'New Zealand 🇳🇿', name_es: 'Nueva Zelanda 🇳🇿',
    tagline_en: 'South Island SH1/SH6 · Milford Sound · Franz Josef Glacier · Queenstown.',
    tagline_es: 'Isla Sur SH1/SH6 · Milford Sound · Glaciar Franz Josef · Queenstown.',
    hero_image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80'
  },
  germany: {
    slug: 'germany', name_en: 'Germany 🇩🇪', name_es: 'Alemania 🇩🇪',
    tagline_en: 'Romantic Road B25 · Bavaria castles · Rothenburg · Neuschwanstein.',
    tagline_es: 'Ruta Romántica B25 · castillos de Baviera · Rothenburg · Neuschwanstein.',
    hero_image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80'
  },
  mexico: {
    slug: 'mexico', name_en: 'Mexico 🇲🇽', name_es: 'México 🇲🇽',
    tagline_en: 'Riviera Maya MEX-307 · Yucatán · Chichén Itzá · Tulum cenotes.',
    tagline_es: 'Riviera Maya MEX-307 · Yucatán · Chichén Itzá · cenotes Tulum.',
    hero_image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80'
  },
  chile: {
    slug: 'chile', name_en: 'Chile 🇨🇱', name_es: 'Chile 🇨🇱',
    tagline_en: 'Carretera Austral Ruta 7 (1,240 km) · Patagonia fjords · glaciers.',
    tagline_es: 'Carretera Austral Ruta 7 (1,240 km) · fiordos Patagonia · glaciares.',
    hero_image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80'
  },
  argentina: {
    slug: 'argentina', name_en: 'Argentina 🇦🇷', name_es: 'Argentina 🇦🇷',
    tagline_en: 'Ruta 40 Patagonia · Bariloche · El Chaltén · Perito Moreno glacier.',
    tagline_es: 'Ruta 40 Patagonia · Bariloche · El Chaltén · glaciar Perito Moreno.',
    hero_image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80'
  },
  peru: {
    slug: 'peru', name_en: 'Peru 🇵🇪', name_es: 'Perú 🇵🇪',
    tagline_en: 'Sacred Valley + Machu Picchu · Cusco Andes loop 320 km.',
    tagline_es: 'Valle Sagrado + Machu Picchu · Cusco Andes loop 320 km.',
    hero_image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80'
  },
  japan: {
    slug: 'japan', name_en: 'Japan 🇯🇵', name_es: 'Japón 🇯🇵',
    tagline_en: 'Golden Route · Tokyo → Mt. Fuji → Kyoto → Osaka on Tokaido corridor.',
    tagline_es: 'Ruta Dorada · Tokio → Monte Fuji → Kioto → Osaka por corredor Tokaido.',
    hero_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80'
  },
  canada: {
    slug: 'canada', name_en: 'Canada 🇨🇦', name_es: 'Canadá 🇨🇦',
    tagline_en: 'Icefields Parkway Hwy 93 · 233 km glaciers · Jasper to Lake Louise.',
    tagline_es: 'Icefields Parkway Hwy 93 · 233 km glaciares · Jasper a Lake Louise.',
    hero_image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80'
  },
  scotland: {
    slug: 'scotland', name_en: 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿', name_es: 'Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    tagline_en: 'North Coast 500 (NC500) · 516 miles Inverness loop · Highlands · lochs.',
    tagline_es: 'North Coast 500 (NC500) · 516 millas loop Inverness · Highlands · lochs.',
    hero_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'
  },
  morocco: {
    slug: 'morocco', name_en: 'Morocco 🇲🇦', name_es: 'Marruecos 🇲🇦',
    tagline_en: 'Marrakech → Atlas Mountains → Sahara Merzouga · N9 + N10 · camels + kasbahs.',
    tagline_es: 'Marrakech → Atlas → Sahara Merzouga · N9 + N10 · camellos + kasbahs.',
    hero_image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80'
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
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 350
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
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 200
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
    ],
    best_season: 'year-round',
    difficulty: 'easy',
    total_distance_km: 150
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
    ],
    best_season: 'shoulder',
    difficulty: 'moderate',
    total_distance_km: 1000
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
    ],
    best_season: 'summer',
    difficulty: 'moderate',
    total_distance_km: 250
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
    ],
    best_season: 'winter',
    difficulty: 'moderate',
    total_distance_km: 600
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
    ],
    best_season: 'shoulder',
    difficulty: 'epic',
    total_distance_km: 2800
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
    ],
    best_season: 'fall',
    difficulty: 'easy',
    total_distance_km: 250
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
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 200
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
    ],
    best_season: 'summer',
    difficulty: 'easy',
    total_distance_km: 250
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
    ],
    best_season: 'shoulder',
    difficulty: 'challenging',
    total_distance_km: 1400
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
    ],
    best_season: 'spring',
    difficulty: 'easy',
    total_distance_km: 250
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
    ],
    best_season: 'spring',
    difficulty: 'easy',
    total_distance_km: 300
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
    ],
    best_season: 'spring',
    difficulty: 'moderate',
    total_distance_km: 900
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
    ],
    best_season: 'spring',
    difficulty: 'challenging',
    total_distance_km: 2200
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
    ],
    best_season: 'shoulder',
    difficulty: 'epic',
    total_distance_km: 3940
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
    ],
    best_season: 'spring',
    difficulty: 'moderate',
    total_distance_km: 200
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
    ],
    best_season: 'shoulder',
    difficulty: 'moderate',
    total_distance_km: 200
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
    ],
    best_season: 'spring',
    difficulty: 'challenging',
    total_distance_km: 1500
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
    ],
    best_season: 'winter',
    difficulty: 'easy',
    total_distance_km: 400
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
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 250
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
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 200
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
    ],
    best_season: 'shoulder',
    difficulty: 'moderate',
    total_distance_km: 900
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
    ],
    best_season: 'shoulder',
    difficulty: 'challenging',
    total_distance_km: 800
  }
];

// S27: 8 nuevas iconic USA routes (post-market-research 2026-08)
export const PACIFIC_NORTHWEST_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'pacific-northwest-loop-7-days',
    region: 'pacific-northwest',
    title: 'Pacific Northwest Loop — 7 days',
    seo_description: 'Seattle, Olympic National Park, Portland and Mt. Rainier — the definitive PNW road trip. I-5 spine + US-101 coast + Mt. Rainier scenic byways.',
    seo_keywords: ['pacific northwest road trip', 'seattle portland itinerary', 'olympic national park route', 'mt rainier trip 7 days'],
    origin_city: 'Seattle',
    destination_city: 'Portland',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1502175353174-a7a1a03b1b7e?w=1200&q=80',
    highway_notes: ['I-5 (Seattle → Portland spine)', 'US-101 (Olympic Peninsula loop)', 'WA-410 (Mt. Rainier scenic byway)'],
    stops: [
      { name: 'Pike Place Market (Seattle)', lat: 47.6089, lng: -122.3406, duration_min: 180, category: 'food' },
      { name: 'Space Needle', lat: 47.6205, lng: -122.3493, duration_min: 120, category: 'attraction' },
      { name: 'Olympic National Park (Hurricane Ridge)', lat: 47.9689, lng: -123.4989, duration_min: 480, category: 'nature' },
      { name: 'Hoh Rainforest', lat: 47.8600, lng: -123.9349, duration_min: 240, category: 'nature' },
      { name: 'Mt. Rainier National Park', lat: 46.8523, lng: -121.7603, duration_min: 480, category: 'nature' },
      { name: 'Portland Pearl District', lat: 45.5289, lng: -122.6846, duration_min: 240, category: 'city' },
      { name: 'Multnomah Falls', lat: 45.5762, lng: -122.1158, duration_min: 90, category: 'nature' }
    ],
    best_season: 'summer',
    difficulty: 'moderate',
    total_distance_km: 1100
  },
  {
    slug: 'oregon-coast-highway-5-days',
    region: 'pacific-northwest',
    title: 'Oregon Coast Highway — 5 days',
    seo_description: 'US-101 from Astoria to Brookings — 363 miles of Oregon coastline. Cannon Beach, Cape Kiwanda, Thors Well and the Oregon Dunes.',
    seo_keywords: ['oregon coast highway', 'us 101 oregon road trip', 'cannon beach itinerary', 'oregon dunes trip'],
    origin_city: 'Astoria',
    destination_city: 'Brookings',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?w=1200&q=80',
    highway_notes: ['US-101 (Oregon Coast Highway — 363 miles)', 'OR-6 (Astoria to Tillamook)'],
    stops: [
      { name: 'Astoria Column', lat: 46.1830, lng: -123.8207, duration_min: 90, category: 'attraction' },
      { name: 'Cannon Beach (Haystack Rock)', lat: 45.8918, lng: -123.9615, duration_min: 180, category: 'nature' },
      { name: 'Cape Kiwanda (Pacific City)', lat: 45.2153, lng: -123.9791, duration_min: 120, category: 'nature' },
      { name: 'Oregon Dunes National Recreation Area', lat: 43.7025, lng: -124.1067, duration_min: 180, category: 'nature' },
      { name: 'Thor\'s Well (Cape Perpetua)', lat: 44.2810, lng: -124.1085, duration_min: 90, category: 'nature' },
      { name: 'Brookings (Samuel H. Boardman)', lat: 42.0526, lng: -124.2843, duration_min: 240, category: 'nature' }
    ],
    best_season: 'summer',
    difficulty: 'moderate',
    total_distance_km: 580
  }
];

export const NORTHEAST_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'new-england-fall-foliage-7-days',
    region: 'northeast',
    title: 'New England Fall Foliage — 7 days',
    seo_description: 'Peak leaf-peeping route: Boston → Vermont → New Hampshire → Maine. I-93 + Kancamagus Highway + Route 100. Best late Sep to mid Oct.',
    seo_keywords: ['new england fall foliage', 'leaf peeping road trip', 'kancamagus highway', 'vermont fall itinerary'],
    origin_city: 'Boston',
    destination_city: 'Acadia National Park',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    highway_notes: ['I-93 (Boston → White Mountains)', 'NH-112 Kancamagus Highway (34.5 mi scenic byway)', 'VT-100 (Vermont spine)', 'US-1 (Maine coast)'],
    stops: [
      { name: 'Boston Common', lat: 42.3554, lng: -71.0656, duration_min: 180, category: 'attraction' },
      { name: 'Woodstock Vermont', lat: 43.6242, lng: -72.5187, duration_min: 240, category: 'city' },
      { name: 'Kancamagus Highway (Sabbaday Falls)', lat: 43.9925, lng: -71.4034, duration_min: 240, category: 'nature' },
      { name: 'Franconia Notch State Park', lat: 44.1585, lng: -71.6811, duration_min: 240, category: 'nature' },
      { name: 'Portland Maine (Old Port)', lat: 43.6591, lng: -70.2568, duration_min: 240, category: 'city' },
      { name: 'Acadia National Park (Cadillac Mountain)', lat: 44.3520, lng: -68.2247, duration_min: 480, category: 'nature' }
    ],
    best_season: 'fall',
    difficulty: 'moderate',
    total_distance_km: 1100
  },
  {
    slug: 'blue-ridge-parkway-5-days',
    region: 'northeast',
    title: 'Blue Ridge Parkway — 5 days',
    seo_description: '469 miles of America\'s favorite drive: Shenandoah NP → Blue Ridge Parkway → Great Smoky Mountains. Speed limit 45mph, no commercial traffic.',
    seo_keywords: ['blue ridge parkway itinerary', 'shenandoah great smokies road trip', 'appalachian scenic drive', 'blue ridge 5 days'],
    origin_city: 'Waynesboro VA',
    destination_city: 'Cherokee NC',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=1200&q=80',
    highway_notes: ['Blue Ridge Parkway (469 mi, 45mph max)', 'Skyline Drive (Shenandoah NP)', 'US-441 (Great Smokies)'],
    stops: [
      { name: 'Shenandoah National Park (Skyline Drive)', lat: 38.5312, lng: -78.3487, duration_min: 480, category: 'nature' },
      { name: 'Peaks of Otter', lat: 37.4477, lng: -79.6039, duration_min: 180, category: 'nature' },
      { name: 'Mabry Mill (Milepost 176)', lat: 36.7521, lng: -80.4028, duration_min: 90, category: 'attraction' },
      { name: 'Asheville NC', lat: 35.5951, lng: -82.5515, duration_min: 480, category: 'city' },
      { name: 'Great Smoky Mountains (Clingmans Dome)', lat: 35.5628, lng: -83.4986, duration_min: 240, category: 'nature' }
    ],
    best_season: 'fall',
    difficulty: 'moderate',
    total_distance_km: 950
  }
];

export const SOUTHEAST_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'florida-keys-overseas-highway-4-days',
    region: 'southeast',
    title: 'Florida Keys Overseas Highway — 4 days',
    seo_description: 'US-1 from Key Largo to Key West — 113 miles over 42 bridges including the iconic Seven Mile Bridge. Snorkel John Pennekamp, kayak Bahia Honda.',
    seo_keywords: ['florida keys road trip', 'overseas highway itinerary', 'seven mile bridge', 'key west 4 days'],
    origin_city: 'Miami',
    destination_city: 'Key West',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1580541631950-7282082b53fe?w=1200&q=80',
    highway_notes: ['US-1 Overseas Highway (113 mi, 42 bridges)', 'Seven Mile Bridge (iconic)', 'MM 0 in Key West'],
    stops: [
      { name: 'John Pennekamp Coral Reef State Park (Key Largo)', lat: 25.1263, lng: -80.4028, duration_min: 240, category: 'nature' },
      { name: 'Islamorada (Robbie\'s Tarpon)', lat: 24.8779, lng: -80.6989, duration_min: 180, category: 'attraction' },
      { name: 'Bahia Honda State Park', lat: 24.6564, lng: -81.2792, duration_min: 240, category: 'nature' },
      { name: 'Seven Mile Bridge', lat: 24.7011, lng: -81.1610, duration_min: 30, category: 'attraction' },
      { name: 'Key West (Mallory Square)', lat: 24.5601, lng: -81.8071, duration_min: 240, category: 'city' },
      { name: 'Ernest Hemingway Home', lat: 24.5510, lng: -81.8009, duration_min: 90, category: 'attraction' }
    ],
    best_season: 'winter',
    difficulty: 'easy',
    total_distance_km: 400
  },
  {
    slug: 'great-river-road-mississippi-10-days',
    region: 'southeast',
    title: 'Great River Road — 10 days',
    seo_description: 'Following the Mississippi from Minneapolis to New Orleans. 3,000 miles across 10 states — blues, jazz, BBQ and paddleboats.',
    seo_keywords: ['great river road', 'mississippi river road trip', 'minneapolis to new orleans', 'blues trail itinerary'],
    origin_city: 'Minneapolis',
    destination_city: 'New Orleans',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=1200&q=80',
    highway_notes: ['Great River Road (National Scenic Byway 3,000 mi)', 'US-61 Blues Highway', 'I-55 (parallel express)'],
    stops: [
      { name: 'Minneapolis (Stone Arch Bridge)', lat: 44.9799, lng: -93.2571, duration_min: 240, category: 'city' },
      { name: 'La Crosse Wisconsin', lat: 43.8014, lng: -91.2396, duration_min: 180, category: 'city' },
      { name: 'St. Louis (Gateway Arch)', lat: 38.6247, lng: -90.1848, duration_min: 240, category: 'attraction' },
      { name: 'Memphis (Beale Street + Sun Studio)', lat: 35.1387, lng: -90.0504, duration_min: 480, category: 'city' },
      { name: 'Vicksburg National Military Park', lat: 32.3517, lng: -90.8479, duration_min: 180, category: 'attraction' },
      { name: 'Natchez Mississippi', lat: 31.5604, lng: -91.4032, duration_min: 240, category: 'city' },
      { name: 'New Orleans French Quarter', lat: 29.9584, lng: -90.0644, duration_min: 480, category: 'city' }
    ],
    best_season: 'fall',
    difficulty: 'epic',
    total_distance_km: 3000
  }
];

export const ROCKIES_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'glacier-yellowstone-teton-8-days',
    region: 'rockies',
    title: 'Glacier · Yellowstone · Grand Teton — 8 days',
    seo_description: 'The 3 crown jewels of the Rockies: Going-to-the-Sun Road in Glacier, Old Faithful in Yellowstone, and the Tetons. US-2 + US-89 + US-191.',
    seo_keywords: ['glacier yellowstone road trip', 'grand teton itinerary', 'going to the sun road', 'rocky mountains 8 days'],
    origin_city: 'Kalispell MT',
    destination_city: 'Jackson WY',
    days_count: 8,
    hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    highway_notes: ['Going-to-the-Sun Road (Glacier NP, closed Nov-May)', 'US-89 (Yellowstone north entrance)', 'US-191 (Yellowstone to Teton)', 'US-2 (Montana east-west)'],
    stops: [
      { name: 'Lake McDonald (Glacier NP)', lat: 48.5820, lng: -113.9260, duration_min: 240, category: 'nature' },
      { name: 'Going-to-the-Sun Road (Logan Pass)', lat: 48.6960, lng: -113.7180, duration_min: 480, category: 'nature' },
      { name: 'Mammoth Hot Springs (Yellowstone)', lat: 44.9776, lng: -110.7008, duration_min: 240, category: 'nature' },
      { name: 'Old Faithful Geyser', lat: 44.4605, lng: -110.8281, duration_min: 180, category: 'nature' },
      { name: 'Grand Canyon of the Yellowstone', lat: 44.7205, lng: -110.4972, duration_min: 240, category: 'nature' },
      { name: 'Grand Teton National Park (Jenny Lake)', lat: 43.7508, lng: -110.7250, duration_min: 480, category: 'nature' },
      { name: 'Jackson WY (Town Square)', lat: 43.4799, lng: -110.7624, duration_min: 240, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'challenging',
    total_distance_km: 1600
  },
  {
    slug: 'colorado-rockies-loop-6-days',
    region: 'rockies',
    title: 'Colorado Rockies Loop — 6 days',
    seo_description: 'Denver → Rocky Mountain NP → Aspen → Great Sand Dunes → Colorado Springs. I-70 mountain corridor + US-24 Independence Pass.',
    seo_keywords: ['colorado road trip', 'rocky mountain national park itinerary', 'aspen independence pass', 'great sand dunes trip'],
    origin_city: 'Denver',
    destination_city: 'Colorado Springs',
    days_count: 6,
    hero_image_url: 'https://images.unsplash.com/photo-1503328427499-d92d1ac3d174?w=1200&q=80',
    highway_notes: ['I-70 (Denver → Vail mountain corridor)', 'US-24 Independence Pass (Aspen, closed winter)', 'Trail Ridge Road (Rocky Mountain NP)', 'US-160 (Great Sand Dunes)'],
    stops: [
      { name: 'Denver Union Station', lat: 39.7527, lng: -105.0011, duration_min: 180, category: 'city' },
      { name: 'Rocky Mountain National Park (Trail Ridge Road)', lat: 40.3856, lng: -105.6836, duration_min: 480, category: 'nature' },
      { name: 'Vail Village', lat: 39.6403, lng: -106.3742, duration_min: 240, category: 'city' },
      { name: 'Aspen (Maroon Bells)', lat: 39.0708, lng: -106.9890, duration_min: 240, category: 'nature' },
      { name: 'Great Sand Dunes National Park', lat: 37.7326, lng: -105.5124, duration_min: 300, category: 'nature' },
      { name: 'Garden of the Gods (Colorado Springs)', lat: 38.8783, lng: -104.8698, duration_min: 180, category: 'nature' }
    ],
    best_season: 'summer',
    difficulty: 'challenging',
    total_distance_km: 1100
  }
];

// S31: 6 templates iconic globales (Europe + Oceania + Iceland)
export const ITALY_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'amalfi-coast-cinque-terre-7-days',
    region: 'italy',
    title: 'Amalfi Coast + Cinque Terre — 7 days',
    seo_description: 'Costiera Amalfitana SS163 (UNESCO 50km) + Cinque Terre + Tuscan hills. Positano, Amalfi, Ravello, Vernazza, Siena in 7 days.',
    seo_keywords: ['amalfi coast itinerary', 'cinque terre road trip', 'italy 7 days', 'costiera amalfitana ss163'],
    origin_city: 'Naples',
    destination_city: 'Florence',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1533904333078-4c0d040e6c22?w=1200&q=80',
    highway_notes: ['SS163 Amalfitana (50km UNESCO)', 'A1/E45 Autostrada del Sole', 'SS1 Aurelia (Liguria coast)'],
    stops: [
      { name: 'Naples (Spaccanapoli)', lat: 40.8518, lng: 14.2681, duration_min: 240, category: 'city' },
      { name: 'Positano', lat: 40.6280, lng: 14.4842, duration_min: 300, category: 'city' },
      { name: 'Amalfi', lat: 40.6340, lng: 14.6028, duration_min: 240, category: 'city' },
      { name: 'Ravello (Villa Cimbrone)', lat: 40.6497, lng: 14.6116, duration_min: 180, category: 'attraction' },
      { name: 'Vernazza (Cinque Terre)', lat: 44.1354, lng: 9.6849, duration_min: 240, category: 'city' },
      { name: 'Manarola (Cinque Terre)', lat: 44.1064, lng: 9.7275, duration_min: 180, category: 'city' },
      { name: 'Florence (Ponte Vecchio)', lat: 43.7679, lng: 11.2531, duration_min: 480, category: 'city' }
    ],
    best_season: 'shoulder',
    difficulty: 'moderate',
    total_distance_km: 800
  }
];

export const ICELAND_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'iceland-ring-road-10-days',
    region: 'iceland',
    title: 'Iceland Ring Road — 10 days',
    seo_description: 'Route 1 completa (1,322 km): Golden Circle, Vík black sand beach, Jökulsárlón glacier lagoon, Mývatn, Akureyri, Snæfellsnes.',
    seo_keywords: ['iceland ring road itinerary', 'route 1 iceland', 'iceland 10 days', 'golden circle jokulsarlon'],
    origin_city: 'Reykjavik',
    destination_city: 'Reykjavik',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?w=1200&q=80',
    highway_notes: ['Route 1 Ring Road (1,322 km around whole country)', 'Route 36 Golden Circle', 'Route 54 Snæfellsnes Peninsula'],
    stops: [
      { name: 'Reykjavik (Hallgrímskirkja)', lat: 64.1466, lng: -21.9426, duration_min: 240, category: 'city' },
      { name: 'Þingvellir National Park', lat: 64.2559, lng: -21.1295, duration_min: 180, category: 'nature' },
      { name: 'Gullfoss Waterfall', lat: 64.3271, lng: -20.1201, duration_min: 90, category: 'nature' },
      { name: 'Geysir Hot Springs', lat: 64.3141, lng: -20.3013, duration_min: 60, category: 'nature' },
      { name: 'Reynisfjara Black Sand Beach (Vík)', lat: 63.4058, lng: -19.0446, duration_min: 120, category: 'nature' },
      { name: 'Jökulsárlón Glacier Lagoon', lat: 64.0764, lng: -16.2306, duration_min: 240, category: 'nature' },
      { name: 'Mývatn Nature Baths', lat: 65.6289, lng: -16.8477, duration_min: 180, category: 'nature' },
      { name: 'Akureyri', lat: 65.6835, lng: -18.1105, duration_min: 240, category: 'city' },
      { name: 'Snæfellsjökull National Park', lat: 64.8080, lng: -23.7772, duration_min: 300, category: 'nature' }
    ],
    best_season: 'summer',
    difficulty: 'challenging',
    total_distance_km: 1322
  }
];

export const IRELAND_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'ireland-ring-of-kerry-5-days',
    region: 'ireland',
    title: 'Ring of Kerry + Wild Atlantic Way — 5 days',
    seo_description: 'Ring of Kerry N70 (179 km) + Cliffs of Moher + Killarney National Park. Charming Irish villages Kenmare, Sneem, Waterville.',
    seo_keywords: ['ring of kerry itinerary', 'wild atlantic way', 'ireland 5 days', 'cliffs of moher road trip'],
    origin_city: 'Killarney',
    destination_city: 'Galway',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200&q=80',
    highway_notes: ['N70 Ring of Kerry (179 km loop)', 'N71 Killarney to Kenmare', 'Wild Atlantic Way (2,500 km coastal)'],
    stops: [
      { name: 'Killarney National Park', lat: 52.0139, lng: -9.5030, duration_min: 480, category: 'nature' },
      { name: 'Muckross House', lat: 52.0247, lng: -9.5044, duration_min: 180, category: 'attraction' },
      { name: 'Kenmare', lat: 51.8807, lng: -9.5836, duration_min: 180, category: 'city' },
      { name: 'Sneem', lat: 51.8371, lng: -9.9017, duration_min: 90, category: 'city' },
      { name: 'Waterville', lat: 51.8262, lng: -10.1741, duration_min: 120, category: 'city' },
      { name: 'Cliffs of Moher', lat: 52.9715, lng: -9.4309, duration_min: 240, category: 'nature' },
      { name: 'Galway (Latin Quarter)', lat: 53.2707, lng: -9.0568, duration_min: 300, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'easy',
    total_distance_km: 400
  }
];

export const AUSTRALIA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'great-ocean-road-4-days',
    region: 'australia',
    title: 'Great Ocean Road — 4 days',
    seo_description: 'B100 Great Ocean Road (243 km): Twelve Apostles, Loch Ard Gorge, Bells Beach, Otway Rainforest. Melbourne → Warrnambool.',
    seo_keywords: ['great ocean road itinerary', 'twelve apostles road trip', 'australia 4 days', 'b100 melbourne warrnambool'],
    origin_city: 'Melbourne',
    destination_city: 'Warrnambool',
    days_count: 4,
    hero_image_url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80',
    highway_notes: ['B100 Great Ocean Road (243 km)', 'A1 Princes Highway (parallel express)', 'C119 Otway scenic'],
    stops: [
      { name: 'Melbourne (Federation Square)', lat: -37.8180, lng: 144.9691, duration_min: 240, category: 'city' },
      { name: 'Bells Beach', lat: -38.3705, lng: 144.2822, duration_min: 90, category: 'nature' },
      { name: 'Lorne', lat: -38.5401, lng: 143.9767, duration_min: 240, category: 'city' },
      { name: 'Great Otway National Park', lat: -38.7853, lng: 143.5000, duration_min: 300, category: 'nature' },
      { name: 'Twelve Apostles', lat: -38.6633, lng: 143.1044, duration_min: 180, category: 'nature' },
      { name: 'Loch Ard Gorge', lat: -38.6467, lng: 143.0733, duration_min: 120, category: 'nature' },
      { name: 'Warrnambool', lat: -38.3823, lng: 142.4844, duration_min: 240, category: 'city' }
    ],
    best_season: 'shoulder',
    difficulty: 'easy',
    total_distance_km: 450
  }
];

export const NEW_ZEALAND_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'new-zealand-south-island-10-days',
    region: 'new-zealand',
    title: 'New Zealand South Island — 10 days',
    seo_description: 'SH1/SH6 Christchurch → Queenstown → Milford Sound → Franz Josef → Nelson. Lord of the Rings landscapes.',
    seo_keywords: ['new zealand south island itinerary', 'milford sound road trip', 'nz 10 days', 'queenstown franz josef'],
    origin_city: 'Christchurch',
    destination_city: 'Christchurch',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    highway_notes: ['SH1 South Island east coast', 'SH6 West Coast + Fiordland', 'SH94 Milford Road (only road to Milford Sound)'],
    stops: [
      { name: 'Christchurch (Botanic Gardens)', lat: -43.5321, lng: 172.6362, duration_min: 240, category: 'city' },
      { name: 'Lake Tekapo (Church of the Good Shepherd)', lat: -44.0055, lng: 170.4805, duration_min: 180, category: 'nature' },
      { name: 'Mount Cook National Park', lat: -43.7346, lng: 170.0955, duration_min: 300, category: 'nature' },
      { name: 'Queenstown (Skyline Gondola)', lat: -45.0312, lng: 168.6626, duration_min: 480, category: 'city' },
      { name: 'Milford Sound', lat: -44.6708, lng: 167.9265, duration_min: 480, category: 'nature' },
      { name: 'Wanaka (That Wanaka Tree)', lat: -44.6976, lng: 169.1470, duration_min: 240, category: 'nature' },
      { name: 'Franz Josef Glacier', lat: -43.4664, lng: 170.1856, duration_min: 300, category: 'nature' },
      { name: 'Nelson (Abel Tasman)', lat: -41.2706, lng: 173.2840, duration_min: 480, category: 'nature' }
    ],
    best_season: 'summer',
    difficulty: 'challenging',
    total_distance_km: 1800
  }
];

export const GERMANY_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'germany-romantic-road-5-days',
    region: 'germany',
    title: 'Germany Romantic Road — 5 days',
    seo_description: 'Romantische Straße (B25, 350 km): Würzburg → Rothenburg ob der Tauber → Nördlingen → Augsburg → Neuschwanstein → Füssen.',
    seo_keywords: ['romantic road germany', 'rothenburg neuschwanstein road trip', 'germany 5 days', 'bavaria castles itinerary'],
    origin_city: 'Würzburg',
    destination_city: 'Füssen',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80',
    highway_notes: ['B25 Romantic Road (350 km Würzburg → Füssen)', 'A7 Autobahn (parallel express)', 'B17 Fürstenweg (Alpine end)'],
    stops: [
      { name: 'Würzburg Residence (UNESCO)', lat: 49.7929, lng: 9.9394, duration_min: 240, category: 'attraction' },
      { name: 'Rothenburg ob der Tauber', lat: 49.3777, lng: 10.1786, duration_min: 480, category: 'city' },
      { name: 'Dinkelsbühl', lat: 49.0708, lng: 10.3167, duration_min: 180, category: 'city' },
      { name: 'Nördlingen (Meteor crater town)', lat: 48.8517, lng: 10.4870, duration_min: 180, category: 'city' },
      { name: 'Augsburg (Fuggerei)', lat: 48.3705, lng: 10.8978, duration_min: 240, category: 'city' },
      { name: 'Neuschwanstein Castle', lat: 47.5576, lng: 10.7498, duration_min: 300, category: 'attraction' },
      { name: 'Füssen Old Town', lat: 47.5720, lng: 10.7015, duration_min: 240, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'easy',
    total_distance_km: 350
  }
];

// S32: 4 iconic LatAm routes (mercado hispanohablante primary market)
export const MEXICO_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'mexico-riviera-maya-yucatan-5-days',
    region: 'mexico',
    title: 'Riviera Maya + Yucatán — 5 days',
    seo_description: 'Cancún → Tulum → cenotes Cobá → Chichén Itzá → Valladolid → Uxmal. MEX-307 costa + MEX-180 Autopista Mérida-Cancún.',
    seo_keywords: ['riviera maya road trip', 'yucatan itinerary', 'chichen itza cenotes', 'mexico 5 days'],
    origin_city: 'Cancún',
    destination_city: 'Mérida',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
    highway_notes: ['MEX-307 Riviera Maya (Cancún → Tulum coast)', 'MEX-180 Autopista Mérida-Cancún', 'MEX-295 Cobá → Valladolid'],
    stops: [
      { name: 'Cancún Hotel Zone', lat: 21.1213, lng: -86.7736, duration_min: 240, category: 'city' },
      { name: 'Playa del Carmen (5th Ave)', lat: 20.6296, lng: -87.0739, duration_min: 240, category: 'city' },
      { name: 'Tulum Ruins', lat: 20.2143, lng: -87.4290, duration_min: 180, category: 'attraction' },
      { name: 'Cenote Dos Ojos', lat: 20.3234, lng: -87.3849, duration_min: 180, category: 'nature' },
      { name: 'Cobá Ruins (Nohoch Mul Pyramid)', lat: 20.4906, lng: -87.7333, duration_min: 240, category: 'attraction' },
      { name: 'Chichén Itzá', lat: 20.6843, lng: -88.5678, duration_min: 300, category: 'attraction' },
      { name: 'Valladolid + Cenote Zací', lat: 20.6900, lng: -88.2020, duration_min: 240, category: 'city' },
      { name: 'Mérida Plaza Grande', lat: 20.9674, lng: -89.6237, duration_min: 300, category: 'city' }
    ],
    best_season: 'winter',
    difficulty: 'moderate',
    total_distance_km: 700
  }
];

export const CHILE_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'chile-carretera-austral-10-days',
    region: 'chile',
    title: 'Carretera Austral Patagonia — 10 days',
    seo_description: 'Ruta 7 completa (1,240 km): Puerto Montt → Chaitén → Puyuhuapi → Coyhaique → Cerro Castillo → Villa O\'Higgins. Fjords, glaciers, ferries.',
    seo_keywords: ['carretera austral itinerary', 'chile patagonia road trip', 'ruta 7 chile', 'coyhaique villa ohiggins'],
    origin_city: 'Puerto Montt',
    destination_city: 'Villa O\'Higgins',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&q=80',
    highway_notes: ['Ruta 7 Carretera Austral (1,240 km semi-paved)', '3 ferries requeridos (Hornopirén-Caleta Gonzalo, Puyuhuapi, Yelcho)', 'Ruta X-25 Cerro Castillo scenic'],
    stops: [
      { name: 'Puerto Montt (Plaza de Armas)', lat: -41.4693, lng: -72.9424, duration_min: 240, category: 'city' },
      { name: 'Parque Pumalín (Chaitén)', lat: -42.9160, lng: -72.7146, duration_min: 480, category: 'nature' },
      { name: 'Puyuhuapi Termas del Ventisquero', lat: -44.3251, lng: -72.5578, duration_min: 240, category: 'nature' },
      { name: 'Parque Nacional Queulat (Ventisquero Colgante)', lat: -44.4838, lng: -72.5445, duration_min: 300, category: 'nature' },
      { name: 'Coyhaique (capital Aysén)', lat: -45.5712, lng: -72.0685, duration_min: 240, category: 'city' },
      { name: 'Cerro Castillo National Park', lat: -46.1000, lng: -72.1500, duration_min: 480, category: 'nature' },
      { name: 'Lago General Carrera (Marble Caves)', lat: -46.6472, lng: -72.6889, duration_min: 300, category: 'nature' },
      { name: 'Villa O\'Higgins (fin del mundo)', lat: -48.4681, lng: -72.5620, duration_min: 240, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'epic',
    total_distance_km: 1500
  }
];

export const ARGENTINA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'argentina-ruta-40-patagonia-10-days',
    region: 'argentina',
    title: 'Argentina Patagonia Ruta 40 — 10 days',
    seo_description: 'Tramo icónico Ruta 40 Patagonia: Bariloche → Ruta 7 Lagos → El Bolsón → Perito Moreno → Los Antiguos → El Chaltén → El Calafate glaciar.',
    seo_keywords: ['ruta 40 patagonia', 'argentina road trip', 'perito moreno glaciar', 'el chalten fitz roy'],
    origin_city: 'Bariloche',
    destination_city: 'El Calafate',
    days_count: 10,
    hero_image_url: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=1200&q=80',
    highway_notes: ['Ruta 40 (5,224 km total — tramo Patagonia)', 'Ruta 7 Camino de los 7 Lagos (Bariloche → San Martín)', 'Ruta Provincial 11 Perito Moreno glaciar'],
    stops: [
      { name: 'San Carlos de Bariloche (Cerro Catedral)', lat: -41.1335, lng: -71.3103, duration_min: 480, category: 'city' },
      { name: 'Ruta de los 7 Lagos (Villa Angostura)', lat: -40.7500, lng: -71.6500, duration_min: 480, category: 'nature' },
      { name: 'San Martín de los Andes', lat: -40.1587, lng: -71.3521, duration_min: 240, category: 'city' },
      { name: 'El Bolsón', lat: -41.9682, lng: -71.5292, duration_min: 240, category: 'city' },
      { name: 'Parque Nacional Los Alerces', lat: -42.9000, lng: -71.7500, duration_min: 360, category: 'nature' },
      { name: 'Perito Moreno Town (Cueva de las Manos)', lat: -46.5867, lng: -70.9268, duration_min: 240, category: 'attraction' },
      { name: 'El Chaltén (Fitz Roy)', lat: -49.3298, lng: -72.8850, duration_min: 480, category: 'nature' },
      { name: 'Perito Moreno Glacier (Los Glaciares NP)', lat: -50.4967, lng: -73.1377, duration_min: 480, category: 'nature' },
      { name: 'El Calafate', lat: -50.3389, lng: -72.2650, duration_min: 240, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'epic',
    total_distance_km: 2000
  }
];

export const PERU_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'peru-sacred-valley-machu-picchu-5-days',
    region: 'peru',
    title: 'Sacred Valley + Machu Picchu — 5 days',
    seo_description: 'Cusco → Pisac → Ollantaytambo → Aguas Calientes → Machu Picchu → Maras Salt Mines → Moray. 320 km Andean loop.',
    seo_keywords: ['sacred valley peru itinerary', 'machu picchu road trip', 'cusco 5 days', 'ollantaytambo pisac'],
    origin_city: 'Cusco',
    destination_city: 'Cusco',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
    highway_notes: ['PE-3S Panamericana Cusco→Puno', 'Ruta 28 G Cusco → Valle Sagrado', 'Peru Rail (Ollantaytambo → Aguas Calientes — no road access to Machu Picchu)'],
    stops: [
      { name: 'Cusco Plaza de Armas', lat: -13.5164, lng: -71.9787, duration_min: 300, category: 'city' },
      { name: 'Saqsaywaman (arriba de Cusco)', lat: -13.5089, lng: -71.9820, duration_min: 180, category: 'attraction' },
      { name: 'Pisac Market + Ruins', lat: -13.4231, lng: -71.8489, duration_min: 240, category: 'attraction' },
      { name: 'Moray (círculos incas)', lat: -13.3298, lng: -72.1936, duration_min: 120, category: 'attraction' },
      { name: 'Maras Salt Mines', lat: -13.3389, lng: -72.1547, duration_min: 120, category: 'attraction' },
      { name: 'Ollantaytambo Fortress', lat: -13.2589, lng: -72.2681, duration_min: 240, category: 'attraction' },
      { name: 'Aguas Calientes (Machu Picchu Pueblo)', lat: -13.1548, lng: -72.5251, duration_min: 240, category: 'city' },
      { name: 'Machu Picchu Citadel', lat: -13.1631, lng: -72.5450, duration_min: 360, category: 'attraction' }
    ],
    best_season: 'shoulder',
    difficulty: 'moderate',
    total_distance_km: 320
  }
];

// S34: 4 iconic routes Asia + Africa + Canada + Scotland (7 continents coverage)
export const JAPAN_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'japan-golden-route-7-days',
    region: 'japan',
    title: 'Japan Golden Route — 7 days',
    seo_description: 'Tokyo → Hakone (Mt. Fuji) → Kyoto → Nara → Osaka. Tokaido corridor 500 km. Bullet train + rental car mix.',
    seo_keywords: ['japan golden route', 'tokyo kyoto itinerary', 'mt fuji hakone road trip', 'japan 7 days'],
    origin_city: 'Tokyo',
    destination_city: 'Osaka',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    highway_notes: ['Tokaido corridor (Tokyo → Osaka 500 km)', 'National Route 1 (scenic drive)', 'Tomei + Meishin Expressway (fast route)', 'Shinkansen bullet train alternative'],
    stops: [
      { name: 'Shibuya Crossing (Tokyo)', lat: 35.6595, lng: 139.7005, duration_min: 300, category: 'city' },
      { name: 'Senso-ji Temple (Asakusa)', lat: 35.7148, lng: 139.7967, duration_min: 180, category: 'attraction' },
      { name: 'Mt. Fuji (Chureito Pagoda view)', lat: 35.4004, lng: 138.7998, duration_min: 240, category: 'nature' },
      { name: 'Hakone Ropeway', lat: 35.2453, lng: 139.0181, duration_min: 240, category: 'nature' },
      { name: 'Kyoto (Fushimi Inari Shrine)', lat: 34.9671, lng: 135.7727, duration_min: 240, category: 'attraction' },
      { name: 'Kinkaku-ji (Golden Pavilion)', lat: 35.0394, lng: 135.7292, duration_min: 120, category: 'attraction' },
      { name: 'Arashiyama Bamboo Grove', lat: 35.0170, lng: 135.6712, duration_min: 180, category: 'nature' },
      { name: 'Nara Park (deer)', lat: 34.6851, lng: 135.8043, duration_min: 240, category: 'attraction' },
      { name: 'Osaka (Dotonbori + Osaka Castle)', lat: 34.6687, lng: 135.5023, duration_min: 300, category: 'city' }
    ],
    best_season: 'spring',
    difficulty: 'moderate',
    total_distance_km: 700
  }
];

export const CANADA_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'canada-icefields-parkway-5-days',
    region: 'canada',
    title: 'Canada Icefields Parkway — 5 days',
    seo_description: 'Highway 93 Jasper → Lake Louise → Banff. 233 km de glaciares, Athabasca Falls, Peyto Lake, Moraine Lake.',
    seo_keywords: ['icefields parkway itinerary', 'canada rockies road trip', 'jasper banff lake louise', 'hwy 93 canada'],
    origin_city: 'Jasper',
    destination_city: 'Banff',
    days_count: 5,
    hero_image_url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
    highway_notes: ['Icefields Parkway Highway 93 (233 km Jasper → Lake Louise)', 'Trans-Canada Highway 1 (Banff → Calgary)', 'Bow Valley Parkway 1A (scenic alternative)'],
    stops: [
      { name: 'Jasper Town (Old Fort Point)', lat: 52.8734, lng: -118.0808, duration_min: 240, category: 'city' },
      { name: 'Maligne Lake + Spirit Island', lat: 52.6996, lng: -117.6428, duration_min: 300, category: 'nature' },
      { name: 'Athabasca Falls', lat: 52.6660, lng: -117.8836, duration_min: 90, category: 'nature' },
      { name: 'Columbia Icefield (Athabasca Glacier)', lat: 52.2153, lng: -117.2340, duration_min: 240, category: 'nature' },
      { name: 'Peyto Lake Viewpoint', lat: 51.7189, lng: -116.5153, duration_min: 90, category: 'nature' },
      { name: 'Bow Lake', lat: 51.6779, lng: -116.4497, duration_min: 90, category: 'nature' },
      { name: 'Lake Louise', lat: 51.4254, lng: -116.1773, duration_min: 240, category: 'nature' },
      { name: 'Moraine Lake', lat: 51.3217, lng: -116.1858, duration_min: 180, category: 'nature' },
      { name: 'Banff Town (Sulphur Mountain)', lat: 51.1784, lng: -115.5708, duration_min: 300, category: 'city' }
    ],
    best_season: 'summer',
    difficulty: 'moderate',
    total_distance_km: 500
  }
];

export const SCOTLAND_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'scotland-north-coast-500-6-days',
    region: 'scotland',
    title: 'Scotland North Coast 500 — 6 days',
    seo_description: 'NC500 loop 516 millas desde Inverness: Applecross Pass, Bealach na Bà, Ullapool, Durness, John O\'Groats. Highlands + lochs.',
    seo_keywords: ['north coast 500 itinerary', 'nc500 scotland road trip', 'scotland highlands 6 days', 'inverness loop'],
    origin_city: 'Inverness',
    destination_city: 'Inverness',
    days_count: 6,
    hero_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    highway_notes: ['North Coast 500 (NC500 - 516 mi loop)', 'A835 Ullapool → Durness west coast', 'A836 north coast', 'Bealach na Bà mountain pass (steep single-track)'],
    stops: [
      { name: 'Inverness Castle', lat: 57.4770, lng: -4.2255, duration_min: 180, category: 'attraction' },
      { name: 'Applecross Pass (Bealach na Bà)', lat: 57.4211, lng: -5.7192, duration_min: 240, category: 'nature' },
      { name: 'Ullapool (Loch Broom)', lat: 57.8977, lng: -5.1610, duration_min: 240, category: 'city' },
      { name: 'Achmelvich Beach', lat: 58.1758, lng: -5.3040, duration_min: 180, category: 'nature' },
      { name: 'Smoo Cave (Durness)', lat: 58.5665, lng: -4.7108, duration_min: 120, category: 'nature' },
      { name: 'John O\'Groats (northern tip)', lat: 58.6373, lng: -3.0700, duration_min: 90, category: 'attraction' },
      { name: 'Dunrobin Castle', lat: 57.9819, lng: -3.9464, duration_min: 180, category: 'attraction' },
      { name: 'Loch Ness (Urquhart Castle)', lat: 57.3241, lng: -4.4425, duration_min: 240, category: 'attraction' }
    ],
    best_season: 'summer',
    difficulty: 'moderate',
    total_distance_km: 830
  }
];

export const MOROCCO_TEMPLATES: SeedTemplate[] = [
  {
    slug: 'morocco-marrakech-sahara-7-days',
    region: 'morocco',
    title: 'Morocco Marrakech to Sahara — 7 days',
    seo_description: 'Marrakech → Ait Ben Haddou → Ouarzazate → Todra Gorge → Merzouga Sahara → Fes. N9 Atlas Mountains + N10 Draa Valley.',
    seo_keywords: ['morocco road trip', 'sahara desert marrakech', 'atlas mountains itinerary', 'merzouga dunes 7 days'],
    origin_city: 'Marrakech',
    destination_city: 'Fes',
    days_count: 7,
    hero_image_url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80',
    highway_notes: ['N9 Marrakech → Ouarzazate (Tizi n\'Tichka pass 2,260m)', 'N10 Ouarzazate → Errachidia (Draa Valley + Dades Gorge)', 'R702 to Merzouga desert entry', 'N13 Erfoud → Fes'],
    stops: [
      { name: 'Marrakech Jemaa el-Fnaa', lat: 31.6258, lng: -7.9891, duration_min: 300, category: 'city' },
      { name: 'Ait Ben Haddou (UNESCO Kasbah)', lat: 31.0472, lng: -7.1319, duration_min: 240, category: 'attraction' },
      { name: 'Ouarzazate (Atlas Studios)', lat: 30.9189, lng: -6.8933, duration_min: 180, category: 'city' },
      { name: 'Dades Gorge', lat: 31.5225, lng: -5.9800, duration_min: 240, category: 'nature' },
      { name: 'Todra Gorge (Tinerhir)', lat: 31.5883, lng: -5.5893, duration_min: 180, category: 'nature' },
      { name: 'Erg Chebbi (Merzouga Dunes)', lat: 31.1000, lng: -3.9800, duration_min: 480, category: 'nature' },
      { name: 'Ifrane (Middle Atlas)', lat: 33.5228, lng: -5.1099, duration_min: 180, category: 'city' },
      { name: 'Fes el-Bali (medina UNESCO)', lat: 34.0605, lng: -4.9825, duration_min: 480, category: 'city' }
    ],
    best_season: 'winter',
    difficulty: 'challenging',
    total_distance_km: 1200
  }
];

// Unified export para el seed endpoint
export const ALL_TEMPLATES: SeedTemplate[] = [
  ...CALIFORNIA_TEMPLATES,
  ...NEVADA_TEMPLATES,
  ...ARIZONA_TEMPLATES,
  ...SOUTHWEST_TEMPLATES,
  ...UTAH_TEMPLATES,
  ...SPAIN_TEMPLATES,
  ...PACIFIC_NORTHWEST_TEMPLATES,
  ...NORTHEAST_TEMPLATES,
  ...SOUTHEAST_TEMPLATES,
  ...ROCKIES_TEMPLATES,
  ...ITALY_TEMPLATES,
  ...ICELAND_TEMPLATES,
  ...IRELAND_TEMPLATES,
  ...AUSTRALIA_TEMPLATES,
  ...NEW_ZEALAND_TEMPLATES,
  ...GERMANY_TEMPLATES,
  ...MEXICO_TEMPLATES,
  ...CHILE_TEMPLATES,
  ...ARGENTINA_TEMPLATES,
  ...PERU_TEMPLATES,
  ...JAPAN_TEMPLATES,
  ...CANADA_TEMPLATES,
  ...SCOTLAND_TEMPLATES,
  ...MOROCCO_TEMPLATES
];
