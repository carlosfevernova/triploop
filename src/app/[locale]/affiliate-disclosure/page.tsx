import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Aviso de afiliados — TripLoop' : 'Affiliate Disclosure — TripLoop',
    description: isEs
      ? 'Cómo gana dinero TripLoop, qué links son afiliados y por qué esto no afecta lo que pagas.'
      : 'How TripLoop makes money, which links are affiliate, and why this never affects what you pay.',
    alternates: {
      canonical: `/${locale}/affiliate-disclosure`,
      languages: { en: '/en/affiliate-disclosure', es: '/es/affiliate-disclosure' }
    }
  };
}

export default async function AffiliateDisclosurePage({ params }: PageProps){
  const { locale } = await params;
  const isEs = locale === 'es';
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <Link href={`/${locale}`} className="mb-6 inline-block text-xs font-semibold uppercase tracking-widest text-ink-500 hover:text-ink-900">
          ← TripLoop
        </Link>
        <h1 className="font-display text-display-md text-ink-900 md:text-display-lg">
          {isEs ? 'Aviso de afiliados' : 'Affiliate Disclosure'}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {isEs ? 'Última actualización: agosto 2026' : 'Last updated: August 2026'}
        </p>

        {isEs ? <EsBody /> : <EnBody />}
      </article>
    </main>
  );
}

function EnBody(){
  return (
    <div className="prose prose-ink mt-8 max-w-none space-y-6 text-ink-700">
      <p className="text-lg">
        TripLoop is <strong>free to use</strong>. To keep it that way, we participate in affiliate programs
        with select travel partners — including <strong>Booking.com</strong> and <strong>GetYourGuide</strong>.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">What this means</h2>
      <p>
        When you click a hotel or activity link from TripLoop and complete a booking on the partner&apos;s
        site, we receive a small commission. <strong>You never pay more</strong> than the price shown by
        the partner. In many cases, using our link doesn&apos;t change your price at all — because tax
        and fees are already included in what Booking and GetYourGuide display.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Which links are affiliate</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Book hotels →</strong> any link to <code>booking.com</code> from a TripLoop page (badge 🏨,
          &quot;Find hotels&quot; buttons, template pages).
        </li>
        <li>
          <strong>Book activities →</strong> any link to <code>getyourguide.com</code> from a TripLoop page
          (badge 🎭, &quot;Find activities&quot; buttons).
        </li>
      </ul>
      <p>
        These links are always marked with <code>rel=&quot;sponsored nofollow&quot;</code> per FTC and search
        engine guidelines. A persistent yellow disclosure banner is shown in the booking panel.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Editorial independence</h2>
      <p>
        We do <strong>not</strong> hide, deprioritize, or filter search results based on commission. The
        Booking search you see is the same one you would get by going to <code>booking.com</code> directly.
        Ranking, availability and prices come from the partners — not from us.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Other ways we monetize</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong>Pro subscription ($6.99/mo):</strong> unlimited trips, offline maps, unlimited AI.</li>
        <li><strong>Never:</strong> selling your data, third-party ads, or promoted stops in your itinerary.</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Compliance</h2>
      <p>
        This disclosure is provided in accordance with the U.S. FTC{' '}
        <a href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking" target="_blank" rel="noreferrer" className="text-coral-600 underline">
          Endorsement Guides
        </a>{' '}
        and the UK CMA guidance on affiliate marketing.
      </p>

      <p className="mt-8 text-sm text-ink-500">
        Questions? Reach out via <a href="mailto:hello@triploop.app" className="text-coral-600 underline">hello@triploop.app</a>.
      </p>
    </div>
  );
}

function EsBody(){
  return (
    <div className="prose prose-ink mt-8 max-w-none space-y-6 text-ink-700">
      <p className="text-lg">
        TripLoop es <strong>gratis</strong>. Para mantenerlo así, participamos en programas de afiliados con
        socios de viaje seleccionados — incluidos <strong>Booking.com</strong> y <strong>GetYourGuide</strong>.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Qué significa</h2>
      <p>
        Cuando haces clic en un link a un hotel o actividad desde TripLoop y completas una reserva en el
        sitio del socio, recibimos una pequeña comisión. <strong>Tú nunca pagas más</strong> del precio
        que muestra el socio. En la mayoría de casos, usar nuestro link no cambia tu precio — porque
        Booking y GetYourGuide muestran precios con impuestos y fees incluidos.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Qué links son afiliados</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Reservar hoteles →</strong> cualquier link a <code>booking.com</code> desde TripLoop
          (badge 🏨, botones &quot;Ver hoteles&quot;, páginas de rutas).
        </li>
        <li>
          <strong>Reservar actividades →</strong> cualquier link a <code>getyourguide.com</code> desde
          TripLoop (badge 🎭, botones &quot;Ver actividades&quot;).
        </li>
      </ul>
      <p>
        Estos links siempre llevan <code>rel=&quot;sponsored nofollow&quot;</code> según guías de la FTC
        y de motores de búsqueda. Un banner amarillo con el aviso se muestra siempre visible en el panel
        de reserva.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Independencia editorial</h2>
      <p>
        <strong>No</strong> ocultamos, deprioritizamos ni filtramos resultados por comisión. La búsqueda
        de Booking que ves es la misma que obtendrías si fueras a <code>booking.com</code> directamente.
        El ranking, disponibilidad y precios vienen de los socios — no de nosotros.
      </p>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Cómo más monetizamos</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong>Suscripción Pro ($6.99/mes):</strong> viajes ilimitados, mapas offline, IA sin límites.</li>
        <li><strong>Nunca:</strong> vender tus datos, ads de terceros, ni paradas patrocinadas en tu ruta.</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold text-ink-900">Cumplimiento</h2>
      <p>
        Este aviso se proporciona conforme a las{' '}
        <a href="https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking" target="_blank" rel="noreferrer" className="text-coral-600 underline">
          FTC Endorsement Guides
        </a>{' '}
        de EE.UU. y la guía de la CMA del Reino Unido sobre marketing de afiliados.
      </p>

      <p className="mt-8 text-sm text-ink-500">
        ¿Preguntas? Escríbenos a <a href="mailto:hello@triploop.app" className="text-coral-600 underline">hello@triploop.app</a>.
      </p>
    </div>
  );
}
