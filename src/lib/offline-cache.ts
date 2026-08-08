// IndexedDB cache para trips + tile prefetching helper
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Trip } from '@/lib/types';

interface TripLoopDB extends DBSchema {
  trips: {
    key: string; // slug
    value: {
      slug: string;
      trip: Trip;
      saved_at: number;
      tiles_cached?: boolean;
    };
    indexes: { 'by-saved': number };
  };
}

let dbPromise: Promise<IDBPDatabase<TripLoopDB>> | null = null;

function getDb(){
  if(typeof window === 'undefined') throw new Error('IDB only in browser');
  if(!dbPromise){
    dbPromise = openDB<TripLoopDB>('triploop', 1, {
      upgrade(db){
        const store = db.createObjectStore('trips', { keyPath: 'slug' });
        store.createIndex('by-saved', 'saved_at');
      }
    });
  }
  return dbPromise;
}

export async function saveTripOffline(trip: Trip){
  const db = await getDb();
  await db.put('trips', { slug: trip.slug, trip, saved_at: Date.now() });
}

export async function markTilesCached(slug: string){
  const db = await getDb();
  const existing = await db.get('trips', slug);
  if(existing) await db.put('trips', { ...existing, tiles_cached: true });
}

export async function getOfflineTrip(slug: string): Promise<Trip | null> {
  const db = await getDb();
  const row = await db.get('trips', slug);
  return row?.trip ?? null;
}

export async function isTripOffline(slug: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.get('trips', slug);
  return !!row;
}

export async function listOfflineTrips(): Promise<Array<{ slug: string; trip: Trip; saved_at: number; tiles_cached?: boolean }>> {
  const db = await getDb();
  const all = await db.getAll('trips');
  return all.sort((a, b) => b.saved_at - a.saved_at);
}

export async function removeOfflineTrip(slug: string){
  const db = await getDb();
  await db.delete('trips', slug);
}

/**
 * Pre-fetch map tiles around trip stops. Retorna % completado a un callback.
 * Usa lat/lng de cada stop, calcula tile coords en 3 zooms (z=8, z=11, z=13)
 * y hace fetch de cada tile — el SW los cacheará en 'map-tiles' cache.
 */
export async function prefetchTilesForTrip(
  trip: Trip,
  onProgress?: (done: number, total: number) => void
){
  if(!trip.stops || trip.stops.length === 0){ onProgress?.(0, 0); return; }
  const zooms = [8, 11, 13];
  const urls = new Set<string>();
  for(const s of trip.stops){
    for(const z of zooms){
      const { xs, ys } = tileCoordsAround(s.lat, s.lng, z, 2); // 5x5 alrededor = 25 tiles/zoom
      for(const x of xs) for(const y of ys){
        urls.add(`https://basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`);
      }
    }
  }
  const total = urls.size;
  let done = 0;
  onProgress?.(0, total);
  const arr = Array.from(urls);
  // Chunk 8 en paralelo para no saturar
  for(let i = 0; i < arr.length; i += 8){
    const chunk = arr.slice(i, i + 8);
    await Promise.allSettled(chunk.map((u) => fetch(u, { mode: 'no-cors' })));
    done += chunk.length;
    onProgress?.(done, total);
  }
  await markTilesCached(trip.slug);
}

function tileCoordsAround(lat: number, lng: number, z: number, radiusTiles = 2){
  const n = Math.pow(2, z);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  const xs: number[] = [];
  const ys: number[] = [];
  for(let dx = -radiusTiles; dx <= radiusTiles; dx++){
    const nx = x + dx;
    if(nx >= 0 && nx < n) xs.push(nx);
  }
  for(let dy = -radiusTiles; dy <= radiusTiles; dy++){
    const ny = y + dy;
    if(ny >= 0 && ny < n) ys.push(ny);
  }
  return { xs, ys };
}

export function isOnline(){
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}
