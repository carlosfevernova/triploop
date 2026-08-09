import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase-admin';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const title = isEs ? 'Blog TripLoop — Road trip guides USA' : 'TripLoop Blog — Road trip guides for USA travelers';
  const description = isEs
    ? 'Guías prácticas de road trips por California, Nevada, Arizona y todo el suroeste USA. Reales, sin fluff.'
    : 'Practical road trip guides for California, Nevada, Arizona and the US Southwest. Real advice, zero fluff.';
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { en: '/en/blog', es: '/es/blog' }
    },
    openGraph: {
      title, description, type: 'website',
      images: [{ url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&q=80' }]
    }
  };
}

export const revalidate = 900; // 15 min

interface Post {
  slug: string; title: string; excerpt?: string;
  hero_image_url?: string; published_at: string;
  read_minutes?: number;
}

export default async function BlogIndex({ params }: PageProps){
  const { locale } = await params;
  const isEs = locale === 'es';
  const sb = createPublicClient();
  const { data } = await sb.from('blog_posts')
    .select('slug, title, excerpt, hero_image_url, published_at, read_minutes')
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50);
  const posts = (data || []) as Post[];

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/30 via-white to-ocean-400/5">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
          <span aria-hidden>←</span>
          {isEs ? 'Volver' : 'Back'}
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral-600">
            {isEs ? 'Blog · guías prácticas' : 'Blog · practical guides'}
          </p>
          <h1 className="font-display text-display-lg tracking-tight text-ink-900">
            {isEs ? 'Guías reales para road trips USA' : 'Real road trip guides for USA travelers'}
          </h1>
          <p className="mt-4 text-lg text-ink-500">
            {isEs
              ? 'Sin fluff. Sin listicles de 20 cosas. Escrito para personas que van a manejar de verdad.'
              : 'No fluff. No 20-things listicles. Written for people actually driving these routes.'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 bg-white p-16 text-center text-ink-500">
            {isEs ? 'Aún no hay posts publicados.' : 'No posts published yet.'}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.slug} post={p} locale={locale} isEs={isEs} />)}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href={`/${locale}/blog/rss.xml`} className="text-xs font-semibold uppercase tracking-widest text-ink-400 hover:text-ink-700">
            📡 RSS feed
          </a>
        </div>
      </div>
    </main>
  );
}

function PostCard({ post, locale, isEs }: { post: Post; locale: string; isEs: boolean }){
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      prefetch
      className="group flex flex-col overflow-hidden rounded-card border border-ink-100 bg-white shadow-card transition hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {post.hero_image_url ? (
          <Image
            src={post.hero_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
          {new Date(post.published_at).toLocaleDateString(isEs ? 'es-MX' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          {post.read_minutes ? ` · ${post.read_minutes} min ${isEs ? 'lectura' : 'read'}` : ''}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 group-hover:text-coral-600">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink-600">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
