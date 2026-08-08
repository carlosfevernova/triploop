'use client';
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { TripStop } from '@/lib/types';
import type { DiscoveryPOI } from '@/app/api/places/discover/route';

interface Props {
  stops: TripStop[];
  polyline?: string;
  hoveredStopId?: string | null;
  onMarkerClick?: (stopId: string) => void;
  discoveryPois?: DiscoveryPOI[];
  onPoiClick?: (poi: DiscoveryPOI) => void;
  onBoundsChange?: (bbox: [number, number, number, number]) => void;
}

const POI_CATEGORY_COLOR: Record<string, string> = {
  food: '#ec4899',
  attraction: '#f59e0b',
  nature: '#059669',
  gas: '#0ea5e9',
  hotel: '#8b5cf6',
  ev: '#84cc16',
  shopping: '#f43f5e'
};

const POI_CATEGORY_EMOJI: Record<string, string> = {
  food: '🍴',
  attraction: '🎨',
  nature: '🏞️',
  gas: '⛽',
  hotel: '🏨',
  ev: '⚡',
  shopping: '🛍️'
};

// Basemap tiles gratis (Carto Voyager, sin API key requerida)
const STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
    }
  },
  layers: [{ id: 'carto', type: 'raster' as const, source: 'carto' }]
};

// Decode Google polyline5 → array [lng, lat]
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while(index < encoded.length){
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while(b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while(b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push([lng / 1e5, lat / 1e5]);
  }
  return points;
}

export function TripMap({ stops, polyline, hoveredStopId, onMarkerClick, discoveryPois, onPoiClick, onBoundsChange }: Props){
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const poiMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const boundsChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init map once
  useEffect(() => {
    if(!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: [-119, 36.5], // California center
      zoom: 5
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    // Debounced bounds change → callback
    const handleMoveEnd = () => {
      if(boundsChangeTimerRef.current) clearTimeout(boundsChangeTimerRef.current);
      boundsChangeTimerRef.current = setTimeout(() => {
        if(!mapRef.current) return;
        const b = mapRef.current.getBounds();
        onBoundsChange?.([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
      }, 500);
    };
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      if(boundsChangeTimerRef.current) clearTimeout(boundsChangeTimerRef.current);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync discovery POI markers
  useEffect(() => {
    const map = mapRef.current;
    if(!map) return;
    const currentIds = new Set((discoveryPois || []).map(p => p.id));
    poiMarkersRef.current.forEach((m, id) => {
      if(!currentIds.has(id)){ m.remove(); poiMarkersRef.current.delete(id); }
    });
    (discoveryPois || []).forEach((p) => {
      if(poiMarkersRef.current.has(p.id)) return;
      const color = POI_CATEGORY_COLOR[p.category] || '#64748b';
      const emoji = POI_CATEGORY_EMOJI[p.category] || '📍';
      const el = document.createElement('div');
      el.style.cssText = `
        width: 30px; height: 30px; border-radius: 50%;
        background: ${color}; border: 2px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: grid; place-items: center; font-size: 14px;
        cursor: pointer; transition: transform 150ms ease;
      `;
      el.textContent = emoji;
      el.title = p.name;
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.2)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
      el.addEventListener('click', (e) => { e.stopPropagation(); onPoiClick?.(p); });
      const marker = new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
      poiMarkersRef.current.set(p.id, marker);
    });
  }, [discoveryPois, onPoiClick]);

  // Sync markers with stops
  useEffect(() => {
    const map = mapRef.current;
    if(!map) return;

    const currentIds = new Set(stops.map(s => s.id));
    // Remove stale markers
    markersRef.current.forEach((m, id) => {
      if(!currentIds.has(id)){ m.remove(); markersRef.current.delete(id); }
    });

    // Add or update markers
    stops.forEach((s, i) => {
      let marker = markersRef.current.get(s.id);
      if(!marker){
        const el = document.createElement('div');
        el.className = 'triploop-marker';
        const inner = document.createElement('div');
        inner.style.cssText = "width:32px;height:32px;border-radius:50%;background:#ff5a5f;color:white;display:grid;place-items:center;font-family:'Inter',sans-serif;font-weight:600;font-size:13px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer";
        inner.textContent = String(i + 1);
        el.appendChild(inner);
        el.addEventListener('click', () => onMarkerClick?.(s.id));
        marker = new maplibregl.Marker({ element: el })
          .setLngLat([s.lng, s.lat])
          .addTo(map);
        markersRef.current.set(s.id, marker);
      } else {
        marker.setLngLat([s.lng, s.lat]);
        // Update number inside
        const el = marker.getElement().querySelector('div');
        if(el) el.textContent = String(i + 1);
      }
    });

    // Fit bounds
    if(stops.length > 0){
      const bounds = new maplibregl.LngLatBounds();
      stops.forEach(s => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 60, duration: 600, maxZoom: 12 });
    }
  }, [stops, onMarkerClick]);

  // Sync polyline route
  useEffect(() => {
    const map = mapRef.current;
    if(!map || !map.isStyleLoaded()){ return; }

    const applyRoute = () => {
      const geojson = polyline
        ? { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: decodePolyline(polyline) }, properties: {} }
        : { type: 'Feature' as const, geometry: { type: 'LineString' as const, coordinates: [] }, properties: {} };

      const src = map.getSource('route') as maplibregl.GeoJSONSource | undefined;
      if(src){
        src.setData(geojson);
      } else {
        map.addSource('route', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#ff5a5f', 'line-width': 4, 'line-opacity': 0.85 }
        });
      }
    };

    if(map.isStyleLoaded()) applyRoute();
    else map.once('load', applyRoute);
  }, [polyline]);

  // Highlight on hover
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      const el = m.getElement().querySelector('div') as HTMLElement;
      if(el){
        el.style.transform = hoveredStopId === id ? 'scale(1.3)' : 'scale(1)';
        el.style.background = hoveredStopId === id ? '#c33741' : '#ff5a5f';
        el.style.transition = 'transform 200ms, background 200ms';
      }
    });
  }, [hoveredStopId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
