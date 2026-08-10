import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';
import { locales as ALL_LOCALES } from '@/i18n/request';

const SITE = 'https://triploop-six.vercel.app';
// S70: expandido de 2 → 4 locales (en, es, pt, de) matching inuit-studio i18n footprint
const LOCALES = ALL_LOCALES;
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

  // S71: query wrapped in Promise.race con timeout 8s + row limits para evitar timeout
  // total de sitemap.xml (síntoma: Google no puede crawl).
  const SB_TIMEOUT_MS = 8000;
  const raceTimeout = <T>(p: PromiseLike<T>): Promise<T | null> =>
    Promise.race([
      Promise.resolve(p),
      new Promise<null>((res) => setTimeout(() => res(null), SB_TIMEOUT_MS))
    ]);

  try {
    const sb = createPublicClient();
    const tripsRes = await raceTimeout(
      sb.from('trips')
        .select('slug, region, updated_at')
        .eq('is_template', true)
        .eq('is_public', true)
        .limit(500)
    );
    const trips = (tripsRes?.data as Array<{ slug: string; region?: string; updated_at?: string }> | null) || [];
    const templateEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      trips.map((trip) => {
        const region = trip.region || 'california';
        return {
          url: `${SITE}/${locale}/${region}/${trip.slug}`,
          lastModified: trip.updated_at ? new Date(trip.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}/${region}/${trip.slug}`]))
          }
        };
      })
    );
    // Blog posts
    const postsRes = await raceTimeout(
      sb.from('blog_posts')
        .select('slug, locale, updated_at, published_at')
        .eq('published', true)
        .limit(500)
    );
    const posts = (postsRes?.data as Array<{ slug: string; locale: string; updated_at?: string; published_at?: string }> | null) || [];
    const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${SITE}/${p.locale}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : (p.published_at ? new Date(p.published_at) : now),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      // S65/S70 SEO fix — Google linkea versiones EN/ES/PT/DE del mismo blog post
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE}/${l}/blog/${p.slug}`])),
          'x-default': `${SITE}/en/blog/${p.slug}`
        }
      }
    }));
    return [...staticEntries, ...templateEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
