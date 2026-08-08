// Traducciones ES para los templates existentes.
// Mapping por slug → {title, seo_description, seo_keywords, stops[].name (opcional)}

interface TranslationEntry {
  title: string;
  seo_description: string;
  seo_keywords?: string[];
  stops?: Array<{ name: string }>; // en el mismo orden que el original
}

export const TEMPLATE_TRANSLATIONS_ES: Record<string, TranslationEntry> = {
  // California
  'san-francisco-classic-5-days': {
    title: 'San Francisco Clásico — 5 días',
    seo_description: 'El road trip definitivo de 5 días por San Francisco: Golden Gate, Alcatraz, Muir Woods, Napa Valley y Sausalito. Tiempos reales de manejo, precios con IVA, funciona en métrico o imperial.',
    seo_keywords: ['itinerario san francisco 5 dias', 'road trip sf', 'california bay area viaje', 'muir woods napa itinerario']
  },
  'los-angeles-highlights-4-days': {
    title: 'Los Angeles Imperdibles — 4 días',
    seo_description: '4 días en LA al estilo local: Griffith al atardecer, Venice boardwalk, Santa Monica pier, Hollywood y Beverly Hills. Tiempos de manejo consideran tráfico real.',
    seo_keywords: ['itinerario los angeles 4 dias', 'la road trip', 'hollywood venice santa monica', 'griffith observatory atardecer']
  },
  'san-diego-sunny-3-days': {
    title: 'San Diego Soleado — 3 días',
    seo_description: 'Un viaje soleado de 3 días por San Diego: lobos marinos en La Jolla, museos Balboa Park, playa Coronado y tacos en Old Town. Perfecto para familias y primerizos.',
    seo_keywords: ['itinerario san diego 3 dias', 'la jolla balboa park', 'coronado old town san diego', 'viaje familiar san diego']
  },
  'pacific-coast-highway-5-days': {
    title: 'Pacific Coast Highway — 5 días',
    seo_description: 'El road trip PCH definitivo: San Francisco a Los Angeles vía Monterey, Big Sur, Hearst Castle y Santa Barbara. 5 días de la costa más fotografiada de EE.UU.',
    seo_keywords: ['road trip pacific coast highway', 'pch itinerario 5 dias', 'big sur monterey santa barbara', 'california coast drive']
  },
  'yosemite-weekend-3-days': {
    title: 'Yosemite de Fin de Semana — 3 días',
    seo_description: 'Yosemite Valley en 3 días: amanecer en Tunnel View, atardecer Glacier Point, caminata Half Dome y el Mist Trail. Incluye tips de reservas y cobertura offline.',
    seo_keywords: ['yosemite 3 dias itinerario', 'yosemite fin de semana', 'glacier point tunnel view', 'yosemite mist trail']
  },
  'death-valley-vegas-4-days': {
    title: 'Death Valley + Las Vegas — 4 días',
    seo_description: 'Loop otro-mundo de 4 días: amanecer en Zabriskie Point, salinas Badwater, drive por Artist Palette, y relax en Las Vegas Strip. Evita verano (>50°C).',
    seo_keywords: ['death valley itinerario 4 dias', 'death valley las vegas viaje', 'zabriskie badwater artist palette', 'california nevada road trip']
  },
  'grand-california-loop-14-days': {
    title: 'El Gran Loop de California — 14 días',
    seo_description: 'El road trip definitivo de 14 días por California: LA → San Diego → Joshua Tree → Vegas → Yosemite → San Francisco → Big Sur → LA. El viaje al que realmente viniste.',
    seo_keywords: ['california 14 dias road trip', 'gran loop california', 'itinerario definitivo california', 'california 2 semanas viaje']
  },
  'napa-sonoma-wine-weekend': {
    title: 'Napa & Sonoma Fin de Semana Vinícola — 3 días',
    seo_description: 'Escapada romántica de 3 días por wine country desde San Francisco: 3 wineries Napa, Sonoma Plaza, secuoyas Muir Woods y drive escénico por Silverado Trail.',
    seo_keywords: ['napa sonoma fin de semana', 'wine country 3 dias', 'san francisco a napa itinerario', 'silverado trail ruta escenica']
  },
  // Nevada
  'las-vegas-weekend-3-days': {
    title: 'Las Vegas Fin de Semana — 3 días',
    seo_description: 'El viaje definitivo de 3 días por Vegas: iconos del Strip de noche, Fremont Street Vegas Viejo, drive matutino Red Rock Canyon y un día en Hoover Dam. Práctico para primerizos.',
    seo_keywords: ['las vegas 3 dias itinerario', 'vegas fin de semana', 'red rock canyon hoover dam', 'primera vez las vegas']
  },
  'lake-tahoe-weekend-4-days': {
    title: 'Lake Tahoe — 4 días',
    seo_description: 'Escapada de 4 días por Lake Tahoe en ambos lados de la frontera: mirador Emerald Bay, playa Sand Harbor, góndola Heavenly y drive escénico alrededor del lago.',
    seo_keywords: ['lake tahoe 4 dias itinerario', 'tahoe road trip', 'emerald bay sand harbor', 'heavenly gondola south lake']
  },
  'nevada-loop-vegas-reno-7-days': {
    title: 'Nevada Loop: Vegas → Reno — 7 días',
    seo_description: 'Road trip de 7 días por Nevada cubriendo Vegas, la carretera más solitaria de USA (Highway 50), Great Basin National Park, pueblo minero fantasma Virginia City y Reno.',
    seo_keywords: ['nevada road trip 7 dias', 'highway 50 carretera solitaria', 'great basin national park', 'reno virginia city']
  },
  // Arizona
  'grand-canyon-weekend-3-days': {
    title: 'Grand Canyon Fin de Semana — 3 días',
    seo_description: 'Viaje perfectamente balanceado de 3 días por Grand Canyon: highlights South Rim, atardecer Hopi Point, Bright Angel Trail (rim), y day trip a rocas rojas Sedona.',
    seo_keywords: ['grand canyon 3 dias itinerario', 'grand canyon south rim fin de semana', 'bright angel trail hopi point', 'primera vez grand canyon']
  },
  'sedona-flagstaff-4-days': {
    title: 'Sedona & Flagstaff — 4 días',
    seo_description: 'Escapada de 4 días por norte de Arizona: caminatas rocas rojas Sedona, Devil\'s Bridge, Slide Rock State Park, drive escénico Oak Creek Canyon y downtown histórico Flagstaff.',
    seo_keywords: ['sedona flagstaff 4 dias', 'sedona rocas rojas itinerario', 'devils bridge oak creek', 'flagstaff arizona fin de semana']
  },
  'arizona-highlights-5-days': {
    title: 'Arizona Imperdibles — 5 días',
    seo_description: '5 días por los mejores de Arizona: Antelope Canyon, Horseshoe Bend, Monument Valley, Grand Canyon y Sedona. Incluye tips de reservas Navajo Nation.',
    seo_keywords: ['arizona 5 dias road trip', 'antelope canyon horseshoe bend', 'monument valley grand canyon sedona', 'norte arizona itinerario']
  },
  // Southwest
  'us-southwest-grand-circle-10-days': {
    title: 'US Southwest Grand Circle — 10 días',
    seo_description: 'El legendario loop de 10 días Grand Circle desde Las Vegas: Zion, Bryce, Antelope Canyon, Monument Valley, Grand Canyon, Sedona. 5 estados, 8 parques nacionales, un road trip.',
    seo_keywords: ['grand circle 10 dias itinerario', 'suroeste usa road trip', 'zion bryce grand canyon loop', '5 estados parques nacionales']
  },
  'route-66-classic-14-days': {
    title: 'Route 66 Clásica — 14 días',
    seo_description: 'El road trip clásico de 14 días por Route 66 de Chicago a Santa Monica cruzando 8 estados: Cadillac Ranch, Meteor Crater, Painted Desert, Petrified Forest y termina en el PCH.',
    seo_keywords: ['route 66 road trip 14 dias', 'chicago a santa monica', 'cadillac ranch meteor crater', 'historic route 66 itinerario']
  },
  // Utah
  'zion-national-park-3-days': {
    title: 'Parque Nacional Zion — 3 días',
    seo_description: 'Viaje de 3 días por Zion desde Las Vegas: Angels Landing (requiere permiso 2026), The Narrows caminando por el río, Emerald Pools + atardecer Watchman. Hospedaje Springdale + logística shuttle.',
    seo_keywords: ['zion 3 dias itinerario', 'zion parque nacional fin de semana', 'angels landing narrows', 'zion desde vegas']
  },
  'bryce-canyon-weekend-3-days': {
    title: 'Bryce Canyon Fin de Semana — 3 días',
    seo_description: '3 días en Bryce Canyon: amanecer Bryce Point (esencial), Navajo/Queens Garden Loop, drive Rainbow Point y observación de estrellas (Dark Sky Park). Mejor mayo-octubre.',
    seo_keywords: ['bryce canyon 3 dias', 'bryce canyon amanecer', 'navajo queens garden loop', 'bryce canyon estrellas']
  },
  'utah-mighty-5-national-parks-10-days': {
    title: 'Utah Mighty 5 — 10 días',
    seo_description: 'El road trip definitivo de 10 días por los parques nacionales de Utah: Zion → Bryce → Capitol Reef → Arches → Canyonlands. Los 5 parques mighty con tiempos reales de manejo.',
    seo_keywords: ['utah mighty 5 road trip', 'utah parques nacionales 10 dias', 'zion bryce arches canyonlands capitol reef', 'utah parques itinerario']
  },
  'salt-lake-park-city-weekend-3-days': {
    title: 'Salt Lake + Park City Fin de Semana — 3 días',
    seo_description: 'Escapada de ciudad de 3 días: Temple Square, drive por Bonneville Salt Flats, Park City Main Street, y drive escénico Deer Valley/Empire Pass. Perfecto add-on ski invierno.',
    seo_keywords: ['salt lake city 3 dias', 'park city fin de semana', 'temple square bonneville salt flats', 'utah city break']
  },
  // España
  'madrid-escapada-fin-de-semana-3-days': {
    title: 'Madrid Escapada de Fin de Semana — 3 días',
    seo_description: '3 días desde Madrid con day trips a Toledo y Segovia: Prado, Plaza Mayor, Retiro, casco histórico Toledo + Alcázar Segovia. Práctico para primerizos.',
    seo_keywords: ['madrid 3 dias itinerario', 'madrid fin de semana', 'madrid toledo segovia day trip', 'primera vez madrid']
  },
  'barcelona-modernista-3-days': {
    title: 'Barcelona Modernista — 3 días',
    seo_description: '3 días en Barcelona: Sagrada Família (reserva semanas antes), Park Güell, tapas Barrio Gótico, montaña Montserrat y escapada costera Sitges. Perfecto para amantes de Gaudí.',
    seo_keywords: ['barcelona 3 dias itinerario', 'barcelona sagrada familia park guell', 'gaudi barcelona fin de semana', 'barcelona montserrat sitges']
  },
  'andalucia-grand-tour-7-days': {
    title: 'Andalucía Gran Tour — 7 días',
    seo_description: 'Road trip de 7 días por Andalucía: flamenco + Alcázar Sevilla, Mezquita Córdoba, Alhambra Granada (reserva 3 meses antes), puente colgante Ronda, final playa Málaga.',
    seo_keywords: ['andalucia 7 dias road trip', 'sevilla cordoba granada malaga', 'alhambra granada itinerario', 'andalucia sur españa viaje']
  },
  'camino-santiago-highlights-10-days': {
    title: 'Camino de Santiago Imperdibles — 10 días',
    seo_description: 'Drive de 10 días por el Camino Francés de Pamplona a Santiago: catedral Burgos, León gótica, vino El Bierzo, Portomarín y final en Santiago. Introducción perfecta al Camino.',
    seo_keywords: ['camino de santiago 10 dias road trip', 'camino frances manejando itinerario', 'pamplona a santiago compostela', 'camino santiago imperdibles']
  }
};
