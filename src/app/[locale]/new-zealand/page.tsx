import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Nueva Zelanda road trip — South Island SH1/SH6 | TripLoop' : 'New Zealand Road Trip — South Island SH1/SH6 | TripLoop',
    description: isEs
      ? 'Isla Sur 10 días: Milford Sound, Franz Josef Glacier, Queenstown, Christchurch. Lord of the Rings landscapes.'
      : 'South Island 10 days: Milford Sound, Franz Josef Glacier, Queenstown, Christchurch. Lord of the Rings landscapes.',
    alternates: { canonical: `/${locale}/new-zealand`, languages: { en: '/en/new-zealand', es: '/es/new-zealand' } }
  };
}
export const revalidate = 3600;
export default async function NZIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="new-zealand" locale={locale} />;
}
