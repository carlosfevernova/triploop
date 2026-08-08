import { NextResponse } from 'next/server';
import type { PlaceSuggestion } from '@/lib/types';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

interface Body {
  destination?: string;
  origin_city?: string;
  destination_city?: string;
  days_count?: number;
  travelers_count?: number;
  interests?: string[];
  locale?: 'en' | 'es';
  existing_stops?: Array<{ name: string; lat: number; lng: number }>;
}

interface AiStop {
  name: string;
  description: string;
  category: 'city' | 'attraction' | 'nature' | 'food' | 'hotel' | 'hidden-gem';
  approx_lat: number;
  approx_lng: number;
  suggested_duration_min: number;
  best_time: 'morning' | 'afternoon' | 'evening' | 'any';
}

const CA_FALLBACK: AiStop[] = [
  { name: 'Golden Gate Bridge', description: 'Iconic red suspension bridge with sweeping views of the Pacific and San Francisco Bay.', category: 'attraction', approx_lat: 37.8199, approx_lng: -122.4783, suggested_duration_min: 60, best_time: 'morning' },
  { name: 'Alcatraz Island', description: 'Historic federal prison on an island — book tickets 2+ weeks ahead.', category: 'attraction', approx_lat: 37.8267, approx_lng: -122.4230, suggested_duration_min: 180, best_time: 'morning' },
  { name: 'Muir Woods National Monument', description: 'Ancient redwood grove 30 min north of SF — magical morning walk.', category: 'nature', approx_lat: 37.8917, approx_lng: -122.5717, suggested_duration_min: 120, best_time: 'morning' },
  { name: 'Napa Valley', description: 'World-class wine country — Silverado Trail is the scenic route.', category: 'food', approx_lat: 38.5025, approx_lng: -122.2654, suggested_duration_min: 360, best_time: 'afternoon' },
  { name: 'Big Sur / Bixby Bridge', description: 'Most photographed stretch of Highway 1. Sunset here is unforgettable.', category: 'nature', approx_lat: 36.3717, approx_lng: -121.9027, suggested_duration_min: 180, best_time: 'evening' },
  { name: 'Monterey Bay Aquarium', description: 'World-renowned aquarium with tunnel of sardines and jellyfish.', category: 'attraction', approx_lat: 36.6182, approx_lng: -121.9017, suggested_duration_min: 180, best_time: 'any' },
  { name: 'Hearst Castle', description: 'Opulent hilltop mansion built by newspaper magnate. Tour required.', category: 'attraction', approx_lat: 35.6852, approx_lng: -121.1683, suggested_duration_min: 180, best_time: 'afternoon' },
  { name: 'Santa Barbara', description: 'The "American Riviera" — Spanish colonial + beaches. Perfect midway stop.', category: 'city', approx_lat: 34.4208, approx_lng: -119.6982, suggested_duration_min: 240, best_time: 'any' },
  { name: 'Griffith Observatory', description: 'Best free view of the Hollywood sign + LA skyline. Go 1h before sunset.', category: 'attraction', approx_lat: 34.1184, approx_lng: -118.3004, suggested_duration_min: 90, best_time: 'evening' },
  { name: 'Venice Beach Boardwalk', description: 'Iconic beach with street performers, muscle beach and roller skaters.', category: 'attraction', approx_lat: 33.9850, approx_lng: -118.4695, suggested_duration_min: 120, best_time: 'afternoon' },
  { name: 'Yosemite Valley', description: 'Granite cliffs, waterfalls, sequoias. Book lodging months ahead in summer.', category: 'nature', approx_lat: 37.7456, approx_lng: -119.5936, suggested_duration_min: 480, best_time: 'any' },
  { name: 'Death Valley (Zabriskie Point)', description: 'Otherworldly landscape — sunrise at Zabriskie is essential. Avoid summer (>50°C).', category: 'nature', approx_lat: 36.4200, approx_lng: -116.8114, suggested_duration_min: 300, best_time: 'morning' },
  { name: "In-N-Out Burger (first taste)", description: 'CA burger institution — order Double-Double Animal Style from the secret menu.', category: 'food', approx_lat: 34.1367, approx_lng: -117.7211, suggested_duration_min: 45, best_time: 'any' },
  { name: 'La Jolla Cove (San Diego)', description: 'Sea lions, snorkeling, tide pools. Best natural beach in SoCal.', category: 'nature', approx_lat: 32.8508, approx_lng: -117.2723, suggested_duration_min: 180, best_time: 'morning' },
  { name: 'Salvation Mountain (Slab City)', description: 'Hidden-gem folk-art hill covered in painted Bible verses. Rare, weird, free.', category: 'hidden-gem', approx_lat: 33.2543, approx_lng: -115.4720, suggested_duration_min: 60, best_time: 'morning' }
];

