import { NextResponse } from 'next/server';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClientFromRequest } from '@/lib/supabase-server';
import { isProSubscription } from '@/lib/stripe-config';
import type { TripStop } from '@/lib/types';

export const runtime = 'edge';

interface Body {
  prompt: string;              // "5 días por California, me gusta la naturaleza y comida"
  locale?: 'en' | 'es';
  currency?: string;
  unit_system?: 'metric' | 'imperial';
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

const SYSTEM_PROMPT_ES = `Eres un experto en planeación de viajes. Recibes una descripción del viaje deseado y devuelves un itinerario estructurado.

REGLAS ESTRICTAS:
- Coordenadas REALES (5 decimales) de lugares que existen en Google Maps
- Rutas geográficamente coherentes (evita saltos ilógicos)
- 4-10 paradas para viajes < 7 días, 6-14 para viajes largos
- Duraciones realistas (city visits 3-8h, natural parks 4-12h, museums 2-4h)
- Responde SOLO con JSON válido en el formato exacto pedido, sin markdown, sin explicaciones extras
- title: en el idioma del usuario, descriptivo (ej: "Costa Pacific California — 7 días")`;

const SYSTEM_PROMPT_EN = `You are a trip planning expert. Given a trip description, return a structured itinerary.

STRICT RULES:
- REAL coordinates (5 decimals) of places that exist in Google Maps
- Geographically coherent routes (no illogical jumps)
- 4-10 stops for trips < 7 days, 6-14 for longer trips
- Realistic durations (city visits 3-8h, natural parks 4-12h, museums 2-4h)
- Respond ONLY with valid JSON in the exact requested format, no markdown, no extra explanation
- title: in the user's language, descriptive (e.g. "California Pacific Coast — 7 days")`;

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

  try {
    const body = (await req.json()) as Body;
    if(!body.prompt || body.prompt.trim().length < 10){
      return NextResponse.json({ error: 'prompt_too_short', hint: 'Describe your trip in at least 10 characters.' }, { status: 400 });
    }

    const locale = body.locale || 'en';
    const system = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;
    const user = `${locale === 'es' ? 'Descripción del viaje del usuario' : 'User trip description'}: "${body.prompt.slice(0, 800)}"

${locale === 'es' ? 'Devuelve JSON con este schema exacto' : 'Return JSON matching this exact schema'}:
${jsonSchema(locale)}`;

    // Cadena de fallback: Fireworks (barato) → Groq (rápido) → Anthropic (premium)
    let spec = await callFireworks(system, user);
    let provider: 'fireworks' | 'groq' | 'anthropic' | 'none' = spec ? 'fireworks' : 'none';
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
        hint: 'AI providers not configured. Set FIREWORKS_API_KEY, GROQ_API_KEY, or ANTHROPIC_API_KEY.'
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
    if(owner_id){
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

    return NextResponse.json({
      trip,
      ai_provider: provider,
      stops_count: tripStops.length,
      region_hint: spec.region_hint || 'other'
    });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
