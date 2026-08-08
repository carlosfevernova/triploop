import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Argentina road trip — Ruta 40 Patagonia Bariloche Perito Moreno | TripLoop' : 'Argentina Road Trip — Route 40 Patagonia Bariloche Perito Moreno | TripLoop',
    description: isEs ? 'Ruta 40 Patagonia 10 días: Bariloche → 7 Lagos → El Chaltén Fitz Roy → Perito Moreno glaciar.' : 'Route 40 Patagonia 10 days: Bariloche → 7 Lakes → El Chaltén Fitz Roy → Perito Moreno glacier.',
    alternates: { canonical: `/${locale}/argentina`, languages: { en: '/en/argentina', es: '/es/argentina' } }
  };
}
export const revalidate = 3600;
export default async function ArgentinaIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="argentina" locale={locale} />;
}
