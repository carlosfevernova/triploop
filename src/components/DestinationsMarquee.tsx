'use client';

/**
 * S100 — Endless-scroll marquee de destinos icónicos.
 * Adaptado del INUIT tech marquee pero con nombres de rutas/lugares.
 * Serif italic + fade edges + pause on hover + respeta reduced-motion.
 */

const DESTINATIONS = [
  'California PCH',
  'Grand Canyon',
  'Ring Road Iceland',
  'Amalfi Coast',
  'Machu Picchu',
  'NC500 Highlands',
  'Golden Route Japan',
  'Great Ocean Road',
  'Ruta 40 Patagonia',
  'Yellowstone',
  'Sahara Merzouga',
  'Milford Sound',
  'Riviera Maya',
  'Icefields Parkway',
  'Cinque Terre',
  'Zion Utah',
  'Neuschwanstein',
  'Route 66',
  'Cliffs of Moher',
  'Blue Ridge Parkway',
  'Carretera Austral',
  'Highway 50',
  'Yosemite',
  'Florida Keys'
];

export function DestinationsMarquee(){
  // Duplicated for seamless loop
  const items = [...DESTINATIONS, ...DESTINATIONS];
  return (
    <section aria-label="Iconic destinations" className="relative overflow-hidden border-y border-ink-100 bg-gradient-to-b from-white via-ink-50/40 to-white py-14">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="marquee-track flex items-center gap-14 will-change-transform">
        {items.map((d, i) => (
          <span key={i} className="marquee-item shrink-0 whitespace-nowrap font-display text-3xl italic tracking-tight text-ink-400 transition-colors hover:text-coral-500 md:text-4xl lg:text-5xl">
            {d}
            {i < items.length - 1 && <span className="ml-14 text-coral-400 opacity-40" aria-hidden>·</span>}
          </span>
        ))}
      </div>
      <style jsx>{`
        .marquee-track{
          animation: mqScrollTL 55s linear infinite;
          width: max-content;
        }
        .marquee-track:hover{ animation-play-state: paused }
        @keyframes mqScrollTL {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none }
        }
      `}</style>
    </section>
  );
}
