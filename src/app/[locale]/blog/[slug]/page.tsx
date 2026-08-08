import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';
import { renderMarkdown } from '@/lib/markdown';

interface PageProps { params: Promise<{ locale: string; slug: string }>; }

interface Post {
  slug: string; locale: string; title: string; excerpt?: string;
  body_md: string; hero_image_url?: string; author_name?: string;
  seo_keywords?: string[]; related_templates?: string[];
  published_at: string; updated_at: string; read_minutes?: number;
}

async function getPost(locale: string, slug: string): Promise<Post | null> {
  const sb = createPublicClient();
  const { data } = await sb.from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('published', true)
    .maybeSingle();
  return (data as Post) || null;
}

// ISR on-demand sin generateStaticParams para permitir posts seedados post-build
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(locale, slug);
  if(!post) return { title: 'Not found', robots: { index: false } };
  const title = `${post.title} | TripLoop`;
  const description = post.excerpt || post.title;
  const ogImage = post.hero_image_url || `https://triploop-six.vercel.app/api/og?title=${encodeURIComponent(post.title)}`;
  return {
    title, description,
    keywords: post.seo_keywords,
    authors: [{ name: post.author_name || 'TripLoop Editorial' }],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: { en: `/en/blog/${slug}`, es: `/es/blog/${slug}` }
    },
    openGraph: {
      title, description, type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name || 'TripLoop Editorial'],
      images: [{ url: ogImage, width: 1200, height: 630 }]
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] }
  };
}

export default async function BlogPost({ params }: PageProps){
  const { locale, slug } = await params;
  const isEs = locale === 'es';
  const post = await getPost(locale, slug);
  if(!post) notFound();

  const bodyHtml = renderMarkdown(post.body_md);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.hero_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: post.author_name || 'TripLoop Editorial' },
    publisher: { '@type': 'Organization', name: 'TripLoop', logo: { '@type': 'ImageObject', url: 'https://triploop-six.vercel.app/icon-512.png' } },
    mainEntityOfPage: `https://triploop-six.vercel.app/${locale}/blog/${slug}`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-ink-900 text-white">
          {post.hero_image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.hero_image_url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/60 to-ink-900" />
            </>
          )}
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-28">
            <Link href={`/${locale}/blog`} className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-white/80 hover:text-white">
              ← {isEs ? 'Todos los posts' : 'All posts'}
            </Link>
            <h1 className="font-display text-display-lg leading-tight tracking-tight md:text-display-xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-white/85">
              <span>{new Date(post.published_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {post.read_minutes ? <span>· {post.read_minutes} min {isEs ? 'lectura' : 'read'}</span> : null}
              {post.author_name ? <span>· {post.author_name}</span> : null}
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <div
            className="text-lg [&_h2]:text-3xl [&_h2]:font-display [&_h3]:text-xl [&_h3]:font-display"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Related templates CTA */}
          {post.related_templates && post.related_templates.length > 0 && (
            <RelatedTemplates slugs={post.related_templates} locale={locale} isEs={isEs} />
          )}
        </article>

        {/* Back to blog */}
        <section className="border-t border-ink-100 bg-ink-50/40 py-12">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Link href={`/${locale}/blog`} className="inline-block font-display text-xl text-ink-900 hover:text-coral-600">
              ← {isEs ? 'Más guías en el blog' : 'More guides on the blog'}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

async function RelatedTemplates({ slugs, locale, isEs }: { slugs: string[]; locale: string; isEs: boolean }){
  const sb = createPublicClient();
  const { data } = await sb.from('trips')
    .select('slug, region, title, days_count, hero_image_url')
    .in('slug', slugs)
    .eq('is_template', true);
  const templates = (data || []) as Array<{ slug: string; region?: string; title: string; days_count: number; hero_image_url?: string }>;
  if(templates.length === 0) return null;
  return (
    <div className="mt-12 rounded-card border border-coral-200 bg-gradient-to-br from-coral-50 to-white p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-coral-700">
        {isEs ? 'Rutas relacionadas · duplícalas en 1 clic' : 'Related trips · fork in one click'}
      </p>
      <div className="space-y-3">
        {templates.map((t) => (
          <Link
            key={t.slug}
            href={`/${locale}/${t.region || 'california'}/${t.slug}`}
            className="flex items-center gap-4 rounded-card border border-ink-100 bg-white p-3 transition hover:border-coral-500 hover:shadow-card"
          >
            {t.hero_image_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={t.hero_image_url} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" loading="lazy" />
            )}
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-semibold text-ink-900">{t.title}</div>
              <div className="text-xs text-ink-500">{t.days_count} {isEs ? 'días' : 'days'}</div>
            </div>
            <span className="text-xs font-semibold text-coral-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
