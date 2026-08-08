import '../../../../globals.css';

// Print view: layout limpio sin banners, sin nav, con @media print rules globales.
export const metadata = {
  robots: { index: false, follow: false }
};

export default function PrintLayout({ children }: { children: React.ReactNode }){
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:max-w-full { max-width: 100% !important; }
          .print\\:p-0 { padding: 0 !important; }
          .break-inside-avoid { break-inside: avoid; }
        }
      ` }} />
      {children}
    </>
  );
}
