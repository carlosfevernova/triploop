import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

interface Metrics {
  trips_total: number;
  trips_7d: number;
  trips_owned: number;         // con owner_id (registered users)
  trips_anon: number;
  templates: number;
  users_total: number;
  users_7d: number;
  subs_by_status: Record<string, number>;
  mrr_usd: number;
  arr_usd: number;
  affiliate_7d: number;
  affiliate_by_provider: Record<string, number>;
  template_views_7d: number;
  template_top: Array<{ slug: string; views: number }>;
}

async function countOf(sb: ReturnType<typeof createAdminClient>, builderFn: () => PromiseLike<{ count: number | null }>){
  try { const r = await builderFn(); return r.count ?? 0; } catch { return 0; }
}
async function listOf<T>(builderFn: () => PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  try { const r = await builderFn(); return r.data || []; } catch { return []; }
}

async function loadMetrics(): Promise<Metrics> {
  const sb = createAdminClient();
  const now = new Date();
  const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    trips_total, trips_7d, trips_owned, trips_anon, templates,
    users_result, users_7d,
    subsList, affiliate_7d, affiliateList,
    template_views_7d, tplViewsList
  ] = await Promise.all([
    countOf(sb, () => sb.from('trips').select('id', { count: 'exact', head: true })),
    countOf(sb, () => sb.from('trips').select('id', { count: 'exact', head: true }).gte('created_at', week)),
    countOf(sb, () => sb.from('trips').select('id', { count: 'exact', head: true }).not('owner_id', 'is', null)),
    countOf(sb, () => sb.from('trips').select('id', { count: 'exact', head: true }).is('owner_id', null)),
    countOf(sb, () => sb.from('trips').select('id', { count: 'exact', head: true }).eq('is_template', true)),
    (async () => { try { return await sb.auth.admin.listUsers({ page: 1, perPage: 1 }); } catch { return { data: null }; } })(),
    countOf(sb, () => sb.from('waitlist').select('id', { count: 'exact', head: true }).gte('created_at', week)),
    listOf<{ status: string; plan?: string }>(() => sb.from('subscriptions').select('status, plan')),
    countOf(sb, () => sb.from('affiliate_clicks').select('id', { count: 'exact', head: true }).gte('clicked_at', week)),
    listOf<{ provider: string }>(() => sb.from('affiliate_clicks').select('provider').gte('clicked_at', week)),
    countOf(sb, () => sb.from('template_views').select('id', { count: 'exact', head: true }).gte('viewed_at', week)),
    listOf<{ template_slug: string }>(() => sb.from('template_views').select('template_slug').gte('viewed_at', week))
  ]);

  const subsByStatus: Record<string, number> = {};
  let mrrCents = 0;
  for(const s of subsList){
    subsByStatus[s.status] = (subsByStatus[s.status] || 0) + 1;
    if(s.status === 'active' || s.status === 'trialing'){
      mrrCents += s.plan === 'yearly' ? 499 : 699; // yearly ($59.88/12) vs monthly $6.99
    }
  }

  const affiliateByProvider: Record<string, number> = {};
  for(const c of affiliateList){
    affiliateByProvider[c.provider] = (affiliateByProvider[c.provider] || 0) + 1;
  }

  const tplCount: Record<string, number> = {};
  for(const v of tplViewsList){
    tplCount[v.template_slug] = (tplCount[v.template_slug] || 0) + 1;
  }
  const tplTop = Object.entries(tplCount)
    .map(([slug, views]) => ({ slug, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const usersTotal = users_result?.data && 'total' in users_result.data ? Number(users_result.data.total) : 0;

  return {
    trips_total,
    trips_7d,
    trips_owned,
    trips_anon,
    templates,
    users_total: usersTotal,
    users_7d,
    subs_by_status: subsByStatus,
    mrr_usd: mrrCents / 100,
    arr_usd: (mrrCents / 100) * 12,
    affiliate_7d,
    affiliate_by_provider: affiliateByProvider,
    template_views_7d,
    template_top: tplTop
  };
}

export default async function AdminDashboard(){
  const ok = await isAdminAuthed();
  if(!ok) redirect('/admin/login');

  const m = await loadMetrics();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">TripLoop Admin</h1>
          <p className="mt-1 text-sm text-ink-500">Live metrics · last 7 days · refresh page for latest</p>
        </div>
        <form action="/api/admin/login" method="POST" className="hidden">
          <input type="hidden" name="_method" value="DELETE" />
        </form>
        <LogoutButton />
      </header>

      {/* Top cards */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total trips" value={m.trips_total} delta={`+${m.trips_7d} (7d)`} accent="coral" />
        <MetricCard label="Registered users" value={m.users_total} delta={`+${m.users_7d} (7d)`} accent="ocean" />
        <MetricCard label="MRR" value={`$${m.mrr_usd.toFixed(2)}`} delta={`~ ARR $${m.arr_usd.toFixed(0)}`} accent="emerald" />
        <MetricCard label="Affiliate clicks (7d)" value={m.affiliate_7d} delta={providerBreakdown(m.affiliate_by_provider)} accent="amber" />
      </section>

      {/* Subs breakdown */}
      <section className="mb-8 grid gap-6 md:grid-cols-2">
        <Card title="Subscriptions">
          {Object.keys(m.subs_by_status).length === 0 ? (
            <p className="text-sm text-ink-400">No subscriptions yet. Once Stripe is live, they appear here.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(m.subs_by_status).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between border-b border-ink-100 pb-1 text-sm">
                  <span className="font-mono text-ink-700">{status}</span>
                  <span className="font-semibold text-ink-900">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Trip ownership">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between border-b border-ink-100 pb-1">
              <span className="text-ink-700">Owned (registered)</span>
              <span className="font-semibold text-ink-900">{m.trips_owned}</span>
            </li>
            <li className="flex items-center justify-between border-b border-ink-100 pb-1">
              <span className="text-ink-700">Anonymous</span>
              <span className="font-semibold text-ink-900">{m.trips_anon}</span>
            </li>
            <li className="flex items-center justify-between pb-1">
              <span className="text-ink-700">SEO templates</span>
              <span className="font-semibold text-ink-900">{m.templates}</span>
            </li>
          </ul>
        </Card>
      </section>

      {/* Template performance */}
      <section className="mb-8">
        <Card title={`Top California templates (${m.template_views_7d} views / 7d)`}>
          {m.template_top.length === 0 ? (
            <p className="text-sm text-ink-400">No template views tracked yet. Hits are counted as visitors reach /california/[slug].</p>
          ) : (
            <ul className="space-y-2">
              {m.template_top.map((t) => {
                const max = m.template_top[0]?.views || 1;
                const pct = Math.round((t.views / max) * 100);
                return (
                  <li key={t.slug} className="text-sm">
                    <div className="mb-1 flex items-center justify-between">
                      <a href={`/en/california/${t.slug}`} target="_blank" rel="noreferrer" className="font-mono text-ink-700 hover:text-coral-600">/{t.slug}</a>
                      <span className="font-semibold text-ink-900">{t.views}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-100">
                      <div className="h-1.5 rounded-full bg-coral-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <footer className="text-center text-[10px] text-ink-400">
        TripLoop Admin · rendered {new Date().toISOString()}
      </footer>
    </main>
  );
}

function providerBreakdown(byProvider: Record<string, number>){
  const parts = Object.entries(byProvider).map(([p, c]) => `${p} ${c}`);
  return parts.length ? parts.join(' · ') : 'no clicks yet';
}

function MetricCard({ label, value, delta, accent }: {
  label: string; value: string | number; delta: string;
  accent: 'coral' | 'ocean' | 'emerald' | 'amber';
}){
  const bg = {
    coral: 'from-coral-50 to-white border-coral-100',
    ocean: 'from-ocean-400/10 to-white border-ocean-400/20',
    emerald: 'from-emerald-50 to-white border-emerald-100',
    amber: 'from-amber-50 to-white border-amber-100'
  }[accent];
  return (
    <div className={`rounded-card border bg-gradient-to-br p-5 ${bg}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold text-ink-900">{value}</div>
      <div className="mt-1 text-xs text-ink-500">{delta}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="rounded-card border border-ink-100 bg-white p-5 shadow-card">
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-500">{title}</h2>
      {children}
    </div>
  );
}

function LogoutButton(){
  return (
    <form
      action="/api/admin/login"
      method="POST"
    >
      <button
        type="submit"
        formMethod="DELETE"
        formAction="/api/admin/login"
        className="rounded-pill border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600 transition hover:border-coral-500 hover:text-coral-600"
      >
        Sign out
      </button>
    </form>
  );
}
