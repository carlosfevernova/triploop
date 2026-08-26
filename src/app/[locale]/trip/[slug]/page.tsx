'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ItineraryPanel } from '@/components/trip/ItineraryPanel';
import { SaveOfflineButton } from '@/components/trip/SaveOfflineButton';
import { PdfExportButton } from '@/components/trip/PdfExportButton';
import { CollabPresence } from '@/components/trip/CollabPresence';
import { CollabToast } from '@/components/trip/CollabToast';
import { createClient } from '@/lib/supabase-browser';
import { getOfflineTrip, saveTripOffline } from '@/lib/offline-cache';
import { useTripRealtime } from '@/lib/use-trip-realtime';
import type { PlaceSuggestion, RouteLeg, Trip, TripStop } from '@/lib/types';
import type { POICategory, DiscoveryPOI } from '@/app/api/places/discover/route';
import { POIDiscoveryChips } from '@/components/trip/POIDiscoveryChips';
import { AiConciergeWidget } from '@/components/trip/AiConciergeWidget';

// Dynamic imports: MapLibre (~85KB) + panels (~30KB) lazy-loaded solo al necesitarse
const TripMap = dynamic(() => import('@/components/trip/TripMap').then(m => ({ default: m.TripMap })), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-ink-100" />
});
const AiSuggestionsPanel = dynamic(() => import('@/components/trip/AiSuggestionsPanel').then(m => ({ default: m.AiSuggestionsPanel })), { ssr: false });
const NearbyPanel = dynamic(() => import('@/components/trip/NearbyPanel').then(m => ({ default: m.NearbyPanel })), { ssr: false });
const StaysAndActivitiesPanel = dynamic(() => import('@/components/trip/StaysAndActivitiesPanel').then(m => ({ default: m.StaysAndActivitiesPanel })), { ssr: false });
const TripSidePanel = dynamic(() => import('@/components/trip/TripSidePanel').then(m => ({ default: m.TripSidePanel })), { ssr: false });
const ReshuffleWizard = dynamic(() => import('@/components/trip/ReshuffleWizard').then(m => ({ default: m.ReshuffleWizard })), { ssr: false });

