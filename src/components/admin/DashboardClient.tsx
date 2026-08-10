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
  trips_sparkline: number[];
  views_sparkline: number[];
  funnel_visitors: number;
  funnel_trips: number;
  funnel_registered: number;
  funnel_paying: number;
}

export function DashboardClient({ metrics }: { metrics: Metrics }){
  const [locale, setLocale] = useState<AdminLocale>('es');
  useEffect(() => { setLocale(getAdminLocale()); }, []);
  const t = T[locale];
  const isEs = locale === 'es';

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
        <KpiCard label={t.totalTrips} value={metrics.trips_total.toLocaleString()} delta={`+${metrics.trips_7d} · 7d`} sparkline={metrics.trips_sparkline} />
        <KpiCard label={t.registeredUsers} value={metrics.users_total.toLocaleString()} delta={`+${metrics.users_7d} · 7d`} />
        <KpiCard label={t.mrr} value={`$${metrics.mrr_usd.toFixed(2)}`} delta={`ARR $${metrics.arr_usd.toFixed(0)}`} />
        <KpiCard label={t.affiliateClicks} value={metrics.affiliate_7d.toLocaleString()} delta={providerBreak(metrics.affiliate_by_provider)} />
      </section>

      {/* Sparklines timeline 30d */}
      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <Card title={isEs ? 'Viajes creados · últimos 30 días' : 'Trips created · last 30 days'}>
          <Sparkline data={metrics.trips_sparkline} color="#FF5A5F" total={metrics.funnel_trips} isEs={isEs} />
        </Card>
        <Card title={isEs ? 'Vistas de plantillas · últimos 30 días' : 'Template views · last 30 days'}>
          <Sparkline data={metrics.views_sparkline} color="#0EA5E9" total={metrics.funnel_visitors} isEs={isEs} />
        </Card>
      </section>

      {/* Funnel */}
      <section className="mb-6">
        <Card title={isEs ? 'Funnel de conversión · 30 días' : 'Conversion funnel · 30 days'}>
          <FunnelChart
            steps={[
              { label: isEs ? 'Visitas plantillas' : 'Template views', value: metrics.funnel_visitors, color: '#0EA5E9' },
              { label: isEs ? 'Viajes creados' : 'Trips created', value: metrics.funnel_trips, color: '#8B5CF6' },
              { label: isEs ? 'Usuarios registrados' : 'Registered users', value: metrics.funnel_registered, color: '#F59E0B' },
              { label: isEs ? 'Pagando (Pro/Trial)' : 'Paying (Pro/Trial)', value: metrics.funnel_paying, color: '#10B981' }
            ]}
          />
        </Card>
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

      {/* S44-S71: Features shipped index — links a nuevas capacidades */}
      <section className="mt-6">
        <Card title={isEs ? 'Features shipped · S40 → S71i' : 'Features shipped · S40 → S71i'}>
          <div className="grid gap-2 md:grid-cols-2">
            <FeatureLink emoji="🌐" href="/pt" label={isEs ? 'Landing 100% multilingüe (S71i · NEW)' : 'Landing 100% multilingual (S71i · NEW)'} desc={isEs ? '10 componentes de landing nativos EN·ES·PT·DE · ~500 strings PT+DE · helper lib/l4.ts · 22% → 100% nativo verificado' : '10 landing components native EN·ES·PT·DE · ~500 PT+DE strings · lib/l4.ts helper · 22% → 100% native verified'} tone="ocean" />
            <FeatureLink emoji="📱" href="/en" label={isEs ? 'Mobile drawer + a11y (S71d/e)' : 'Mobile drawer + a11y (S71d/e)'} desc={isEs ? 'React Portal fix (drawer 11px → 92% viewport) · close btn WCAG · LocaleSwitcher role=group' : 'React Portal fix (drawer 11px → 92% viewport) · close btn WCAG · LocaleSwitcher role=group'} tone="coral" />
            <FeatureLink emoji="🗓" href="/en/agenda" label="Agenda diaria (S52)" desc={isEs ? 'Day-only flow standalone: sin viaje macro, sin cuenta, 8 shortcuts quick-add' : 'Standalone day-only flow: no macro trip, no account, 8 quick-add shortcuts'} tone="emerald" />
            <FeatureLink emoji="🌍" href="/en/trip/pacific-coast-highway/itinerary" label="Itinerary Engine (S44-S50 full)" desc={isEs ? 'Multi-día + DnD + AI ops + realtime + offline + Discovery + Tour' : 'Multi-day + DnD + AI ops + realtime + offline + Discovery + Tour'} tone="coral" />
            <FeatureLink emoji="💳" href="/admin/ai-costs" label={isEs ? 'AI Cost Dashboard (S43)' : 'AI Cost Dashboard (S43)'} desc={isEs ? 'KPIs · provider/endpoint breakdown · 7-day chart' : 'KPIs · provider/endpoint breakdown · 7-day chart'} tone="ocean" />
            <FeatureLink emoji="📊" href="/admin/reports/technical" label={isEs ? 'Reporte técnico' : 'Technical report'} desc={isEs ? '~27.8K LOC · 51 APIs · 65 componentes · 24 migrations · 4 locales nativos' : '~27.8K LOC · 51 APIs · 65 components · 24 migrations · 4 native locales'} tone="emerald" />
            <FeatureLink emoji="💎" href="/admin/reports/investors" label={isEs ? 'Deck inversores' : 'Investor deck'} desc={isEs ? '24 regiones · 7 continentes · 4 idiomas · valuación 3 escenarios' : '24 regions · 7 continents · 4 languages · 3 valuation scenarios'} tone="amber" />
            <FeatureLink emoji="🖨" href="/en/trip/pacific-coast-highway/itinerary/print" label={isEs ? 'Print itinerary (S47)' : 'Print itinerary (S47)'} desc={isEs ? 'PDF-ready A4 con auto-print + break-inside avoid' : 'PDF-ready A4 with auto-print + break-inside avoid'} tone="amber" />
          </div>
          <p className="mt-3 text-[11px] text-ink-400">
            {isEs
              ? 'Migrations 017 (webhook) · 018 (ai_call_log) · 019 (trip_expenses) · 020 (stop_votes) · 021 (itinerary engine) · 022 (intelligence) · 023 (realtime) · 024 (analytics events) aplicadas en Supabase.'
              : 'Migrations 017 (webhook) · 018 (ai_call_log) · 019 (trip_expenses) · 020 (stop_votes) · 021 (itinerary engine) · 022 (intelligence) · 023 (realtime) · 024 (analytics events) applied in Supabase.'}
          </p>
        </Card>
      </section>

      <footer className="mt-10 text-center text-[10px] font-medium tracking-wider text-ink-300">
        RENDERED {new Date().toISOString()}
      </footer>
    </main>
  );
}

