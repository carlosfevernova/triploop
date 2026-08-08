import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Italia road trips — Costa Amalfitana, Cinque Terre, Toscana | TripLoop' : 'Italy Road Trips — Amalfi Coast, Cinque Terre, Tuscany | TripLoop',
    description: isEs
      ? 'Costiera Amalfitana SS163 + Cinque Terre + Florencia en 7 días. UNESCO scenic drive, Positano, Ravello.'
      : 'Amalfi Coast SS163 + Cinque Terre + Florence 7 days. UNESCO scenic drive, Positano, Ravello.',
    alternates: { canonical: `/${locale}/italy`, languages: { en: '/en/italy', es: '/es/italy' } }
  };
}

export const revalidate = 3600;

export default async function ItalyIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="italy" locale={locale} />;
}
