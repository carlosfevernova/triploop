import Link from 'next/link';

// S33: shared back button para navegación consistente en todas las rutas.
// Server component — no state, no client JS. Usa href fallback (no history.back()) para SSR-safety.

interface Props {
  href: string;
  label?: string;
  locale?: 'en' | 'es';
  className?: string;
}

export function BackButton({ href, label, locale = 'en', className = '' }: Props){
  const isEs = locale === 'es';
  const finalLabel = label || (isEs ? 'Volver' : 'Back');
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800 hover:shadow-card ${className}`}
      aria-label={finalLabel}
    >
      <span aria-hidden>←</span>
      {finalLabel}
    </Link>
  );
}
