import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { BLOG_POSTS } from '@/lib/blog-seed';
import { BLOG_POSTS_ES } from '@/lib/blog-seed-es';
import { estimateReadMinutes } from '@/lib/markdown';

export const runtime = 'edge';

export async function POST(req: Request){
  const token = (req.headers.get('x-seed-token') || '').trim();
  const expected = (process.env.SEED_TOKEN || '').trim();
  if(!expected || token !== expected){
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sb = createAdminClient();
  const results: Array<{ slug: string; locale: string; ok: boolean; error?: string }> = [];
  const all = [...BLOG_POSTS, ...BLOG_POSTS_ES];
  for(const post of all){
    const { error } = await sb.from('blog_posts').upsert({
      slug: post.slug,
      locale: post.locale,
      title: post.title,
      excerpt: post.excerpt,
      body_md: post.body_md,
      hero_image_url: post.hero_image_url,
      seo_keywords: post.seo_keywords,
      related_templates: post.related_templates,
      published: true,
      read_minutes: estimateReadMinutes(post.body_md),
      updated_at: new Date().toISOString()
    }, { onConflict: 'slug,locale' });
    results.push({ slug: post.slug, locale: post.locale, ok: !error, error: error?.message });
  }
  return NextResponse.json({ seeded: results.length, results });
}

export async function GET(){
  const sb = createAdminClient();
  const { data } = await sb.from('blog_posts').select('slug, title, locale').eq('published', true);
  return NextResponse.json({ count: data?.length || 0, posts: data });
}
