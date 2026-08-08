import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: Request){
  try {
    const { email, locale = 'en' } = await req.json();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if(!url || !key){
      // Sin Supabase configurado aún — devuelve OK para no bloquear demo
      console.log('[waitlist] Supabase no configurado, guardando local:', email);
      return NextResponse.json({ ok: true, mode: 'local_log' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const sb = createClient(url, key);
    const { error } = await sb.from('waitlist').upsert(
      { email: cleanEmail, locale, referer: req.headers.get('referer') || null, user_agent: req.headers.get('user-agent')?.slice(0, 200) || null },
      { onConflict: 'email' }
    );
    if(error){
      // Fail-open para no perder leads si tabla no existe
      console.error('[waitlist] supabase:', error.message);
      return NextResponse.json({ ok: true, mode: 'silent_fail' });
    }
    // Fire-and-forget: envía welcome email (soft-fail si Resend no configurado)
    try {
      const origin = req.headers.get('origin') || 'https://triploop-six.vercel.app';
      fetch(`${origin}/api/emails/waitlist`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, locale })
      }).catch(() => {});
    } catch {}
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
}
