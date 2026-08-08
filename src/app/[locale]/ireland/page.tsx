import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Irlanda road trip — Ring of Kerry N70, Cliffs of Moher | TripLoop' : 'Ireland Road Trip — Ring of Kerry N70, Cliffs of Moher | TripLoop',
    description: isEs
      ? 'Ring of Kerry N70 (179 km) + Wild Atlantic Way + Cliffs of Moher en 5 días.'
      : 'Ring of Kerry N70 (179 km) + Wild Atlantic Way + Cliffs of Moher in 5 days.',
    alternates: { canonical: `/${locale}/ireland`, languages: { en: '/en/ireland', es: '/es/ireland' } }
  };
}
export const revalidate = 3600;
export default async function IrelandIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="ireland" locale={locale} />;
}
