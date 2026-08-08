'use client';
import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Live map preview durante AI Trip Generation.
// UX pattern Mindtrip/Layla 2026: stops aparecen con stagger + auto-fit bounds.
// Pre-genera: muestra región detectada tentativamente por keywords del prompt.

interface Stop {
  name: string;
  lat: number;
  lng: number;
  category?: string;
}

interface Props {
  stops: Stop[];        // stops finales de la IA
  hint?: {
    lat: number;
    lng: number;
    zoom?: number;
    label: string;
  } | null;                                   // región pre-detectada por keywords
  locale: 'en' | 'es';
  phase?: 'idle' | 'thinking' | 'streaming' | 'complete';
}

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
      attribution: '© OpenStreetMap © CARTO'
    }
  },
  layers: [{ id: 'carto', type: 'raster' as const, source: 'carto' }]
};

const CATEGORY_COLOR: Record<string, string> = {
  city: '#0ea5e9',
  nature: '#059669',
  attraction: '#f59e0b',
  food: '#ec4899',
  hotel: '#8b5cf6',
  other: '#64748b'
};

// Región defaults (fallback si no hay stops aún ni hint)
const DEFAULT_VIEW = { lat: 36.0, lng: -115.0, zoom: 4 };  // Southwest USA vista

export function AiGeneratorMap({ stops, hint, locale, phase = 'idle' }: Props){
  const isEs = locale === 'es';
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [renderedCount, setRenderedCount] = useState(0);

  // Init map
  useEffect(() => {
    if(!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
      zoom: DEFAULT_VIEW.zoom,
      attributionControl: false
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Fly to hint region cuando cambia y aún no hay stops
  useEffect(() => {
    if(!mapRef.current || stops.length > 0 || !hint) return;
    mapRef.current.flyTo({
      center: [hint.lng, hint.lat],
      zoom: hint.zoom || 5,
      duration: 1500,
      essential: true
    });
  }, [hint, stops.length]);

  // Stagger animation: agregar markers uno por uno cuando llegan stops
  useEffect(() => {
    if(!mapRef.current) return;
    // Reset if stops empty
    if(stops.length === 0){
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      setRenderedCount(0);
      return;
    }
    // Solo animar stops nuevos (append-only)
    if(renderedCount >= stops.length) return;
    const nextIdx = renderedCount;
    const stop = stops[nextIdx];
    const color = CATEGORY_COLOR[stop.category || 'other'] || CATEGORY_COLOR.other;

    const el = document.createElement('div');
    el.className = 'ai-map-marker';
    el.style.cssText = `
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: grid; place-items: center;
      color: white; font-weight: 700; font-size: 11px;
      cursor: pointer;
      animation: aiMarkerPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: center bottom;
    `;
    el.textContent = String(nextIdx + 1);
    el.title = stop.name;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([stop.lng, stop.lat])
      .setPopup(new maplibregl.Popup({ offset: 20, closeButton: false }).setHTML(`<strong>${stop.name}</strong>`))
      .addTo(mapRef.current);
    markersRef.current.push(marker);

    // Auto-fit bounds a todos los stops renderizados
    if(nextIdx > 0){
      const bounds = new maplibregl.LngLatBounds();
      for(let i = 0; i <= nextIdx; i++){
        bounds.extend([stops[i].lng, stops[i].lat]);
      }
      mapRef.current.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 10 });
    } else {
      mapRef.current.flyTo({ center: [stop.lng, stop.lat], zoom: 7, duration: 1200 });
    }

    // Draw line segment del stop anterior al nuevo
    if(nextIdx > 0 && mapRef.current){
      const lineId = `line-${nextIdx}`;
      const prev = stops[nextIdx - 1];
      mapRef.current.addSource(lineId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [[prev.lng, prev.lat], [stop.lng, stop.lat]] }
        }
      });
      mapRef.current.addLayer({
        id: lineId,
        type: 'line',
        source: lineId,
        paint: {
          'line-color': '#f97316',
          'line-width': 3,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2]
        }
      });
    }

    // Stagger: next stop en 350ms
    const timer = setTimeout(() => setRenderedCount(nextIdx + 1), 350);
    return () => clearTimeout(timer);
  }, [stops, renderedCount]);

  const emptyState = phase === 'thinking' || phase === 'idle';

  return (
    <div className="relative h-full w-full">
      <style jsx global>{`
        @keyframes aiMarkerPop {
          0% { transform: scale(0) translateY(-20px); opacity: 0; }
          60% { transform: scale(1.15) translateY(2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .maplibregl-popup-content { border-radius: 12px !important; padding: 8px 12px !important; font-family: inherit; font-size: 12px; }
      `}</style>
      <div ref={containerRef} className="h-full w-full rounded-card" />

      {/* Overlay estados */}
      {emptyState && stops.length === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-900/5 to-ink-900/20 rounded-card">
          <div className="rounded-card bg-white/95 px-6 py-4 shadow-card-hover backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {phase === 'thinking' ? (
                <>
                  <div className="relative h-5 w-5">
                    <div className="absolute inset-0 animate-ping rounded-full bg-coral-400 opacity-60" />
                    <div className="absolute inset-0 rounded-full bg-coral-500" />
                  </div>
                  <span className="text-sm font-semibold text-ink-800">
                    {isEs ? 'La IA está pensando tu ruta…' : 'AI is thinking your route…'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl" aria-hidden>🗺️</span>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      {hint ? hint.label : (isEs ? 'Tu mapa aparecerá aquí' : 'Your map will appear here')}
                    </div>
                    <div className="text-[11px] text-ink-500">
                      {isEs ? 'Describe tu viaje para ver la ruta en vivo' : 'Describe your trip to see the route live'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress badge cuando stops están renderizando */}
      {stops.length > 0 && renderedCount < stops.length && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-pill bg-ink-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {isEs ? `Colocando ${renderedCount + 1} de ${stops.length}` : `Placing ${renderedCount + 1} of ${stops.length}`}
        </div>
      )}

      {/* Progress badge cuando complete */}
      {stops.length > 0 && renderedCount >= stops.length && phase === 'complete' && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-pill bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          ✓ {isEs ? `${stops.length} paradas listas` : `${stops.length} stops ready`}
        </div>
      )}
    </div>
  );
}

