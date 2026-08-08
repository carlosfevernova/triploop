import type { Metadata } from 'next';

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Widget embebible — TripLoop' : 'Embeddable widget — TripLoop',
    description: isEs
      ? 'Embebe cualquier ruta TripLoop en tu blog o web con 1 línea de HTML.'
      : 'Embed any TripLoop trip on your blog or site with 1 line of HTML.'
  };
}

export const revalidate = 86400;

export default async function EmbedDocsPage({ params }: PageProps){
  const { locale } = await params;
  const isEs = locale === 'es';
  const exampleSlug = 'pacific-coast-highway-5-days';
  const html = `<iframe src="https://triploop-six.vercel.app/embed/trip/${exampleSlug}?locale=${locale}&theme=light" width="100%" height="620" frameborder="0" loading="lazy" style="border:0;max-width:720px"></iframe>`;
  const htmlDark = `<iframe src="https://triploop-six.vercel.app/embed/trip/${exampleSlug}?locale=${locale}&theme=dark" width="100%" height="620" frameborder="0" loading="lazy" style="border:0;max-width:720px"></iframe>`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-coral-50/30 via-white to-ocean-400/5">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral-600">
          {isEs ? 'Widget embebible · gratis' : 'Embeddable widget · free'}
        </p>
        <h1 className="font-display text-display-lg tracking-tight text-ink-900">
          {isEs ? 'Embebe TripLoop en tu blog.' : 'Embed TripLoop on your blog.'}
        </h1>
        <p className="mt-4 text-lg text-ink-500">
          {isEs
            ? 'Copia una línea de HTML y muestra cualquier ruta en tu sitio. Sin JavaScript pesado, sin login, mobile-friendly.'
            : 'Copy one line of HTML and show any trip on your site. No heavy JS, no login required, mobile-friendly.'}
        </p>

        {/* Ejemplo light */}
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">
            1. {isEs ? 'Vista clara (light)' : 'Light theme'}
          </h2>
          <pre className="mb-6 overflow-x-auto rounded-lg bg-ink-900 p-4 text-[11px] text-emerald-300"><code>{html}</code></pre>
          <div className="overflow-hidden rounded-card border border-ink-100 bg-ink-50/50 p-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
              {isEs ? 'Vista previa' : 'Preview'}
            </p>
            <iframe
              src={`/embed/trip/${exampleSlug}?locale=${locale}&theme=light`}
              width="100%"
              height="620"
              frameBorder="0"
              loading="lazy"
              style={{ border: 0, maxWidth: 720 }}
            />
          </div>
        </section>

        {/* Ejemplo dark */}
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">
            2. {isEs ? 'Vista oscura (dark)' : 'Dark theme'}
          </h2>
          <pre className="mb-6 overflow-x-auto rounded-lg bg-ink-900 p-4 text-[11px] text-emerald-300"><code>{htmlDark}</code></pre>
        </section>

        {/* Opciones */}
        <section className="mt-12 rounded-card border border-ink-100 bg-white p-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">
            {isEs ? 'Parámetros disponibles' : 'Available parameters'}
          </h2>
          <ul className="space-y-2 text-sm text-ink-700">
            <li><code className="rounded bg-ink-100 px-2 py-0.5">locale=en|es</code> — {isEs ? 'Idioma del contenido' : 'Content language'}</li>
            <li><code className="rounded bg-ink-100 px-2 py-0.5">theme=light|dark</code> — {isEs ? 'Tema visual' : 'Visual theme'}</li>
          </ul>
        </section>

        <section className="mt-8 text-sm text-ink-500">
          <p>
            {isEs
              ? 'Reemplaza el slug con cualquier ruta de nuestro'
              : 'Replace the slug with any trip from our'}{' '}
            <a href={`/${locale}/california`} className="text-coral-600 underline">
              {isEs ? 'catálogo' : 'catalog'}
            </a>. {isEs ? 'Ejemplos:' : 'Examples:'} <code className="rounded bg-ink-100 px-1.5">grand-canyon-weekend-3-days</code>, <code className="rounded bg-ink-100 px-1.5">us-southwest-grand-circle-10-days</code>, <code className="rounded bg-ink-100 px-1.5">route-66-classic-14-days</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
