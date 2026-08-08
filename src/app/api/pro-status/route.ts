import { NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { isAdminAuthed } from '@/lib/admin-guard';
import { isProSubscription } from '@/lib/stripe-config';

export const runtime = 'nodejs';

// Returns { isPro, adminOverride } — used by usePro() hook + Pro gates.
// Admin passphrase (Cside) grants full Pro access to test all features.

export async function GET(req: Request){
  // Admin override: cookie triploop_admin desbloquea todos features Pro
  const adminOverride = await isAdminAuthed();

  // Check user subscription
  let userId: string | null = null;
  let isPro = false;
  let status: string | null = null;
  try {
    const client = createClientFromRequest(req);
    const { data: { user } } = await client.auth.getUser();
    userId = user?.id ?? null;
    if(userId){
      const sb = createAdminClient();
      const { data: sub } = await sb.from('subscriptions').select('*').eq('user_id', userId).maybeSingle();
      isPro = isProSubscription(sub);
      status = sub?.status || null;
    }
  } catch { /* not authed → free user */ }

  return NextResponse.json({
    userId,
    isPro: isPro || adminOverride,
    adminOverride,
    status: adminOverride ? 'admin-preview' : status,
    trial_end: null,
    cancel_at_period_end: false
  }, {
    headers: { 'cache-control': 'private, max-age=30' }
  });
}