export default function TripPage(){
  const params = useParams<{ locale: string; slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const locale = params.locale;
  const isEs = locale === 'es';

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
  const [routePolyline, setRoutePolyline] = useState<string | undefined>(undefined);
  const [legs, setLegs] = useState<RouteLeg[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [forking, setForking] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [nearbyAnchor, setNearbyAnchor] = useState<TripStop | null>(null);
  const [optimizingRoute, setOptimizingRoute] = useState(false);  // S55
  const [staysOpen, setStaysOpen] = useState(false);
  const [sidePanel, setSidePanel] = useState<null | 'budget' | 'insights' | 'checklist' | 'photos' | 'ev'>(null);
  const [reshuffleOpen, setReshuffleOpen] = useState(false);
  // Discovery layer state
  const [discoveryCategory, setDiscoveryCategory] = useState<POICategory | null>(null);
  const [discoveryPois, setDiscoveryPois] = useState<DiscoveryPOI[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<DiscoveryPOI | null>(null);
  const [mapBounds, setMapBounds] = useState<[number, number, number, number] | null>(null);
  const discoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  // Detect current user
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  // Realtime collab: presence + remote stop sync + broadcast events
  const { presence, lastRemoteChange, broadcastChange } = useTripRealtime({
    slug,
    currentUserId: userId,
    currentUserEmail: userEmail,
    enabled: !!trip && !error,
    onRemoteTripUpdate: (updates) => {
      setTrip((t) => {
        if(!t) return t;
        // Optimistic: si el update remoto tiene mismo hash que último save, ignorar (self-echo)
        const incomingHash = JSON.stringify(updates.stops || []);
        if(incomingHash === JSON.stringify(t.stops)) return t;
        return { ...t, ...updates };
      });
      if(updates.route_geometry?.legs) setLegs(updates.route_geometry.legs);
    }
  });

  // Initial load con fallback offline (IDB)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/trips/${slug}`);
        const data = await r.json();
        if(!r.ok || !data.trip) throw new Error(data.error || 'not_found');
        setTrip(data.trip);
        if(data.trip.route_geometry?.legs) setLegs(data.trip.route_geometry.legs);
        lastSavedRef.current = JSON.stringify({ stops: data.trip.stops, ...settingsOf(data.trip) });
        // Refresh copia offline si ya existe (mantenerla actualizada silenciosamente)
        try {
          const existing = await getOfflineTrip(slug);
          if(existing) await saveTripOffline(data.trip);
        } catch { /* ignore */ }
      } catch (e) {
        // Fallback offline: intentar IDB
        try {
          const offline = await getOfflineTrip(slug);
          if(offline){
            setTrip(offline);
            if(offline.route_geometry?.legs) setLegs(offline.route_geometry.legs);
            lastSavedRef.current = JSON.stringify({ stops: offline.stops, ...settingsOf(offline) });
            return;
          }
        } catch { /* ignore */ }
        setError((e as Error).message);
      }
      finally { setLoading(false); }
    })();
  }, [slug]);

  // Recompute route on stops change (debounced)
  useEffect(() => {
    if(!trip || trip.stops.length < 2) return;
    if(routeTimerRef.current) clearTimeout(routeTimerRef.current);
    routeTimerRef.current = setTimeout(async () => {
      try {
        const r = await fetch('/api/routes/optimize', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ stops: trip.stops })
        });
        const data = await r.json();
        if(r.ok && data.legs){
          setLegs(data.legs);
          setRoutePolyline(data.polyline);
          setTrip((t) => t ? { ...t,
            total_distance_m: data.total_distance_m,
            total_duration_s: data.total_duration_s,
            route_geometry: { legs: data.legs, total_distance_m: data.total_distance_m, total_duration_s: data.total_duration_s }
          } : t);
        }
      } catch { /* ignore */ }
    }, 400);
    return () => { if(routeTimerRef.current) clearTimeout(routeTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.stops]);

  // Auto-save debounced
  useEffect(() => {
    if(!trip) return;
    const current = JSON.stringify({ stops: trip.stops, ...settingsOf(trip), route_geometry: trip.route_geometry, total_distance_m: trip.total_distance_m, total_duration_s: trip.total_duration_s });
    if(current === lastSavedRef.current) return;
    if(saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/trips/${slug}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            title: trip.title,
            unit_system: trip.unit_system,
            currency: trip.currency,
            stops: trip.stops,
            route_geometry: trip.route_geometry,
            total_distance_m: trip.total_distance_m,
            total_duration_s: trip.total_duration_s
          })
        });
        lastSavedRef.current = current;
      } finally { setSaving(false); }
    }, 800);
    return () => { if(saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [trip, slug]);

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try { await navigator.clipboard.writeText(url); setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); } catch {}
  };

  const fork = async () => {
    if(!userId){ router.push(`/${locale}/signin`); return; }
    setForking(true);
    try {
      const r = await fetch(`/api/trips/${slug}/fork`, { method: 'POST' });
      const data = await r.json();
      if(r.ok && data.trip?.slug){ router.push(`/${locale}/trip/${data.trip.slug}`); }
    } finally { setForking(false); }
  };

  // S55: Optimize route order (nearest-neighbor preservando origin + destination)
  const handleOptimizeRoute = async () => {
    if(!trip || trip.stops.length < 4) return;
    setOptimizingRoute(true);
    try {
      const r = await fetch('/api/routes/optimize-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ stops: trip.stops, preserve_endpoints: true })
      });
      const data = await r.json();
      if(!r.ok){ alert(isEs ? 'No se pudo optimizar' : 'Could not optimize'); return; }
      if(!data.changed){
        alert(isEs ? '✓ Tu ruta ya está optimizada' : '✓ Your route is already optimized');
        return;
      }
      const savedStr = data.saved_km < 1 ? `${Math.round(data.saved_km * 1000)} m` : `${data.saved_km.toFixed(1)} km`;
      const ok = confirm(isEs
        ? `Optimizar reduciría ${savedStr} (${data.saved_pct}%) del total: ${data.before_km.toFixed(1)} km → ${data.after_km.toFixed(1)} km. ¿Aplicar el nuevo orden?`
        : `Optimization would save ${savedStr} (${data.saved_pct}%) total: ${data.before_km.toFixed(1)} km → ${data.after_km.toFixed(1)} km. Apply new order?`);
      if(!ok) return;
      setTrip((t) => t ? { ...t, stops: data.stops } : t);
    } finally { setOptimizingRoute(false); }
  };

  const isOwnerOrAnon = !trip?.owner_id || trip?.owner_id === userId;
  const canFork = userId && trip?.owner_id && trip.owner_id !== userId; // signed in + no soy owner

  // Background enrich: resuelve place_id real + rating + foto contra Google Places
  const enrichStop = async (stopId: string, name: string, lat: number, lng: number, existingPlaceId?: string) => {
    try {
      const isAiSyntheticId = !existingPlaceId || /^(fireworks|groq|anthropic|curated|ai|mock):/i.test(existingPlaceId);
      const r = await fetch('/api/places/enrich', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          isAiSyntheticId
            ? { name, lat, lng }
            : { google_place_id: existingPlaceId }
        )
      });
      const data = await r.json();
      if(!r.ok || !data.poi) return;
      setTrip((t) => {
        if(!t) return t;
        return {
          ...t,
          stops: t.stops.map((s) => s.id === stopId ? {
            ...s,
            place_id: data.poi.google_place_id,
            address: s.address || data.poi.address,
            photo_url: s.photo_url || data.poi.photo_url,
            rating: data.poi.rating,
            user_ratings_total: data.poi.user_ratings_total,
            phone: data.poi.phone,
            website: data.poi.website,
            opening_hours: data.poi.opening_hours,
            price_level: data.poi.price_level
          } : s)
        };
      });
    } catch { /* silent */ }
  };

  // Auto-describe con IA (background): actualiza stop.notes con 1-2 oraciones
  const autoDescribeStop = async (stopId: string, name: string, lat: number, lng: number) => {
    try {
      const r = await fetch('/api/ai/describe-stop', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, lat, lng, locale })
      });
      const data = await r.json();
      if(!data.description) return;
      setTrip((t) => {
        if(!t) return t;
        return {
          ...t,
          stops: t.stops.map((s) => s.id === stopId && !s.notes ? { ...s, notes: data.description } : s)
        };
      });
    } catch { /* silent */ }
  };

  const handleAiAdd = (place: PlaceSuggestion & { duration_min?: number; category?: string }) => {
    if(!trip) return;
    const newStop: TripStop = {
      id: crypto.randomUUID(),
      name: place.name,
      address: place.formatted_address,
      lat: place.lat,
      lng: place.lng,
      place_id: place.place_id,
      duration_min: place.duration_min,
      category: (place.category as TripStop['category']) || 'other'
    };
    setTrip((t) => t ? { ...t, stops: [...t.stops, newStop] } : t);
    broadcastChange('add', newStop.name);
    // Fire-and-forget enrich contra Google Places + AI description
    enrichStop(newStop.id, newStop.name, newStop.lat, newStop.lng, newStop.place_id);
    autoDescribeStop(newStop.id, newStop.name, newStop.lat, newStop.lng);
  };

  // Fetch POIs cuando cambia category o bounds (debounced 400ms)
  useEffect(() => {
    if(!discoveryCategory || !mapBounds){ setDiscoveryPois([]); return; }
    if(discoveryTimerRef.current) clearTimeout(discoveryTimerRef.current);
    discoveryTimerRef.current = setTimeout(async () => {
      setDiscoveryLoading(true);
      try {
        const r = await fetch('/api/places/discover', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ bbox: mapBounds, category: discoveryCategory, maxResults: 20 })
        });
        const data = await r.json();
        if(r.ok && Array.isArray(data.pois)) setDiscoveryPois(data.pois);
      } finally { setDiscoveryLoading(false); }
    }, 400);
    return () => { if(discoveryTimerRef.current) clearTimeout(discoveryTimerRef.current); };
  }, [discoveryCategory, mapBounds]);

  const handlePoiAdd = (poi: DiscoveryPOI) => {
    if(!trip) return;
    const newStop: TripStop = {
      id: crypto.randomUUID(),
      name: poi.name,
      address: poi.address,
      lat: poi.lat,
      lng: poi.lng,
      place_id: poi.google_place_id,
      photo_url: poi.photo_url,
      rating: poi.rating,
      user_ratings_total: poi.user_ratings_total,
      price_level: poi.price_level,
      category: mapPoiCatToStopCat(poi.category)
    };
    setTrip((t) => t ? { ...t, stops: [...t.stops, newStop] } : t);
    broadcastChange('add', newStop.name);
    autoDescribeStop(newStop.id, newStop.name, newStop.lat, newStop.lng);
    setSelectedPoi(null);
  };

  const handleNearbyAdd = (place: PlaceSuggestion) => {
    if(!trip) return;
    const newStop: TripStop = {
      id: crypto.randomUUID(),
      name: place.name,
      address: place.formatted_address,
      lat: place.lat,
      lng: place.lng,
      place_id: place.place_id,
      photo_url: place.photo_url,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      category: mapTypeToCategory(place.types)
    };
    setTrip((t) => t ? { ...t, stops: [...t.stops, newStop] } : t);
    broadcastChange('add', newStop.name);
    autoDescribeStop(newStop.id, newStop.name, newStop.lat, newStop.lng);
  };

  if(loading) return <FullscreenMessage>Cargando…</FullscreenMessage>;
  if(error || !trip) return <FullscreenMessage>{isEs ? 'Viaje no encontrado' : 'Trip not found'}</FullscreenMessage>;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Highway notes badge — S32 */}
      {trip.highway_notes && trip.highway_notes.length > 0 && (
        <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 px-6 py-1.5 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span aria-hidden className="shrink-0">🛣️</span>
            <span className="shrink-0 font-semibold uppercase tracking-widest text-amber-800 text-[10px]">
              {isEs ? 'Ruta' : 'Route'}
            </span>
            {trip.highway_notes.map((h, i) => (
              <span key={i} className="shrink-0 rounded-pill border border-amber-200 bg-white px-2.5 py-0.5 font-medium text-amber-900">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => history.length > 1 ? router.back() : router.push(`/${locale}`)}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition hover:border-ink-800 hover:text-ink-900"
            aria-label={isEs ? 'Volver' : 'Back'}
            title={isEs ? 'Volver' : 'Back'}
          >←</button>
          <Link href={`/${locale}`} className="flex items-center gap-2 text-ink-800">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white">
              <span className="font-display text-sm font-semibold">t</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">TripLoop</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* S44: Itinerary Engine — nueva vista temporal */}
          <Link
            href={`/${locale}/trip/${slug}/itinerary`}
            className="rounded-pill border border-ink-900 bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-700"
            title={isEs ? 'Ver por día, hora y actividad' : 'View by day, time, and activity'}
          >🗓 {isEs ? 'Itinerario' : 'Itinerary'}</Link>
          <CollabPresence users={presence} isEs={isEs} />
          <SaveOfflineButton trip={trip} isEs={isEs} />
          {trip.stops.length > 0 && <PdfExportButton slug={trip.slug} isEs={isEs} />}
          {trip.stops.length > 0 && (
            <button
              onClick={() => setStaysOpen(true)}
              className="rounded-pill border border-ocean-400/40 bg-ocean-400/10 px-4 py-2 text-xs font-semibold text-ocean-400 transition hover:bg-ocean-400 hover:text-white"
            >
              🎫 {isEs ? 'Reservar' : 'Book'}
            </button>
          )}
          {trip.stops.length > 0 && (
            <button
              onClick={() => setSidePanel('budget')}
              className="rounded-pill border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-500 hover:text-white"
              title={isEs ? 'Presupuesto estimado' : 'Estimated budget'}
            >💰 {isEs ? 'Presupuesto' : 'Budget'}</button>
          )}
          {trip.stops.length > 1 && (
            <button
              onClick={() => setSidePanel('insights')}
              className="rounded-pill border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-500 hover:text-white"
              title={isEs ? 'Alertas y consejos locales' : 'Warnings & local tips'}
            >🚨 {isEs ? 'Consejos' : 'Tips'}</button>
          )}
          {trip.stops.length > 0 && (
            <button
              onClick={() => setSidePanel('checklist')}
              className="rounded-pill border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-500 hover:text-white"
              title={isEs ? 'Checklist qué llevar' : 'Packing checklist'}
            >📋 {isEs ? 'Empacar' : 'Pack'}</button>
          )}
          {trip.stops.length > 1 && (
            <button
              onClick={() => setSidePanel('photos')}
              className="rounded-pill border border-purple-300 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-800 transition hover:bg-purple-500 hover:text-white"
              title={isEs ? 'Spots de foto que valen la pena' : 'Photo spots worth it'}
            >📸 {isEs ? 'Fotos' : 'Photos'}</button>
          )}
          {trip.stops.length > 0 && (
            <button
              onClick={() => setSidePanel('ev')}
              className="rounded-pill border border-lime-300 bg-lime-50 px-4 py-2 text-xs font-semibold text-lime-800 transition hover:bg-lime-500 hover:text-white"
              title={isEs ? 'Cargadores para vehículo eléctrico' : 'Electric vehicle chargers'}
            >⚡ {isEs ? 'EV' : 'EV'}</button>
          )}
          {isOwnerOrAnon && trip.stops.length > 1 && (
            <button
              onClick={() => setReshuffleOpen(true)}
              className="rounded-pill border border-fuchsia-300 bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
              title={isEs ? 'Reorganizar si algo cambió' : 'Reshuffle if things changed'}
            >🔄 {isEs ? 'Reorganizar' : 'Reshuffle'}</button>
          )}
          {isOwnerOrAnon && (
            <button
              onClick={() => setAiOpen(true)}
              className="rounded-pill bg-gradient-to-r from-coral-500 to-coral-600 px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:from-coral-600 hover:to-coral-700"
            >
              ✨ {isEs ? 'IA' : 'AI'}
            </button>
          )}
          {canFork && (
            <button
              onClick={fork}
              disabled={forking}
              className="rounded-pill border border-coral-200 bg-coral-50 px-4 py-2 text-xs font-semibold text-coral-700 transition hover:border-coral-500 disabled:opacity-50"
            >
              {forking ? '…' : (isEs ? '📋 Duplicar' : '📋 Duplicate')}
            </button>
          )}
          <button
            onClick={share}
            className="rounded-pill border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-800"
          >
            {copiedShare ? (isEs ? '✓ Copiado' : '✓ Copied') : (isEs ? '🔗 Compartir' : '🔗 Share')}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${trip.title} — ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            target="_blank" rel="noreferrer"
            className="rounded-pill bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* AI panel */}
      {isOwnerOrAnon && (
        <AiSuggestionsPanel
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          trip={trip}
          onAdd={handleAiAdd}
          isEs={isEs}
        />
      )}

      {/* Nearby panel */}
      {isOwnerOrAnon && (
        <NearbyPanel
          open={!!nearbyAnchor}
          onClose={() => setNearbyAnchor(null)}
          anchor={nearbyAnchor}
          onAdd={handleNearbyAdd}
          isEs={isEs}
        />
      )}

      {/* Stays & activities panel (visible a todos, incluye fork/anon) */}
      <StaysAndActivitiesPanel
        open={staysOpen}
        onClose={() => setStaysOpen(false)}
        trip={trip}
        isEs={isEs}
        locale={locale}
      />

      {/* Side panel: Budget + Insights */}
      {sidePanel && (
        <TripSidePanel
          open={!!sidePanel}
          onClose={() => setSidePanel(null)}
          view={sidePanel}
          trip={trip}
          locale={locale as 'en' | 'es'}
        />
      )}

      {/* Reshuffle wizard */}
      {reshuffleOpen && isOwnerOrAnon && (
        <ReshuffleWizard
          slug={trip.slug}
          currentStops={trip.stops}
          locale={locale as 'en' | 'es'}
          onApply={(newStops) => {
            setTrip((t) => t ? { ...t, stops: newStops } : t);
            broadcastChange('add', isEs ? 'Reorganizado con IA' : 'Reshuffled with AI');
          }}
          onClose={() => setReshuffleOpen(false)}
        />
      )}

      {/* Collaborative editing toast */}
      <CollabToast change={lastRemoteChange} isEs={isEs} />

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1">
          <TripMap
            stops={trip.stops}
            polyline={routePolyline}
            hoveredStopId={hoveredStopId}
            onMarkerClick={(id) => setHoveredStopId(id)}
            discoveryPois={discoveryPois}
            onPoiClick={(p) => setSelectedPoi(p)}
            onBoundsChange={setMapBounds}
          />
          {isOwnerOrAnon && (
            <POIDiscoveryChips
              selected={discoveryCategory}
              onSelect={(c) => { setDiscoveryCategory(c); setSelectedPoi(null); }}
              loading={discoveryLoading}
              count={discoveryPois.length}
              isEs={isEs}
              selectedPoi={selectedPoi}
              onAddPoi={handlePoiAdd}
              onDismissPoi={() => setSelectedPoi(null)}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          <ItineraryPanel
            trip={trip}
            legs={legs}
            onStopsChange={(stops) => setTrip((t) => t ? { ...t, stops } : t)}
            onHover={setHoveredStopId}
            onSettingsChange={(patch) => setTrip((t) => t ? { ...t, ...patch } : t)}
            onExploreNearby={isOwnerOrAnon ? setNearbyAnchor : undefined}
            onOptimizeRoute={handleOptimizeRoute}
            optimizing={optimizingRoute}
            saving={saving}
            isEs={isEs}
          />
        </div>
      </div>
      {/* AI Concierge — floating widget bottom-right, uses free-tier OpenRouter → Groq fallback */}
      {trip && (
        <AiConciergeWidget
          slug={slug}
          locale={locale}
          stops={(trip.stops || []).map((s) => ({ name: s.name, lat: s.lat, lng: s.lng, day: s.day }))}
        />
      )}
    </div>
  );
}

function FullscreenMessage({ children }: { children: React.ReactNode }){
  return <div className="grid min-h-screen place-items-center text-ink-500">{children}</div>;
}

function settingsOf(t: Trip){
  return { title: t.title, unit_system: t.unit_system, currency: t.currency };
}

function mapPoiCatToStopCat(cat: POICategory): TripStop['category'] {
  if(cat === 'food') return 'food';
  if(cat === 'hotel') return 'hotel';
  if(cat === 'nature') return 'nature';
  if(cat === 'attraction') return 'attraction';
  return 'other';
}

function mapTypeToCategory(types?: string[]): TripStop['category'] {
  if(!types || types.length === 0) return 'other';
  const t = new Set(types);
  if(['restaurant','cafe','bakery','bar','food'].some(x => t.has(x))) return 'food';
  if(['hotel','lodging','resort'].some(x => t.has(x))) return 'hotel';
  if(['park','national_park','hiking_area','campground','beach'].some(x => t.has(x))) return 'nature';
  if(['tourist_attraction','museum','art_gallery','amusement_park','zoo'].some(x => t.has(x))) return 'attraction';
  if(['locality','administrative_area_level_1'].some(x => t.has(x))) return 'city';
  return 'other';
}