/**
 * Provider chain (open-source first, cost-optimized 2026):
 *   1. Fireworks AI — DeepSeek V4 Flash (open weights, $0.14/$0.28 per 1M)
 *   2. Groq — Llama 3.3 70B (open weights, 394 tok/s, $0.59/$0.79 per 1M)
 *   3. Anthropic Claude Haiku 4.5 (proprietary fallback, only if the above fail)
 *   4. Curated CA offline fallback
 *
 * All providers use OpenAI-compatible chat completions.
 * Enable JSON-mode where supported to guarantee parseable output.
 */
type Provider = 'fireworks' | 'groq' | 'anthropic' | 'curated';

interface ProviderResult {
  ok: boolean;
  raw?: string;
  error?: string;
  provider: Provider;
  model?: string;
}

async function callFireworks(system: string, user: string): Promise<ProviderResult> {
  const key = process.env.FIREWORKS_API_KEY;
  if(!key) return { ok: false, error: 'no_key', provider: 'fireworks' };
  const model = 'accounts/fireworks/models/deepseek-v3';
  const r = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    })
  });
  if(!r.ok) return { ok: false, error: (await r.text()).slice(0, 300), provider: 'fireworks' };
  const d = await r.json();
  return { ok: true, raw: d?.choices?.[0]?.message?.content || '', provider: 'fireworks', model };
}

async function callGroq(system: string, user: string): Promise<ProviderResult> {
  const key = process.env.GROQ_API_KEY;
  if(!key) return { ok: false, error: 'no_key', provider: 'groq' };
  const model = 'llama-3.3-70b-versatile';
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    })
  });
  if(!r.ok) return { ok: false, error: (await r.text()).slice(0, 300), provider: 'groq' };
  const d = await r.json();
  return { ok: true, raw: d?.choices?.[0]?.message?.content || '', provider: 'groq', model };
}

async function callAnthropic(system: string, user: string): Promise<ProviderResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if(!key) return { ok: false, error: 'no_key', provider: 'anthropic' };
  const model = 'claude-haiku-4-5-20251001';
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: user }]
    })
  });
  if(!r.ok) return { ok: false, error: (await r.text()).slice(0, 300), provider: 'anthropic' };
  const d = await r.json();
  return { ok: true, raw: d?.content?.[0]?.text || '', provider: 'anthropic', model };
}

function extractJsonArray(raw: string): AiStop[] {
  // Try direct parse (JSON mode)
  try {
    const parsed = JSON.parse(raw);
    if(Array.isArray(parsed)) return parsed;
    if(Array.isArray(parsed?.stops)) return parsed.stops;
    if(Array.isArray(parsed?.suggestions)) return parsed.suggestions;
  } catch { /* fallthrough */ }
  // Extract first [...] block
  const m = raw.match(/\[[\s\S]*\]/);
  if(m){
    try { return JSON.parse(m[0]); } catch { /* fallthrough */ }
  }
  return [];
}

