'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/blog', label: 'Blog Editor', icon: '📝' },
  { href: '/admin/reports/technical', label: 'Technical Report', icon: '🔧' },
  { href: '/admin/reports/investors', label: 'Investor Deck', icon: '💼' }
];

export function AdminSidebar(){
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-ink-100 bg-white p-4 md:block">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-coral-500 text-xs font-semibold text-white">t</div>
        <span className="font-display text-sm font-semibold text-ink-900">Admin</span>
      </div>
      <nav>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    active ? 'bg-coral-50 font-semibold text-coral-700' : 'text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <form action="/api/admin/login" method="POST" className="mt-8 px-2">
        <button
          type="submit"
          formMethod="DELETE"
          formAction="/api/admin/login"
          className="text-xs font-semibold text-ink-400 hover:text-coral-600"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
