import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';
interface PageProps { params: Promise<{ locale: string }>; }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'México road trip — Riviera Maya, Yucatán, Chichén Itzá | TripLoop' : 'Mexico Road Trip — Riviera Maya, Yucatán, Chichén Itzá | TripLoop',
    description: isEs ? 'Cancún → Tulum → Cenotes → Chichén Itzá → Uxmal → Mérida en 5 días. MEX-307 + MEX-180 Autopista.' : 'Cancún → Tulum → Cenotes → Chichén Itzá → Uxmal → Mérida 5 days. MEX-307 + MEX-180 Highway.',
    alternates: { canonical: `/${locale}/mexico`, languages: { en: '/en/mexico', es: '/es/mexico' } }
  };
}
export const revalidate = 3600;
export default async function MexicoIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="mexico" locale={locale} />;
}
