import type { Metadata } from 'next';
import { waLink, isWhatsAppConfigured, getPublicNumber } from '@/lib/whatsapp';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'WhatsApp — Planea por chat | TripLoop' : 'WhatsApp — Plan by chat | TripLoop',
    description: isEs
      ? 'Planea tu road trip por California, Nevada o Arizona en WhatsApp. Nuestro bot con IA responde en segundos.'
      : 'Plan your California, Nevada or Arizona road trip on WhatsApp. Our AI bot responds in seconds.',
    alternates: {
      canonical: `/${locale}/whatsapp`,
      languages: { en: '/en/whatsapp', es: '/es/whatsapp' }
    }
  };
}

export const revalidate = 3600;

export default async function WhatsAppPage({ params }: PageProps){
  const { locale } = await params;
  const isEs = locale === 'es';
  const configured = isWhatsAppConfigured();
  const number = getPublicNumber();
  const helloLink = waLink(isEs ? 'Hola TripLoop, quiero planear un viaje' : 'Hi TripLoop, I want to plan a trip', isEs ? 'es' : 'en');
  const rutasLink = waLink(isEs ? 'rutas' : 'trips', isEs ? 'es' : 'en');
  const preciosLink = waLink(isEs ? 'precios' : 'pricing', isEs ? 'es' : 'en');

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-ocean-400/5">
      <div className="mx-auto max-w-4xl px-6 py-8 md:py-12">
        <a href={`/${locale}`} className="inline-flex items-center gap-1.5 rounded-pill border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-ink-800">
          <span aria-hidden>←</span>
          {isEs ? 'Volver' : 'Back'}
        </a>
      </div>
      <div className="mx-auto max-w-4xl px-6 pb-16 md:pb-24">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            {isEs ? 'WhatsApp bot' : 'WhatsApp bot'}
          </div>
          <h1 className="font-display text-display-lg tracking-tight text-ink-900 md:text-display-xl">
            {isEs ? 'Planea por chat.' : 'Plan by chat.'}
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-ink-500">
            {isEs
              ? 'Nuestro bot de WhatsApp responde con IA en segundos. Pídele rutas, precios, blog o describe tu viaje ideal.'
              : 'Our WhatsApp bot replies with AI in seconds. Ask for trips, pricing, blog, or describe your ideal journey.'}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={helloLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-pill bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-glow transition hover:bg-emerald-600"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
              {isEs ? 'Chatear ahora' : 'Chat now'}
            </a>
            {number && (
              <p className="text-xs text-ink-500">
                {isEs ? 'O guarda el número:' : 'Or save the number:'}{' '}
                <code className="rounded bg-ink-100 px-2 py-0.5 font-mono text-[13px]">+{number}</code>
              </p>
            )}
          </div>
        </div>

        {/* Comandos */}
        <section className="mb-10 rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink-900">
            {isEs ? 'Qué puedes preguntar' : 'What you can ask'}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Cmd cmd={isEs ? 'rutas' : 'trips'} desc={isEs ? '16 rutas listas para duplicar' : '16 ready-to-fork itineraries'} link={rutasLink} />
            <Cmd cmd={isEs ? 'planear' : 'plan'} desc={isEs ? 'Arma un viaje nuevo' : 'Build a new trip'} link={waLink(isEs ? 'planear' : 'plan', isEs ? 'es' : 'en')} />
            <Cmd cmd="blog" desc={isEs ? '16 guías editoriales' : '16 editorial guides'} link={waLink('blog', isEs ? 'es' : 'en')} />
            <Cmd cmd={isEs ? 'precios' : 'pricing'} desc={isEs ? 'Plan Free vs Pro' : 'Free vs Pro plan'} link={preciosLink} />
          </div>
          <p className="mt-6 rounded-lg bg-ink-50/60 p-4 text-sm text-ink-600">
            <b>{isEs ? 'Tip:' : 'Tip:'}</b>{' '}
            {isEs
              ? 'También puedes escribir libre. Ej: "quiero 5 días por Big Sur en septiembre, me gusta la naturaleza y comida" — la IA te sugiere ruta.'
              : 'You can also write freely. E.g. "I want 5 days along Big Sur in September, I like nature and food" — AI suggests a route.'}
          </p>
        </section>

        {/* Info privacidad */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 text-sm text-ink-600">
          <h3 className="mb-2 font-display text-base font-semibold text-ink-900">
            {isEs ? '🔒 Privacidad' : '🔒 Privacy'}
          </h3>
          <p>
            {isEs
              ? 'Guardamos tu número y mensajes solo para mejorar el bot. No compartimos con terceros. Escribe "borrar" para eliminar tu historial.'
              : "We store your number and messages only to improve the bot. We don't share with third parties. Type \"delete\" to remove your history."}
          </p>
        </section>

        {!configured && (
          <p className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-center text-xs text-amber-800">
            {isEs
              ? '⚙️ Bot en configuración: por ahora el link abre WhatsApp con mensaje pre-lleno — pronto respuestas automáticas.'
              : '⚙️ Bot in setup: for now the link opens WhatsApp with a pre-filled message — automatic replies coming soon.'}
          </p>
        )}
      </div>
    </main>
  );
}

function Cmd({ cmd, desc, link }: { cmd: string; desc: string; link: string }){
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 transition hover:border-emerald-500 hover:shadow-card"
    >
      <code className="rounded-lg bg-emerald-500 px-3 py-1.5 font-mono text-sm font-semibold text-white">{cmd}</code>
      <span className="flex-1 text-sm text-ink-700">{desc}</span>
      <span className="text-emerald-600">→</span>
    </a>
  );
}
