'use client';
import { L } from '@/lib/l4';

// S96 — value-first, traveler-facing. No brand names of tools.
// S71g: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export function TrustBadges({ locale = 'en' }: { locale?: string }){
  return (
    <section className="border-y border-ink-100 bg-gradient-to-b from-ink-50/60 via-white to-ink-50/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-600">
          {L(locale, { en: 'What powers your trip', es: 'Lo que impulsa tu viaje', pt: 'O que impulsiona sua viagem', de: 'Was deine Reise antreibt' })}
        </p>
        <h2 className="mx-auto mb-12 max-w-2xl text-center font-display text-2xl leading-tight text-ink-900 md:text-3xl text-balance">
          {L(locale, {
            en: "Technology you don't notice — until you need it.",
            es: 'Tecnología que no notas — hasta que la necesitas.',
            pt: 'Tecnologia que você não nota — até precisar.',
            de: 'Technologie, die du nicht bemerkst — bis du sie brauchst.'
          })}
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Benefit
            emoji="🗺️"
            title={L(locale, { en: 'Live maps', es: 'Mapas en vivo', pt: 'Mapas ao vivo', de: 'Live-Karten' })}
            desc={L(locale, { en: 'Live traffic, minute-accurate ETAs', es: 'Tráfico real, ETAs por minuto', pt: 'Trânsito ao vivo, ETAs precisos ao minuto', de: 'Live-Verkehr, minutengenaue Ankunftszeiten' })}
          />
          <Benefit
            emoji="🧠"
            title={L(locale, { en: 'AI planning', es: 'IA que planea', pt: 'IA que planeja', de: 'KI-Planung' })}
            desc={L(locale, { en: 'Full itinerary in seconds', es: 'Itinerario completo en segundos', pt: 'Roteiro completo em segundos', de: 'Vollständiger Reiseplan in Sekunden' })}
          />
          <Benefit
            emoji="📶"
            title={L(locale, { en: 'Works offline', es: 'Funciona sin señal', pt: 'Funciona sem sinal', de: 'Funktioniert offline' })}
            desc={L(locale, { en: 'Auto-syncs when back online', es: 'Sincroniza al reconectar', pt: 'Sincroniza ao reconectar', de: 'Synchronisiert bei Wiederverbindung' })}
          />
          <Benefit
            emoji="💳"
            title={L(locale, { en: 'Secure checkout', es: 'Pago seguro', pt: 'Pagamento seguro', de: 'Sichere Zahlung' })}
            desc={L(locale, { en: 'Global, three clicks', es: 'Global, en tres clics', pt: 'Global, três cliques', de: 'Weltweit, drei Klicks' })}
          />
          <Benefit
            emoji="💬"
            title={L(locale, { en: 'WhatsApp sharing', es: 'Compartir por WhatsApp', pt: 'Compartilhar via WhatsApp', de: 'Über WhatsApp teilen' })}
            desc={L(locale, { en: 'With your crew, instantly', es: 'Con tu grupo, al instante', pt: 'Com seu grupo, na hora', de: 'Mit deiner Gruppe, sofort' })}
          />
          <Benefit
            emoji="🌎"
            title={L(locale, { en: '24 curated regions', es: '24 regiones curadas', pt: '24 regiões selecionadas', de: '24 kuratierte Regionen' })}
            desc={L(locale, { en: '60 routes across 7 continents', es: '60 rutas en 7 continentes', pt: '60 rotas em 7 continentes', de: '60 Routen auf 7 Kontinenten' })}
          />
        </div>
      </div>
    </section>
  );
}

function Benefit({ emoji, title, desc }: { emoji: string; title: string; desc: string }){
  return (
    <div className="group rounded-2xl border border-ink-100 bg-white/70 p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      <div className="mb-2 text-2xl leading-none" aria-hidden>{emoji}</div>
      <p className="text-[13px] font-semibold text-ink-800 leading-tight">{title}</p>
      <p className="mt-1 text-[11px] text-ink-500 leading-snug">{desc}</p>
    </div>
  );
}
