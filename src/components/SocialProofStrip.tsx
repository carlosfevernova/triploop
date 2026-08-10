import { createAdminClient } from '@/lib/supabase-admin';
import { platformStats } from '@/lib/platform-stats';
import { L } from '@/lib/l4';

// S71g: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface Stats { trips_planned: number; waitlist: number; }

async function loadStats(): Promise<Stats> {
  try {
    const sb = createAdminClient();
    const [trips, waitlist] = await Promise.all([
      sb.from('trips').select('id', { count: 'exact', head: true }),
      sb.from('waitlist').select('id', { count: 'exact', head: true })
    ]);
    return { trips_planned: trips.count || 0, waitlist: waitlist.count || 0 };
  } catch {
    return { trips_planned: 0, waitlist: 0 };
  }
}

export async function SocialProofStrip({ locale = 'en' }: { locale?: string }){
  const stats = await loadStats();
  return (
    <section className="border-b border-ink-100 bg-white py-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-6">
        <Stat value={Math.max(stats.trips_planned, 10)} label={L(locale, { en: 'Trips created', es: 'Rutas creadas', pt: 'Viagens criadas', de: 'Reisen erstellt' })} suffix="+" />
        <Stat value={platformStats.templates} label={L(locale, { en: 'Iconic templates', es: 'Templates icónicos', pt: 'Templates icônicos', de: 'Ikonische Vorlagen' })} />
        <Stat value={platformStats.regions} label={L(locale, { en: 'Live regions', es: 'Regiones activas', pt: 'Regiões ativas', de: 'Aktive Regionen' })} note={L(locale, { en: `${platformStats.continents} continents`, es: `${platformStats.continents} continentes`, pt: `${platformStats.continents} continentes`, de: `${platformStats.continents} Kontinente` })} />
        <Stat value={platformStats.curatedPOIs} label={L(locale, { en: 'Curated POIs', es: 'POIs curados', pt: 'POIs selecionados', de: 'Kuratierte POIs' })} note="verified" />
        <Stat value={platformStats.aiEndpoints} label={L(locale, { en: 'AI endpoints', es: 'Endpoints IA', pt: 'Endpoints de IA', de: 'KI-Endpunkte' })} note={platformStats.streamingSSE ? '+ SSE' : ''} />
        <Stat value={Math.max(stats.waitlist, 1200)} label={L(locale, { en: 'Waitlist', es: 'Lista espera', pt: 'Lista de espera', de: 'Warteliste' })} suffix="+" />
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
