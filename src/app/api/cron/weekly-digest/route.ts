import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email/send';
import { weeklyDigestEmail } from '@/lib/email/templates';

export const runtime = 'edge';

function isAuthorized(req: Request){
  const auth = (req.headers.get('authorization') || '').trim();
  const secret = (process.env.CRON_SECRET || '').trim();
  const expected = `Bearer ${secret}`;
  if(!secret || auth.length !== expected.length) return false;
  let diff = 0;
  for(let i = 0; i < auth.length; i++) diff |= auth.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function GET(req: Request){
  if(!isAuthorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sb = createAdminClient();

  // Top templates por views últimos 7 días
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: views } = await sb.from('template_views').select('template_slug').gte('viewed_at', week);
  const counts: Record<string, number> = {};
  for(const v of views || []){ counts[v.template_slug] = (counts[v.template_slug] || 0) + 1; }
  const topSlugs = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s);

  // Info completa de esos templates
  const { data: templates } = await sb.from('trips').select('slug, title, days_count').in('slug', topSlugs.length ? topSlugs : ['__none__']);
  // Fallback: si aún no hay views, muestra templates default en orden alfabético
  const finalTemplates = (templates && templates.length > 0)
    ? templates.map(t => ({ slug: t.slug, title: t.title, days: t.days_count }))
    : ((await sb.from('trips').select('slug, title, days_count').eq('is_template', true).limit(5)).data || []).map(t => ({ slug: t.slug, title: t.title, days: t.days_count }));

  // Query users registrados
  const { data: usersData } = await sb.auth.admin.listUsers({ page: 1, perPage: 500 });
  const emails = (usersData?.users || []).map(u => u.email).filter((e): e is string => !!e);

  // Unsub set
  const { data: unsubs } = await sb.from('email_unsubscribes').select('email');
  const unsubSet = new Set((unsubs || []).map(u => u.email.toLowerCase()));

  // Dedup: no reenviar digest a mismo email en últimos 5 días
  const fiveAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentLogs } = await sb.from('email_log').select('to_email').eq('tag', 'weekly-digest').gte('sent_at', fiveAgo);
  const recentSet = new Set((recentLogs || []).map(r => r.to_email.toLowerCase()));

  const results: Array<{ email: string; sent: boolean; skipped?: string }> = [];
  let sent = 0;
  for(const email of emails){
    const low = email.toLowerCase();
    if(unsubSet.has(low)){ results.push({ email, sent: false, skipped: 'unsubscribed' }); continue; }
    if(recentSet.has(low)){ results.push({ email, sent: false, skipped: 'already_sent' }); continue; }

    const tpl = weeklyDigestEmail(email, finalTemplates, false);
    const result = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, tag: tpl.tag });
    try {
      await sb.from('email_log').insert({
        to_email: email, tag: tpl.tag, subject: tpl.subject,
        status: result.ok ? 'sent' : (result as { mocked?: boolean }).mocked ? 'mocked' : 'failed',
        provider_id: 'id' in result ? result.id : null,
        error: 'error' in result ? result.error : null
      });
    } catch {}
    if(result.ok || (result as { mocked?: boolean }).mocked) sent++;
    results.push({ email, sent: !!result.ok });
  }

  return NextResponse.json({ processed: emails.length, sent, templates: finalTemplates.length });
}
