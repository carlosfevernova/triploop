import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { isProSubscription } from '@/lib/stripe-config';
import { isAdminAuthed } from '@/lib/admin-guard';
import { matchTemplate, extractRegionKey } from '@/lib/template-matcher';
import { getCuratedPOIs } from '@/lib/curated-pois';
import { promptCacheGet, promptCacheSet } from '@/lib/prompt-cache';
import { validateTrip } from '@/lib/trip-validator';
import { logAICall } from '@/lib/ai-cost-tracker';
import type { TripStop } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface Body {
  prompt: string;              // "5 días por California, me gusta la naturaleza y comida"
  locale?: 'en' | 'es';
  currency?: string;
  unit_system?: 'metric' | 'imperial';
  context?: {
    budget?: 'low' | 'mid' | 'high';
    travelers?: number;
    tripType?: 'family' | 'couple' | 'friends' | 'solo' | 'business';
    interests?: string[];
    pace?: 'relaxed' | 'balanced' | 'packed';
    hasKids?: boolean;
    kidAges?: string;
    accessibility?: boolean;
  };
}

interface AiTripSpec {
  title: string;
  region_hint?: 'california' | 'nevada' | 'arizona' | 'utah' | 'southwest' | 'spain' | 'other';
  origin_city?: string;
  destination_city?: string;
  days_count: number;
  travelers_count?: number;
  stops: Array<{
    name: string;
    lat: number;
    lng: number;
    category?: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'other';
    duration_min?: number;
    notes?: string;
  }>;
}

const FREE_TRIP_LIMIT = 3;

// S29: prompts compactados <250 tokens para menor latencia AI.
const SYSTEM_PROMPT_ES = `Experto trip planner. Devuelve JSON con itinerario.

REGLAS:
- Coords REALES (5 decimales) de Google Maps
- 4-10 paradas por viaje <7d, 6-14 para +7d
- Duraciones: cities 3-8h, parks 4-12h, museums 2-4h
- SOLO JSON válido, sin markdown
- title descriptivo español`;

const SYSTEM_PROMPT_EN = `Expert trip planner. Return JSON itinerary.

RULES:
- REAL coords (5 decimals) Google Maps
- 4-10 stops for <7d trips, 6-14 for longer
- Durations: cities 3-8h, parks 4-12h, museums 2-4h
- JSON ONLY, no markdown
- title descriptive`;

function jsonSchema(locale: 'en' | 'es'){
  return `{
  "title": string,
  "region_hint": "california"|"nevada"|"arizona"|"utah"|"southwest"|"spain"|"other",
  "origin_city": string,
  "destination_city": string,
  "days_count": number,
  "travelers_count": number,
  "stops": [
    { "name": string, "lat": number, "lng": number, "category": "city"|"attraction"|"nature"|"food"|"hotel"|"other", "duration_min": number, "notes": string(1-2 ${locale === 'es' ? 'oraciones' : 'sentences'}) }
  ]
}`;
}

async function callFireworks(system: string, user: string): Promise<AiTripSpec | null> {
  const key = process.env.FIREWORKS_API_KEY;
  if(!key) return null;
  try {
    const r = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/deepseek-v3',
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if(!r.ok) return null;
    const data = await r.json();
    const raw = data?.choices?.[0]?.message?.content || '';
    return extractSpec(raw);
  } catch { return null; }
}

async function callGroq(system: string, user: string): Promise<AiTripSpec | null> {
  const key = process.env.GROQ_API_KEY;
  if(!key) return null;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if(!r.ok) return null;
    const data = await r.json();
    const raw = data?.choices?.[0]?.message?.content || '';
    return extractSpec(raw);
  } catch { return null; }
}

async function callAnthropic(system: string, user: string): Promise<AiTripSpec | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        system,
        messages: [{ role: 'user', content: user }]
      })
    });
    if(!r.ok) return null;
    const data = await r.json();
    const raw = data?.content?.[0]?.text || '';
    return extractSpec(raw);
  } catch { return null; }
}

// OpenRouter — modelos gratis 100%, sin tarjeta, sin restricción email
// Modelos free: deepseek/deepseek-chat-v3-0324:free, meta-llama/llama-3.3-70b-instruct:free, google/gemini-2.0-flash-exp:free
async function callOpenRouter(system: string, user: string): Promise<AiTripSpec | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if(!key) return null;
  // Modelos free 2026-08. openrouter/free routea a proveedores rápidos (nvidia, gemma).
  // Timeout 20s por modelo — evita bloquear producción si un provider rate-limita.
  const models = [
    'openrouter/free',
    'google/gemma-4-31b-it:free',
    'nvidia/nemotron-3-super-120b-a12b:free'
  ];
  for(const model of models){
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'authorization': `Bearer ${key}`,
          'content-type': 'application/json',
          'HTTP-Referer': 'https://triploop-six.vercel.app',
          'X-Title': 'TripLoop AI Generator'
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ]
        })
      });
      clearTimeout(timeout);
      if(!r.ok) continue;
      const data = await r.json();
      const raw = data?.choices?.[0]?.message?.content || '';
      const spec = extractSpec(raw);
      if(spec) return spec;
    } catch { continue; }
  }
  return null;
}