function FeatureLink({ emoji, href, label, desc, tone }: { emoji: string; href: string; label: string; desc: string; tone: 'coral'|'ocean'|'emerald'|'amber' }){
  const bg = tone === 'coral' ? 'from-coral-50 border-coral-200 hover:border-coral-500'
    : tone === 'ocean' ? 'from-ocean-400/10 border-ocean-400/30 hover:border-ocean-400'
    : tone === 'emerald' ? 'from-emerald-50 border-emerald-200 hover:border-emerald-500'
    : 'from-amber-50 border-amber-200 hover:border-amber-500';
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`group flex items-start gap-3 rounded-xl border bg-gradient-to-br to-white p-3 transition ${bg}`}>
      <span className="text-2xl leading-none" aria-hidden>{emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-ink-900 group-hover:underline">{label}</div>
        <div className="mt-0.5 text-[11px] text-ink-500">{desc}</div>
      </div>
      <span className="text-ink-300 group-hover:text-ink-700">→</span>
    </a>
  );
}

function providerBreak(byProvider: Record<string, number>){
  const parts = Object.entries(byProvider).map(([p, c]) => `${p} ${c}`);
  return parts.length ? parts.join(' · ') : '—';
}

function KpiCard({ label, value, delta, sparkline }: { label: string; value: string; delta: string; sparkline?: number[] }){
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">{label}</div>
      <div className="mt-2 font-display text-[28px] font-semibold tabular-nums leading-none text-ink-900">{value}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-[11px] font-medium text-ink-500">{delta}</div>
        {sparkline && <MiniSpark data={sparkline} />}
      </div>
    </div>
  );
}

function MiniSpark({ data }: { data: number[] }){
  const max = Math.max(...data, 1);
  const w = 60, h = 20;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="text-ink-300">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkline({ data, color, total, isEs }: { data: number[]; color: string; total: number; isEs?: boolean }){
  const max = Math.max(...data, 1);
  const w = 600, h = 100;
  const barW = w / data.length;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="font-display text-[24px] font-semibold tabular-nums text-ink-900">{total.toLocaleString()}</div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">total 30d</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
        {data.map((v, i) => {
          const barH = (v / max) * h;
          return <rect key={i} x={i * barW + 1} y={h - barH} width={barW - 2} height={barH} fill={color} opacity={0.85} rx={1} />;
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] font-medium text-ink-400">
        <span>{isEs ? 'hace 30d' : '30d ago'}</span>
        <span>{isEs ? 'hoy' : 'today'}</span>
      </div>
    </div>
  );
}

function FunnelChart({ steps }: { steps: Array<{ label: string; value: number; color: string }> }){
  const max = Math.max(...steps.map(s => s.value), 1);
  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const pct = Math.round((s.value / max) * 100);
        const prevVal = i > 0 ? steps[i - 1].value : max;
        const convRate = prevVal > 0 ? Math.round((s.value / prevVal) * 100) : 0;
        return (
          <div key={i} className="text-[13px]">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="font-semibold text-ink-800">{s.label}</span>
              <span className="flex items-baseline gap-2">
                <span className="tabular-nums font-semibold text-ink-900">{s.value.toLocaleString()}</span>
                {i > 0 && <span className="text-[10px] font-medium text-ink-400">{convRate}% conv</span>}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
            </div>
          </div>
        );
      })}
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
