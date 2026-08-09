import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase-admin';

export const metadata = { title: 'AI Costs — TripLoop Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

interface ProviderMetric {
  provider: string;
  calls: number;
  success_rate: number;
  avg_latency_ms: number;
  total_cost_usd: number;
  fallback_count: number;
}

interface EndpointMetric { endpoint: string; calls: number; avg_latency_ms: number; }
interface DailyMetric { day: string; calls: number; cost: number; }

async function loadMetrics(): Promise<{
  providers: ProviderMetric[];
  endpoints: EndpointMetric[];
  daily7d: DailyMetric[];
  totalCalls: number;
  totalCost: number;
  cachedRate: number;
  hasData: boolean;
}> {
  try {
    const sb = createAdminClient();
    const { data, error } = await sb.from('ai_call_log').select('*').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    if(error || !data) return { providers: [], endpoints: [], daily7d: [], totalCalls: 0, totalCost: 0, cachedRate: 0, hasData: false };

    const providerAgg = new Map<string, { calls: number; success: number; latency: number[]; cost: number; fallbacks: number }>();
    const endpointAgg = new Map<string, { calls: number; latency: number[] }>();
    const dailyAgg = new Map<string, { calls: number; cost: number }>();
    let cachedCount = 0;

    for(const row of data as Array<{ provider: string; endpoint: string; latency_ms: number | null; success: boolean; estimated_cost_usd: number | null; fallback_count: number | null; source: string | null; created_at: string }>){
      const p = row.provider || 'unknown';
      const pAgg = providerAgg.get(p) || { calls: 0, success: 0, latency: [], cost: 0, fallbacks: 0 };
      pAgg.calls++;
      if(row.success) pAgg.success++;
      if(row.latency_ms) pAgg.latency.push(row.latency_ms);
      pAgg.cost += Number(row.estimated_cost_usd || 0);
      pAgg.fallbacks += row.fallback_count || 0;
      providerAgg.set(p, pAgg);

      const ep = row.endpoint || 'unknown';
      const eAgg = endpointAgg.get(ep) || { calls: 0, latency: [] };
      eAgg.calls++;
      if(row.latency_ms) eAgg.latency.push(row.latency_ms);
      endpointAgg.set(ep, eAgg);

      const day = row.created_at.slice(0, 10);
      const dAgg = dailyAgg.get(day) || { calls: 0, cost: 0 };
      dAgg.calls++;
      dAgg.cost += Number(row.estimated_cost_usd || 0);
      dailyAgg.set(day, dAgg);

      if(row.source === 'cache' || row.source === 'curated') cachedCount++;
    }

    const providers: ProviderMetric[] = [...providerAgg.entries()].map(([provider, a]) => ({
      provider,
      calls: a.calls,
      success_rate: a.calls ? Math.round(a.success / a.calls * 100) : 0,
      avg_latency_ms: a.latency.length ? Math.round(a.latency.reduce((s, x) => s + x, 0) / a.latency.length) : 0,
      total_cost_usd: Math.round(a.cost * 100000) / 100000,
      fallback_count: a.fallbacks
    })).sort((a, b) => b.calls - a.calls);

    const endpoints: EndpointMetric[] = [...endpointAgg.entries()].map(([endpoint, a]) => ({
      endpoint,
      calls: a.calls,
      avg_latency_ms: a.latency.length ? Math.round(a.latency.reduce((s, x) => s + x, 0) / a.latency.length) : 0
    })).sort((a, b) => b.calls - a.calls);

    const daily7d: DailyMetric[] = [...dailyAgg.entries()]
      .map(([day, a]) => ({ day, calls: a.calls, cost: Math.round(a.cost * 100000) / 100000 }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-7);

    const totalCalls = data.length;
    const totalCost = providers.reduce((s, p) => s + p.total_cost_usd, 0);
    const cachedRate = totalCalls ? Math.round(cachedCount / totalCalls * 100) : 0;

    return { providers, endpoints, daily7d, totalCalls, totalCost, cachedRate, hasData: totalCalls > 0 };
  } catch {
    return { providers: [], endpoints: [], daily7d: [], totalCalls: 0, totalCost: 0, cachedRate: 0, hasData: false };
  }
}

export default async function AICostsPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');
  const m = await loadMetrics();

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <a href="/admin" className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
        <span aria-hidden>←</span> Volver al dashboard
      </a>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-400">Observability · Últimos 30 días</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink-900">AI Cost Dashboard</h1>
        <p className="mt-2 text-[14px] text-ink-500">Métricas de llamadas AI · Provider performance · Costo estimado</p>
      </header>

      {!m.hasData && (
        <div className="rounded-card border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800">
          <p className="font-semibold">Sin datos aún — ai_call_log vacía.</p>
          <p className="mt-1 text-xs">Los datos aparecerán cuando los usuarios generen viajes con IA. Endpoint tracking está activo.</p>
        </div>
      )}

      {m.hasData && (
        <>
          {/* KPI cards */}
          <section className="mb-8 grid gap-4 md:grid-cols-4">
            <Card label="Total llamadas 30d" value={m.totalCalls.toLocaleString()} />
            <Card label="Cost total estimado" value={`$${m.totalCost.toFixed(4)}`} />
            <Card label="Cache/Curated hit rate" value={`${m.cachedRate}%`} note="0 tokens cost" />
            <Card label="Providers activos" value={String(m.providers.length)} />
          </section>

          {/* Provider breakdown */}
          <section className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-800">Por provider</h2>
            <div className="overflow-x-auto rounded-card border border-ink-100 bg-white shadow-card">
              <table className="w-full text-[13px]">
                <thead className="border-b border-ink-100 bg-ink-50/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-ink-700">Provider</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Calls</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Success %</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Avg latency</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Cost USD</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-700">Fallbacks</th>
                  </tr>
                </thead>
                <tbody>
                  {m.providers.map((p, i) => (
                    <tr key={p.provider} className={i % 2 ? 'bg-ink-50/30' : ''}>
                      <td className="px-3 py-2 font-mono text-[11px] text-ink-800">{p.provider}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.calls}</td>
                      <td className={`px-3 py-2 text-right tabular-nums ${p.success_rate >= 95 ? 'text-emerald-600' : p.success_rate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>{p.success_rate}%</td>
                      <td className={`px-3 py-2 text-right tabular-nums ${p.avg_latency_ms < 2000 ? 'text-emerald-600' : p.avg_latency_ms < 10000 ? 'text-amber-600' : 'text-red-600'}`}>{p.avg_latency_ms}ms</td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold">${p.total_cost_usd.toFixed(5)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-ink-500">{p.fallback_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-800">Por endpoint</h2>
            <div className="overflow-x-auto rounded-card border border-ink-100 bg-white shadow-card">
              <table className="w-full text-[13px]">
                <thead className="border-b border-ink-100 bg-ink-50/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Endpoint</th>
                    <th className="px-3 py-2 text-right font-semibold">Calls</th>
                    <th className="px-3 py-2 text-right font-semibold">Avg latency</th>
                  </tr>
                </thead>
                <tbody>
                  {m.endpoints.map((e, i) => (
                    <tr key={e.endpoint} className={i % 2 ? 'bg-ink-50/30' : ''}>
                      <td className="px-3 py-2 font-mono text-[11px]">{e.endpoint}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{e.calls}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{e.avg_latency_ms}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Daily last 7 days */}
          <section className="mb-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-800">Últimos 7 días</h2>
            <div className="rounded-card border border-ink-100 bg-white p-4 shadow-card">
              <div className="flex items-end justify-around gap-2" style={{ minHeight: 140 }}>
                {m.daily7d.map(d => {
                  const maxCalls = Math.max(...m.daily7d.map(x => x.calls), 1);
                  const h = Math.max(4, (d.calls / maxCalls) * 120);
                  return (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div className="text-[10px] tabular-nums text-ink-500">{d.calls}</div>
                      <div className="w-full rounded-t bg-gradient-to-t from-coral-500 to-coral-400" style={{ height: h }} title={`$${d.cost.toFixed(5)}`} />
                      <div className="text-[10px] font-mono text-ink-400">{d.day.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <p className="mt-10 text-center text-[10px] text-ink-400">
        Data: ai_call_log · migration 018 · queries ejecutadas server-side · auto-refresh en cada render
      </p>
    </main>
  );
}

function Card({ label, value, note }: { label: string; value: string; note?: string }){
  return (
    <div className="rounded-card border border-ink-100 bg-white p-4 shadow-card">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink-900">{value}</div>
      {note && <div className="mt-0.5 text-[11px] text-ink-500">{note}</div>}
    </div>
  );
}
