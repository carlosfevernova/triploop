import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';

const SITE = 'https://triploop-six.vercel.app';
const LOCALES = ['en', 'es'] as const;
const REGIONS = ['california', 'nevada', 'arizona', 'southwest'] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ['', '/california', '/nevada', '/arizona', '/southwest', '/signin', '/signup', '/pricing/upgrade', '/affiliate-disclosure'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${SITE}/${locale}${p}`,
      lastModified: now,
      changeFrequency: p === '' ? 'weekly' as const : 'monthly' as const,
      priority: p === '' ? 1.0 : REGIONS.some(r => p === `/${r}`) ? 0.9 : 0.5,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}${p}`]))
      }
    }))
  );

  try {
    const sb = createPublicClient();
    const { data } = await sb.from('trips')
      .select('slug, region, updated_at')
      .eq('is_template', true)
      .eq('is_public', true);
    const templateEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      (data || []).map((t: { slug: string; region?: string; updated_at?: string }) => {
        const region = t.region || 'california';
        return {
          url: `${SITE}/${locale}/${region}/${t.slug}`,
          lastModified: t.updated_at ? new Date(t.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}/${region}/${t.slug}`]))
          }
        };
      })
    );
    return [...staticEntries, ...templateEntries];
  } catch {
    return staticEntries;
  }
}
