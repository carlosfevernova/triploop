import '../globals.css';

export const metadata = {
  title: 'Admin — TripLoop',
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
