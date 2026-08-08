import type { Metadata } from 'next';
import { RegionTemplateDetail, generateRegionMetadata } from '@/components/region/RegionTemplateDetail';

interface PageProps { params: Promise<{ locale: string; slug: string }>; }

// ISR on-demand: sin generateStaticParams para permitir templates seedeados post-build
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateRegionMetadata('spain', slug, locale);
}

export default async function SpainTemplatePage({ params }: PageProps){
  const { locale, slug } = await params;
  return <RegionTemplateDetail region="spain" slug={slug} locale={locale} />;
}
