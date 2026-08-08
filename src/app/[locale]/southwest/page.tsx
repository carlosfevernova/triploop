import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Suroeste USA — Grand Circle, Route 66 multi-estado | TripLoop' : 'US Southwest Road Trips — Grand Circle, Route 66 | TripLoop',
    description: isEs ? 'Rutas multi-estado: US Southwest Grand Circle 10 días (5 estados, 8 parques), Route 66 Chicago-Santa Monica 14 días.' : 'Multi-state road trips: US Southwest Grand Circle 10 days (5 states, 8 national parks), Route 66 Chicago-Santa Monica 14 days.',
    alternates: { canonical: `/${locale}/southwest`, languages: { en: '/en/southwest', es: '/es/southwest' } }
  };
}

export const revalidate = 3600;

export default async function SouthwestIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="southwest" locale={locale} />;
}
