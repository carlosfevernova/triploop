import type { Metadata } from 'next';
import { RegionIndex } from '@/components/region/RegionIndex';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Sureste USA road trips — Florida Keys, Mississippi River | TripLoop' : 'Southeast USA Road Trips — Florida Keys, Mississippi River | TripLoop',
    description: isEs
      ? 'Florida Keys Overseas Highway (US-1, 4 días) + Great River Road Minneapolis→New Orleans (10 días). Seven Mile Bridge, Beale St, French Quarter.'
      : 'Florida Keys Overseas Highway (US-1, 4 days) + Great River Road Minneapolis→New Orleans (10 days). Seven Mile Bridge, Beale St, French Quarter.',
    alternates: { canonical: `/${locale}/southeast`, languages: { en: '/en/southeast', es: '/es/southeast' } }
  };
}

export const revalidate = 3600;

export default async function SoutheastIndexPage({ params }: PageProps){
  const { locale } = await params;
  return <RegionIndex region="southeast" locale={locale} />;
}
