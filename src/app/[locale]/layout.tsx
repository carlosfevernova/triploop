import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import { OfflineBanner } from '@/components/OfflineBanner';
import { AdminPreviewBanner } from '@/components/AdminPreviewBanner';
import { WebVitalsReporter } from '@/components/WebVitalsReporter';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz']
});

export function generateStaticParams(){
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://triploop.app'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_MX'
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        es: '/es',
        'x-default': '/en'   // S65 SEO fix — Google necesita fallback para usuarios sin locale
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}){
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  // S65 cache fix — enable static rendering (unlocks ISR revalidate=300)
  // Pages auth-gated tienen layout.tsx wrapper con force-dynamic (/account, /my-trips, /signin, /signup)
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AdminPreviewBanner />
          <OfflineBanner />
          <WebVitalsReporter />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
