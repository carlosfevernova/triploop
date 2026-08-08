import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email/send';
import { trialEndingEmail } from '@/lib/email/templates';

export const runtime = 'edge';

// Vercel Cron protection: bearer con CRON_SECRET (constant-time compare)
function isAuthorized(req: Request){
  const auth = (req.headers.get('authorization') || '').trim();
  const secret = (process.env.CRON_SECRET || '').trim();
  const expected = `Bearer ${secret}`;
  if(!secret || auth.length !== expected.length) return false;
  // Web Crypto constant-time compare (edge-compat, sin Node crypto)
  let diff = 0;
  for(let i = 0; i < auth.length; i++) diff |= auth.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// GET (Vercel Cron manda GET) → busca trials que terminan en 2-4 días y envía email si aún no.
export async function GET(req: Request){
  if(!isAuthorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sb = createAdminClient();
  const now = Date.now();
  const in2d = new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString();
  const in4d = new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString();

  // Trials activos en ventana 2-4 días
  const { data: subs, error } = await sb.from('subscriptions')
    .select('user_id, trial_end, current_period_end')
    .eq('status', 'trialing')
    .gte('trial_end', in2d)
    .lte('trial_end', in4d);
  if(error) return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 });

  const results: Array<{ user_id: string; sent: boolean; skipped?: string }> = [];
  for(const sub of subs || []){
    // Get email del user (admin API)
    try {
      const { data: userData } = await sb.auth.admin.getUserById(sub.user_id);
      const email = userData?.user?.email;
      if(!email){ results.push({ user_id: sub.user_id, sent: false, skipped: 'no_email' }); continue; }

      // Check unsub
      const { data: unsub } = await sb.from('email_unsubscribes').select('email').eq('email', email).maybeSingle();
      if(unsub){ results.push({ user_id: sub.user_id, sent: false, skipped: 'unsubscribed' }); continue; }

      // Check dedup: ya enviamos trial-ending a este email en últimos 5 días?
      const fiveAgo = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
      const { count: recent } = await sb.from('email_log').select('id', { count: 'exact', head: true })
        .eq('to_email', email).eq('tag', 'trial-ending').gte('sent_at', fiveAgo);
      if((recent || 0) > 0){ results.push({ user_id: sub.user_id, sent: false, skipped: 'already_sent' }); continue; }

      const daysLeft = Math.max(1, Math.ceil((new Date(sub.trial_end || sub.current_period_end || '').getTime() - now) / (24 * 60 * 60 * 1000)));
      const tpl = trialEndingEmail(email, daysLeft, false);
      const result = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, tag: tpl.tag });
      await sb.from('email_log').insert({
        to_email: email, tag: tpl.tag, subject: tpl.subject,
        status: result.ok ? 'sent' : (result as { mocked?: boolean }).mocked ? 'mocked' : 'failed',
        provider_id: 'id' in result ? result.id : null,
        error: 'error' in result ? result.error : null
      });
      results.push({ user_id: sub.user_id, sent: !!result.ok });
    } catch (e) {
      results.push({ user_id: sub.user_id, sent: false, skipped: (e as Error).message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
