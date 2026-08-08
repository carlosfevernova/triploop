import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase-admin';

export const runtime = 'edge';
export const revalidate = 3600;

export const metadata = {
  title: 'TripLoop embed',
  robots: { index: false, follow: false }
};

interface PageProps { params: Promise<{ slug: string }>; searchParams: Promise<{ locale?: string; theme?: string }>; }

interface Stop { id?: string; name: string; lat: number; lng: number; duration_min?: number; category?: string; }
interface Trip {
  slug: string; title: string; days_count: number;
  origin_city?: string; destination_city?: string; hero_image_url?: string;
  stops: Stop[]; total_distance_m?: number; total_duration_s?: number;
  translations?: Record<string, { title?: string; stops?: Array<{ name: string }> }>;
}

async function getTrip(slug: string): Promise<Trip | null> {
  const sb = createPublicClient();
  const { data } = await sb.from('trips')
    .select('slug, title, days_count, origin_city, destination_city, hero_image_url, stops, total_distance_m, total_duration_s, translations')
    .eq('slug', slug)
    .maybeSingle();
  return (data as Trip) || null;
}

export default async function EmbedTripPage({ params, searchParams }: PageProps){
  const { slug } = await params;
  const { locale = 'en', theme = 'light' } = await searchParams;
  const raw = await getTrip(slug);
  if(!raw) notFound();

  // Aplicar traducción locale
  let tpl: Trip = raw;
  if(locale === 'es' && raw.translations?.es){
    const tr = raw.translations.es;
    tpl = {
      ...raw,
      title: tr.title || raw.title,
      stops: tr.stops
        ? raw.stops.map((s, i) => ({ ...s, name: tr.stops![i]?.name || s.name }))
        : raw.stops
    };
  }

  const isEs = locale === 'es';
  const isDark = theme === 'dark';
  const bg = isDark ? '#1F2937' : '#ffffff';
  const fg = isDark ? '#F9FAFB' : '#1F2937';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const border = isDark ? '#374151' : '#E5E7EB';
  const accent = '#FF5A5F';
  const siteUrl = `https://triploop-six.vercel.app/${locale}/${slug.startsWith('california') || slug.startsWith('nevada') || slug.startsWith('arizona') || slug.startsWith('utah') || slug.startsWith('us-southwest') || slug.startsWith('route-66') ? 'trip' : 'trip'}/${slug}`;

  return (
    <html lang={locale}>
      <body style={{
        margin: 0, padding: 16, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        background: bg, color: fg, minHeight: '100vh'
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, background: accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>t</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>{tpl.title}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                {tpl.days_count} {isEs ? 'días' : 'days'} · {tpl.stops.length} {isEs ? 'paradas' : 'stops'}
                {tpl.origin_city && ` · ${tpl.origin_city}`}
                {tpl.destination_city && tpl.destination_city !== tpl.origin_city && ` → ${tpl.destination_city}`}
              </div>
            </div>
            <a href={siteUrl} target="_top" rel="noopener" style={{
              padding: '6px 14px', borderRadius: 999, background: accent, color: 'white',
              fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap'
            }}>
              {isEs ? 'Ver ruta' : 'View trip'} →
            </a>
          </div>

          {/* Hero image */}
          {tpl.hero_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={tpl.hero_image_url} alt="" style={{ width: '100%', display: 'block', maxHeight: 200, objectFit: 'cover' }} />
          )}

          {/* Stops list */}
          <ol style={{ margin: 0, padding: '12px 20px 20px', listStyle: 'none' }}>
            {tpl.stops.slice(0, 8).map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < Math.min(7, tpl.stops.length - 1) ? `1px solid ${border}` : 'none' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: accent, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, flexShrink: 0
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                  {s.duration_min && (
                    <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                      ⏱ {s.duration_min < 60 ? `${s.duration_min} min` : `${Math.floor(s.duration_min / 60)}h${s.duration_min % 60 ? ` ${s.duration_min % 60}m` : ''}`}
                    </div>
                  )}
                </div>
              </li>
            ))}
            {tpl.stops.length > 8 && (
              <li style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, color: muted }}>
                + {tpl.stops.length - 8} {isEs ? 'paradas más' : 'more stops'}
              </li>
            )}
          </ol>

          {/* Footer branding */}
          <div style={{ padding: '10px 20px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: muted }}>
            <span>TripLoop · road trip planner</span>
            <a href="https://triploop-six.vercel.app" target="_top" rel="noopener" style={{ color: muted, textDecoration: 'none' }}>triploop.app ↗</a>
          </div>
        </div>
      </body>
    </html>
  );
}
