import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Japón road trip — Golden Route Tokio Kioto | TripLoop' : 'Japan Road Trip — Golden Route Tokyo Kyoto | TripLoop',
    description: isEs ? 'Ruta Dorada 7 días: Tokio → Monte Fuji → Kioto → Nara → Osaka. Tokaido corridor 500 km.' : 'Golden Route 7 days: Tokyo → Mt Fuji → Kyoto → Nara → Osaka. Tokaido corridor 500 km.',
    alternates: { canonical: `/${locale}/japan`, languages: { en: '/en/japan', es: '/es/japan' } }
  };
}
export const revalidate = 3600;
export default async function JapanIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="japan" locale={locale} />;
}
