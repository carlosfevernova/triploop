import '../globals.css';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Admin — TripLoop',
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }){
  const hdrs = await headers();
  const path = hdrs.get('x-invoke-path') || hdrs.get('referer') || '';
  const isLogin = path.includes('/admin/login');
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-50">
        {isLogin ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        )}
      </body>
    </html>
  );
}
