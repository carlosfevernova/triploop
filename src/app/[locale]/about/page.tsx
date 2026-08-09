import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { platformStats } from '@/lib/platform-stats';
import type { Locale } from '@/i18n/request';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Acerca de TripLoop — Historia + misión' : 'About TripLoop — Story + mission',
    description: isEs
      ? 'TripLoop es un planeador AI-native de road trips bilingüe. 24 regiones, 7 continentes, gratis para empezar.'
      : 'TripLoop is an AI-native bilingual road-trip planner. 24 regions, 7 continents, free to start.',
    alternates: { canonical: `/${locale}/about`, languages: { en: '/en/about', es: '/es/about' } }
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          {isEs ? 'Acerca de TripLoop' : 'About TripLoop'}
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          {isEs
            ? 'Planeamos road trips que otros dan por sentado — bien.'
            : 'We plan road trips others take for granted — properly.'}
        </p>

        <section className="mt-10 space-y-6 text-[15px] leading-relaxed text-ink-700">
          <p>
            {isEs
              ? 'TripLoop existe porque la planeación de un road trip todavía cuesta más que el viaje mismo. Comparar mapas, cruzar rutas, calcular tiempos con tráfico, encontrar paradas de comida decentes, saber si tu hotel abre cuando llegas — todo eso vive en 6 apps distintas, ninguna en tu idioma nativo, y la mayoría cobra por lo que Google ya te dio gratis.'
              : 'TripLoop exists because planning a road trip still costs more effort than the trip itself. Comparing maps, cross-referencing routes, calculating traffic times, finding decent food stops, checking if your hotel is open when you arrive — all that lives in 6 different apps, none in your native language, and most charge you for what Google already gave you for free.'}
          </p>
          <p>
            {isEs
              ? 'Construimos TripLoop con una regla simple: cada feature debe reducir el trabajo del viajero, no agregarle uno. Por eso el timeline es día por día, hora por hora. Por eso la IA sugiere paradas verificadas con coordenadas reales, no inventa. Por eso funciona offline. Por eso es bilingüe nativo EN+ES.'
              : 'We built TripLoop with a simple rule: every feature must reduce the traveler\'s work, not add to it. That\'s why the timeline is day-by-day, hour-by-hour. That\'s why the AI suggests verified stops with real coordinates instead of hallucinating. That\'s why it works offline. That\'s why it\'s bilingual EN+ES natively.'}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{isEs ? 'Por los números' : 'By the numbers'}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label={isEs ? 'Rutas curadas' : 'Curated routes'} value={String(platformStats.templates)} />
            <Stat label={isEs ? 'Regiones' : 'Regions'} value={String(platformStats.regions)} />
            <Stat label={isEs ? 'Continentes' : 'Continents'} value={String(platformStats.continents)} />
            <Stat label={isEs ? 'POIs verificados' : 'Verified POIs'} value={`${platformStats.curatedPOIs}+`} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink-900">{isEs ? 'Cómo funciona offline' : 'How offline works'}</h2>
          <p className="mt-3 text-[15px] text-ink-700">
            {isEs
              ? 'TripLoop es una PWA (Progressive Web App). Al abrir un viaje, guardamos sus datos + tiles del mapa en tu dispositivo con IndexedDB y Service Worker. Puedes editar sin señal: los cambios se encolan en localStorage y sincronizan automáticamente al volver online. Ideal para parques nacionales, valles remotos y vuelos.'
              : 'TripLoop is a PWA (Progressive Web App). When you open a trip, we save its data + map tiles to your device via IndexedDB and a Service Worker. You can edit offline: changes queue in localStorage and sync automatically when you\'re back online. Ideal for national parks, remote valleys, and flights.'}
          </p>
        </section>

        <section className="mt-12 rounded-card border border-coral-200 bg-coral-50/40 p-6">
          <h2 className="font-display text-xl font-semibold text-ink-900">{isEs ? '¿Listo para probarlo?' : 'Ready to try it?'}</h2>
          <p className="mt-2 text-sm text-ink-600">
            {isEs ? 'No pedimos email, no pedimos tarjeta. Solo empieza.' : 'No email required, no card required. Just start.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/${locale}/trip/new`} className="rounded-pill bg-ink-900 px-5 py-2 text-sm font-semibold text-white hover:bg-ink-700">
              🗓 {isEs ? 'Crear itinerario' : 'Create itinerary'}
            </Link>
            <Link href={`/${locale}/trip/new/ai`} className="rounded-pill bg-coral-500 px-5 py-2 text-sm font-semibold text-white hover:bg-coral-600">
              ✨ {isEs ? 'Probar IA' : 'Try AI'}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }){
  return (
    <div className="rounded-card border border-ink-100 bg-white p-4 text-center">
      <div className="font-display text-3xl font-semibold text-ink-900 tabular-nums">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">{label}</div>
    </div>
  );
}
