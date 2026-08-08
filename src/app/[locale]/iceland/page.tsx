import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Islandia road trip — Ring Road (Route 1) 1,322 km | TripLoop' : 'Iceland Road Trip — Ring Road (Route 1) 1,322 km | TripLoop',
    description: isEs
      ? 'Ring Road completo 10 días: Golden Circle, Jökulsárlón, Vík, Mývatn, Snæfellsnes.'
      : 'Full Ring Road 10 days: Golden Circle, Jökulsárlón, Vík, Mývatn, Snæfellsnes.',
    alternates: { canonical: `/${locale}/iceland`, languages: { en: '/en/iceland', es: '/es/iceland' } }
  };
}
export const revalidate = 3600;
export default async function IcelandIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="iceland" locale={locale} />;
}
