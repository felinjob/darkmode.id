import { SystemHeader } from '@/components/system-header';
import { HeroManifesto } from '@/components/hero-manifesto';
import { FounderModule } from '@/components/founder-module';
import { SelectedWorks } from '@/components/selected-works';
import { EngineeringTrajectory } from '@/components/engineering-trajectory';
import { CapabilitiesGrid } from '@/components/capabilities-grid';
import { LabArchive } from '@/components/lab-archive';
import { DirectCtaBanner } from '@/components/direct-cta-banner';
import { getDictionary } from '@/lib/dictionaries';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <SystemHeader locale={locale} />

      <main className="flex flex-col w-full px-4 md:px-8 lg:px-12 xl:px-16">
        {/* 01. Hero & Retrato Acima da Dobra */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pt-6 md:pt-10 pb-12 md:pb-16 border-b border-[var(--border-subtle)] w-full items-center">
          <HeroManifesto dict={dict.hero} />
          <FounderModule dict={dict.founder} />
        </section>

        {/* 02. Projetos Principais (Dora MES, Santos PREP, Use Azevedo) */}
        <div id="works" className="w-full scroll-mt-16">
          <SelectedWorks dict={dict.works} />
        </div>

        {/* 03. Sobre Mim (Do Audiovisual para o Código e os Dados) */}
        {dict.trajectory && <EngineeringTrajectory dict={dict.trajectory} />}

        {/* 04. Ferramentas & Prática (Faixa Sutil) */}
        <div id="capabilities" className="w-full border-b border-[var(--border-subtle)] scroll-mt-16">
          <CapabilitiesGrid dict={dict.capabilities} />
        </div>

        {/* 05. Lab & Experimentos */}
        <div id="lab" className="w-full border-b border-[var(--border-subtle)] scroll-mt-16">
          <LabArchive dict={dict.lab} />
        </div>

        {/* 06. Contato Direto */}
        {dict.cta && <DirectCtaBanner dict={dict.cta} />}
      </main>
    </>
  );
}
