import { ProjectVisor } from './project-visor';

interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 w-full">
      {/* Coluna Visual (Visor de Produção) - Ocupa 7 colunas no Desktop */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
        <ProjectVisor title={project.title} media={project.media} />
      </div>

      {/* Coluna Analítica (Ficha de Engenharia) - Ocupa 5 colunas no Desktop */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 md:p-8">
        <div className="flex flex-col space-y-8">
          {/* Cabeçalho */}
          <header className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase">
              <span className="text-[var(--text-muted)]">CASE {project.index} // 03</span>
              <span className="text-[var(--accent-focus)]">[{project.category}]</span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
              {project.title}
            </h3>
            <p className="font-sans text-sm text-[var(--text-primary)] font-medium">
              {project.summary}
            </p>
          </header>

          {/* Desafio Operacional */}
          <section className="space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)]/50 pb-2">
              {project.challengeLabel}
            </h4>
            <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.challenge}
            </p>
          </section>

          {/* Decisões de Arquitetura */}
          <section className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)]/50 pb-2">
              {project.architectureLabel}
            </h4>
            <ul className="flex flex-wrap gap-2">
              {project.architecture.map((tech: any, i: number) => (
                <li 
                  key={i} 
                  className="px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)] tracking-wide uppercase"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          {/* Métricas de Impacto */}
          <section className="space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)]/50 pb-2">
              {project.metricsLabel}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {project.metrics.map((metric: any, i: number) => (
                <div key={i} className="flex flex-col space-y-1">
                  <span className="font-mono text-2xl md:text-3xl font-bold tracking-tighter text-[var(--text-primary)] tabular-nums">
                    {metric.value}
                  </span>
                  <span className="font-sans text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Barra de Ações (Ergonomia Tátil) */}
        <footer className="mt-10 flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--border-subtle)]">
          {project.actions?.map((action: any, i: number) => (
            <a
              key={i}
              href={action.url}
              className={`flex-1 min-h-[48px] flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] text-center ${
                action.isPrimary
                  ? 'bg-[var(--accent-focus)] text-black hover:brightness-110 active:brightness-90 focus:ring-[var(--accent-focus)]'
                  : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] focus:ring-[var(--border-subtle)]'
              }`}
            >
              {action.label}
            </a>
          ))}
        </footer>
      </div>
    </article>
  );
}
