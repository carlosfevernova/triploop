import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email/send';
import { welcomeEmail } from '@/lib/email/templates';

export const runtime = 'edge';

// POST { email, name?, locale? } → envía welcome. Fire-and-forget desde signup.
export async function POST(req: Request){
  try {
    const { email, name, locale = 'en' } = await req.json();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }
    const sb = createAdminClient();
    // Skip si ya se dio de baja
    const { data: unsub } = await sb.from('email_unsubscribes').select('email').eq('email', email).maybeSingle();
    if(unsub){ return NextResponse.json({ ok: true, skipped: 'unsubscribed' }); }

    const tpl = welcomeEmail(name, email, locale === 'es');
    const result = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, tag: tpl.tag });

    // Best-effort log
    try {
      await sb.from('email_log').insert({
        to_email: email,
        tag: tpl.tag,
        subject: tpl.subject,
        status: result.ok ? 'sent' : (result as { mocked?: boolean }).mocked ? 'mocked' : 'failed',
        provider_id: 'id' in result ? result.id : null,
        error: 'error' in result ? result.error : null
      });
    } catch { /* log tabla opcional */ }

    return NextResponse.json({ ok: true, sent: result.ok, mocked: (result as { mocked?: boolean }).mocked });
  } catch (e) {
    return NextResponse.json({ error: 'bad_request', detail: (e as Error).message }, { status: 400 });
  }
}
