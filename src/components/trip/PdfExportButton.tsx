'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePro } from '@/lib/use-pro';
import { UpgradeModal } from '@/components/UpgradeModal';

interface Props {
  slug: string;
  isEs?: boolean;
}

export function PdfExportButton({ slug, isEs }: Props){
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const { isPro, loading } = usePro();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const openPrint = () => {
    if(!isPro){ setUpgradeOpen(true); return; }
    // Nueva pestaña + auto-print
    window.open(`/${locale}/trip/${slug}/print?auto=1`, '_blank', 'noopener');
  };

  if(loading) return null;

  return (
    <>
      <button
        onClick={openPrint}
        className="rounded-pill border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-700 transition hover:border-ink-800"
      >
        📄 {isPro ? 'PDF' : (isEs ? 'PDF · Pro' : 'PDF · Pro')}
      </button>
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason="generic" isEs={isEs} />
    </>
  );
}
