import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Arizona road trips — Grand Canyon, Sedona, Antelope | TripLoop' : 'Arizona Road Trip Itineraries — Grand Canyon, Sedona, Antelope | TripLoop',
    description: isEs ? 'Rutas por Arizona listas: Grand Canyon weekend, Sedona-Flagstaff, Antelope-Horseshoe-Monument Valley.' : 'Ready-to-customize Arizona road trips: Grand Canyon weekend, Sedona-Flagstaff, Antelope-Horseshoe-Monument Valley.',
    alternates: { canonical: `/${locale}/arizona`, languages: { en: '/en/arizona', es: '/es/arizona' } }
  };
}

export const revalidate = 3600;

export default async function ArizonaIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="arizona" locale={locale} />;
}
