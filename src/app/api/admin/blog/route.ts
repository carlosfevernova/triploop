import { NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase-admin';
import { estimateReadMinutes } from '@/lib/markdown';

export const runtime = 'nodejs';

async function guard(){
  const ok = await isAdminAuthed();
  return ok;
}

// GET → list all posts (published + drafts)
export async function GET(){
  if(!(await guard())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const sb = createAdminClient();
  const { data, error } = await sb.from('blog_posts').select('*').order('published_at', { ascending: false });
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data || [] });
}

// PATCH { slug, ...updates } → edit post
export async function PATCH(req: Request){
  if(!(await guard())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { slug, ...updates } = body;
  if(!slug) return NextResponse.json({ error: 'slug_required' }, { status: 400 });
  if(updates.body_md) updates.read_minutes = estimateReadMinutes(updates.body_md);
  updates.updated_at = new Date().toISOString();
  const sb = createAdminClient();
  const { error } = await sb.from('blog_posts').update(updates).eq('slug', slug);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// POST → new post
export async function POST(req: Request){
  if(!(await guard())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { slug, locale = 'en', title, body_md = '', excerpt, hero_image_url, published = false } = body;
  if(!slug || !title) return NextResponse.json({ error: 'slug_title_required' }, { status: 400 });
  const sb = createAdminClient();
  const { error } = await sb.from('blog_posts').insert({
    slug, locale, title, body_md, excerpt, hero_image_url, published,
    read_minutes: estimateReadMinutes(body_md)
  });
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE ?slug=xxx
export async function DELETE(req: Request){
  if(!(await guard())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if(!slug) return NextResponse.json({ error: 'slug_required' }, { status: 400 });
  const sb = createAdminClient();
  const { error } = await sb.from('blog_posts').delete().eq('slug', slug);
  if(error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
