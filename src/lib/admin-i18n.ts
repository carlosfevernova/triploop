// Admin i18n minimal — no depende de next-intl (admin es outside [locale]).
// Locale stored in cookie 'triploop_admin_locale' + read via document.cookie.

export type AdminLocale = 'en' | 'es';

export const ADMIN_LOCALE_COOKIE = 'triploop_admin_locale';

export const T = {
  en: {
    admin: 'Admin',
    dashboard: 'Dashboard',
    blogEditor: 'Blog Editor',
    technicalReport: 'Technical Report',
    investorDeck: 'Investor Deck',
    signOut: 'Sign out',
    signIn: 'Enter dashboard',
    passphrase: 'Passphrase',
    wrongPassphrase: 'Wrong passphrase.',
    liveMetrics: 'Live metrics · last 7 days · refresh page for latest',
    totalTrips: 'Total trips',
    registeredUsers: 'Registered users',
    mrr: 'MRR',
    affiliateClicks: 'Affiliate clicks (7d)',
    subscriptions: 'Subscriptions',
    tripOwnership: 'Trip ownership',
    ownedRegistered: 'Owned (registered)',
    anonymous: 'Anonymous',
    seoTemplates: 'SEO templates',
    topTemplates: 'Top California templates',
    noSubs: 'No subscriptions yet. Once Stripe is live, they appear here.',
    noViews: 'No template views tracked yet. Hits are counted as visitors reach /california/[slug].',
    posts: 'posts',
    editMdSource: 'edit markdown source + published state',
    back: 'Back to list',
    title: 'Title',
    excerpt: 'Excerpt',
    heroImage: 'Hero image URL',
    body: 'Body (Markdown)',
    published: 'Published',
    save: 'Save',
    saved: '✓ Saved',
    saving: 'Saving…',
    delete: 'Delete',
    draft: 'DRAFT',
    minRead: 'min read',
    edit: 'Edit'
  },
  es: {
    admin: 'Admin',
    dashboard: 'Panel',
    blogEditor: 'Editor de blog',
    technicalReport: 'Reporte técnico',
    investorDeck: 'Deck inversionistas',
    signOut: 'Cerrar sesión',
    signIn: 'Entrar al panel',
    passphrase: 'Contraseña',
    wrongPassphrase: 'Contraseña incorrecta.',
    liveMetrics: 'Métricas en vivo · últimos 7 días · recarga para actualizar',
    totalTrips: 'Viajes totales',
    registeredUsers: 'Usuarios registrados',
    mrr: 'MRR',
    affiliateClicks: 'Clicks afiliados (7d)',
    subscriptions: 'Suscripciones',
    tripOwnership: 'Propiedad de viajes',
    ownedRegistered: 'Con dueño (registrados)',
    anonymous: 'Anónimos',
    seoTemplates: 'Plantillas SEO',
    topTemplates: 'Top plantillas California',
    noSubs: 'Sin suscripciones aún. Cuando Stripe esté activo, aparecen aquí.',
    noViews: 'Sin views de plantillas todavía. Se cuentan al visitar /california/[slug].',
    posts: 'posts',
    editMdSource: 'editar fuente markdown + estado publicado',
    back: 'Regresar a lista',
    title: 'Título',
    excerpt: 'Extracto',
    heroImage: 'URL imagen hero',
    body: 'Cuerpo (Markdown)',
    published: 'Publicado',
    save: 'Guardar',
    saved: '✓ Guardado',
    saving: 'Guardando…',
    delete: 'Eliminar',
    draft: 'BORRADOR',
    minRead: 'min lectura',
    edit: 'Editar'
  }
} as const;

export function getAdminLocale(): AdminLocale {
  if(typeof document === 'undefined') return 'es';
  const match = document.cookie.match(/triploop_admin_locale=(en|es)/);
  return (match?.[1] as AdminLocale) || 'es';
}

export function setAdminLocale(loc: AdminLocale){
  if(typeof document === 'undefined') return;
  document.cookie = `${ADMIN_LOCALE_COOKIE}=${loc};path=/admin;max-age=31536000;samesite=lax`;
}
