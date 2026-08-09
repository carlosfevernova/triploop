import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Privacidad — TripLoop' : 'Privacy Policy — TripLoop',
    description: isEs
      ? 'Cómo TripLoop maneja tus datos: qué guardamos, qué compartimos, qué no hacemos.'
      : 'How TripLoop handles your data: what we store, what we share, what we never do.',
    alternates: { canonical: `/${locale}/privacy`, languages: { en: '/en/privacy', es: '/es/privacy' } }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">{isEs ? 'Privacidad' : 'Privacy Policy'}</h1>
        <p className="mt-2 text-sm text-ink-500">{isEs ? 'Última actualización: 2026-08-08' : 'Last updated: 2026-08-08'}</p>

        <div className="prose prose-sm mt-8 max-w-none text-ink-700">
          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">{isEs ? 'Lo esencial' : 'The essentials'}</h2>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>{isEs ? 'No vendemos tus datos. Nunca.' : 'We never sell your data.'}</li>
            <li>{isEs ? 'No usamos tracking cross-site (no Facebook Pixel, no Google Ads).' : 'No cross-site tracking (no Facebook Pixel, no Google Ads).'}</li>
            <li>{isEs ? 'Puedes usar TripLoop sin cuenta.' : 'You can use TripLoop without an account.'}</li>
            <li>{isEs ? 'Tus viajes son privados por defecto.' : 'Your trips are private by default.'}</li>
            <li>{isEs ? 'Puedes exportar o eliminar tus datos cuando quieras.' : 'You can export or delete your data anytime.'}</li>
          </ul>

          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">{isEs ? 'Qué guardamos' : 'What we store'}</h2>
          <p>{isEs
            ? 'Cuando creas un viaje, guardamos sus datos (nombre, paradas, notas) en Supabase (base de datos alojada en AWS us-east). Si no tienes cuenta, el viaje se identifica por un slug único y compartible. Si tienes cuenta, se asocia con tu user_id.'
            : 'When you create a trip, we store its data (name, stops, notes) in Supabase (database hosted on AWS us-east). Without an account, the trip is identified by a unique shareable slug. With an account, it\'s associated with your user_id.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? 'Analytics' : 'Analytics'}</h2>
          <p>{isEs
            ? 'Contamos eventos anónimos de uso (viaje creado, día seleccionado, item movido) para mejorar el producto. No linkeamos estos eventos a tu identidad. También medimos Web Vitals (LCP, INP, CLS) para performance. Puedes bloquearlos con un ad-blocker sin afectar la app.'
            : 'We count anonymous usage events (trip created, day selected, item moved) to improve the product. We do not link these events to your identity. We also measure Web Vitals (LCP, INP, CLS) for performance. Blocking them with an ad-blocker won\'t affect the app.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? 'Proveedores' : 'Providers'}</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li><b>Supabase</b> — {isEs ? 'base de datos, auth, realtime' : 'database, auth, realtime'}</li>
            <li><b>Vercel</b> — {isEs ? 'hosting, edge functions' : 'hosting, edge functions'}</li>
            <li><b>Google Maps Platform</b> — {isEs ? 'places, rutas, geocoding' : 'places, routes, geocoding'}</li>
            <li><b>OpenRouter / Anthropic / Groq</b> — {isEs ? 'sugerencias con IA (sin PII enviado)' : 'AI suggestions (no PII sent)'}</li>
            <li><b>Stripe</b> — {isEs ? 'pagos (solo si te suscribes a Pro)' : 'payments (only if you subscribe to Pro)'}</li>
            <li><b>Resend</b> — {isEs ? 'emails (solo si te registras)' : 'emails (only if you sign up)'}</li>
          </ul>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? 'Cookies' : 'Cookies'}</h2>
          <p>{isEs
            ? 'Usamos cookies estrictamente necesarias: sesión de auth, preferencia de idioma, dismiss de banners. Sin cookies de terceros ni de tracking publicitario.'
            : 'We use strictly necessary cookies: auth session, language preference, banner dismiss. No third-party or advertising tracking cookies.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? 'Tus derechos' : 'Your rights'}</h2>
          <p>{isEs
            ? 'Puedes solicitar tus datos, corregirlos o eliminarlos escribiendo a hello@triploop.app. Respondemos en 30 días.'
            : 'You can request your data, correct it, or delete it by writing to hello@triploop.app. We respond within 30 days.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? 'Contacto' : 'Contact'}</h2>
          <p><a href="mailto:hello@triploop.app" className="text-coral-600 hover:underline">hello@triploop.app</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
