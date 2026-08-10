import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';
import { locales } from '@/i18n/request';
import { L } from '@/lib/l4';

// S71l: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
// LEGAL_REVIEW_REQUIRED: for BR/DE market launch, PT/DE privacy needs LGPD/DSGVO validation.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const title = L(locale, {
    en: 'Privacy Policy — TripLoop',
    es: 'Privacidad — TripLoop',
    pt: 'Privacidade — TripLoop',
    de: 'Datenschutzerklärung — TripLoop'
  });
  const description = L(locale, {
    en: 'How TripLoop handles your data: what we store, what we share, what we never do.',
    es: 'Cómo TripLoop maneja tus datos: qué guardamos, qué compartimos, qué no hacemos.',
    pt: 'Como o TripLoop trata seus dados: o que guardamos, o que compartilhamos, o que não fazemos.',
    de: 'Wie TripLoop deine Daten behandelt: was wir speichern, was wir teilen, was wir niemals tun.'
  });
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/privacy`])),
        'x-default': '/en/privacy'
      }
    }
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">
          {L(locale, { en: 'Privacy Policy', es: 'Privacidad', pt: 'Privacidade', de: 'Datenschutzerklärung' })}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {L(locale, { en: 'Last updated: 2026-08-08', es: 'Última actualización: 2026-08-08', pt: 'Última atualização: 2026-08-08', de: 'Zuletzt aktualisiert: 2026-08-08' })}
        </p>

        <div className="prose prose-sm mt-8 max-w-none text-ink-700">
          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'The essentials', es: 'Lo esencial', pt: 'O essencial', de: 'Das Wesentliche' })}
          </h2>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>{L(locale, { en: 'We never sell your data.', es: 'No vendemos tus datos. Nunca.', pt: 'Nunca vendemos seus dados.', de: 'Wir verkaufen deine Daten niemals.' })}</li>
            <li>{L(locale, { en: 'No cross-site tracking (no Facebook Pixel, no Google Ads).', es: 'No usamos tracking cross-site (no Facebook Pixel, no Google Ads).', pt: 'Sem rastreamento cross-site (sem Facebook Pixel, sem Google Ads).', de: 'Kein Cross-Site-Tracking (kein Facebook Pixel, kein Google Ads).' })}</li>
            <li>{L(locale, { en: 'You can use TripLoop without an account.', es: 'Puedes usar TripLoop sin cuenta.', pt: 'Você pode usar o TripLoop sem conta.', de: 'Du kannst TripLoop ohne Konto nutzen.' })}</li>
            <li>{L(locale, { en: 'Your trips are private by default.', es: 'Tus viajes son privados por defecto.', pt: 'Suas viagens são privadas por padrão.', de: 'Deine Reisen sind standardmäßig privat.' })}</li>
            <li>{L(locale, { en: 'You can export or delete your data anytime.', es: 'Puedes exportar o eliminar tus datos cuando quieras.', pt: 'Você pode exportar ou excluir seus dados quando quiser.', de: 'Du kannst deine Daten jederzeit exportieren oder löschen.' })}</li>
          </ul>

          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'What we store', es: 'Qué guardamos', pt: 'O que guardamos', de: 'Was wir speichern' })}
          </h2>
          <p>{L(locale, {
            en: "When you create a trip, we store its data (name, stops, notes) in Supabase (database hosted on AWS us-east). Without an account, the trip is identified by a unique shareable slug. With an account, it's associated with your user_id.",
            es: 'Cuando creas un viaje, guardamos sus datos (nombre, paradas, notas) en Supabase (base de datos alojada en AWS us-east). Si no tienes cuenta, el viaje se identifica por un slug único y compartible. Si tienes cuenta, se asocia con tu user_id.',
            pt: 'Ao criar uma viagem, guardamos seus dados (nome, paradas, notas) no Supabase (banco de dados hospedado no AWS us-east). Sem conta, a viagem é identificada por um slug único e compartilhável. Com conta, é associada ao seu user_id.',
            de: 'Wenn du eine Reise erstellst, speichern wir ihre Daten (Name, Stopps, Notizen) in Supabase (Datenbank auf AWS us-east gehostet). Ohne Konto wird die Reise durch einen eindeutigen teilbaren Slug identifiziert. Mit Konto ist sie deiner user_id zugeordnet.'
          })}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">Analytics</h2>
          <p>{L(locale, {
            en: "We count anonymous usage events (trip created, day selected, item moved) to improve the product. We do not link these events to your identity. We also measure Web Vitals (LCP, INP, CLS) for performance. Blocking them with an ad-blocker won't affect the app.",
            es: 'Contamos eventos anónimos de uso (viaje creado, día seleccionado, item movido) para mejorar el producto. No linkeamos estos eventos a tu identidad. También medimos Web Vitals (LCP, INP, CLS) para performance. Puedes bloquearlos con un ad-blocker sin afectar la app.',
            pt: 'Contamos eventos anônimos de uso (viagem criada, dia selecionado, item movido) para melhorar o produto. Não vinculamos esses eventos à sua identidade. Também medimos Web Vitals (LCP, INP, CLS) de performance. Bloqueá-los com ad-blocker não afeta o app.',
            de: 'Wir zählen anonyme Nutzungsereignisse (Reise erstellt, Tag ausgewählt, Element verschoben), um das Produkt zu verbessern. Wir verknüpfen diese Ereignisse nicht mit deiner Identität. Wir messen auch Web Vitals (LCP, INP, CLS) für die Leistung. Ein Ad-Blocker beeinträchtigt die App nicht.'
          })}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'Providers', es: 'Proveedores', pt: 'Fornecedores', de: 'Anbieter' })}
          </h2>
          <ul className="ml-5 list-disc space-y-1">
            <li><b>Supabase</b> — {L(locale, { en: 'database, auth, realtime', es: 'base de datos, auth, realtime', pt: 'banco de dados, auth, realtime', de: 'Datenbank, Auth, Realtime' })}</li>
            <li><b>Vercel</b> — {L(locale, { en: 'hosting, edge functions', es: 'hosting, edge functions', pt: 'hospedagem, edge functions', de: 'Hosting, Edge Functions' })}</li>
            <li><b>Google Maps Platform</b> — {L(locale, { en: 'places, routes, geocoding', es: 'places, rutas, geocoding', pt: 'places, rotas, geocoding', de: 'Places, Routen, Geocoding' })}</li>
            <li><b>OpenRouter / Anthropic / Groq</b> — {L(locale, { en: 'AI suggestions (no PII sent)', es: 'sugerencias con IA (sin PII enviado)', pt: 'sugestões com IA (sem PII enviado)', de: 'KI-Vorschläge (keine PII gesendet)' })}</li>
            <li><b>Stripe</b> — {L(locale, { en: 'payments (only if you subscribe to Pro)', es: 'pagos (solo si te suscribes a Pro)', pt: 'pagamentos (só se assinar Pro)', de: 'Zahlungen (nur bei Pro-Abo)' })}</li>
            <li><b>Resend</b> — {L(locale, { en: 'emails (only if you sign up)', es: 'emails (solo si te registras)', pt: 'e-mails (só se cadastrar)', de: 'E-Mails (nur bei Registrierung)' })}</li>
          </ul>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">Cookies</h2>
          <p>{L(locale, {
            en: 'We use strictly necessary cookies: auth session, language preference, banner dismiss. No third-party or advertising tracking cookies.',
            es: 'Usamos cookies estrictamente necesarias: sesión de auth, preferencia de idioma, dismiss de banners. Sin cookies de terceros ni de tracking publicitario.',
            pt: 'Usamos cookies estritamente necessários: sessão de auth, preferência de idioma, dismiss de banners. Sem cookies de terceiros ou rastreamento publicitário.',
            de: 'Wir verwenden ausschließlich notwendige Cookies: Auth-Sitzung, Sprachpräferenz, Banner-Schließen. Keine Drittanbieter- oder Werbe-Tracking-Cookies.'
          })}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'Your rights', es: 'Tus derechos', pt: 'Seus direitos', de: 'Deine Rechte' })}
          </h2>
          <p>{L(locale, {
            en: 'You can request your data, correct it, or delete it by writing to hello@triploop.app. We respond within 30 days.',
            es: 'Puedes solicitar tus datos, corregirlos o eliminarlos escribiendo a hello@triploop.app. Respondemos en 30 días.',
            pt: 'Você pode solicitar seus dados, corrigi-los ou excluí-los escrevendo para hello@triploop.app. Respondemos em 30 dias.',
            de: 'Du kannst deine Daten anfordern, korrigieren oder löschen lassen, indem du an hello@triploop.app schreibst. Wir antworten innerhalb von 30 Tagen.'
          })}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'Contact', es: 'Contacto', pt: 'Contato', de: 'Kontakt' })}
          </h2>
          <p><a href="mailto:hello@triploop.app" className="text-coral-600 hover:underline">hello@triploop.app</a></p>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
