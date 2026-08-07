'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TripMap } from '@/components/trip/TripMap';
import { ItineraryPanel } from '@/components/trip/ItineraryPanel';
import { AiSuggestionsPanel } from '@/components/trip/AiSuggestionsPanel';
import { createClient } from '@/lib/supabase-browser';
import type { PlaceSuggestion, RouteLeg, Trip, TripStop } from '@/lib/types';

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
  const [forking, setForking] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  // Detect current user
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/trips/${slug}`);
        const data = await r.json();
        if(!r.ok || !data.trip) throw new Error(data.error || 'not_found');
        setTrip(data.trip);
        if(data.trip.route_geometry?.legs) setLegs(data.trip.route_geometry.legs);
        lastSavedRef.current = JSON.stringify({ stops: data.trip.stops, ...settingsOf(data.trip) });
      } catch (e) { setError((e as Error).message); }
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

  const isOwnerOrAnon = !trip?.owner_id || trip?.owner_id === userId;
  const canFork = userId && trip?.owner_id && trip.owner_id !== userId; // signed in + no soy owner

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
  };

  if(loading) return <FullscreenMessage>Cargando…</FullscreenMessage>;
  if(error || !trip) return <FullscreenMessage>{isEs ? 'Viaje no encontrado' : 'Trip not found'}</FullscreenMessage>;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-ink-800">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 text-white">
            <span className="font-display text-sm font-semibold">t</span>
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">TripLoop</span>
        </Link>
        <div className="flex items-center gap-2">
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

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <TripMap
            stops={trip.stops}
            polyline={routePolyline}
            hoveredStopId={hoveredStopId}
            onMarkerClick={(id) => setHoveredStopId(id)}
          />
        </div>
        <div className="w-full max-w-md">
          <ItineraryPanel
            trip={trip}
            legs={legs}
            onStopsChange={(stops) => setTrip((t) => t ? { ...t, stops } : t)}
            onHover={setHoveredStopId}
            onSettingsChange={(patch) => setTrip((t) => t ? { ...t, ...patch } : t)}
            saving={saving}
            isEs={isEs}
          />
        </div>
      </div>
    </div>
  );
}

function FullscreenMessage({ children }: { children: React.ReactNode }){
  return <div className="grid min-h-screen place-items-center text-ink-500">{children}</div>;
}

function settingsOf(t: Trip){
  return { title: t.title, unit_system: t.unit_system, currency: t.currency };
}
