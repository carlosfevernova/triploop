import { rateLimit, getClientKey } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { isProSubscription } from '@/lib/stripe-config';
import { isAdminAuthed } from '@/lib/admin-guard';
import { matchTemplate, extractRegionKey } from '@/lib/template-matcher';
import { getCuratedPOIs } from '@/lib/curated-pois';
import { promptCacheGet, promptCacheSet } from '@/lib/prompt-cache';
import type { TripStop } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

// S30: Server-Sent Events streaming del /api/ai/generate-trip.
// UX pattern: stops aparecen en el mapa client-side mientras backend genera.
// Perception latency: 0ms para el primer stop en curated hit, ~2s para AI first stop.

interface Body {
  prompt: string;
  locale?: 'en' | 'es';
  currency?: string;
  unit_system?: 'metric' | 'imperial';
  context?: {
    budget?: 'low' | 'mid' | 'high';
    travelers?: number;
    tripType?: string;
    interests?: string[];
    pace?: string;
    hasKids?: boolean;
    kidAges?: string;
  };
}

interface AiStop {
  name: string;
  lat: number;
  lng: number;
  category?: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'other';
  duration_min?: number;
  notes?: string;
}
interface AiTripSpec {
  title: string;
  region_hint?: string;
  origin_city?: string;
  destination_city?: string;
  days_count: number;
  travelers_count?: number;
  stops: AiStop[];
}

const FREE_TRIP_LIMIT = 3;
const SYSTEM_EN = `Expert trip planner. Return JSON itinerary.\nRULES: REAL coords (5 decimals), 4-10 stops <7d/6-14 longer, durations cities 3-8h parks 4-12h, JSON ONLY.`;
const SYSTEM_ES = `Experto trip planner. JSON con itinerario.\nREGLAS: coords REALES (5 dec), 4-10 paradas <7d/6-14 largos, duraciones cities 3-8h parks 4-12h, SOLO JSON.`;

function schema(){
  return `{"title":string,"region_hint":string,"origin_city":string,"destination_city":string,"days_count":number,"travelers_count":number,"stops":[{"name":string,"lat":number,"lng":number,"category":"city"|"attraction"|"nature"|"food"|"hotel"|"other","duration_min":number,"notes":string}]}`;
}

async function callOpenRouter(system: string, user: string): Promise<AiTripSpec | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if(!key) return null;
  const models = ['google/gemma-4-26b-a4b-it:free', 'openai/gpt-oss-20b:free', 'openrouter/free'];
  for(const model of models){
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'authorization': `Bearer ${key}`,
          'content-type': 'application/json',
          'HTTP-Referer': 'https://triploop-six.vercel.app',
          'X-Title': 'TripLoop Stream'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
        })
      });
      clearTimeout(timeout);
      if(!r.ok) continue;
      const raw = (await r.json())?.choices?.[0]?.message?.content || '';
      try { return JSON.parse(raw) as AiTripSpec; } catch {
        const m = raw.match(/\{[\s\S]*\}/);
        if(m){ try { return JSON.parse(m[0]) as AiTripSpec; } catch {} }
      }
    } catch { continue; }
  }
  return null;
}

