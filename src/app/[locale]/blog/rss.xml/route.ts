import { createPublicClient } from '@/lib/supabase-admin';

const SITE = 'https://triploop-six.vercel.app';

interface Params { params: Promise<{ locale: string }> }

export async function GET(_req: Request, { params }: Params){
  const { locale } = await params;
  const sb = createPublicClient();
  const { data } = await sb.from('blog_posts')
    .select('slug, title, excerpt, published_at')
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50);
  const posts = data || [];

  const items = posts.map((p: { slug: string; title: string; excerpt?: string; published_at: string }) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE}/${locale}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/${locale}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TripLoop Blog</title>
    <link>${SITE}/${locale}/blog</link>
    <description>Practical road trip guides for USA travelers.</description>
    <language>${locale}</language>
    <atom:link href="${SITE}/${locale}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=900, s-maxage=900'
    }
  });
}
