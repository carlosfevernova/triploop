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

  return <BlogEditorClient initialPosts={posts} />;
}
