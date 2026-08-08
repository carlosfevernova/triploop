import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Canadá road trip — Icefields Parkway Hwy 93 Jasper Banff | TripLoop' : 'Canada Road Trip — Icefields Parkway Hwy 93 Jasper Banff | TripLoop',
    description: isEs ? 'Icefields Parkway Hwy 93 233 km: Jasper → Lake Louise → Banff. Glaciares Athabasca, Peyto Lake, Moraine Lake en 5 días.' : 'Icefields Parkway Hwy 93 233 km: Jasper → Lake Louise → Banff. Athabasca Glacier, Peyto Lake, Moraine Lake in 5 days.',
    alternates: { canonical: `/${locale}/canada`, languages: { en: '/en/canada', es: '/es/canada' } }
  };
}
export const revalidate = 3600;
export default async function CanadaIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="canada" locale={locale} />;
}
