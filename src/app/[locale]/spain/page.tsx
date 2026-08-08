import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'España road trips — Madrid, Barcelona, Andalucía, Camino | TripLoop' : 'Spain Road Trip Itineraries — Madrid, Barcelona, Andalucía, Camino | TripLoop',
    description: isEs
      ? 'Rutas por España listas para personalizar: Madrid escapada 3d, Barcelona Modernista, Andalucía 7d, Camino de Santiago 10d.'
      : 'Ready-to-customize Spain road trips: Madrid weekend 3d, Barcelona Modernista, Andalucía 7d, Camino de Santiago 10d.',
    alternates: { canonical: `/${locale}/spain`, languages: { en: '/en/spain', es: '/es/spain' } }
  };
}

export const revalidate = 3600;

export default async function SpainIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="spain" locale={locale} />;
}
