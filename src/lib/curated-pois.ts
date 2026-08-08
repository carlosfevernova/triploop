// S29: curated POI knowledge base. 100+ verified iconic locations por región.
// Fuente: templates existentes S17-S27 + POIs adicionales conocidos verificados en Google Maps 2026-08.
// Uso: (a) endpoint público /api/places/curated, (b) inject en AI context → AI usa coords verified.

import type { Region } from './templates-seed';

export interface CuratedPOI {
  name: string;
  lat: number;
  lng: number;
  category: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'other';
  iconic?: boolean;         // debe visitar
  best_time?: string;       // 'sunrise' | 'sunset' | 'weekday morning' | 'avoid weekends'
  avg_visit_min?: number;
  tip?: string;             // 1-line insider tip
}

export const CURATED_POIS: Record<Region, CuratedPOI[]> = {
  california: [
    // Iconic must-see
    { name: 'Golden Gate Bridge', lat: 37.8199, lng: -122.4783, category: 'attraction', iconic: true, best_time: 'sunset from Battery Spencer', avg_visit_min: 60, tip: 'Foggy AM common — check webcam before driving up' },
    { name: 'Alcatraz Island', lat: 37.8267, lng: -122.4230, category: 'attraction', iconic: true, best_time: 'weekday morning', avg_visit_min: 180, tip: 'Book 3 months ahead via nps.gov — sells out' },
    { name: 'Fisherman\'s Wharf', lat: 37.808, lng: -122.4177, category: 'attraction', avg_visit_min: 120, tip: 'Skip clam chowder chains — go to Sotto Mare' },
    { name: 'Muir Woods National Monument', lat: 37.8917, lng: -122.5717, category: 'nature', avg_visit_min: 150, tip: 'Reserve parking online — no walk-in' },
    { name: 'Napa Valley', lat: 38.5025, lng: -122.2654, category: 'food', avg_visit_min: 480, tip: 'Prefer Sonoma if you want less pretense' },
    { name: 'Hollywood Walk of Fame', lat: 34.1017, lng: -118.3407, category: 'attraction', avg_visit_min: 90, tip: 'Actually kind of dirty — Griffith is better' },
    { name: 'Griffith Observatory', lat: 34.1184, lng: -118.3004, category: 'attraction', iconic: true, best_time: 'sunset', avg_visit_min: 120, tip: 'Hike from Fern Dell to avoid parking chaos' },
    { name: 'Getty Center', lat: 34.0780, lng: -118.4741, category: 'attraction', iconic: true, avg_visit_min: 240, tip: 'Free admission, $25 parking' },
    { name: 'Venice Beach Boardwalk', lat: 33.9850, lng: -118.4695, category: 'attraction', avg_visit_min: 150 },
    { name: 'Santa Monica Pier', lat: 34.0100, lng: -118.4962, category: 'attraction', avg_visit_min: 120 },
    { name: 'Bixby Creek Bridge', lat: 36.3711, lng: -121.9024, category: 'attraction', iconic: true, best_time: 'golden hour', avg_visit_min: 30 },
    { name: 'McWay Falls (Julia Pfeiffer Burns)', lat: 36.1583, lng: -121.6708, category: 'nature', iconic: true, avg_visit_min: 60 },
    { name: 'Big Sur Bakery', lat: 36.2467, lng: -121.7570, category: 'food', avg_visit_min: 90, tip: 'Wood-fired pizza gem — reserve dinner' },
    { name: 'Point Lobos State Reserve', lat: 36.5222, lng: -121.9411, category: 'nature', avg_visit_min: 180 },
    { name: 'Hearst Castle', lat: 35.6852, lng: -121.1682, category: 'attraction', avg_visit_min: 180, tip: 'Tour tickets required — book ahead' },
    { name: 'Yosemite Valley (Tunnel View)', lat: 37.7156, lng: -119.6774, category: 'nature', iconic: true, best_time: 'sunrise', avg_visit_min: 240 },
    { name: 'Half Dome', lat: 37.7460, lng: -119.5333, category: 'nature', iconic: true, avg_visit_min: 720, tip: 'Permit required for cables — apply in spring lottery' },
    { name: 'Palm Springs Aerial Tramway', lat: 33.8281, lng: -116.6389, category: 'attraction', avg_visit_min: 180 },
    { name: 'Joshua Tree National Park', lat: 33.8734, lng: -115.9010, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 240 }
  ],
  nevada: [
    { name: 'Las Vegas Strip', lat: 36.1147, lng: -115.1728, category: 'city', iconic: true, avg_visit_min: 480 },
    { name: 'Bellagio Fountains', lat: 36.1129, lng: -115.1770, category: 'attraction', iconic: true, best_time: 'sunset (every 15 min after)', avg_visit_min: 30 },
    { name: 'Fremont Street Experience', lat: 36.1698, lng: -115.1428, category: 'attraction', avg_visit_min: 120 },
    { name: 'Red Rock Canyon', lat: 36.1358, lng: -115.4275, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Hoover Dam', lat: 36.0161, lng: -114.7377, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Lake Tahoe (Emerald Bay)', lat: 38.9541, lng: -120.1027, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Valley of Fire State Park', lat: 36.4842, lng: -114.5347, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Reno Riverwalk', lat: 39.5245, lng: -119.8137, category: 'city', avg_visit_min: 120 }
  ],
  arizona: [
    { name: 'Grand Canyon (South Rim)', lat: 36.0544, lng: -112.1401, category: 'nature', iconic: true, best_time: 'sunrise Mather Point', avg_visit_min: 480 },
    { name: 'Grand Canyon (Bright Angel Trail)', lat: 36.0577, lng: -112.1435, category: 'nature', iconic: true, avg_visit_min: 360 },
    { name: 'Antelope Canyon (Upper)', lat: 36.8619, lng: -111.3743, category: 'nature', iconic: true, best_time: '11am-1pm light beams', avg_visit_min: 90, tip: 'Guided tour required — book 2 months ahead' },
    { name: 'Horseshoe Bend', lat: 36.8791, lng: -111.5104, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 90 },
    { name: 'Sedona (Cathedral Rock)', lat: 34.8256, lng: -111.7859, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 240 },
    { name: 'Monument Valley', lat: 36.9980, lng: -110.0985, category: 'nature', iconic: true, best_time: 'sunrise from The View Hotel', avg_visit_min: 300 },
    { name: 'Meteor Crater', lat: 35.0271, lng: -111.0224, category: 'attraction', avg_visit_min: 90 },
    { name: 'Saguaro National Park', lat: 32.2967, lng: -111.1662, category: 'nature', avg_visit_min: 180 },
    { name: 'Phoenix Desert Botanical Garden', lat: 33.4622, lng: -111.9436, category: 'nature', avg_visit_min: 180 }
  ],
  utah: [
    { name: 'Zion National Park (Angels Landing)', lat: 37.2691, lng: -112.9469, category: 'nature', iconic: true, best_time: 'first shuttle 7am', avg_visit_min: 300, tip: 'Permit required since 2022 lottery' },
    { name: 'The Narrows (Zion)', lat: 37.2853, lng: -112.9482, category: 'nature', iconic: true, avg_visit_min: 360 },
    { name: 'Bryce Canyon (Sunrise Point)', lat: 37.6260, lng: -112.1615, category: 'nature', iconic: true, best_time: 'sunrise', avg_visit_min: 240 },
    { name: 'Arches (Delicate Arch)', lat: 38.7436, lng: -109.4993, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 180 },
    { name: 'Canyonlands (Island in the Sky)', lat: 38.4599, lng: -109.8207, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Capitol Reef National Park', lat: 38.2972, lng: -111.2615, category: 'nature', avg_visit_min: 180 },
    { name: 'Monument Valley (Utah side)', lat: 37.0021, lng: -110.1080, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Salt Lake City Temple Square', lat: 40.7708, lng: -111.8927, category: 'attraction', avg_visit_min: 120 },
    { name: 'Park City Main Street', lat: 40.6461, lng: -111.4980, category: 'city', avg_visit_min: 180 }
  ],
  southwest: [
    { name: 'Route 66 (Cadillac Ranch, TX)', lat: 35.1872, lng: -101.9871, category: 'attraction', iconic: true, avg_visit_min: 60 },
    { name: 'Wigwam Motel (Holbrook AZ)', lat: 34.9033, lng: -110.1621, category: 'hotel', iconic: true, avg_visit_min: 60 },
    { name: 'Petrified Forest National Park', lat: 34.9099, lng: -109.8068, category: 'nature', avg_visit_min: 180 },
    { name: 'Meteor Crater (AZ)', lat: 35.0271, lng: -111.0224, category: 'attraction', avg_visit_min: 90 },
    { name: 'Santa Fe Plaza', lat: 35.6870, lng: -105.9378, category: 'city', avg_visit_min: 240 }
  ],
  spain: [
    { name: 'Palacio Real (Madrid)', lat: 40.4180, lng: -3.7143, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Museo del Prado', lat: 40.4138, lng: -3.6921, category: 'attraction', iconic: true, avg_visit_min: 240, tip: 'Free entry last 2h daily except Sun' },
    { name: 'Plaza Mayor (Madrid)', lat: 40.4155, lng: -3.7074, category: 'attraction', avg_visit_min: 60 },
    { name: 'Sagrada Familia', lat: 41.4036, lng: 2.1744, category: 'attraction', iconic: true, avg_visit_min: 180, tip: 'Book online — never walk-up' },
    { name: 'Park Güell', lat: 41.4145, lng: 2.1527, category: 'attraction', iconic: true, avg_visit_min: 150 },
    { name: 'Las Ramblas (Barcelona)', lat: 41.3809, lng: 2.1735, category: 'attraction', avg_visit_min: 120, tip: 'Watch pickpockets — pass through, don\'t linger' },
    { name: 'Mercado de La Boquería', lat: 41.3818, lng: 2.1717, category: 'food', avg_visit_min: 90 },
    { name: 'La Alhambra (Granada)', lat: 37.1761, lng: -3.5881, category: 'attraction', iconic: true, avg_visit_min: 300, tip: 'Book 2 months ahead — sold out season' },
    { name: 'Catedral de Sevilla + Giralda', lat: 37.3857, lng: -5.9932, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Plaza de España (Sevilla)', lat: 37.3773, lng: -5.9871, category: 'attraction', iconic: true, avg_visit_min: 60 },
    { name: 'Mezquita-Catedral de Córdoba', lat: 37.8790, lng: -4.7794, category: 'attraction', iconic: true, avg_visit_min: 90 }
  ],
  'pacific-northwest': [
    { name: 'Pike Place Market (Seattle)', lat: 47.6089, lng: -122.3406, category: 'food', iconic: true, avg_visit_min: 180 },
    { name: 'Space Needle', lat: 47.6205, lng: -122.3493, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Chihuly Garden and Glass', lat: 47.6207, lng: -122.3510, category: 'attraction', avg_visit_min: 120 },
    { name: 'Olympic National Park (Hurricane Ridge)', lat: 47.9689, lng: -123.4989, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Hoh Rainforest', lat: 47.8600, lng: -123.9349, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Mt. Rainier National Park', lat: 46.8523, lng: -121.7603, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Portland Powell\'s Books', lat: 45.5230, lng: -122.6812, category: 'attraction', avg_visit_min: 180 },
    { name: 'Multnomah Falls', lat: 45.5762, lng: -122.1158, category: 'nature', iconic: true, avg_visit_min: 90 },
    { name: 'Cannon Beach (Haystack Rock)', lat: 45.8918, lng: -123.9615, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 180 },
    { name: 'Crater Lake National Park', lat: 42.9446, lng: -122.1090, category: 'nature', iconic: true, avg_visit_min: 300 }
  ],
  northeast: [
    { name: 'Boston Freedom Trail', lat: 42.3554, lng: -71.0656, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Faneuil Hall Marketplace', lat: 42.3600, lng: -71.0568, category: 'food', avg_visit_min: 120 },
    { name: 'Harvard Square (Cambridge)', lat: 42.3736, lng: -71.1189, category: 'city', avg_visit_min: 120 },
    { name: 'Fenway Park', lat: 42.3467, lng: -71.0972, category: 'attraction', avg_visit_min: 180 },
    { name: 'Kancamagus Highway (NH)', lat: 43.9925, lng: -71.4034, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Portland Head Light (ME)', lat: 43.6231, lng: -70.2072, category: 'attraction', iconic: true, avg_visit_min: 90 },
    { name: 'Acadia National Park (Cadillac Mtn)', lat: 44.3520, lng: -68.2247, category: 'nature', iconic: true, best_time: 'sunrise (1st US sunlight)', avg_visit_min: 480 },
    { name: 'Vermont Route 100', lat: 43.6242, lng: -72.5187, category: 'nature', iconic: true, best_time: 'peak leaf oct 5-15', avg_visit_min: 480 },
    { name: 'Shenandoah NP (Skyline Drive)', lat: 38.5312, lng: -78.3487, category: 'nature', iconic: true, avg_visit_min: 360 },
    { name: 'Blue Ridge Parkway (Mabry Mill)', lat: 36.7521, lng: -80.4028, category: 'attraction', iconic: true, avg_visit_min: 90 },
    { name: 'Asheville (Biltmore Estate)', lat: 35.5401, lng: -82.5528, category: 'attraction', iconic: true, avg_visit_min: 300 },
    { name: 'Great Smoky Mtns (Clingmans Dome)', lat: 35.5628, lng: -83.4986, category: 'nature', iconic: true, avg_visit_min: 240 }
  ],
  southeast: [
    { name: 'Miami South Beach (Ocean Drive)', lat: 25.7907, lng: -80.1300, category: 'city', iconic: true, avg_visit_min: 180 },
    { name: 'John Pennekamp State Park', lat: 25.1263, lng: -80.4028, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Seven Mile Bridge', lat: 24.7011, lng: -81.1610, category: 'attraction', iconic: true, avg_visit_min: 30 },
    { name: 'Bahia Honda State Park', lat: 24.6564, lng: -81.2792, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Key West Mallory Square', lat: 24.5601, lng: -81.8071, category: 'attraction', iconic: true, best_time: 'sunset celebration', avg_visit_min: 180 },
    { name: 'Ernest Hemingway Home', lat: 24.5510, lng: -81.8009, category: 'attraction', avg_visit_min: 90 },
    { name: 'New Orleans French Quarter', lat: 29.9584, lng: -90.0644, category: 'city', iconic: true, avg_visit_min: 480 },
    { name: 'Bourbon Street (NOLA)', lat: 29.9584, lng: -90.0669, category: 'attraction', best_time: 'after 8pm', avg_visit_min: 240 },
    { name: 'Memphis Beale Street', lat: 35.1387, lng: -90.0504, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Sun Studio (Memphis)', lat: 35.1385, lng: -90.0389, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'St. Louis Gateway Arch', lat: 38.6247, lng: -90.1848, category: 'attraction', iconic: true, avg_visit_min: 180 }
  ],
  italy: [
    { name: 'Positano', lat: 40.6280, lng: 14.4842, category: 'city', iconic: true, best_time: 'shoulder season sep-oct', avg_visit_min: 300, tip: 'Steep streets — pack comfortable shoes' },
    { name: 'Amalfi Cathedral', lat: 40.6340, lng: 14.6028, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Ravello (Villa Cimbrone)', lat: 40.6497, lng: 14.6116, category: 'attraction', iconic: true, avg_visit_min: 180, tip: 'Terrace of Infinity — sunset unreal' },
    { name: 'Vernazza (Cinque Terre)', lat: 44.1354, lng: 9.6849, category: 'city', iconic: true, avg_visit_min: 240 },
    { name: 'Manarola (Cinque Terre)', lat: 44.1064, lng: 9.7275, category: 'city', iconic: true, best_time: 'sunset from Nessun Dorma', avg_visit_min: 180 },
    { name: 'Florence (Ponte Vecchio)', lat: 43.7679, lng: 11.2531, category: 'city', iconic: true, avg_visit_min: 240 },
    { name: 'Duomo di Firenze', lat: 43.7731, lng: 11.2560, category: 'attraction', iconic: true, avg_visit_min: 180, tip: 'Book Brunelleschi dome climb 2 weeks ahead' },
    { name: 'Uffizi Gallery', lat: 43.7678, lng: 11.2554, category: 'attraction', iconic: true, avg_visit_min: 240, tip: 'Reserve ticket online — 3h queue walk-in' },
    { name: 'Colosseum (Rome)', lat: 41.8902, lng: 12.4922, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Vatican (St Peter\'s)', lat: 41.9022, lng: 12.4534, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Naples (Spaccanapoli)', lat: 40.8518, lng: 14.2681, category: 'food', avg_visit_min: 240, tip: 'Pizza at Da Michele or Sorbillo — the classics' }
  ],
  iceland: [
    { name: 'Reykjavik (Hallgrímskirkja)', lat: 64.1466, lng: -21.9426, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Blue Lagoon', lat: 63.8804, lng: -22.4495, category: 'attraction', iconic: true, avg_visit_min: 240, tip: 'Book weeks ahead — sold out' },
    { name: 'Þingvellir National Park', lat: 64.2559, lng: -21.1295, category: 'nature', iconic: true, avg_visit_min: 180 },
    { name: 'Gullfoss Waterfall', lat: 64.3271, lng: -20.1201, category: 'nature', iconic: true, avg_visit_min: 90 },
    { name: 'Geysir Hot Springs', lat: 64.3141, lng: -20.3013, category: 'nature', iconic: true, avg_visit_min: 60 },
    { name: 'Seljalandsfoss', lat: 63.6156, lng: -19.9884, category: 'nature', iconic: true, avg_visit_min: 90 },
    { name: 'Skógafoss', lat: 63.5321, lng: -19.5114, category: 'nature', iconic: true, avg_visit_min: 60 },
    { name: 'Reynisfjara Black Sand Beach', lat: 63.4058, lng: -19.0446, category: 'nature', iconic: true, avg_visit_min: 120 },
    { name: 'Jökulsárlón Glacier Lagoon', lat: 64.0764, lng: -16.2306, category: 'nature', iconic: true, best_time: 'summer for iceberg cruise', avg_visit_min: 240 },
    { name: 'Diamond Beach', lat: 64.0416, lng: -16.1795, category: 'nature', iconic: true, avg_visit_min: 90 }
  ],
  ireland: [
    { name: 'Cliffs of Moher', lat: 52.9715, lng: -9.4309, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 240 },
    { name: 'Killarney National Park', lat: 52.0139, lng: -9.5030, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Ring of Kerry (Molls Gap)', lat: 51.9317, lng: -9.6903, category: 'nature', iconic: true, avg_visit_min: 90 },
    { name: 'Kenmare Stone Circle', lat: 51.8807, lng: -9.5836, category: 'attraction', avg_visit_min: 60 },
    { name: 'Dingle Peninsula (Slea Head)', lat: 52.1128, lng: -10.4592, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Galway (Latin Quarter)', lat: 53.2707, lng: -9.0568, category: 'city', iconic: true, avg_visit_min: 240 },
    { name: 'Dublin Trinity College (Book of Kells)', lat: 53.3441, lng: -6.2577, category: 'attraction', iconic: true, avg_visit_min: 180 }
  ],
  australia: [
    { name: 'Twelve Apostles', lat: -38.6633, lng: 143.1044, category: 'nature', iconic: true, best_time: 'sunset', avg_visit_min: 180 },
    { name: 'Loch Ard Gorge', lat: -38.6467, lng: 143.0733, category: 'nature', iconic: true, avg_visit_min: 120 },
    { name: 'Bells Beach', lat: -38.3705, lng: 144.2822, category: 'nature', iconic: true, avg_visit_min: 90 },
    { name: 'Great Otway National Park', lat: -38.7853, lng: 143.5000, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Lorne', lat: -38.5401, lng: 143.9767, category: 'city', avg_visit_min: 240 },
    { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Bondi Beach', lat: -33.8908, lng: 151.2743, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Melbourne (Federation Square)', lat: -37.8180, lng: 144.9691, category: 'city', avg_visit_min: 240 }
  ],
  'new-zealand': [
    { name: 'Milford Sound', lat: -44.6708, lng: 167.9265, category: 'nature', iconic: true, best_time: 'first cruise 9am', avg_visit_min: 480 },
    { name: 'Mount Cook National Park', lat: -43.7346, lng: 170.0955, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Queenstown (Skyline)', lat: -45.0312, lng: 168.6626, category: 'city', iconic: true, avg_visit_min: 480 },
    { name: 'Lake Tekapo (Church Good Shepherd)', lat: -44.0055, lng: 170.4805, category: 'nature', iconic: true, best_time: 'starry night dark-sky reserve', avg_visit_min: 180 },
    { name: 'That Wanaka Tree', lat: -44.6976, lng: 169.1470, category: 'nature', iconic: true, best_time: 'sunrise', avg_visit_min: 60 },
    { name: 'Franz Josef Glacier', lat: -43.4664, lng: 170.1856, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Abel Tasman National Park', lat: -40.9333, lng: 173.0000, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Hobbiton (North Island)', lat: -37.8721, lng: 175.6822, category: 'attraction', iconic: true, avg_visit_min: 180, tip: 'Book tour only entry' }
  ],
  germany: [
    { name: 'Neuschwanstein Castle', lat: 47.5576, lng: 10.7498, category: 'attraction', iconic: true, best_time: 'first ticket 9am', avg_visit_min: 300, tip: 'Book weeks ahead — sold out summer' },
    { name: 'Rothenburg ob der Tauber', lat: 49.3777, lng: 10.1786, category: 'city', iconic: true, avg_visit_min: 480, tip: 'Best walled town in Germany' },
    { name: 'Würzburg Residence (UNESCO)', lat: 49.7929, lng: 9.9394, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Dinkelsbühl', lat: 49.0708, lng: 10.3167, category: 'city', avg_visit_min: 180 },
    { name: 'Augsburg (Fuggerei)', lat: 48.3705, lng: 10.8978, category: 'attraction', avg_visit_min: 240 },
    { name: 'Berlin Brandenburg Gate', lat: 52.5163, lng: 13.3777, category: 'attraction', iconic: true, avg_visit_min: 90 },
    { name: 'Munich (Marienplatz)', lat: 48.1374, lng: 11.5755, category: 'city', iconic: true, avg_visit_min: 240 },
    { name: 'Cologne Cathedral', lat: 50.9413, lng: 6.9583, category: 'attraction', iconic: true, avg_visit_min: 180 }
  ],
  mexico: [
    { name: 'Chichén Itzá (El Castillo)', lat: 20.6843, lng: -88.5678, category: 'attraction', iconic: true, best_time: 'first entry 8am avoid heat', avg_visit_min: 300, tip: 'Equinox March/Sep: serpent shadow on pyramid' },
    { name: 'Tulum Ruins', lat: 20.2143, lng: -87.4290, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Cenote Dos Ojos', lat: 20.3234, lng: -87.3849, category: 'nature', iconic: true, avg_visit_min: 180, tip: 'Snorkel gear included in entry' },
    { name: 'Cenote Ik Kil', lat: 20.6222, lng: -88.5679, category: 'nature', iconic: true, avg_visit_min: 120 },
    { name: 'Playa del Carmen (5th Ave)', lat: 20.6296, lng: -87.0739, category: 'city', avg_visit_min: 240 },
    { name: 'Cobá Nohoch Mul Pyramid', lat: 20.4906, lng: -87.7333, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Uxmal Ruins', lat: 20.3592, lng: -89.7714, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Mérida Plaza Grande', lat: 20.9674, lng: -89.6237, category: 'city', avg_visit_min: 300 },
    { name: 'Isla Mujeres', lat: 21.2371, lng: -86.7311, category: 'nature', avg_visit_min: 480 }
  ],
  chile: [
    { name: 'Perito Moreno Glacier (chilean side view)', lat: -50.4967, lng: -73.1377, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Torres del Paine National Park', lat: -51.2540, lng: -73.0000, category: 'nature', iconic: true, avg_visit_min: 720, tip: 'W trek 4-5 days iconic' },
    { name: 'Marble Caves (Lago General Carrera)', lat: -46.6472, lng: -72.6889, category: 'nature', iconic: true, best_time: 'morning still water', avg_visit_min: 240 },
    { name: 'Parque Pumalín', lat: -42.9160, lng: -72.7146, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Ventisquero Colgante (Queulat)', lat: -44.4838, lng: -72.5445, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Cerro Castillo', lat: -46.1000, lng: -72.1500, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Valparaíso (UNESCO cerros)', lat: -33.0472, lng: -71.6127, category: 'city', iconic: true, avg_visit_min: 300 },
    { name: 'Atacama Desert (San Pedro)', lat: -22.9083, lng: -68.2000, category: 'nature', iconic: true, avg_visit_min: 720, tip: 'Driest desert on earth — stargazing epic' }
  ],
  argentina: [
    { name: 'Perito Moreno Glacier (Los Glaciares NP)', lat: -50.4967, lng: -73.1377, category: 'nature', iconic: true, best_time: 'morning for ice calving', avg_visit_min: 480 },
    { name: 'Fitz Roy (El Chaltén)', lat: -49.3298, lng: -72.8850, category: 'nature', iconic: true, best_time: 'sunrise', avg_visit_min: 720 },
    { name: 'Cerro Torre', lat: -49.2926, lng: -73.0982, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Bariloche Cerro Catedral', lat: -41.1335, lng: -71.3103, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Ruta de los 7 Lagos', lat: -40.7500, lng: -71.6500, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Iguazú Falls (argentine side)', lat: -25.6867, lng: -54.4372, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Buenos Aires La Recoleta', lat: -34.5875, lng: -58.3931, category: 'city', iconic: true, avg_visit_min: 240 },
    { name: 'Mendoza Wine Region', lat: -32.8908, lng: -68.8272, category: 'food', iconic: true, avg_visit_min: 480 },
    { name: 'Cueva de las Manos (Santa Cruz)', lat: -47.1550, lng: -70.6467, category: 'attraction', iconic: true, avg_visit_min: 180 }
  ],
  peru: [
    { name: 'Machu Picchu Citadel', lat: -13.1631, lng: -72.5450, category: 'attraction', iconic: true, best_time: 'first entry 6am', avg_visit_min: 360, tip: 'Reserve tickets 2 months ahead + Huayna Picchu +40 min' },
    { name: 'Sacsayhuamán (Cusco)', lat: -13.5089, lng: -71.9820, category: 'attraction', iconic: true, avg_visit_min: 180 },
    { name: 'Ollantaytambo Fortress', lat: -13.2589, lng: -72.2681, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Pisac Ruins + Market', lat: -13.4231, lng: -71.8489, category: 'attraction', iconic: true, avg_visit_min: 240 },
    { name: 'Rainbow Mountain (Vinicunca)', lat: -13.8697, lng: -71.3033, category: 'nature', iconic: true, best_time: 'early to avoid crowds', avg_visit_min: 480, tip: '5,200m altitude — acclimatize 2 days Cusco first' },
    { name: 'Maras Salt Mines', lat: -13.3389, lng: -72.1547, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Moray Inca Circles', lat: -13.3298, lng: -72.1936, category: 'attraction', iconic: true, avg_visit_min: 120 },
    { name: 'Cusco Plaza de Armas', lat: -13.5164, lng: -71.9787, category: 'city', iconic: true, avg_visit_min: 300 },
    { name: 'Lake Titicaca (Puno)', lat: -15.8402, lng: -70.0219, category: 'nature', iconic: true, avg_visit_min: 480 }
  ],
  rockies: [
    { name: 'Lake McDonald (Glacier NP)', lat: 48.5820, lng: -113.9260, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Going-to-the-Sun Road (Logan Pass)', lat: 48.6960, lng: -113.7180, category: 'nature', iconic: true, best_time: 'open jul-sep only', avg_visit_min: 480 },
    { name: 'Old Faithful Geyser', lat: 44.4605, lng: -110.8281, category: 'nature', iconic: true, avg_visit_min: 180 },
    { name: 'Mammoth Hot Springs', lat: 44.9776, lng: -110.7008, category: 'nature', iconic: true, avg_visit_min: 240 },
    { name: 'Grand Prismatic Spring', lat: 44.5251, lng: -110.8383, category: 'nature', iconic: true, best_time: 'midday for colors', avg_visit_min: 120 },
    { name: 'Grand Teton (Jenny Lake)', lat: 43.7508, lng: -110.7250, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Jackson Hole Town Square', lat: 43.4799, lng: -110.7624, category: 'city', avg_visit_min: 180 },
    { name: 'Rocky Mtn NP (Trail Ridge Rd)', lat: 40.3856, lng: -105.6836, category: 'nature', iconic: true, avg_visit_min: 480 },
    { name: 'Aspen Maroon Bells', lat: 39.0708, lng: -106.9890, category: 'nature', iconic: true, best_time: 'sunrise reflection', avg_visit_min: 240 },
    { name: 'Great Sand Dunes NP', lat: 37.7326, lng: -105.5124, category: 'nature', iconic: true, avg_visit_min: 300 },
    { name: 'Garden of the Gods', lat: 38.8783, lng: -104.8698, category: 'nature', iconic: true, avg_visit_min: 180 },
    { name: 'Pikes Peak Summit', lat: 38.8409, lng: -105.0442, category: 'nature', iconic: true, avg_visit_min: 240 }
  ]
};

export function getCuratedPOIs(region: Region, opts: { onlyIconic?: boolean; limit?: number } = {}): CuratedPOI[] {
  const pois = CURATED_POIS[region] || [];
  let filtered = pois;
  if(opts.onlyIconic) filtered = pois.filter(p => p.iconic);
  if(opts.limit) filtered = filtered.slice(0, opts.limit);
  return filtered;
}

export function getAllCuratedRegions(): Region[] {
  return Object.keys(CURATED_POIS) as Region[];
}

export function totalCuratedPOIs(): number {
  return Object.values(CURATED_POIS).reduce((sum, arr) => sum + arr.length, 0);
}
