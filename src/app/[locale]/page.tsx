import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/request';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { SocialProofStrip } from '@/components/SocialProofStrip';
import { ProblemSection } from '@/components/ProblemSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { TrustBadges } from '@/components/TrustBadges';
import { CitiesGrid } from '@/components/CitiesGrid';
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
  // Descartamos t; keys se leen dentro de componentes Client via useTranslations
  await getTranslations({ locale: locale as Locale });
  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        <Hero />
        <SocialProofStrip isEs={isEs} />
        <ProblemSection />
        <FeaturesGrid />
        <TrustBadges isEs={isEs} />
        <CitiesGrid />
        <Comparison isEs={isEs} />
        <Pricing />
        <FAQ isEs={isEs} />
      </main>
      <Footer />
      <StickyCta isEs={isEs} />
    </>
  );
}