// Cloudflare Workers AI — free tier ~10k req/día, Llama 3
async function callCloudflareAI(system: string, user: string): Promise<AiTripSpec | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  if(!accountId || !token) return null;
  try {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`, {
      method: 'POST',
      headers: { 'authorization': `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 3000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if(!r.ok) return null;
    const data = await r.json();
    const raw = data?.result?.response || '';
    return extractSpec(raw);
  } catch { return null; }
}

function extractSpec(raw: string): AiTripSpec | null {
  try {
    const parsed = JSON.parse(raw);
    if(parsed?.stops && Array.isArray(parsed.stops) && parsed.stops.length > 0) return parsed as AiTripSpec;
  } catch {}
  const match = raw.match(/\{[\s\S]*\}/);
  if(match){
    try {
      const parsed = JSON.parse(match[0]);
      if(parsed?.stops && Array.isArray(parsed.stops) && parsed.stops.length > 0) return parsed as AiTripSpec;
    } catch {}
  }
  return null;
}

export async function POST(req: Request){
  // Rate limit generoso pero protectivo
  const rl = rateLimit(getClientKey(req), { limit: 8, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const _startTime = Date.now();  // S43 P1: track total latency
  try {
    const body = (await req.json()) as Body;
    if(!body.prompt || body.prompt.trim().length < 10){
      return NextResponse.json({ error: 'prompt_too_short', hint: 'Describe your trip in at least 10 characters.' }, { status: 400 });
    }

    const locale = body.locale || 'en';

    // === S29 PROMPT CACHE ===
    // Hit → return cached AiTripSpec en <10ms.
    const cachedSpec = promptCacheGet<AiTripSpec>(body.prompt, locale);
    let cacheHit = !!cachedSpec;

    // === S28 CURATED-FIRST ===
    // Antes de gastar tiempo/tokens con AI, intentar match con templates verificados.
    // Match hit → return en <100ms sin llamar AI.
    const curatedMatch = matchTemplate(body.prompt);
    let curatedTripSpec: AiTripSpec | null = null;
    let curatedProviderTag: string | null = null;
    if(curatedMatch.matched && curatedMatch.template){
      const t = curatedMatch.template;
      const translations = locale === 'es' ? null : null; // el endpoint devuelve English base; frontend applyLocale hará ES si aplica
      curatedTripSpec = {
        title: t.title,
        region_hint: t.region as AiTripSpec['region_hint'],
        origin_city: t.origin_city,
        destination_city: t.destination_city,
        days_count: t.days_count,
        travelers_count: 2,
        stops: t.stops.map(s => ({
          name: s.name, lat: s.lat, lng: s.lng,
          category: (s.category as 'city'|'attraction'|'nature'|'food'|'hotel'|'other') || 'other',
          duration_min: s.duration_min,
          notes: undefined
        }))
      };
      curatedProviderTag = `curated:${t.slug}`;
      void translations; // usage guard
    }

    const system = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;

    // === S29 INJECT CURATED POIS EN AI CONTEXT ===
    // Da al AI POIs verificados de la región detectada → no inventa coords, más rápido, más preciso.
    const detectedRegion = extractRegionKey(body.prompt);
    const curatedRefs = detectedRegion ? getCuratedPOIs(detectedRegion, { onlyIconic: true, limit: 15 }) : [];
    const poiContext = curatedRefs.length > 0
      ? `\n\n${locale === 'es' ? 'POIs verificados en la región (usa estos si aplican, no inventes coords)' : 'Verified POIs in region (prefer these, don\'t invent coords)'}:\n${curatedRefs.map(p => `- ${p.name} (${p.lat.toFixed(4)},${p.lng.toFixed(4)}) [${p.category}]`).join('\n')}`
      : '';

    const user = `${locale === 'es' ? 'Descripción del viaje' : 'User trip description'}: "${body.prompt.slice(0, 800)}"${poiContext}

${locale === 'es' ? 'Devuelve JSON con schema' : 'Return JSON with schema'}:
${jsonSchema(locale)}`;

    // Cadena de fallback: OpenRouter free → Cloudflare free → Fireworks → Groq → Anthropic
    type Provider = 'openrouter' | 'cloudflare' | 'fireworks' | 'groq' | 'anthropic' | 'none' | 'curated' | 'cache';
    let spec: AiTripSpec | null = cachedSpec || curatedTripSpec;
    let provider: Provider = cachedSpec ? 'cache' : (curatedTripSpec ? 'curated' : 'none');
    if(!spec) spec = await callOpenRouter(system, user);
    if(!provider || provider === 'none') provider = spec ? 'openrouter' : 'none';
    if(!spec){
      spec = await callCloudflareAI(system, user);
      provider = spec ? 'cloudflare' : 'none';
    }
    if(!spec){
      spec = await callFireworks(system, user);
      provider = spec ? 'fireworks' : 'none';
    }
    if(!spec){
      spec = await callGroq(system, user);
      provider = spec ? 'groq' : 'none';
    }
    if(!spec){
      spec = await callAnthropic(system, user);
      provider = spec ? 'anthropic' : 'none';
    }

    if(!spec){
      return NextResponse.json({
        error: 'ai_unavailable',
        hint: 'AI providers not configured. Set OPENROUTER_API_KEY (100% free, recomendado), CLOUDFLARE_AI_TOKEN+CLOUDFLARE_ACCOUNT_ID, FIREWORKS_API_KEY, GROQ_API_KEY, or ANTHROPIC_API_KEY.'
      }, { status: 503 });
    }

    // Validate + sanitize
    const stops = (spec.stops || []).slice(0, 20).filter(s =>
      typeof s.lat === 'number' && typeof s.lng === 'number' && s.name && s.name.length > 1
    );
    if(stops.length === 0){
      return NextResponse.json({ error: 'no_valid_stops', ai_provider: provider }, { status: 422 });
    }

    // Auth check + free tier gate
    let owner_id: string | null = null;
    try {
      const authClient = createClientFromRequest(req);
      const { data: { user } } = await authClient.auth.getUser();
      owner_id = user?.id ?? null;
    } catch {}

    const sb = createAdminClient();
    // Admin preview override: skip Pro gate cuando cookie Cside activa
    const adminOverride = await isAdminAuthed();
    if(owner_id && !adminOverride){
      const { data: sub } = await sb.from('subscriptions').select('status').eq('user_id', owner_id).maybeSingle();
      if(!isProSubscription(sub ? { user_id: owner_id, status: sub.status } : null)){
        const { count } = await sb.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', owner_id);
        if((count || 0) >= FREE_TRIP_LIMIT){
          return NextResponse.json({ error: 'free_limit_reached', limit: FREE_TRIP_LIMIT }, { status: 402 });
        }
      }
    }

    // Genera slug via RPC + insert trip
    const { data: slugRow } = await sb.rpc('gen_trip_slug');
    const slug = (slugRow as string) || `ai-${Date.now().toString(36)}`;

    const tripStops: TripStop[] = stops.map((s, i) => ({
      id: `ai-${slug}-${i}`,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      duration_min: s.duration_min,
      category: (s.category as TripStop['category']) || 'other',
      notes: s.notes
    }));

    const { data: trip, error } = await sb.from('trips').insert({
      slug,
      title: spec.title || (locale === 'es' ? 'Mi viaje generado por IA' : 'My AI-generated trip'),
      origin_city: spec.origin_city,
      destination_city: spec.destination_city,
      days_count: Math.max(1, Math.min(spec.days_count || 3, 30)),
      travelers_count: spec.travelers_count || 2,
      unit_system: body.unit_system || 'imperial',
      currency: body.currency || 'USD',
      locale,
      stops: tripStops,
      is_public: true,
      owner_id
    }).select().single();

    if(error) return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 });

    // S29: guarda AI response en cache si no fue hit ni curated
    if(!cacheHit && provider !== 'curated' && provider !== 'cache' && spec){
      try { promptCacheSet(body.prompt, locale, spec); } catch {}
    }

    // S40 P0.2: validate itinerary before returning
    const validation = validateTrip(tripStops, spec.days_count);

    // S43 P1: log AI call para observability admin dashboard
    void logAICall({
      endpoint: 'generate-trip',
      provider,
      latency_ms: Date.now() - _startTime,
      success: true,
      source: (provider === 'curated' ? 'curated' : provider === 'cache' ? 'cache' : 'ai'),
      metadata: { validation_score: validation.score, stops: tripStops.length, region: spec.region_hint }
    });

    return NextResponse.json({
      trip,
      ai_provider: provider,
      source: provider === 'curated' ? 'curated' : (provider === 'cache' ? 'cache' : 'ai'),
      curated_template_slug: curatedProviderTag,
      match_confidence: curatedMatch.confidence,
      match_reasons: curatedMatch.reasons,
      curated_poi_context_count: curatedRefs.length,
      stops_count: tripStops.length,
      region_hint: spec.region_hint || 'other',
      validation: {
        valid: validation.valid,
        score: validation.score,
        issues: validation.issues.slice(0, 10)
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
