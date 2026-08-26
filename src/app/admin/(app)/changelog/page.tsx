import { redirect } from 'next/navigation';
import { isAdminAuthed } from '@/lib/admin-guard';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const metadata = { title: 'Changelog — TripLoop Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

async function loadChangelog(): Promise<string> {
  try {
    const path = join(process.cwd(), 'CHANGELOG.md');
    return await readFile(path, 'utf-8');
  } catch {
    return '# Changelog\n\nCHANGELOG.md not found in repo root.';
  }
}

// Minimal markdown renderer — headings + bullets + inline code + bold + links + hr.
// Zero deps. Enough for CHANGELOG.md rendered as static admin view.
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  let inCodeBlock = false;

  const inline = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-ink-100 px-1 py-0.5 text-[11px] font-mono text-ink-800">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-ink-900">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-coral-600 underline hover:text-coral-800" href="$2" target="_blank" rel="noreferrer">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) { inCodeBlock = !inCodeBlock; out.push(inCodeBlock ? '<pre class="my-3 rounded-lg bg-ink-900 p-3 text-[11px] font-mono text-emerald-200 overflow-x-auto">' : '</pre>'); continue; }
    if (inCodeBlock) { out.push(inline(line)); continue; }
    if (line === '---') { if (inList) { out.push('</ul>'); inList = false; } out.push('<hr class="my-6 border-ink-100" />'); continue; }
    if (line.startsWith('### ')) { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h3 class="mt-6 mb-2 font-display text-[15px] font-semibold text-ink-800">${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h2 class="mt-8 mb-3 font-display text-[20px] font-semibold text-ink-900 border-b border-ink-100 pb-2">${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith('# ')) { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h1 class="mb-4 font-display text-[28px] font-semibold text-ink-900">${inline(line.slice(2))}</h1>`); continue; }
    if (line.startsWith('- ')) {
      if (!inList) { out.push('<ul class="ml-4 mb-3 list-disc space-y-1 text-[13px] text-ink-700">'); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    if (line === '') {
      if (inList) { out.push('</ul>'); inList = false; }
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }
    out.push(`<p class="mb-3 text-[13px] leading-relaxed text-ink-700">${inline(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  if (inCodeBlock) out.push('</pre>');
  return out.join('\n');
}

export default async function ChangelogPage(){
  if(!(await isAdminAuthed())) redirect('/admin/login');
  const md = await loadChangelog();
  const html = renderMarkdown(md);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <a href="/admin" className="mb-6 inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
        <span aria-hidden>←</span> Volver al dashboard
      </a>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-ink-400">Sprint history · auto-loaded from CHANGELOG.md</p>
        <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink-900">Changelog</h1>
        <p className="mt-2 text-[14px] text-ink-500">
          Bytes-for-bytes from <code className="rounded bg-ink-100 px-1 py-0.5 text-[11px]">CHANGELOG.md</code> in repo root · Zero deps renderer (no external markdown lib).
        </p>
      </header>

      <article className="rounded-card border border-ink-100 bg-white p-8 shadow-card" dangerouslySetInnerHTML={{ __html: html }} />

      <p className="mt-6 text-center text-[10px] text-ink-400">
        Source of truth: CHANGELOG.md · Update by editing that file + `git commit` · Runs on every request (force-dynamic)
      </p>
    </main>
  );
}
