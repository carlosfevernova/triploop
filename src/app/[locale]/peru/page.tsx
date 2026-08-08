import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Perú road trip — Valle Sagrado, Cusco, Machu Picchu | TripLoop' : 'Peru Road Trip — Sacred Valley, Cusco, Machu Picchu | TripLoop',
    description: isEs ? 'Cusco → Pisac → Ollantaytambo → Machu Picchu → Maras Moray en 5 días. 320 km loop Andes.' : 'Cusco → Pisac → Ollantaytambo → Machu Picchu → Maras Moray in 5 days. 320 km Andean loop.',
    alternates: { canonical: `/${locale}/peru`, languages: { en: '/en/peru', es: '/es/peru' } }
  };
}
export const revalidate = 3600;
export default async function PeruIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="peru" locale={locale} />;
}
