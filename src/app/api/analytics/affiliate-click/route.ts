import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'edge';

// Lightweight tracking de clicks affiliate. Best-effort: no bloquea al user.
// Body: { slug, stop_id, destination, provider: 'gyg'|'booking', ts }
export async function POST(req: Request){
  try {
    const body = await req.json();
    const sb = createAdminClient();
    // Insert best-effort. Si tabla no existe, retorna OK igual.
    try {
      await sb.from('affiliate_clicks').insert({
        trip_slug: body.slug,
        stop_id: body.stop_id,
        destination: body.destination,
        provider: body.provider,
        clicked_at: new Date(body.ts || Date.now()).toISOString()
      });
    } catch { /* soft-fail */ }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Nunca fallar en tracking
  }
}
