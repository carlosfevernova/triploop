import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Rocky Mountains road trips — Glacier, Yellowstone, Colorado | TripLoop' : 'Rocky Mountains Road Trips — Glacier, Yellowstone, Colorado | TripLoop',
    description: isEs
      ? 'Rocosas 3 joyas: Glacier + Yellowstone + Grand Teton (8 días) + Colorado Rockies loop (6 días). Going-to-the-Sun Road, Independence Pass.'
      : 'Rockies 3 crown jewels: Glacier + Yellowstone + Grand Teton (8 days) + Colorado Rockies loop (6 days). Going-to-the-Sun Road, Independence Pass.',
    alternates: { canonical: `/${locale}/rockies`, languages: { en: '/en/rockies', es: '/es/rockies' } }
  };
}

export const revalidate = 3600;

export default async function RockiesIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="rockies" locale={locale} />;
}
