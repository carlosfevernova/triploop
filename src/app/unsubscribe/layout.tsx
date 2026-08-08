import '../globals.css';

export const metadata = {
  robots: { index: false, follow: false }
};

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }){
  return <html lang="en"><body>{children}</body></html>;
}
