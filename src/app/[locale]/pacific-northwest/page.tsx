import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Pacific Northwest road trips — Seattle, Portland, Olympic | TripLoop' : 'Pacific Northwest Road Trips — Seattle, Portland, Olympic | TripLoop',
    description: isEs
      ? 'Rutas PNW: Seattle→Portland loop 7 días con Olympic NP y Mt. Rainier, Oregon Coast Highway (US-101) 5 días. Tiempos reales, precios finales.'
      : 'PNW itineraries: Seattle→Portland 7-day loop with Olympic NP and Mt. Rainier, Oregon Coast Highway (US-101) 5 days. Real drive times, tax-included.',
    alternates: { canonical: `/${locale}/pacific-northwest`, languages: { en: '/en/pacific-northwest', es: '/es/pacific-northwest' } }
  };
}

export const revalidate = 3600;

export default async function PNWIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="pacific-northwest" locale={locale} />;
}
