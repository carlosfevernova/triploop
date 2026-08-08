import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'edge';

// Track template view. Fire-and-forget desde client cuando abre /california/[slug].
export async function POST(req: Request){
  try {
    const { slug, locale = 'en' } = await req.json();
    if(!slug) return NextResponse.json({ ok: true });

    // Hash simple user-agent para privacy (evita PII pero da unique visitors approx)
    const ua = req.headers.get('user-agent') || '';
    const uaHash = ua ? await sha256Hex(ua).then(h => h.slice(0, 12)) : null;
    const referrer = req.headers.get('referer')?.slice(0, 200) || null;

    const sb = createAdminClient();
    try {
      await sb.from('template_views').insert({
        template_slug: slug,
        locale,
        referrer,
        user_agent_hash: uaHash
      });
    } catch { /* soft-fail si tabla no existe */ }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail on analytics
  }
}

async function sha256Hex(input: string){
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
