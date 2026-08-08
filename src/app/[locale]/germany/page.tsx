import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Alemania road trip — Ruta Romántica B25 · Neuschwanstein | TripLoop' : 'Germany Road Trip — Romantic Road B25 · Neuschwanstein | TripLoop',
    description: isEs
      ? 'Romantische Straße B25 (350 km): Würzburg → Rothenburg → Neuschwanstein → Füssen en 5 días.'
      : 'Romantic Road B25 (350 km): Würzburg → Rothenburg → Neuschwanstein → Füssen in 5 days.',
    alternates: { canonical: `/${locale}/germany`, languages: { en: '/en/germany', es: '/es/germany' } }
  };
}
export const revalidate = 3600;
export default async function GermanyIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="germany" locale={locale} />;
}
