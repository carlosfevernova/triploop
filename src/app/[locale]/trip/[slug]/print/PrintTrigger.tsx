'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function PrintTrigger(){
  const params = useSearchParams();
  useEffect(() => {
    if(params?.get('auto') === '1'){
      const t = setTimeout(() => window.print(), 1200);
      return () => clearTimeout(t);
    }
  }, [params]);
  return null;
}

export function PrintButton({ label }: { label: string }){
  return (
    <button
      onClick={() => window.print()}
      className="rounded-pill bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white print:hidden"
    >
      🖨️ {label}
    </button>
  );
}
