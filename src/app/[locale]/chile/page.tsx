import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Chile road trip — Carretera Austral Ruta 7 Patagonia | TripLoop' : 'Chile Road Trip — Carretera Austral Route 7 Patagonia | TripLoop',
    description: isEs ? 'Ruta 7 completa 1,240 km: Puerto Montt → Coyhaique → Villa O\'Higgins. Fiordos, glaciares, ferries.' : 'Full Route 7 1,240 km: Puerto Montt → Coyhaique → Villa O\'Higgins. Fjords, glaciers, ferries.',
    alternates: { canonical: `/${locale}/chile`, languages: { en: '/en/chile', es: '/es/chile' } }
  };
}
export const revalidate = 3600;
export default async function ChileIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="chile" locale={locale} />;
}
