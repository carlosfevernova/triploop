// Minimal markdown → safe HTML. Sin deps, edge-runtime compat.
// Soporta: h1-h3, párrafos, links, bold/italic, listas, blockquotes.

function esc(s: string){
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text: string){
  // Escape primero, luego apply inline patterns sobre el escaped
  let out = esc(text);
  // links [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safeUrl = /^https?:\/\/|^\//.test(url) ? url : '#';
    const isInternal = safeUrl.startsWith('/');
    const attrs = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${safeUrl}" class="text-coral-600 underline hover:text-coral-700"${attrs}>${label}</a>`;
  });
  // bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic *text*
  out = out.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
  // inline code `code`
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-ink-100 px-1.5 py-0.5 text-[0.9em] font-mono">$1</code>');
  return out;
}

export function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paraBuffer: string[] = [];
  let inBlockquote = false;
  let bqBuffer: string[] = [];

  const flushList = () => {
    if(listBuffer.length === 0) return;
    const tag = listType === 'ol' ? 'ol' : 'ul';
    const cls = tag === 'ol' ? 'list-decimal' : 'list-disc';
    html.push(`<${tag} class="${cls} space-y-2 pl-6 my-4 text-ink-700">${listBuffer.join('')}</${tag}>`);
    listBuffer = []; listType = null;
  };
  const flushPara = () => {
    if(paraBuffer.length === 0) return;
    html.push(`<p class="my-4 leading-relaxed text-ink-700">${inline(paraBuffer.join(' '))}</p>`);
    paraBuffer = [];
  };
  const flushBq = () => {
    if(bqBuffer.length === 0) return;
    html.push(`<blockquote class="border-l-4 border-coral-500 bg-coral-50/50 px-4 py-2 my-4 italic text-ink-700">${inline(bqBuffer.join(' '))}</blockquote>`);
    bqBuffer = []; inBlockquote = false;
  };

  for(const rawLine of lines){
    const line = rawLine.trimEnd();
    if(!line.trim()){
      flushPara(); flushList(); flushBq();
      continue;
    }
    // Headings
    let m: RegExpMatchArray | null;
    if((m = line.match(/^###\s+(.+)/))){
      flushPara(); flushList(); flushBq();
      html.push(`<h3 class="mt-8 mb-3 font-display text-xl font-semibold text-ink-900">${inline(m[1])}</h3>`);
      continue;
    }
    if((m = line.match(/^##\s+(.+)/))){
      flushPara(); flushList(); flushBq();
      html.push(`<h2 class="mt-10 mb-4 font-display text-2xl font-semibold text-ink-900">${inline(m[1])}</h2>`);
      continue;
    }
    if((m = line.match(/^#\s+(.+)/))){
      flushPara(); flushList(); flushBq();
      html.push(`<h1 class="mt-6 mb-4 font-display text-3xl font-semibold text-ink-900">${inline(m[1])}</h1>`);
      continue;
    }
    // Blockquote
    if(line.startsWith('> ')){
      flushPara(); flushList();
      inBlockquote = true;
      bqBuffer.push(line.slice(2));
      continue;
    } else if(inBlockquote){ flushBq(); }
    // Ordered list
    if((m = line.match(/^\d+\.\s+(.+)/))){
      flushPara();
      if(listType !== 'ol'){ flushList(); listType = 'ol'; }
      listBuffer.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    // Unordered list
    if((m = line.match(/^[-*]\s+(.+)/))){
      flushPara();
      if(listType !== 'ul'){ flushList(); listType = 'ul'; }
      listBuffer.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    // Horizontal rule
    if(/^---+$/.test(line)){
      flushPara(); flushList(); flushBq();
      html.push('<hr class="my-8 border-ink-100" />');
      continue;
    }
    // Paragraph accum
    flushList();
    paraBuffer.push(line);
  }
  flushPara(); flushList(); flushBq();
  return html.join('\n');
}

export function estimateReadMinutes(md: string): number {
  const words = md.replace(/[#*_`\[\]()>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220)); // 220 wpm
}
