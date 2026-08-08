import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase-admin';
import { BlogEditorClient } from './BlogEditorClient';

export const dynamic = 'force-dynamic';

interface Post {
  slug: string; locale: string; title: string; excerpt?: string;
  body_md: string; hero_image_url?: string; published: boolean;
  published_at: string; read_minutes?: number;
}

export default async function BlogEditorPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');
  const sb = createAdminClient();
  const { data } = await sb.from('blog_posts').select('*').order('published_at', { ascending: false });
  const posts = (data || []) as Post[];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Blog Editor</h1>
        <p className="mt-1 text-sm text-ink-500">{posts.length} posts · edit markdown source + published state</p>
      </header>
      <BlogEditorClient initialPosts={posts} />
    </main>
  );
}
