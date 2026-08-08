import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Noreste USA road trips — New England fall foliage, Blue Ridge Parkway | TripLoop' : 'Northeast USA Road Trips — New England Fall Foliage, Blue Ridge Parkway | TripLoop',
    description: isEs
      ? 'Otoño en New England 7 días (Boston→Acadia) + Blue Ridge Parkway 5 días (Shenandoah→Smokies). Kancamagus Hwy, VT-100, I-93.'
      : 'New England fall foliage 7 days (Boston→Acadia) + Blue Ridge Parkway 5 days (Shenandoah→Smokies). Kancamagus Hwy, VT-100, I-93.',
    alternates: { canonical: `/${locale}/northeast`, languages: { en: '/en/northeast', es: '/es/northeast' } }
  };
}

export const revalidate = 3600;

export default async function NortheastIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="northeast" locale={locale} />;
}
