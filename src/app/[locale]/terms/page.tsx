import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import type { Locale } from '@/i18n/request';
import { locales } from '@/i18n/request';
import { L } from '@/lib/l4';

// S71l: 4-locale migration. TRANSLATIONS_NEED_NATIVE_REVIEW: pt, de
// LEGAL_REVIEW_REQUIRED: for BR/DE market launch, PT/DE terms need lawyer validation.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const title = L(locale, {
    en: 'Terms of Service — TripLoop',
    es: 'Términos de servicio — TripLoop',
    pt: 'Termos de serviço — TripLoop',
    de: 'Nutzungsbedingungen — TripLoop'
  });
  const description = L(locale, {
    en: 'TripLoop terms of use. Service "as-is", liability limitation, disputes.',
    es: 'Términos de uso de TripLoop. Servicio "tal cual", limitación de responsabilidad, disputas.',
    pt: 'Termos de uso do TripLoop. Serviço "como está", limitação de responsabilidade, disputas.',
    de: 'TripLoop-Nutzungsbedingungen. Dienst "wie besehen", Haftungsbeschränkung, Streitigkeiten.'
  });
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/terms`])),
        'x-default': '/en/terms'
      }
    }
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;

  const sections: { heading: Record<Locale, string>; body: Record<Locale, string> }[] = [
    {
      heading: { en: '1. Acceptance', es: '1. Aceptación', pt: '1. Aceitação', de: '1. Zustimmung' },
      body: {
        en: 'By using TripLoop you accept these terms. If you do not accept, do not use the service.',
        es: 'Al usar TripLoop aceptas estos términos. Si no aceptas, no uses el servicio.',
        pt: 'Ao usar o TripLoop você aceita estes termos. Se não aceitar, não use o serviço.',
        de: 'Durch die Nutzung von TripLoop akzeptierst du diese Bedingungen. Wenn du nicht zustimmst, nutze den Dienst nicht.'
      }
    },
    {
      heading: { en: '2. "As-is" Service', es: '2. Servicio "tal cual"', pt: '2. Serviço "como está"', de: '2. "Wie besehen"-Dienst' },
      body: {
        en: 'TripLoop is offered "as-is", without warranties of availability or accuracy. Curated routes, GPS coordinates, drive times, and estimated prices are references and may change. Always verify operating hours and road conditions before traveling.',
        es: 'TripLoop se ofrece "tal cual", sin garantías de disponibilidad o precisión. Las rutas curadas, coordenadas GPS, tiempos de manejo y precios estimados son referencia y pueden cambiar. Verifica siempre horarios de operación y condiciones de carretera antes de viajar.',
        pt: 'O TripLoop é oferecido "como está", sem garantias de disponibilidade ou precisão. Rotas selecionadas, coordenadas GPS, tempos de direção e preços estimados são referências e podem mudar. Sempre verifique horários de funcionamento e condições das estradas antes de viajar.',
        de: 'TripLoop wird "wie besehen" angeboten, ohne Garantien für Verfügbarkeit oder Genauigkeit. Kuratierte Routen, GPS-Koordinaten, Fahrzeiten und geschätzte Preise sind Referenzen und können sich ändern. Überprüfe immer Öffnungszeiten und Straßenverhältnisse vor der Reise.'
      }
    },
    {
      heading: { en: '3. Account & Data', es: '3. Cuenta y datos', pt: '3. Conta e dados', de: '3. Konto & Daten' },
      body: {
        en: 'You can use TripLoop without an account (anonymous trips). If you create an account, you are responsible for credential security. Your trips are private by default unless you enable sharing.',
        es: 'Puedes usar TripLoop sin cuenta (viajes anónimos). Si creas cuenta, eres responsable de la seguridad de tus credenciales. Tus viajes son privados por defecto salvo que actives compartir.',
        pt: 'Você pode usar o TripLoop sem conta (viagens anônimas). Se criar uma conta, você é responsável pela segurança das credenciais. Suas viagens são privadas por padrão, exceto se ativar o compartilhamento.',
        de: 'Du kannst TripLoop ohne Konto nutzen (anonyme Reisen). Wenn du ein Konto erstellst, bist du für die Sicherheit der Zugangsdaten verantwortlich. Deine Reisen sind standardmäßig privat, es sei denn, du aktivierst das Teilen.'
      }
    },
    {
      heading: { en: '4. AI-Generated Content', es: '4. Contenido generado por IA', pt: '4. Conteúdo gerado por IA', de: '4. KI-generierte Inhalte' },
      body: {
        en: 'AI-generated itinerary suggestions, insights, and edits may contain errors. We do not individually verify them. Use them as a starting point and adjust to your judgment.',
        es: 'Las sugerencias de itinerarios, insights y ediciones generadas por IA pueden contener errores. Nosotros no las verificamos individualmente. Úsalas como punto de partida y ajusta según tu criterio.',
        pt: 'Sugestões de roteiros, insights e edições geradas por IA podem conter erros. Não as verificamos individualmente. Use-as como ponto de partida e ajuste conforme seu critério.',
        de: 'KI-generierte Reiseplanvorschläge, Erkenntnisse und Bearbeitungen können Fehler enthalten. Wir überprüfen sie nicht einzeln. Nutze sie als Ausgangspunkt und passe sie nach eigenem Ermessen an.'
      }
    },
    {
      heading: { en: '5. Affiliate Links', es: '5. Enlaces afiliados', pt: '5. Links de afiliados', de: '5. Affiliate-Links' },
      body: {
        en: 'TripLoop may earn a commission when you book hotels or activities through platform links. This does not affect the price you pay.',
        es: 'TripLoop puede ganar comisión cuando reservas hoteles o actividades a través de enlaces en la plataforma. Esto no afecta el precio que pagas.',
        pt: 'O TripLoop pode receber comissão quando você reserva hotéis ou atividades através de links da plataforma. Isso não afeta o preço que você paga.',
        de: 'TripLoop kann eine Provision verdienen, wenn du Hotels oder Aktivitäten über Plattform-Links buchst. Dies wirkt sich nicht auf den Preis aus, den du zahlst.'
      }
    },
    {
      heading: { en: '6. Liability Limitation', es: '6. Limitación de responsabilidad', pt: '6. Limitação de responsabilidade', de: '6. Haftungsbeschränkung' },
      body: {
        en: 'TripLoop is not liable for accidents, delays, cancellations, or losses related to your trip. We are a planning tool, not a travel agency.',
        es: 'TripLoop no es responsable por accidentes, retrasos, cancelaciones ni pérdidas relacionadas con tu viaje. Somos una herramienta de planeación, no una agencia de viajes.',
        pt: 'O TripLoop não é responsável por acidentes, atrasos, cancelamentos ou perdas relacionadas à sua viagem. Somos uma ferramenta de planejamento, não uma agência de viagens.',
        de: 'TripLoop haftet nicht für Unfälle, Verspätungen, Stornierungen oder Verluste im Zusammenhang mit deiner Reise. Wir sind ein Planungstool, keine Reiseagentur.'
      }
    },
    {
      heading: { en: '7. Changes to Terms', es: '7. Cambios a estos términos', pt: '7. Alterações nestes termos', de: '7. Änderungen der Bedingungen' },
      body: {
        en: 'We may update these terms. Material changes will be announced in the app.',
        es: 'Podemos actualizar estos términos. Los cambios importantes se anunciarán en la app.',
        pt: 'Podemos atualizar estes termos. Alterações relevantes serão anunciadas no app.',
        de: 'Wir können diese Bedingungen aktualisieren. Wesentliche Änderungen werden in der App bekannt gegeben.'
      }
    },
    {
      heading: { en: '8. Contact', es: '8. Contacto', pt: '8. Contato', de: '8. Kontakt' },
      body: { en: 'email', es: 'email', pt: 'email', de: 'email' } // handled specially
    }
  ];

  return (
    <>
      <Nav locale={locale as Locale} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold text-ink-900">
          {L(locale, { en: 'Terms of Service', es: 'Términos de servicio', pt: 'Termos de serviço', de: 'Nutzungsbedingungen' })}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {L(locale, { en: 'Last updated: 2026-08-08', es: 'Última actualización: 2026-08-08', pt: 'Última atualização: 2026-08-08', de: 'Zuletzt aktualisiert: 2026-08-08' })}
        </p>

        <div className="prose prose-sm mt-8 max-w-none text-ink-700">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="mt-8 font-display text-xl font-semibold text-ink-900">{L(locale, s.heading)}</h2>
              {i === sections.length - 1 ? (
                <p><a href="mailto:hello@triploop.app" className="text-coral-600 hover:underline">hello@triploop.app</a></p>
              ) : (
                <p>{L(locale, s.body)}</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
