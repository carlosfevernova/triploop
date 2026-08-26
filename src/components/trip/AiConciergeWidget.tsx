'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  provider?: string;
}

interface Props {
  slug: string;
  locale: string;
  stops: Array<{ name: string; lat?: number; lng?: number; day?: number }>;
  currentStopIndex?: number;
}

const SUGGESTIONS: Record<string, string[]> = {
  en: ['What\'s near me?', 'Best time for stop 1?', 'Budget dinner nearby', 'Rest stops on this route?'],
  es: ['¿Qué hay cerca?', '¿Mejor hora para parada 1?', 'Cena económica cerca', '¿Baños en la ruta?'],
  pt: ['O que há por perto?', 'Melhor hora para parada 1?', 'Jantar barato perto', 'Paradas para descanso?'],
  de: ['Was ist in der Nähe?', 'Beste Zeit für Stopp 1?', 'Günstiges Abendessen', 'Rastplätze auf der Route?']
};

const UI_STRINGS = {
  en: { title: 'AI Concierge', placeholder: 'Ask anything about your trip…', send: 'Ask', thinking: 'Thinking…', open: 'Open Concierge', close: 'Close', hint: 'Grounded in your trip stops. Free tier AI — no cost per message.' },
  es: { title: 'Concierge IA', placeholder: 'Pregunta lo que sea sobre tu viaje…', send: 'Enviar', thinking: 'Pensando…', open: 'Abrir Concierge', close: 'Cerrar', hint: 'Aterrizado en tus paradas del viaje. IA free tier — sin costo por mensaje.' },
  pt: { title: 'Concierge IA', placeholder: 'Pergunte qualquer coisa sobre sua viagem…', send: 'Enviar', thinking: 'Pensando…', open: 'Abrir Concierge', close: 'Fechar', hint: 'Baseado nas paradas da sua viagem. IA free tier — sem custo por mensagem.' },
  de: { title: 'KI-Concierge', placeholder: 'Frag alles über deine Reise…', send: 'Fragen', thinking: 'Denke nach…', open: 'Concierge öffnen', close: 'Schließen', hint: 'Basiert auf deinen Stopps. Free Tier KI — kostenlose Nachrichten.' }
};

function t(locale: string): typeof UI_STRINGS.en {
  return UI_STRINGS[locale as keyof typeof UI_STRINGS] || UI_STRINGS.en;
}

function getSuggestions(locale: string): string[] {
  return SUGGESTIONS[locale] || SUGGESTIONS.en;
}

export function AiConciergeWidget({ slug, locale, stops, currentStopIndex }: Props){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const strings = t(locale);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function ask(question: string){
    if (!question.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: question, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const r = await fetch(`/api/trips/${slug}/concierge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          locale,
          stops: stops.slice(0, 15),
          currentStopIndex
        })
      });
      const data = await r.json() as { answer?: string; provider?: string; error?: string };
      const answer = data.answer || (data.error === 'empty_question' ? '?' : (locale === 'es' ? 'Sin respuesta.' : 'No response.'));
      setMessages((m) => [...m, { role: 'assistant', content: answer, ts: Date.now(), provider: data.provider }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: locale === 'es' ? 'Error de red.' : 'Network error.', ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-ink-800 hover:scale-105"
        aria-label={strings.open}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[10px] font-bold">AI</span>
        {strings.open}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-ink-100 bg-ink-900 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-coral-500 text-[11px] font-bold">AI</span>
          <div>
            <div className="text-[13px] font-semibold">{strings.title}</div>
            <div className="text-[10px] text-ink-300">{stops.length} {locale === 'es' ? 'paradas' : locale === 'pt' ? 'paradas' : locale === 'de' ? 'Stopps' : 'stops'}</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="text-ink-300 hover:text-white text-lg" aria-label={strings.close}>×</button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-ink-50/40">
        {messages.length === 0 && (
          <div>
            <p className="text-[11px] text-ink-500 mb-2 text-center">{strings.hint}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {getSuggestions(locale).map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1 text-[11px] text-ink-700 transition hover:border-ink-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] ${
              m.role === 'user' ? 'bg-ink-900 text-white rounded-br-sm' : 'bg-white border border-ink-100 text-ink-800 rounded-bl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white border border-ink-100 px-3 py-2 text-[13px] text-ink-500 flex items-center gap-2">
              <span className="inline-flex space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulse" style={{ animationDelay: '300ms' }} />
              </span>
              {strings.thinking}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="flex gap-2 border-t border-ink-100 bg-white p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={strings.placeholder}
          maxLength={500}
          className="flex-1 rounded-full border border-ink-200 px-3 py-1.5 text-[13px] focus:border-ink-800 focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-ink-900 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-ink-800 disabled:opacity-40"
        >
          {loading ? strings.thinking : strings.send}
        </button>
      </form>
    </div>
  );
}
