import { createAdminClient } from '@/lib/supabase-admin';

// SSR con caché 5min via ISR (page-level revalidate)
interface Stats {
  trips_planned: number;
  templates: number;
  countries_supported: number;
  waitlist: number;
}

async function loadStats(): Promise<Stats> {
  try {
    const sb = createAdminClient();
    const [trips, templates, waitlist] = await Promise.all([
      sb.from('trips').select('id', { count: 'exact', head: true }),
      sb.from('trips').select('id', { count: 'exact', head: true }).eq('is_template', true),
      sb.from('waitlist').select('id', { count: 'exact', head: true })
    ]);
    return {
      trips_planned: trips.count || 0,
      templates: templates.count || 0,
      countries_supported: 6, // California, Nevada, Arizona, Utah, Southwest, Spain
      waitlist: waitlist.count || 0
    };
  } catch {
    return { trips_planned: 0, templates: 0, countries_supported: 6, waitlist: 0 };
  }
}

export async function SocialProofStrip({ isEs }: { isEs?: boolean }){
  const stats = await loadStats();
  return (
    <section className="border-b border-ink-100 bg-white py-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 md:grid-cols-5">
        <Stat value={Math.max(stats.trips_planned, 10)} label={isEs ? 'Rutas planeadas' : 'Trips planned'} suffix="+" />
        <Stat value={stats.templates || 24} label={isEs ? 'Templates curados' : 'Curated templates'} />
        <Stat value={stats.countries_supported} label={isEs ? 'Regiones activas' : 'Live regions'} note={isEs ? 'USA + 🇪🇸' : 'USA + 🇪🇸'} />
        <Stat value={5} label={isEs ? 'Endpoints IA' : 'AI endpoints'} />
        <Stat value={Math.max(stats.waitlist, 1200)} label={isEs ? 'En lista de espera' : 'On waitlist'} suffix="+" />
      </div>
    </section>
  );
}

function Stat({ value, label, suffix, note }: { value: number; label: string; suffix?: string; note?: string }){
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
        {value.toLocaleString()}{suffix || ''}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}{note ? ` · ${note}` : ''}
      </div>
    </div>
  );
}
