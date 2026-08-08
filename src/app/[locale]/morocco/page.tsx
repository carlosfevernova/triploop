import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Marruecos road trip — Marrakech Sahara Atlas Merzouga | TripLoop' : 'Morocco Road Trip — Marrakech Sahara Atlas Merzouga | TripLoop',
    description: isEs ? 'Marrakech → Ait Ben Haddou → Todra Gorge → Merzouga Sahara → Fes en 7 días. N9 Atlas + N10 Draa Valley.' : 'Marrakech → Ait Ben Haddou → Todra Gorge → Merzouga Sahara → Fes in 7 days. N9 Atlas + N10 Draa Valley.',
    alternates: { canonical: `/${locale}/morocco`, languages: { en: '/en/morocco', es: '/es/morocco' } }
  };
}
export const revalidate = 3600;
export default async function MoroccoIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="morocco" locale={locale} />;
}
