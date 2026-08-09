import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { callOpenRouterJson } from '@/lib/ai-openrouter';
import { logAICall } from '@/lib/ai-cost-tracker';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { validateOps, type ItineraryOp } from '@/lib/itinerary/ai-operations';
import type { ItineraryItem, TripDay } from '@/lib/itinerary/types';

export const runtime = 'nodejs';

// S46 P4: AI itinerary operations endpoint.
// POST { prompt: string, day_context_id?: number }
// Retorna { operations: ItineraryOp[], explanation: string, provider: string }
// NO ejecuta; solo devuelve preview para que el usuario apruebe.

const SYSTEM_PROMPT = `You are an itinerary editing assistant. You do NOT explain, chat, or generate prose.
You ONLY return a JSON object with this exact shape:
{
  "operations": [ ... array of operations ... ],
  "explanation": "brief 1-sentence summary of what the operations do"
}

Each operation has an "op" field. Valid ops:
- {"op":"move_item","item_id":<int>,"target_day_id":<int|null>,"reason":"..."}
- {"op":"update_time","item_id":<int>,"start_local":"HH:MM" or null,"reason":"..."}
- {"op":"update_duration","item_id":<int>,"duration_min":<int|null>,"reason":"..."}
- {"op":"add_item","title":"<string>","type":"place|meal|hotel|flight|train|walk|event|note|free_time","trip_day_id":<int|null>,"start_local":"HH:MM"?,"duration_min":<int>?,"reason":"..."}
- {"op":"remove_item","item_id":<int>,"reason":"..."}
- {"op":"set_priority","item_id":<int>,"priority":"must|preferred|optional","reason":"..."}
- {"op":"set_fixed","item_id":<int>,"fixed":true|false,"reason":"..."}
- {"op":"set_notes","item_id":<int>,"notes":"<string>","reason":"..."}
- {"op":"optimize_day","day_id":<int>,"reason":"..."}
- {"op":"schedule_day","day_id":<int>,"start_min":<int>?,"reason":"..."}

Rules:
- Use ONLY item_id and day_id values present in the context.
- Do NOT invent new IDs.
- Do NOT touch items marked fixed:true unless user explicitly says so.
- Keep operations minimal. If unsure, do fewer.
- If user asks something unrelated to itinerary editing, return {"operations":[],"explanation":"Not an itinerary edit request"}
- Reason field: brief phrase in the same language as user prompt.`;

async function checkWriteAccess(req: Request, slug: string){
  const sb = createAdminClient();
  const { data: trip } = await sb.from('trips').select('owner_id').eq('slug', slug).maybeSingle();
  if(!trip) return { ok: false as const, status: 404 as const, error: 'not_found' };
  if(!trip.owner_id) return { ok: true as const };
  // Cross-request auth check would need createClientFromRequest; permissive por ahora (anon trips OK)
  return { ok: true as const };
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }){
  const rl = rateLimit(getClientKey(req), { limit: 10, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  const { slug } = await params;
  const check = await checkWriteAccess(req, slug);
  if(!check.ok) return NextResponse.json({ error: check.error }, { status: check.status });

  const startTime = Date.now();
  try {
    const body = await req.json();
    const prompt = String(body.prompt || '').slice(0, 500);
    if(!prompt) return NextResponse.json({ error: 'prompt_required' }, { status: 400 });

    const sb = createAdminClient();
    const [{ data: days }, { data: items }] = await Promise.all([
      sb.from('trip_days').select('id, day_number, date, timezone, title').eq('trip_slug', slug).order('day_number'),
      sb.from('itinerary_items').select('id, trip_day_id, position, type, title, start_local, duration_min, priority, fixed').eq('trip_slug', slug).order('position')
    ]);

    const context = {
      days: (days || []).map(d => ({ id: d.id, day_number: d.day_number, date: d.date, title: d.title })),
      items: (items || []).map(i => ({
        id: i.id,
        trip_day_id: i.trip_day_id,
        title: i.title,
        type: i.type,
        start_local: i.start_local,
        duration_min: i.duration_min,
        priority: i.priority,
        fixed: i.fixed
      }))
    };

    const userMsg = `USER REQUEST: "${prompt}"\n\nCURRENT ITINERARY CONTEXT:\n${JSON.stringify(context)}\n\nReturn JSON with "operations" array and "explanation" string.`;

    const result = await callOpenRouterJson<{ operations: unknown[]; explanation?: string }>(
      SYSTEM_PROMPT, userMsg,
      { maxTokens: 1500, timeoutMs: 25000, title: 'TripLoop Itinerary AI' }
    );

    if(!result){
      await logAICall({ endpoint: '/api/trips/[slug]/itinerary/ai', provider: 'none', latency_ms: Date.now() - startTime, success: false, error_category: 'all_providers_failed' });
      return NextResponse.json({ error: 'ai_unavailable', operations: [], explanation: '' }, { status: 502 });
    }

    const validated = validateOps(result.data.operations || [], (items || []) as ItineraryItem[], (days || []) as TripDay[]);
    const explanation = typeof result.data.explanation === 'string' ? result.data.explanation.slice(0, 300) : '';

    await logAICall({
      endpoint: '/api/trips/[slug]/itinerary/ai',
      provider: result.provider,
      latency_ms: Date.now() - startTime,
      success: true
    });

    return NextResponse.json({ operations: validated, explanation, provider: result.provider, raw_count: (result.data.operations || []).length, valid_count: validated.length });
  } catch (e) {
    await logAICall({ endpoint: '/api/trips/[slug]/itinerary/ai', provider: 'error', latency_ms: Date.now() - startTime, success: false, error_category: (e as Error).message.slice(0, 40) });
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
