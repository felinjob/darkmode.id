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
      
      <main className="flex flex-col w-full">
        {/* Sprint 03: Hero & Founder Module */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-8 lg:px-12 xl:px-16 pt-0 md:pt-4 pb-16 md:pb-32 border-b border-[var(--border-subtle)] max-w-[1920px] mx-auto w-full">
          <HeroManifesto dict={dict.hero} />
          <FounderModule dict={dict.founder} />
        </section>

        {/* Sprint 04: Vitrine Nobre (Selected Works) */}
        <section id="works" className="w-full">
          <SelectedWorks dict={dict.works} />
        </section>

        {/* Sprint 05: Lab & Capabilities Stacked */}
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