function toSuggestions(items: AiStop[], provider: Provider){
  return items
    .filter((s) => s && typeof s.approx_lat === 'number' && typeof s.approx_lng === 'number' && s.name)
    .map((s) => ({
      place_id: `${provider}:${s.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: s.name,
      formatted_address: provider === 'curated' ? 'California, USA' : 'AI suggestion — click to verify',
      lat: s.approx_lat,
      lng: s.approx_lng,
      types: [s.category || 'attraction'],
      _ai: {
        description: s.description,
        category: s.category,
        suggested_duration_min: s.suggested_duration_min,
        best_time: s.best_time
      }
    })) satisfies (PlaceSuggestion & { _ai: unknown })[];
}

export async function POST(req: Request){
  // Rate limit: 10 req/min por IP (protege AI credits)
  const rl = rateLimit(getClientKey(req), { limit: 10, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = (await req.json()) as Body;
    const {
      destination_city = 'California',
      days_count = 7,
      interests = [],
      locale = 'en',
      existing_stops = []
    } = body;

    const count = Math.min(12, Math.max(6, days_count * 2));

    const system = locale === 'es'
      ? `Eres un experto en planeación de viajes por California para turistas internacionales. Recomiendas paradas específicas basadas en gustos + duración + practicalidad (respeta tiempos reales de manejo, evita días con más de 6 horas al volante). Responde SOLO con JSON válido en el formato pedido. Sin markdown, sin explicaciones extra.`
      : `You are an expert California trip planner for international tourists. Recommend specific stops based on interests + duration + practicality (respect real drive times, avoid 6h+ driving days). Respond ONLY with valid JSON in the exact format requested. No markdown, no extra prose.`;

    const user = `Return exactly ${count} suggestions as JSON object: { "stops": AiStop[] } where AiStop is:
{ "name": string, "description": string (1-2 lines, ${locale === 'es' ? 'español' : 'english'}), "category": "city"|"attraction"|"nature"|"food"|"hotel"|"hidden-gem", "approx_lat": number, "approx_lng": number, "suggested_duration_min": number, "best_time": "morning"|"afternoon"|"evening"|"any" }

Trip: ${days_count} days in ${destination_city}.
Interests: ${interests.length ? interests.join(', ') : 'general sightseeing, food, iconic sights'}.
${existing_stops.length ? `Already added — DO NOT REPEAT: ${existing_stops.map(s => s.name).join(', ')}.` : ''}
Coordinates must be real and precise (5 decimals). Prioritize logical geographic clustering.`;

    const providersTried: Array<{ provider: Provider; error?: string }> = [];
    const TIMEOUT_MS = 8000;

    // Fase 1: Fireworks + Groq en PARALELO (los 2 open-source rápidos).
    // Promise.race → first non-empty parseable response wins.
    const openSourceCallers = [callFireworks, callGroq];
    const parallelPromises = openSourceCallers.map((call) =>
      Promise.race<ProviderResult>([
        call(system, user),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS))
      ]).then((result) => {
        if(!result.ok) throw new Error(`${result.provider}: ${result.error}`);
        const items = extractJsonArray(result.raw || '');
        if(items.length === 0) throw new Error(`${result.provider}: empty_json`);
        return { result, items };
      })
    );

    try {
      const winner = await Promise.any(parallelPromises);
      providersTried.push({ provider: winner.result.provider });
      const existing = new Set(existing_stops.map((s) => s.name.toLowerCase()));
      const filtered = winner.items.filter((s) => !existing.has((s.name || '').toLowerCase()));
      return NextResponse.json({
        suggestions: toSuggestions(filtered, winner.result.provider),
        mode: 'ai',
        provider: winner.result.provider,
        model: winner.result.model,
        providers_tried: providersTried,
        strategy: 'parallel_race'
      });
    } catch (e) {
      // Ambos open-source fallaron/timeout → last-resort Anthropic secuencial
      providersTried.push({ provider: 'fireworks', error: 'race_lost_or_failed' });
      providersTried.push({ provider: 'groq', error: 'race_lost_or_failed' });
      const anth = await callAnthropic(system, user);
      providersTried.push({ provider: anth.provider, error: anth.ok ? undefined : anth.error });
      if(anth.ok){
        const items = extractJsonArray(anth.raw || '');
        if(items.length > 0){
          const existing = new Set(existing_stops.map((s) => s.name.toLowerCase()));
          const filtered = items.filter((s) => !existing.has((s.name || '').toLowerCase()));
          return NextResponse.json({
            suggestions: toSuggestions(filtered, anth.provider),
            mode: 'ai', provider: anth.provider, model: anth.model,
            providers_tried: providersTried, strategy: 'anthropic_fallback'
          });
        }
      }
    }

    // All providers unavailable → curated fallback
    const existing = new Set(existing_stops.map((s) => s.name.toLowerCase()));
    const filtered = CA_FALLBACK.filter((s) => !existing.has(s.name.toLowerCase())).slice(0, count);
    return NextResponse.json({
      suggestions: toSuggestions(filtered, 'curated'),
      mode: 'curated_fallback',
      providers_tried: providersTried,
      message: 'Add FIREWORKS_API_KEY (recommended, open-source DeepSeek V3), GROQ_API_KEY (fast Llama 3.3), or ANTHROPIC_API_KEY to enable live AI suggestions.'
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
