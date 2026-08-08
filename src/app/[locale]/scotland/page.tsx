import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Escocia road trip — North Coast 500 (NC500) Highlands | TripLoop' : 'Scotland Road Trip — North Coast 500 (NC500) Highlands | TripLoop',
    description: isEs ? 'NC500 loop 516 millas: Inverness → Applecross → Ullapool → Durness → John O\'Groats → Loch Ness en 6 días.' : 'NC500 loop 516 miles: Inverness → Applecross → Ullapool → Durness → John O\'Groats → Loch Ness in 6 days.',
    alternates: { canonical: `/${locale}/scotland`, languages: { en: '/en/scotland', es: '/es/scotland' } }
  };
}
export const revalidate = 3600;
export default async function ScotlandIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="scotland" locale={locale} />;
}
