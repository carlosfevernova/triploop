'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { T, getAdminLocale, setAdminLocale, type AdminLocale } from '@/lib/admin-i18n';

type NavKey = 'dashboard' | 'blogEditor' | 'aiCosts' | 'featureFlags' | 'changelog' | 'technicalReport' | 'investorDeck';

const NAV: Array<{ href: string; key: NavKey; icon: React.ReactNode }> = [
  { href: '/admin', key: 'dashboard',        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M3 3h6v8H3zM11 3h6v4h-6zM11 9h6v8h-6zM3 13h6v4H3z" /></svg> },
  { href: '/admin/blog', key: 'blogEditor',  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M14.586 2.586a2 2 0 112.828 2.828l-9.9 9.9L4 17l1.686-3.514 9.9-9.9z" /></svg> },
  { href: '/admin/ai-costs', key: 'aiCosts', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4v4.5l3 1.5-.75 1.3-3.75-2V6h1.5z" /></svg> },
  { href: '/admin/flags', key: 'featureFlags', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M4 2a1 1 0 00-1 1v14a1 1 0 002 0v-5h9l-2-3 2-3H5V3a1 1 0 00-1-1z" /></svg> },
  { href: '/admin/changelog', key: 'changelog', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M6 2a2 2 0 00-2 2v14l4-2 4 2 4-2V4a2 2 0 00-2-2H6zm1 4h6v1.5H7V6zm0 3h6v1.5H7V9zm0 3h4v1.5H7V12z" /></svg> },
  { href: '/admin/reports/technical', key: 'technicalReport', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path d="M12 2l2 5 5 .8-3.6 3.5.8 5.2L12 14l-4.2 2.5.8-5.2L5 7.8 10 7l2-5z" /></svg> },
  { href: '/admin/reports/investors',  key: 'investorDeck',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-[15px] w-[15px]"><path fillRule="evenodd" d="M6 5V3a2 2 0 012-2h4a2 2 0 012 2v2h3a1 1 0 011 1v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a1 1 0 011-1h3zM8 3h4v2H8V3z" clipRule="evenodd" /></svg> }
];

export function AdminSidebar(){
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState<AdminLocale>('es');
  useEffect(() => { setLocale(getAdminLocale()); }, []);
  const t = T[locale];

  const switchLocale = (loc: AdminLocale) => {
    setAdminLocale(loc);
    setLocale(loc);
    router.refresh();
  };

  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-ink-100 bg-white md:flex md:flex-col">
      {/* Brand */}
      <div className="border-b border-ink-100 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink-900 text-[13px] font-semibold text-white">t</div>
          <div>
            <div className="font-display text-[15px] font-semibold leading-tight tracking-tight text-ink-900">TripLoop</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-ink-400">{t.admin}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                    active ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-ink-400 group-hover:text-ink-700'}>{item.icon}</span>
                  <span>{t[item.key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer: locale switch + sign out */}
      <div className="border-t border-ink-100 px-3 py-4">
        <div className="mb-3 flex gap-1 rounded-pill bg-ink-100 p-0.5 text-[11px]">
          {(['en', 'es'] as AdminLocale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex-1 rounded-pill py-1 font-semibold uppercase tracking-wider transition ${
                locale === loc ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
        {/* S54: Back to home link (faltaba, admin no tenía forma de salir al sitio público) */}
        <a
          href="/"
          className="mb-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-medium text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
        >
          <span aria-hidden>←</span> {locale === 'es' ? 'Ver sitio público' : 'View public site'}
        </a>
        <form action="/api/admin/login" method="POST" className="px-1">
          <button
            type="submit"
            formMethod="DELETE"
            formAction="/api/admin/login"
            className="w-full text-left text-[11px] font-medium text-ink-400 transition hover:text-coral-600"
          >
            {t.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
