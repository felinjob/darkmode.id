import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
      {/* Cabeçalho do Case */}
      <header className="p-6 md:p-8 space-y-3">
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

      {/* Meio: Imagem e Desafio Operacional Lado a Lado no Desktop */}
      <div className="flex flex-col lg:flex-row w-full border-y border-[var(--border-subtle)]">
        
        {/* Coluna da Imagem (Full cover) */}
        <div className="relative w-full lg:w-[55%] aspect-video lg:aspect-auto border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden">
          {project.media?.src ? (
            <Image
              src={project.media.src}
              alt={`Preview do projeto ${project.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              quality={100}
              unoptimized={true}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)]">
                [VISUAL_DATA_PENDING]
              </span>
            </div>
          )}
        </div>

        {/* Coluna do Desafio Operacional */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 md:p-8 lg:p-12 xl:p-16 bg-[var(--bg-surface)]">
          <section className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-subtle)]/50 pb-2">
              {project.challengeLabel}
            </h4>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              {project.challenge}
            </p>
          </section>
        </div>

      </div>

      {/* Conteúdo Analítico Inferior (Arquitetura e Métricas) */}
      <div className="p-6 md:p-8 space-y-8">
        
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

      {/* Botões */}
      <footer className="flex flex-col sm:flex-row gap-3 p-6 md:p-8 pt-0">
        {project.actions?.map((action: any, i: number) => {
          const isExternal = action.url.startsWith('http');
          return (
            <Link
              key={i}
              href={action.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={`flex-1 min-h-[48px] flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] text-center ${
                action.isPrimary
                  ? 'bg-[var(--accent-focus)] text-black hover:brightness-110 active:brightness-90 focus:ring-[var(--accent-focus)]'
                  : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] focus:ring-[var(--border-subtle)]'
              }`}
            >
              {action.label}
            </Link>
          );
        })}
      </footer>
    </article>
  );
}
