import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { platformStats } from '@/lib/platform-stats';
import type { Locale } from '@/i18n/request';
import { locales } from '@/i18n/request';
import { L } from '@/lib/l4';

// S71l: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const title = L(locale, {
    en: 'About TripLoop — Story + mission',
    es: 'Acerca de TripLoop — Historia + misión',
    pt: 'Sobre o TripLoop — História + missão',
    de: 'Über TripLoop — Geschichte + Mission'
  });
  const description = L(locale, {
    en: 'TripLoop is an AI-native multilingual road-trip planner. 24 regions, 7 continents, free to start.',
    es: 'TripLoop es un planeador AI-native de road trips multilingüe. 24 regiones, 7 continentes, gratis para empezar.',
    pt: 'TripLoop é um planejador de road trips AI-native multilíngue. 24 regiões, 7 continentes, grátis para começar.',
    de: 'TripLoop ist ein KI-nativer, mehrsprachiger Roadtrip-Planer. 24 Regionen, 7 Kontinente, kostenlos zum Starten.'
  });
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
        'x-default': '/en/about'
      }
    }
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          {L(locale, { en: 'About TripLoop', es: 'Acerca de TripLoop', pt: 'Sobre o TripLoop', de: 'Über TripLoop' })}
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          {L(locale, {
            en: 'We plan road trips others take for granted — properly.',
            es: 'Planeamos road trips que otros dan por sentado — bien.',
            pt: 'Planejamos road trips que outros ignoram — direito.',
            de: 'Wir planen Roadtrips, die andere selbstverständlich nehmen — richtig.'
          })}
        </p>

        <section className="mt-10 space-y-6 text-[15px] leading-relaxed text-ink-700">
          <p>
            {L(locale, {
              en: 'TripLoop exists because planning a road trip still costs more effort than the trip itself. Comparing maps, cross-referencing routes, calculating traffic times, finding decent food stops, checking if your hotel is open when you arrive — all that lives in 6 different apps, none in your native language, and most charge you for what Google already gave you for free.',
              es: 'TripLoop existe porque la planeación de un road trip todavía cuesta más que el viaje mismo. Comparar mapas, cruzar rutas, calcular tiempos con tráfico, encontrar paradas de comida decentes, saber si tu hotel abre cuando llegas — todo eso vive en 6 apps distintas, ninguna en tu idioma nativo, y la mayoría cobra por lo que Google ya te dio gratis.',
              pt: 'O TripLoop existe porque planejar uma road trip ainda dá mais trabalho que a própria viagem. Comparar mapas, cruzar rotas, calcular tempos com trânsito, encontrar paradas de comida decentes, saber se seu hotel está aberto ao chegar — tudo isso mora em 6 apps diferentes, nenhum no seu idioma nativo, e a maioria cobra pelo que o Google já lhe deu de graça.',
              de: 'TripLoop existiert, weil die Planung eines Roadtrips immer noch mehr Aufwand kostet als die Reise selbst. Karten vergleichen, Routen abgleichen, Verkehrszeiten berechnen, gute Essensstopps finden, prüfen, ob dein Hotel offen ist bei Ankunft — all das lebt in 6 verschiedenen Apps, keine in deiner Muttersprache, und die meisten verlangen Geld für das, was Google dir schon kostenlos gegeben hat.'
            })}
          </p>
          <p>
            {L(locale, {
              en: "We built TripLoop with a simple rule: every feature must reduce the traveler's work, not add to it. That's why the timeline is day-by-day, hour-by-hour. That's why the AI suggests verified stops with real coordinates instead of hallucinating. That's why it works offline. That's why it's natively multilingual in EN·ES·PT·DE.",
              es: 'Construimos TripLoop con una regla simple: cada feature debe reducir el trabajo del viajero, no agregarle uno. Por eso el timeline es día por día, hora por hora. Por eso la IA sugiere paradas verificadas con coordenadas reales, no inventa. Por eso funciona offline. Por eso es multilingüe nativo EN·ES·PT·DE.',
              pt: 'Construímos o TripLoop com uma regra simples: cada recurso deve reduzir o trabalho do viajante, não aumentá-lo. Por isso o timeline é dia a dia, hora a hora. Por isso a IA sugere paradas verificadas com coordenadas reais, sem inventar. Por isso funciona offline. Por isso é multilíngue nativo EN·ES·PT·DE.',
              de: 'Wir haben TripLoop mit einer einfachen Regel gebaut: Jede Funktion muss die Arbeit des Reisenden reduzieren, nicht sie erhöhen. Deshalb ist die Zeitleiste Tag für Tag, Stunde für Stunde. Deshalb schlägt die KI verifizierte Stopps mit echten Koordinaten vor, statt zu halluzinieren. Deshalb funktioniert es offline. Deshalb ist es nativ mehrsprachig in EN·ES·PT·DE.'
            })}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {L(locale, { en: 'By the numbers', es: 'Por los números', pt: 'Em números', de: 'In Zahlen' })}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label={L(locale, { en: 'Curated routes', es: 'Rutas curadas', pt: 'Rotas selecionadas', de: 'Kuratierte Routen' })} value={String(platformStats.templates)} />
            <Stat label={L(locale, { en: 'Regions', es: 'Regiones', pt: 'Regiões', de: 'Regionen' })} value={String(platformStats.regions)} />
            <Stat label={L(locale, { en: 'Continents', es: 'Continentes', pt: 'Continentes', de: 'Kontinente' })} value={String(platformStats.continents)} />
            <Stat label={L(locale, { en: 'Verified POIs', es: 'POIs verificados', pt: 'POIs verificados', de: 'Verifizierte POIs' })} value={`${platformStats.curatedPOIs}+`} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            {L(locale, { en: 'How offline works', es: 'Cómo funciona offline', pt: 'Como o offline funciona', de: 'So funktioniert Offline' })}
          </h2>
          <p className="mt-3 text-[15px] text-ink-700">
            {L(locale, {
              en: "TripLoop is a PWA (Progressive Web App). When you open a trip, we save its data + map tiles to your device via IndexedDB and a Service Worker. You can edit offline: changes queue in localStorage and sync automatically when you're back online. Ideal for national parks, remote valleys, and flights.",
              es: 'TripLoop es una PWA (Progressive Web App). Al abrir un viaje, guardamos sus datos + tiles del mapa en tu dispositivo con IndexedDB y Service Worker. Puedes editar sin señal: los cambios se encolan en localStorage y sincronizan automáticamente al volver online. Ideal para parques nacionales, valles remotos y vuelos.',
              pt: 'O TripLoop é um PWA (Progressive Web App). Ao abrir uma viagem, salvamos seus dados + tiles do mapa no seu dispositivo via IndexedDB e Service Worker. Você pode editar offline: as alterações ficam em fila no localStorage e sincronizam automaticamente ao voltar online. Ideal para parques nacionais, vales remotos e voos.',
              de: 'TripLoop ist eine PWA (Progressive Web App). Wenn du eine Reise öffnest, speichern wir ihre Daten + Kartenkacheln auf deinem Gerät via IndexedDB und Service Worker. Du kannst offline bearbeiten: Änderungen werden im localStorage in eine Warteschlange gestellt und automatisch synchronisiert, sobald du wieder online bist. Ideal für Nationalparks, entlegene Täler und Flüge.'
            })}
          </p>
        </section>

        <section className="mt-12 rounded-card border border-coral-200 bg-coral-50/40 p-6">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {L(locale, { en: 'Ready to try it?', es: '¿Listo para probarlo?', pt: 'Pronto para testar?', de: 'Bereit zum Ausprobieren?' })}
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            {L(locale, {
              en: 'No email required, no card required. Just start.',
              es: 'No pedimos email, no pedimos tarjeta. Solo empieza.',
              pt: 'Sem pedir e-mail, sem pedir cartão. É só começar.',
              de: 'Keine E-Mail nötig, keine Karte nötig. Einfach loslegen.'
            })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/${locale}/trip/new`} className="rounded-pill bg-ink-900 px-5 py-2 text-sm font-semibold text-white hover:bg-ink-700">
              🗓 {L(locale, { en: 'Create itinerary', es: 'Crear itinerario', pt: 'Criar roteiro', de: 'Reiseplan erstellen' })}
            </Link>
            <Link href={`/${locale}/trip/new/ai`} className="rounded-pill bg-coral-500 px-5 py-2 text-sm font-semibold text-white hover:bg-coral-600">
              ✨ {L(locale, { en: 'Try AI', es: 'Probar IA', pt: 'Testar IA', de: 'KI testen' })}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
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
