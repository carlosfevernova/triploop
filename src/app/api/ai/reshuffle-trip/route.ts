import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { callOpenRouterJson } from '@/lib/ai-openrouter';
import type { TripStop } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface Body {
  slug: string;
  locale?: 'en' | 'es';
  disruption: {
    type: 'flight_delay' | 'weather_closure' | 'tired' | 'sick' | 'schedule_change';
    lost_hours?: number;         // e.g. 6 (delay), 24 (canceled day)
    missed_stop_ids?: string[];  // stops que ya no llegamos
    keep_stop_ids?: string[];    // stops must-see
  };
  preferences?: {
    prefer_fewer_stops?: boolean;
    prefer_keep_hotel?: boolean;
  };
}

interface ReshuffleResult {
  new_stops: Array<{ id: string; name: string; lat: number; lng: number; day?: number; duration_min?: number; category?: string; notes?: string; is_new?: boolean }>;
  summary: string;
  dropped: string[];        // names of dropped stops
  added: string[];          // names of new stops added (suggestions)
  reasoning: string;
}

const SYSTEM_ES = `Eres un experto en logística de viajes en tiempo real. Un usuario tuvo una disrupción (vuelo demorado, clima, cansancio). Necesitas REORGANIZAR el itinerario para maximizar valor con menos tiempo.

REGLAS:
- Mantén stops en keep_stop_ids si vienen (must-see del usuario).
- Elimina/mueve stops en missed_stop_ids.
- Prioriza stops icónicos por región conocidos.
- Si prefer_fewer_stops → menos paradas pero más tiempo cada una.
- Si prefer_keep_hotel → mantén día final en misma ciudad.
- Puedes AÑADIR 1-2 stops nuevos alternativos si mejoran el plan (marcar is_new=true).
- Coordenadas REALES (5 decimales) de lugares existentes.
- summary: 1-2 oraciones qué cambió.
- reasoning: 2-3 oraciones POR QUÉ estos cambios (ej: "Con 6h menos, saltamos 2 paradas de menor impacto y agregamos San Luis Obispo como pit stop natural en la ruta").
- JSON válido sin markdown.`;

const SYSTEM_EN = `You are an expert real-time trip logistics advisor. User had a disruption (flight delay, weather, tired). You need to REORGANIZE the itinerary to maximize value with less time.

RULES:
- Keep stops in keep_stop_ids if provided (user must-see).
- Remove/move stops in missed_stop_ids.
- Prioritize iconic stops for known regions.
- If prefer_fewer_stops → fewer stops but more time each.
- If prefer_keep_hotel → keep last day in same city.
- Can ADD 1-2 new alternative stops if they improve the plan (mark is_new=true).
- REAL coordinates (5 decimals) of existing places.
- summary: 1-2 sentences what changed.
- reasoning: 2-3 sentences WHY these changes.
- Valid JSON no markdown.`;

function schema(){
  return `{
  "new_stops": [ { "id": string, "name": string, "lat": number, "lng": number, "day": number, "duration_min": number, "category": "city"|"attraction"|"nature"|"food"|"hotel"|"other", "notes": string, "is_new": boolean } ],
  "summary": string,
  "dropped": [ string ],
  "added": [ string ],
  "reasoning": string
}`;
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 6, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    if(!body.slug || !body.disruption?.type) return NextResponse.json({ error: 'slug_and_disruption_required' }, { status: 400 });
    const locale = body.locale || 'en';

    const sb = createAdminClient();
    const { data: trip, error } = await sb.from('trips')
      .select('slug, title, days_count, region, stops')
      .eq('slug', body.slug).maybeSingle();
    if(error || !trip) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });

    const stops = (Array.isArray(trip.stops) ? trip.stops : []) as TripStop[];
    const missed = new Set(body.disruption.missed_stop_ids || []);
    const keepIds = new Set(body.disruption.keep_stop_ids || []);

    const stopsSerialized = stops.map(s =>
      `${s.id === undefined ? '' : `[id:${s.id}]`} ${s.name} (${s.lat},${s.lng})${missed.has(s.id!) ? ' — MISSED' : ''}${keepIds.has(s.id!) ? ' — MUST-KEEP' : ''}`
    ).join('\n');

    const disruptionLabel = {
      flight_delay: locale === 'es' ? `Vuelo demorado ${body.disruption.lost_hours || 6} horas` : `Flight delayed ${body.disruption.lost_hours || 6} hours`,
      weather_closure: locale === 'es' ? 'Cierre por clima' : 'Weather closure',
      tired: locale === 'es' ? 'Cansancio — necesita ritmo relajado' : 'Tired — needs relaxed pace',
      sick: locale === 'es' ? 'Enfermedad — reducir actividades' : 'Sick — reduce activities',
      schedule_change: locale === 'es' ? 'Cambio de horarios' : 'Schedule change'
    }[body.disruption.type];

    const prefs = [
      body.preferences?.prefer_fewer_stops ? (locale === 'es' ? 'menos paradas' : 'fewer stops') : null,
      body.preferences?.prefer_keep_hotel ? (locale === 'es' ? 'mantener último hotel' : 'keep last hotel') : null
    ].filter(Boolean).join(', ') || (locale === 'es' ? 'sin preferencias' : 'no preferences');

    const system = locale === 'es' ? SYSTEM_ES : SYSTEM_EN;
    const userPrompt = `${locale === 'es' ? 'Viaje' : 'Trip'}: ${trip.title}
${locale === 'es' ? 'Región' : 'Region'}: ${trip.region || 'unknown'}
${locale === 'es' ? 'Días' : 'Days'}: ${trip.days_count}
${locale === 'es' ? 'Disrupción' : 'Disruption'}: ${disruptionLabel}
${locale === 'es' ? 'Preferencias' : 'Preferences'}: ${prefs}

${locale === 'es' ? 'Paradas actuales' : 'Current stops'}:
${stopsSerialized}

${locale === 'es' ? 'Devuelve JSON schema' : 'Return JSON schema'}:
${schema()}`;

    const result = await callOpenRouterJson<ReshuffleResult>(system, userPrompt, { maxTokens: 3000, title: 'TripLoop Reshuffle', timeoutMs: 30000 });
    if(!result) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 });

    // Sanitize new_stops
    const newStops = (result.data.new_stops || []).slice(0, 20).filter(s =>
      typeof s.lat === 'number' && typeof s.lng === 'number' && s.name
    );

    return NextResponse.json({
      reshuffle: {
        ...result.data,
        new_stops: newStops
      },
      provider: result.provider
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
