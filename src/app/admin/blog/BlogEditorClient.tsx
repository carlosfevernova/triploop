'use client';
import { useState } from 'react';

interface Post {
  slug: string; locale: string; title: string; excerpt?: string;
  body_md: string; hero_image_url?: string; published: boolean;
  published_at: string; read_minutes?: number;
}

export function BlogEditorClient({ initialPosts }: { initialPosts: Post[] }){
  const [posts, setPosts] = useState(initialPosts);
  const [selected, setSelected] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    if(!selected) return;
    setSaving(true);
    try {
      const r = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: selected.slug,
          title: selected.title,
          excerpt: selected.excerpt,
          body_md: selected.body_md,
          hero_image_url: selected.hero_image_url,
          published: selected.published
        })
      });
      if(!r.ok){ setMsg('Error: ' + (await r.text())); return; }
      setPosts((prev) => prev.map(p => p.slug === selected.slug ? selected : p));
      setMsg('✓ Saved');
      setTimeout(() => setMsg(null), 2000);
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if(!selected) return;
    if(!confirm(`Delete "${selected.title}"?`)) return;
    await fetch(`/api/admin/blog?slug=${encodeURIComponent(selected.slug)}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter(p => p.slug !== selected.slug));
    setSelected(null);
  };

  if(selected){
    return (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <button onClick={() => setSelected(null)} className="rounded-pill border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-ink-800">← Back to list</button>
          <span className="text-xs text-ink-500">/{selected.locale}/blog/{selected.slug}</span>
          {msg && <span className="ml-auto text-xs font-semibold text-emerald-600">{msg}</span>}
        </div>
        <div className="space-y-4 rounded-card border border-ink-100 bg-white p-6 shadow-card">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-500">Title</span>
            <input value={selected.title} onChange={(e) => setSelected({...selected, title: e.target.value})} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-coral-500" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-500">Excerpt</span>
            <textarea value={selected.excerpt || ''} onChange={(e) => setSelected({...selected, excerpt: e.target.value})} rows={2} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-coral-500" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-500">Hero image URL</span>
            <input value={selected.hero_image_url || ''} onChange={(e) => setSelected({...selected, hero_image_url: e.target.value})} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-coral-500" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-500">Body (Markdown)</span>
            <textarea value={selected.body_md} onChange={(e) => setSelected({...selected, body_md: e.target.value})} rows={20} className="w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-xs outline-none focus:border-coral-500" />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={selected.published} onChange={(e) => setSelected({...selected, published: e.target.checked})} />
            <span className="text-sm text-ink-700">Published</span>
          </label>
          <div className="flex gap-2 border-t border-ink-100 pt-4">
            <button onClick={save} disabled={saving} className="rounded-pill bg-coral-500 px-5 py-2 text-sm font-semibold text-white hover:bg-coral-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={remove} className="ml-auto rounded-pill border border-coral-200 px-4 py-2 text-xs font-semibold text-coral-600 hover:bg-coral-50">Delete</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-ink-100 bg-white shadow-card">
      <ul className="divide-y divide-ink-100">
        {posts.map((p) => (
          <li key={p.slug}>
            <button onClick={() => setSelected(p)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-ink-50">
              {p.hero_image_url && <img src={p.hero_image_url} alt="" className="h-12 w-16 flex-shrink-0 rounded object-cover" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900">{p.title}</span>
                  {!p.published && <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">DRAFT</span>}
                </div>
                <div className="mt-0.5 text-xs text-ink-500">/{p.locale}/blog/{p.slug} · {p.read_minutes || 0} min read</div>
              </div>
              <span className="text-xs text-ink-400">Edit →</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
