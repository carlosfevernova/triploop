import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Términos de servicio — TripLoop' : 'Terms of Service — TripLoop',
    description: isEs
      ? 'Términos de uso de TripLoop. Servicio "tal cual", limitación de responsabilidad, disputas.'
      : 'TripLoop terms of use. Service "as-is", liability limitation, disputes.',
    alternates: { canonical: `/${locale}/terms`, languages: { en: '/en/terms', es: '/es/terms' } }
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">{isEs ? 'Términos de servicio' : 'Terms of Service'}</h1>
        <p className="mt-2 text-sm text-ink-500">{isEs ? 'Última actualización: 2026-08-08' : 'Last updated: 2026-08-08'}</p>

        <div className="prose prose-sm mt-8 max-w-none text-ink-700">
          <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">{isEs ? '1. Aceptación' : '1. Acceptance'}</h2>
          <p>{isEs
            ? 'Al usar TripLoop aceptas estos términos. Si no aceptas, no uses el servicio.'
            : 'By using TripLoop you accept these terms. If you do not accept, do not use the service.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '2. Servicio "tal cual"' : '2. "As-is" Service'}</h2>
          <p>{isEs
            ? 'TripLoop se ofrece "tal cual", sin garantías de disponibilidad o precisión. Las rutas curadas, coordenadas GPS, tiempos de manejo y precios estimados son referencia y pueden cambiar. Verifica siempre horarios de operación y condiciones de carretera antes de viajar.'
            : 'TripLoop is offered "as-is", without warranties of availability or accuracy. Curated routes, GPS coordinates, drive times, and estimated prices are references and may change. Always verify operating hours and road conditions before traveling.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '3. Cuenta y datos' : '3. Account & Data'}</h2>
          <p>{isEs
            ? 'Puedes usar TripLoop sin cuenta (viajes anónimos). Si creas cuenta, eres responsable de la seguridad de tus credenciales. Tus viajes son privados por defecto salvo que actives compartir.'
            : 'You can use TripLoop without an account (anonymous trips). If you create an account, you are responsible for credential security. Your trips are private by default unless you enable sharing.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '4. Contenido generado por IA' : '4. AI-Generated Content'}</h2>
          <p>{isEs
            ? 'Las sugerencias de itinerarios, insights y ediciones generadas por IA pueden contener errores. Nosotros no las verificamos individualmente. Úsalas como punto de partida y ajusta según tu criterio.'
            : 'AI-generated itinerary suggestions, insights, and edits may contain errors. We do not individually verify them. Use them as a starting point and adjust to your judgment.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '5. Enlaces afiliados' : '5. Affiliate Links'}</h2>
          <p>{isEs
            ? 'TripLoop puede ganar comisión cuando reservas hoteles o actividades a través de enlaces en la plataforma. Esto no afecta el precio que pagas.'
            : 'TripLoop may earn a commission when you book hotels or activities through platform links. This does not affect the price you pay.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '6. Limitación de responsabilidad' : '6. Liability Limitation'}</h2>
          <p>{isEs
            ? 'TripLoop no es responsable por accidentes, retrasos, cancelaciones ni pérdidas relacionadas con tu viaje. Somos una herramienta de planeación, no una agencia de viajes.'
            : 'TripLoop is not liable for accidents, delays, cancellations, or losses related to your trip. We are a planning tool, not a travel agency.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '7. Cambios a estos términos' : '7. Changes to Terms'}</h2>
          <p>{isEs
            ? 'Podemos actualizar estos términos. Los cambios importantes se anunciarán en la app.'
            : 'We may update these terms. Material changes will be announced in the app.'}</p>

          <h2 className="mt-6 font-display text-xl font-semibold text-ink-900">{isEs ? '8. Contacto' : '8. Contact'}</h2>
          <p><a href="mailto:hello@triploop.app" className="text-coral-600 hover:underline">hello@triploop.app</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