// Helper: detectar región tentativa por keywords del prompt (client-side heuristic)
export function detectRegionHint(prompt: string): { lat: number; lng: number; zoom: number; label: string } | null {
  const p = prompt.toLowerCase();
  const REGIONS: { keywords: string[]; hint: { lat: number; lng: number; zoom: number; label: string } }[] = [
    { keywords: ['california', 'los angeles', 'san francisco', 'lax', 'sfo', 'big sur', 'yosemite', 'napa', 'la ', 'sf '], hint: { lat: 37.0, lng: -119.5, zoom: 5, label: 'California detected' } },
    { keywords: ['nevada', 'las vegas', 'reno', 'vegas'], hint: { lat: 39.0, lng: -117.0, zoom: 5, label: 'Nevada detected' } },
    { keywords: ['arizona', 'grand canyon', 'phoenix', 'sedona', 'tucson', 'flagstaff'], hint: { lat: 34.5, lng: -111.5, zoom: 5, label: 'Arizona detected' } },
    { keywords: ['utah', 'zion', 'bryce', 'arches', 'moab', 'salt lake'], hint: { lat: 38.5, lng: -111.8, zoom: 5, label: 'Utah detected' } },
    { keywords: ['spain', 'españa', 'madrid', 'barcelona', 'sevilla', 'granada', 'andalucia', 'andalucía', 'valencia'], hint: { lat: 40.0, lng: -3.5, zoom: 5, label: 'España detected' } },
    { keywords: ['route 66', 'southwest', 'new mexico', 'colorado', 'santa fe'], hint: { lat: 35.5, lng: -106.0, zoom: 5, label: 'Southwest detected' } }
  ];
  for(const r of REGIONS){
    if(r.keywords.some(k => p.includes(k))) return r.hint;
  }
  return null;
}
