import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Nevada road trips — Vegas, Tahoe, Great Basin | TripLoop' : 'Nevada Road Trip Itineraries — Vegas, Tahoe, Loneliest Road | TripLoop',
    description: isEs ? 'Rutas por Nevada listas para personalizar: Vegas weekend, Lake Tahoe, Loop Reno-Vegas por Highway 50.' : 'Ready-to-customize Nevada road trips: Vegas weekend, Lake Tahoe, Reno-Vegas loop via the loneliest road in America.',
    alternates: { canonical: `/${locale}/nevada`, languages: { en: '/en/nevada', es: '/es/nevada' } }
  };
}

export const revalidate = 3600;

export default async function NevadaIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="nevada" locale={locale} />;
}
