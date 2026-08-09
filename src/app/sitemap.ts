import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';

const SITE = 'https://triploop-six.vercel.app';
const LOCALES = ['en', 'es'] as const;
const REGIONS = [
  'california', 'nevada', 'arizona', 'southwest', 'utah', 'spain',
  'pacific-northwest', 'northeast', 'southeast', 'rockies',
  'italy', 'iceland', 'ireland', 'australia', 'new-zealand', 'germany',
  'mexico', 'chile', 'argentina', 'peru',
  'japan', 'canada', 'scotland', 'morocco'
] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    '',
    ...REGIONS.map(r => `/${r}`),
    '/blog', '/whatsapp', '/signin', '/signup', '/pricing/upgrade', '/affiliate-disclosure',
    '/trip/new', '/trip/new/ai'
  ];

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
    // Blog posts
    const { data: posts } = await sb.from('blog_posts')
      .select('slug, locale, updated_at, published_at')
      .eq('published', true);
    const blogEntries: MetadataRoute.Sitemap = (posts || []).map((p: { slug: string; locale: string; updated_at?: string; published_at?: string }) => ({
      url: `${SITE}/${p.locale}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : (p.published_at ? new Date(p.published_at) : now),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      // S65 SEO fix — Google linkea versiones EN↔ES del mismo blog post
      alternates: {
        languages: {
          en: `${SITE}/en/blog/${p.slug}`,
          es: `${SITE}/es/blog/${p.slug}`,
          'x-default': `${SITE}/en/blog/${p.slug}`
        }
      }
    }));
    return [...staticEntries, ...templateEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
