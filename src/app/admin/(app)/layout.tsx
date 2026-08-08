import { AdminSidebar } from '@/components/admin/AdminSidebar';

// Route group: applies sidebar to all children EXCEPT /admin/login
// (login is at src/app/admin/login/ outside this group)

export default function AdminAppLayout({ children }: { children: React.ReactNode }){
  return (
    <div className="flex min-h-screen bg-ink-50/40">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