function sseChunk(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 8, windowSec: 60 });
  if(!rl.ok) return new Response(sseChunk('error', { error: 'rate_limited' }), {
    status: 429,
    headers: { 'content-type': 'text/event-stream' }
  });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(sseChunk('error', { error: 'invalid_body' }), { status: 400, headers: { 'content-type': 'text/event-stream' } });
  }
  if(!body.prompt || body.prompt.trim().length < 10){
    return new Response(sseChunk('error', { error: 'prompt_too_short' }), { status: 400, headers: { 'content-type': 'text/event-stream' } });
  }
  const locale = body.locale || 'en';

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller){
      const emit = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sseChunk(event, data)));
      };
      const done = () => controller.close();

      try {
        // Region hint immediately
        const region = extractRegionKey(body.prompt);
        emit('phase', { phase: 'thinking' });
        if(region) emit('region_hint', { region, source: 'keywords' });

        // === Cache lookup ===
        const cached = promptCacheGet<AiTripSpec>(body.prompt, locale);
        let spec: AiTripSpec | null = cached;
        let source: 'cache' | 'curated' | 'ai' = 'ai';
        let templateSlug: string | null = null;

        if(cached){
          source = 'cache';
        } else {
          // === Curated template match ===
          const match = matchTemplate(body.prompt);
          if(match.matched && match.template){
            const t = match.template;
            spec = {
              title: t.title, region_hint: t.region,
              origin_city: t.origin_city, destination_city: t.destination_city,
              days_count: t.days_count, travelers_count: 2,
              stops: t.stops.map(s => ({
                name: s.name, lat: s.lat, lng: s.lng,
                category: (s.category as AiStop['category']) || 'other',
                duration_min: s.duration_min
              }))
            };
            source = 'curated';
            templateSlug = t.slug;
            emit('phase', { phase: 'matched_template', template_slug: t.slug, confidence: match.confidence });
          }
        }

        // === AI fallback ===
        if(!spec){
          emit('phase', { phase: 'ai_generating' });
          const curatedRefs = region ? getCuratedPOIs(region, { onlyIconic: true, limit: 15 }) : [];
          const poiContext = curatedRefs.length > 0
            ? `\nVerified POIs region:\n${curatedRefs.map(p => `- ${p.name} (${p.lat.toFixed(4)},${p.lng.toFixed(4)}) [${p.category}]`).join('\n')}`
            : '';
          const user = `${locale === 'es' ? 'Viaje' : 'Trip'}: "${body.prompt.slice(0, 800)}"${poiContext}\nJSON schema: ${schema()}`;
          const system = locale === 'es' ? SYSTEM_ES : SYSTEM_EN;
          spec = await callOpenRouter(system, user);
          if(spec){
            try { promptCacheSet(body.prompt, locale, spec); } catch {}
          }
        }

        if(!spec){
          emit('error', { error: 'ai_unavailable' });
          done();
          return;
        }

        // === Sanitize + stream stops uno por uno ===
        const validStops = (spec.stops || []).slice(0, 20).filter(s =>
          typeof s.lat === 'number' && typeof s.lng === 'number' && s.name && s.name.length > 1
        );
        if(validStops.length === 0){
          emit('error', { error: 'no_valid_stops' });
          done();
          return;
        }

        emit('meta', {
          title: spec.title,
          days_count: spec.days_count,
          origin_city: spec.origin_city,
          destination_city: spec.destination_city,
          total_stops: validStops.length,
          source,
          template_slug: templateSlug
        });

        // Stream each stop con pequeño delay para efecto progressive
        for(let i = 0; i < validStops.length; i++){
          const s = validStops[i];
          emit('stop', { index: i, name: s.name, lat: s.lat, lng: s.lng, category: s.category, duration_min: s.duration_min, notes: s.notes });
          // Delay stagger 150ms (o menos si AI ya tarda mucho)
          if(source === 'curated' || source === 'cache'){
            await new Promise(r => setTimeout(r, 150));
          }
        }

        // === Persist trip to DB ===
        emit('phase', { phase: 'saving' });
        const sb = createAdminClient();
        const adminOverride = await isAdminAuthed();
        let owner_id: string | null = null;
        try {
          const authClient = createClientFromRequest(req);
          const { data: { user: u } } = await authClient.auth.getUser();
          owner_id = u?.id ?? null;
        } catch {}
        if(owner_id && !adminOverride){
          const { data: sub } = await sb.from('subscriptions').select('status').eq('user_id', owner_id).maybeSingle();
          if(!isProSubscription(sub ? { user_id: owner_id, status: sub.status } : null)){
            const { count } = await sb.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', owner_id);
            if((count || 0) >= FREE_TRIP_LIMIT){
              emit('error', { error: 'free_limit_reached', limit: FREE_TRIP_LIMIT });
              done();
              return;
            }
          }
        }
        const { data: slugRow } = await sb.rpc('gen_trip_slug');
        const slug = (slugRow as string) || `ai-${Date.now().toString(36)}`;
        const tripStops: TripStop[] = validStops.map((s, i) => ({
          id: `ai-${slug}-${i}`, name: s.name, lat: s.lat, lng: s.lng,
          duration_min: s.duration_min, category: s.category, notes: s.notes
        }));
        const { data: trip, error } = await sb.from('trips').insert({
          slug, title: spec.title || (locale === 'es' ? 'Mi viaje IA' : 'My AI trip'),
          origin_city: spec.origin_city, destination_city: spec.destination_city,
          days_count: Math.max(1, Math.min(spec.days_count || 3, 30)),
          travelers_count: spec.travelers_count || 2,
          unit_system: body.unit_system || 'imperial',
          currency: body.currency || 'USD',
          locale, stops: tripStops, is_public: true, owner_id
        }).select().single();

        if(error || !trip){
          emit('error', { error: 'insert_failed', detail: error?.message });
          done();
          return;
        }

        emit('complete', { slug: trip.slug, trip_id: trip.id, source, template_slug: templateSlug });
        done();
      } catch (e) {
        emit('error', { error: (e as Error).message });
        done();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
      'x-accel-buffering': 'no'
    }
  });
}
