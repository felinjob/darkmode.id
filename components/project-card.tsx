import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
      {/* Cabeçalho do Case: Identificador, Título e Descrição Única (máx 2 linhas) */}
      <header className="p-6 md:p-8 space-y-3">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase">
          <span className="text-[var(--text-muted)] tabular-nums">CASE {project.index} // 03</span>
          <span className="text-[var(--accent-focus)] font-medium">[{project.category}]</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
          {project.title}
        </h3>
        <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-4xl">
          {project.summary}
        </p>
      </header>

      {/* Imagem do Projeto em Alta Definição */}
      <div className="relative w-full aspect-video md:aspect-[21/9] border-y border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden">
        {project.media?.src ? (
          <Image
            src={project.media.src}
            alt={`Preview de ${project.title}`}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition-transform duration-700 hover:scale-[1.015]"
            quality={90}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)]">
              [VISUAL_DATA_PENDING]
            </span>
          </div>
        )}
      </div>

      {/* Dados Técnicos: Stack Compacta e Grade de Métricas */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Stack Técnica Compacta em Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mr-2">
            STACK //
          </span>
          {project.architecture?.map((tech: string, i: number) => (
            <span 
              key={i} 
              className="px-2.5 py-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)] tracking-wide uppercase tabular-nums"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Grade de Métricas em Destaque (tabular-nums) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-2 border-t border-[var(--border-subtle)]/50">
          {project.metrics?.map((metric: any, i: number) => (
            <div 
              key={i} 
              className="flex flex-col space-y-1 bg-[var(--bg-base)]/50 p-4 border border-[var(--border-subtle)]"
            >
              <span className="font-mono text-2xl md:text-3xl font-bold tracking-tighter text-[var(--text-primary)] tabular-nums">
                {metric.value}
              </span>
              <span className="font-sans text-[11px] text-[var(--text-secondary)] uppercase tracking-wide">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Links de Ação Direta */}
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
