import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/request';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { SocialProofStrip } from '@/components/SocialProofStrip';
import { FeatureQuickAccess } from '@/components/FeatureQuickAccess';
import { ProblemSection } from '@/components/ProblemSection';
import { FeaturesShowcase } from '@/components/FeaturesShowcase';
import { TrustBadges } from '@/components/TrustBadges';
import { RegionsGrid } from '@/components/RegionsGrid';
import { Comparison } from '@/components/Comparison';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { StickyCta } from '@/components/StickyCta';
import { Footer } from '@/components/Footer';

// ISR: revalida cada 5 min para actualizar métricas social proof
export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  const isEs = locale === 'es';
  // S65 cache fix — enables static rendering (unlocks ISR revalidate=300)
  setRequestLocale(locale);
  // Descartamos t; keys se leen dentro de componentes Client via useTranslations
  await getTranslations({ locale: locale as Locale });
  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        <Hero />
        {/* S48: Quick-access post-hero — 6 features primarias con acción directa (1-click) */}
        <FeatureQuickAccess />
        <SocialProofStrip isEs={isEs} />
        <ProblemSection />
        <FeaturesShowcase />
        <TrustBadges isEs={isEs} />
        <RegionsGrid />
        {/* S50: CitiesGrid removido — redundante con Nav "Destinos" dropdown que ya expone 24 regiones */}
        <Comparison isEs={isEs} />
        <Pricing locale={locale} />
        <FAQ isEs={isEs} />
      </main>
      <Footer />
      <StickyCta isEs={isEs} />
    </>
  );
}
