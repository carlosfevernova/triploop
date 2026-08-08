import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Australia road trip — Great Ocean Road B100 | TripLoop' : 'Australia Road Trip — Great Ocean Road B100 | TripLoop',
    description: isEs
      ? 'Great Ocean Road 243 km, Doce Apóstoles, Loch Ard Gorge, Melbourne a Warrnambool en 4 días.'
      : 'Great Ocean Road 243 km, Twelve Apostles, Loch Ard Gorge, Melbourne to Warrnambool in 4 days.',
    alternates: { canonical: `/${locale}/australia`, languages: { en: '/en/australia', es: '/es/australia' } }
  };
}
export const revalidate = 3600;
export default async function AustraliaIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="australia" locale={locale} />;
}
