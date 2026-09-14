import { ProjectCard } from './project-card';

export function SelectedWorks({ dict }: { dict: any }) {
  return (
    <section id="works" className="py-16 md:py-24">
      {/* Cabeçalho da Seção */}
      <header className="mb-12 md:mb-16 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {dict.title}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {dict.tag}
          </span>
        </div>
        <div className="w-full h-px bg-[var(--border-subtle)]" />
      </header>

      {/* Lista de Estudos de Caso */}
      <div className="flex flex-col gap-16 md:gap-24">
        {dict.cases.map((project: any, index: number) => (
          <div key={project.id} className="flex flex-col gap-16 md:gap-24">
            <ProjectCard project={project} />
            {index < dict.cases.length - 1 && (
              <div className="w-full h-px bg-[var(--border-subtle)]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
