'use client';

// Trust badges: "powered by / built with" logos reales.
// Honestos: solo empresas cuyas tecnologías realmente uso.
export function TrustBadges({ isEs }: { isEs?: boolean }){
  return (
    <section className="border-y border-ink-100 bg-ink-50/40 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-ink-400">
          {isEs ? 'Construido sobre infraestructura de clase mundial' : 'Built on world-class infrastructure'}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-ink-500">
          <BadgeItem name="Vercel" />
          <BadgeItem name="Supabase" />
          <BadgeItem name="Stripe" />
          <BadgeItem name="Google Maps" />
          <BadgeItem name="DeepSeek AI" />
          <BadgeItem name="MapLibre" />
        </ul>
      </div>
    </section>
  );
}

function BadgeItem({ name }: { name: string }){
  return (
    <li className="font-display text-sm font-semibold text-ink-500/80 transition hover:text-ink-800">
      {name}
    </li>
  );
}
