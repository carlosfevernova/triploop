import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { callOpenRouterJson, readTripCache, contentHash } from '@/lib/ai-openrouter';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface Body { slug: string; locale?: 'en' | 'es'; }

export interface PhotoSpot {
  stop_name: string;
  spot: string;
  worth_it: 'yes' | 'skip' | 'maybe';
  best_time: string;
  best_angle: string;
  wait_time_min: number;
  tips: string;
}
export interface PhotoSpotsResult {
  spots: PhotoSpot[];
  generated_at: string;
  provider: string;
}

const SYSTEM_ES = `Eres un fotógrafo de viajes experto. Dado un itinerario, identifica los MEJORES spots de foto por parada y clasifica si valen la pena.

REGLAS:
- 4-8 spots totales priorizando los MÁS icónicos.
- worth_it: "yes" (must-shoot), "maybe" (bonito si tienes tiempo), "skip" (turístico saturado, hay mejor cerca).
- best_time: hora específica ("golden hour 6:30 AM", "blue hour post-sunset", "noon avoid queue").
- best_angle: técnico ("desde mirador inferior", "reflejo en agua durante wide-angle").
- wait_time_min: estimado tiempo espera para foto sin gente (0-60 min).
- tips: 1 tip práctico ("evita fines de semana", "usa polarizador").
- Español neutral. JSON válido sin markdown.`;

const SYSTEM_EN = `You are an expert travel photographer. Given an itinerary, identify BEST photo spots per stop and rate if they're worth it.

RULES:
- 4-8 total spots prioritizing MOST iconic.
- worth_it: "yes" (must-shoot), "maybe" (nice if you have time), "skip" (touristy overcrowded, better nearby).
- best_time: specific hour ("golden hour 6:30 AM", "blue hour post-sunset", "noon avoid queue").
- best_angle: technical ("from lower viewpoint", "water reflection with wide-angle").
- wait_time_min: estimated wait for people-free shot (0-60 min).
- tips: 1 practical tip ("avoid weekends", "use polarizer").
- Valid JSON no markdown.`;

function schema(){
  return `{ "spots": [ { "stop_name": string, "spot": string(< 80 chars), "worth_it": "yes"|"skip"|"maybe", "best_time": string, "best_angle": string, "wait_time_min": number, "tips": string } ] }`;
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 8, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    if(!body.slug) return NextResponse.json({ error: 'slug_required' }, { status: 400 });
    const locale = body.locale || 'en';

    const sb = createAdminClient();
    const { trip, cached, hasMetadata } = await readTripCache<PhotoSpotsResult>(
      sb as unknown as Parameters<typeof readTripCache>[0],
      body.slug,
      `photo_spots_${locale}`
    );
    if(!trip) return NextResponse.json({ error: 'trip_not_found' }, { status: 404 });

    const stops = (Array.isArray(trip.stops) ? trip.stops : []) as Array<{ name: string }>;
    const hash = contentHash(stops.map(s => s.name).join('|') + locale);
    if(cached && (cached as PhotoSpotsResult & { hash?: string }).hash === hash){
      return NextResponse.json({ photo_spots: cached, source: 'cache' });
    }

    const system = locale === 'es' ? SYSTEM_ES : SYSTEM_EN;
    const userPrompt = `${locale === 'es' ? 'Itinerario' : 'Itinerary'}: ${trip.title}
${locale === 'es' ? 'Paradas' : 'Stops'}: ${stops.map(s => s.name).join(', ')}

${locale === 'es' ? 'Devuelve JSON schema' : 'Return JSON schema'}:
${schema()}`;

    const result = await callOpenRouterJson<{ spots: PhotoSpot[] }>(system, userPrompt, { maxTokens: 1500, title: 'TripLoop Photo Spots', timeoutMs: 30000 });
    if(!result) return NextResponse.json({ error: 'ai_unavailable' }, { status: 503 });

    const photoSpots: PhotoSpotsResult & { hash: string } = {
      spots: result.data.spots,
      generated_at: new Date().toISOString(),
      provider: result.provider,
      hash
    };

    if(hasMetadata){
      try {
        const existingMeta = (trip.metadata || {}) as Record<string, unknown>;
        await sb.from('trips').update({
          metadata: { ...existingMeta, [`photo_spots_${locale}`]: photoSpots }
        }).eq('slug', body.slug);
      } catch { /* soft-fail */ }
    }

    return NextResponse.json({ photo_spots: photoSpots, source: 'ai' });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
