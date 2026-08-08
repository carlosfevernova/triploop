import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';
import { RegionTemplateDetail, generateRegionMetadata } from '@/components/region/RegionTemplateDetail';

interface PageProps { params: Promise<{ locale: string; slug: string }>; }

export async function generateStaticParams(){
  const sb = createPublicClient();
  const { data } = await sb.from('trips').select('slug').eq('is_template', true).eq('is_public', true).eq('region', 'nevada');
  const slugs = (data || []).map((r: { slug: string }) => r.slug);
  return ['en', 'es'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return generateRegionMetadata('nevada', slug, locale);
}

export default async function NevadaTemplatePage({ params }: PageProps){
  const { locale, slug } = await params;
  return <RegionTemplateDetail region="nevada" slug={slug} locale={locale} />;
}
