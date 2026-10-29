import { ProjectCard } from './project-card';

export function SelectedWorks({ dict }: { dict: any }) {
  return (
    <section className="py-14 md:py-20 border-b border-[var(--border-subtle)]">
      {/* Cabeçalho da Seção */}
      <header className="mb-10 md:mb-12 flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {dict.title}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-focus)]">
            {dict.tag}
          </span>
        </div>
        {dict.subtitle && (
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {dict.subtitle}
          </p>
        )}
      </header>

      {/* Lista de Projetos Principais */}
      <div className="flex flex-col gap-10 md:gap-12">
        {dict.cases.map((project: any) => (
          <ProjectCard key={project.id} project={project} labels={dict.labels} />
        ))}
      </div>
    </section>
  );
}
