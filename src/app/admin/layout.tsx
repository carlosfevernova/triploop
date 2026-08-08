import '../globals.css';

export const metadata = {
  title: 'Admin — TripLoop',
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="bg-ink-50 min-h-screen">{children}</body>
    </html>
  );
}
