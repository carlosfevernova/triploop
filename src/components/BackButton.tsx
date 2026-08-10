import Link from 'next/link';
import { L } from '@/lib/l4';

// S71k: 4-locale. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
interface Props {
  href: string;
  label?: string;
  locale?: string;
  className?: string;
}

export function BackButton({ href, label, locale = 'en', className = '' }: Props){
  const finalLabel = label || L(locale, { en: 'Back', es: 'Volver', pt: 'Voltar', de: 'Zurück' });
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
