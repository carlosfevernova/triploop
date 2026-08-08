import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Utah road trips — Mighty 5, Zion, Bryce, Arches | TripLoop' : 'Utah Road Trip Itineraries — Mighty 5, Zion, Bryce, Arches | TripLoop',
    description: isEs
      ? 'Rutas por Utah listas: Mighty 5 en 10 días, Zion weekend, Bryce Canyon, Salt Lake + Park City. Con tiempos reales y precios con IVA.'
      : 'Ready-to-customize Utah road trips: Mighty 5 in 10 days, Zion weekend, Bryce Canyon, Salt Lake + Park City. Real drive times, tax-included pricing.',
    alternates: { canonical: `/${locale}/utah`, languages: { en: '/en/utah', es: '/es/utah' } }
  };
}

export const revalidate = 3600;

export default async function UtahIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="utah" locale={locale} />;
}
