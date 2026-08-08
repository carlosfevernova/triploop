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
      countries_supported: 1, // California / USA
      waitlist: waitlist.count || 0
    };
  } catch {
    return { trips_planned: 0, templates: 0, countries_supported: 1, waitlist: 0 };
  }
}

export async function SocialProofStrip({ isEs }: { isEs?: boolean }){
  const stats = await loadStats();
  // Ocultar si aún hay 0 trips (evita "0 trips planned" que se ve mal)
  if(stats.trips_planned < 3) return null;
  return (
    <section className="border-b border-ink-100 bg-white py-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        <Stat value={stats.trips_planned} label={isEs ? 'Rutas planeadas' : 'Trips planned'} />
        <Stat value={stats.templates} label={isEs ? 'Rutas curadas' : 'Curated itineraries'} />
        <Stat value={stats.waitlist} label={isEs ? 'En la lista de espera' : 'On the waitlist'} suffix="+" />
        <Stat value={100} label={isEs ? 'Ciudades cubiertas' : 'Cities covered'} suffix="+" note="California" />
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
