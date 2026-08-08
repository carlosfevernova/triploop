// Wrapper de geocoding/search GRATIS (Nominatim + Photon).
// Uso: probar free primero, Google como último recurso.
// Rate limits: Nominatim 1 req/s, Photon 1 req/s. Cache agresivo en pois recomendado.

const USER_AGENT = 'TripLoop/1.0 (https://triploop-six.vercel.app)';

export interface FreeGeocodeResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
  osm_id?: string;
  place_source: 'nominatim' | 'photon';
}

/**
 * Nominatim (OpenStreetMap) — geocoding by name/query.
 * Free, unlimited self-hosted. Public: 1 req/s.
 */
export async function geocodeNominatim(query: string, opts: {
  countryCodes?: string; // e.g. 'us,mx,es'
  limit?: number;
  viewbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
} = {}): Promise<FreeGeocodeResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', String(opts.limit || 5));
  url.searchParams.set('addressdetails', '1');
  if(opts.countryCodes) url.searchParams.set('countrycodes', opts.countryCodes);
  if(opts.viewbox){
    url.searchParams.set('viewbox', opts.viewbox.join(','));
    url.searchParams.set('bounded', '1');
  }
  try {
    const r = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en,es' }
    });
    if(!r.ok) return [];
    const data = await r.json() as Array<{
      display_name: string;
      lat: string; lon: string;
      type?: string; class?: string;
      osm_id?: number;
      name?: string;
    }>;
    return data.map(d => ({
      name: d.name || d.display_name.split(',')[0].trim(),
      address: d.display_name,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      types: [d.class || 'place', d.type || ''].filter(Boolean),
      osm_id: d.osm_id ? String(d.osm_id) : undefined,
      place_source: 'nominatim'
    }));
  } catch { return []; }
}

/**
 * Photon (Komoot's Nominatim wrapper) — faster search + typo tolerance.
 * Public instance gratis, 1 req/s.
 */
export async function geocodePhoton(query: string, opts: {
  limit?: number;
  lang?: 'en' | 'es' | 'de' | 'fr';
  lat?: number; lng?: number; // bias por proximidad
} = {}): Promise<FreeGeocodeResult[]> {
  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(opts.limit || 5));
  if(opts.lang) url.searchParams.set('lang', opts.lang);
  if(opts.lat && opts.lng){
    url.searchParams.set('lat', String(opts.lat));
    url.searchParams.set('lon', String(opts.lng));
  }
  try {
    const r = await fetch(url.toString(), { headers: { 'User-Agent': USER_AGENT } });
    if(!r.ok) return [];
    const data = await r.json() as {
      features: Array<{
        geometry: { coordinates: [number, number] };
        properties: { name?: string; street?: string; city?: string; country?: string; osm_id?: number; osm_type?: string; type?: string };
      }>
    };
    return (data.features || []).map(f => ({
      name: f.properties.name || 'Unknown',
      address: [f.properties.street, f.properties.city, f.properties.country].filter(Boolean).join(', '),
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      types: f.properties.type ? [f.properties.type] : [],
      osm_id: f.properties.osm_id ? String(f.properties.osm_id) : undefined,
      place_source: 'photon'
    }));
  } catch { return []; }
}

/**
 * Try Photon first (faster), fallback Nominatim.
 * Returns first result or null.
 */
export async function geocodeFree(query: string, opts?: { lat?: number; lng?: number; lang?: 'en' | 'es' }): Promise<FreeGeocodeResult | null> {
  const photon = await geocodePhoton(query, { limit: 1, lang: opts?.lang, lat: opts?.lat, lng: opts?.lng });
  if(photon.length > 0) return photon[0];
  const nominatim = await geocodeNominatim(query, { limit: 1 });
  return nominatim[0] || null;
}
