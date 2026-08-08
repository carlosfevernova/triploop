-- Compound unique (slug, locale) permite mismo slug en 2 idiomas
-- para hreflang alternates SEO correctos.
alter table public.blog_posts drop constraint if exists blog_posts_slug_key;
alter table public.blog_posts add constraint blog_posts_slug_locale_unique unique (slug, locale);
