'use client';

// S96 — value-first, traveler-facing. No brand names of tools.
// Cada tile representa una capability tangible que el viajero experimenta.
export function TrustBadges({ isEs }: { isEs?: boolean }){
  return (
    <section className="border-y border-ink-100 bg-gradient-to-b from-ink-50/60 via-white to-ink-50/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-600">
          {isEs ? 'Lo que impulsa tu viaje' : 'What powers your trip'}
        </p>
        <h2 className="mx-auto mb-12 max-w-2xl text-center font-display text-2xl leading-tight text-ink-900 md:text-3xl text-balance">
          {isEs
            ? 'Tecnología que no notas — hasta que la necesitas.'
            : "Technology you don't notice — until you need it."}
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Benefit
            emoji="🗺️"
            title={isEs ? 'Mapas en vivo' : 'Live maps'}
            desc={isEs ? 'Tráfico real, ETAs por minuto' : 'Live traffic, minute-accurate ETAs'}
          />
          <Benefit
            emoji="🧠"
            title={isEs ? 'IA que planea' : 'AI planning'}
            desc={isEs ? 'Itinerario completo en segundos' : 'Full itinerary in seconds'}
          />
          <Benefit
            emoji="📶"
            title={isEs ? 'Funciona sin señal' : 'Works offline'}
            desc={isEs ? 'Sincroniza al reconectar' : 'Auto-syncs when back online'}
          />
          <Benefit
            emoji="💳"
            title={isEs ? 'Pago seguro' : 'Secure checkout'}
            desc={isEs ? 'Global, en tres clics' : 'Global, three clicks'}
          />
          <Benefit
            emoji="💬"
            title={isEs ? 'Compartir por WhatsApp' : 'WhatsApp sharing'}
            desc={isEs ? 'Con tu grupo, al instante' : 'With your crew, instantly'}
          />
          <Benefit
            emoji="🌎"
            title={isEs ? '24 regiones curadas' : '24 curated regions'}
            desc={isEs ? '60 rutas en 7 continentes' : '60 routes across 7 continents'}
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
