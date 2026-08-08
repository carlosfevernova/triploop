-- Blog posts: markdown editorial, indexable SEO, vinculado a templates
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  locale text not null default 'en',
  title text not null,
  excerpt text,
  body_md text not null,               -- markdown fuente
  hero_image_url text,
  author_name text default 'TripLoop Editorial',
  seo_keywords text[],
  related_templates text[],            -- slugs de templates trip para CTA
  published boolean default true,
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  read_minutes int
);

create index if not exists blog_posts_pub_idx on public.blog_posts (published, published_at desc);
create index if not exists blog_posts_locale_idx on public.blog_posts (locale, published, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts for select using (published = true);

grant select on public.blog_posts to anon, authenticated;
