import { SystemHeader } from '@/components/system-header';
import { HeroManifesto } from '@/components/hero-manifesto';
import { FounderModule } from '@/components/founder-module';
import { SelectedWorks } from '@/components/selected-works';
import { LabArchive } from '@/components/lab-archive';
import { CapabilitiesGrid } from '@/components/capabilities-grid';
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
        {/* Sprint 03: Hero & Founder Module */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 md:pt-8 pb-12 md:pb-20 border-b border-[var(--border-subtle)] w-full">
          <HeroManifesto dict={dict.hero} />
          <FounderModule dict={dict.founder} />
        </section>

        {/* 03. Vitrine Nobre: Selected Works com Dimensão de Information Challenge */}
        <section id="works" className="w-full">
          <SelectedWorks dict={dict.works} />
        </section>

        {/* 04. Capabilities & Lab Stacked */}
        <div className="flex flex-col w-full">
          <section id="capabilities" className="w-full border-b border-[var(--border-subtle)]">
            <CapabilitiesGrid dict={dict.capabilities} />
          </section>
          
          <section id="lab" className="w-full border-b border-[var(--border-subtle)]">
            <LabArchive dict={dict.lab} />
          </section>
        </div>
      </main>
    </>
  );
}
