import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/request';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { FeaturesGrid } from '@/components/FeaturesGrid';
import { CitiesGrid } from '@/components/CitiesGrid';
import { Pricing } from '@/components/Pricing';
import { Footer } from '@/components/Footer';

export default async function Home({ params }: { params: Promise<{ locale: string }> }){
  const { locale } = await params;
  return (
    <>
      <Nav locale={locale as Locale} />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesGrid />
        <CitiesGrid />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
