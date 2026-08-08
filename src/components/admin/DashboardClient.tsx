'use client';
import { useEffect, useState } from 'react';
import { T, getAdminLocale, type AdminLocale } from '@/lib/admin-i18n';

interface Metrics {
  trips_total: number; trips_7d: number; trips_owned: number; trips_anon: number;
  templates: number; users_total: number; users_7d: number;
  subs_by_status: Record<string, number>;
  mrr_usd: number; arr_usd: number;
  affiliate_7d: number; affiliate_by_provider: Record<string, number>;
  template_views_7d: number;
  template_top: Array<{ slug: string; views: number }>;
}

export function DashboardClient({ metrics }: { metrics: Metrics }){
  const [locale, setLocale] = useState<AdminLocale>('es');
  useEffect(() => { setLocale(getAdminLocale()); }, []);
  const t = T[locale];

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink-900">{t.dashboard}</h1>
          <p className="mt-1 text-[13px] text-ink-500">{t.liveMetrics}</p>
        </div>
      </header>

      {/* KPI strip */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label={t.totalTrips} value={metrics.trips_total.toLocaleString()} delta={`+${metrics.trips_7d} · 7d`} />
        <KpiCard label={t.registeredUsers} value={metrics.users_total.toLocaleString()} delta={`+${metrics.users_7d} · 7d`} />
        <KpiCard label={t.mrr} value={`$${metrics.mrr_usd.toFixed(2)}`} delta={`ARR $${metrics.arr_usd.toFixed(0)}`} />
        <KpiCard label={t.affiliateClicks} value={metrics.affiliate_7d.toLocaleString()} delta={providerBreak(metrics.affiliate_by_provider)} />
      </section>

      {/* Detail rows */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card title={t.subscriptions}>
          {Object.keys(metrics.subs_by_status).length === 0 ? (
            <EmptyState>{t.noSubs}</EmptyState>
          ) : (
            <ul className="divide-y divide-ink-100">
              {Object.entries(metrics.subs_by_status).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="font-mono text-ink-500">{status}</span>
                  <span className="tabular-nums font-semibold text-ink-900">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title={t.tripOwnership}>
          <ul className="divide-y divide-ink-100 text-[13px]">
            <Row label={t.ownedRegistered} value={metrics.trips_owned} />
            <Row label={t.anonymous} value={metrics.trips_anon} />
            <Row label={t.seoTemplates} value={metrics.templates} />
          </ul>
        </Card>
      </section>

      <section className="mt-4">
        <Card title={`${t.topTemplates} · ${metrics.template_views_7d} views/7d`}>
          {metrics.template_top.length === 0 ? (
            <EmptyState>{t.noViews}</EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {metrics.template_top.map((tpl) => {
                const max = metrics.template_top[0]?.views || 1;
                const pct = Math.round((tpl.views / max) * 100);
                return (
                  <li key={tpl.slug} className="text-[13px]">
                    <div className="mb-1.5 flex items-center justify-between">
                      <a href={`/en/california/${tpl.slug}`} target="_blank" rel="noreferrer" className="font-mono text-ink-600 hover:text-ink-900">/{tpl.slug}</a>
                      <span className="tabular-nums font-semibold text-ink-900">{tpl.views}</span>
                    </div>
                    <div className="h-1 rounded-full bg-ink-100">
                      <div className="h-1 rounded-full bg-ink-900 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      <footer className="mt-10 text-center text-[10px] font-medium tracking-wider text-ink-300">
        RENDERED {new Date().toISOString()}
      </footer>
    </main>
  );
}

function providerBreak(byProvider: Record<string, number>){
  const parts = Object.entries(byProvider).map(([p, c]) => `${p} ${c}`);
  return parts.length ? parts.join(' · ') : '—';
}

function KpiCard({ label, value, delta }: { label: string; value: string; delta: string }){
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">{label}</div>
      <div className="mt-2 font-display text-[28px] font-semibold tabular-nums leading-none text-ink-900">{value}</div>
      <div className="mt-2 text-[11px] font-medium text-ink-500">{delta}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink-500">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }){
  return <p className="py-6 text-center text-[12px] text-ink-400">{children}</p>;
}

function Row({ label, value }: { label: string; value: number }){
  return (
    <li className="flex items-center justify-between py-2.5">
      <span className="text-ink-600">{label}</span>
      <span className="tabular-nums font-semibold text-ink-900">{value.toLocaleString()}</span>
    </li>
  );
}
