import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase-admin';

// S52: Agenda diaria — crea trip minimal (1 día, sin destino) y redirige directo al itinerary editor.
// Reutiliza tablas trip_days + itinerary_items. Marca como is_public=true para shareable-by-slug sin login.

export const dynamic = 'force-dynamic';

export default async function AgendaNewPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateISO = `${yyyy}-${mm}-${dd}`;

  const isEs = locale === 'es';
  const title = isEs ? `Mi agenda · ${dateISO}` : `My agenda · ${dateISO}`;

  const sb = createAdminClient();
  // 1) Generar slug
  const { data: slugRow } = await sb.rpc('gen_trip_slug');
  const slug = String(slugRow || `agenda-${Date.now().toString(36)}`);

  // 2) Insert trip minimal (1 día, sin destino, marcado como agenda via title prefix)
  await sb.from('trips').insert({
    slug,
    title,
    start_date: dateISO,
    end_date: dateISO,
    days_count: 1,
    travelers_count: 1,
    unit_system: locale === 'es' ? 'metric' : 'imperial',
    currency: locale === 'es' ? 'MXN' : 'USD',
    locale,
    stops: [],
    is_public: true
  });

  redirect(`/${locale}/trip/${slug}/itinerary`);
}
