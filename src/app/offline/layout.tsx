import '../globals.css';

export const metadata = {
  title: 'Offline — TripLoop',
  robots: { index: false, follow: false }
};

export default function OfflineLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
