import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { rateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export const runtime = 'edge';

const ALLOWED_EVENTS = new Set([
  'itinerary_viewed','day_selected','item_added','item_removed','item_moved',
  'item_time_changed','item_duration_changed','route_viewed','route_optimized',
  'day_auto_scheduled','ai_edit_applied','schedule_warning_shown','schedule_warning_resolved',
  'item_undo','ai_edit_requested'
]);

// S47 Fase 34: Ingesta de eventos de itinerary. Append-only, fire-and-forget desde cliente.
// Body: { trip_slug: string, event: string, props?: object, session_id?: string }
export async function POST(req: Request){
  const rl = rateLimit(getClientKey(req), { limit: 120, windowSec: 60 });
  if(!rl.ok) return rateLimitResponse(rl);

  try {
    const body = await req.json();
    const trip_slug = String(body.trip_slug || '').slice(0, 200);
    const event = String(body.event || '');
    if(!trip_slug || !ALLOWED_EVENTS.has(event)) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

    const props = body.props && typeof body.props === 'object' ? body.props : null;
    const session_id = body.session_id ? String(body.session_id).slice(0, 60) : null;

    const sb = createAdminClient();
    await sb.from('itinerary_events').insert({ trip_slug, event, props, session_id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
