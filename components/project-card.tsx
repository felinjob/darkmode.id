import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: any;
  labels?: {
    bottleneck?: string;
    solution?: string;
    metrics?: string;
    liveBadge?: string;
  };
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  return (
    <article className="flex flex-col w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors">
      {/* Barra Superior Compacta */}
      <div className="px-5 md:px-6 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
        <div className="flex items-center gap-2.5">
          <span className="text-[var(--accent-focus)] font-bold tabular-nums">
            {project.index} / 03
          </span>
          <span className="text-[var(--border-strong)]">•</span>
          <span className="text-[var(--text-secondary)]">{project.category}</span>
        </div>

        <div className="flex items-center gap-3">
          {project.location && (
            <span className="hidden sm:inline text-[var(--text-muted)]">{project.location}</span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] text-[var(--signal-state)] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal-state)]" />
            {labels?.liveBadge || 'EM PRODUÇÃO'}
          </span>
        </div>
      </div>

      {/* Corpo em Split Layout: Imagem + Métricas à esquerda (7 col) | Contexto + Ações à direita (5 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
        {/* Coluna Visual & Resultados (7 colunas) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[var(--bg-base)]/40">
          <div className="relative w-full aspect-video border-b border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden group">
            {project.media?.src ? (
              <Image
                src={project.media.src}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                quality={90}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)]">
                  [PREVIEW]
                </span>
              </div>
            )}
          </div>

          {/* Faixa Compacta de Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x divide-[var(--border-subtle)] bg-[var(--bg-base)]/60">
            {project.metrics?.map((metric: any, i: number) => (
              <div key={i} className="p-3.5 sm:p-4 flex flex-col justify-center">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
                  {metric.value}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5 leading-tight">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Editorial & Ações (5 colunas) */}
        <div className="lg:col-span-5 p-5 sm:p-6 md:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-snug">
              {project.title}
            </h3>

            <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.summary}
            </p>

            {/* Problema & Solução em notas curtas e diretas */}
            {(project.bottleneck || project.solution) && (
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]/70 text-xs sm:text-[13px] leading-relaxed">
                {project.bottleneck && (
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-focus)] font-semibold block mb-0.5">
                      {labels?.bottleneck || 'Problema'}
                    </span>
                    <p className="text-[var(--text-secondary)]">{project.bottleneck}</p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--signal-state)] font-semibold block mb-0.5">
                      {labels?.solution || 'Solução'}
                    </span>
                    <p className="text-[var(--text-secondary)]">{project.solution}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]/70">
            {/* Stack enxuta */}
            <div className="flex flex-wrap gap-1.5">
              {project.architecture?.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.actions?.map((action: any, i: number) => {
                const isExternal = action.url.startsWith('http');
                return (
                  <Link
                    key={i}
                    href={action.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`min-h-[42px] flex items-center justify-center font-mono text-[11px] font-bold uppercase tracking-wider px-3 py-2.5 transition-all text-center ${
                      action.isPrimary
                        ? 'bg-[var(--accent-focus)] text-white hover:brightness-110'
                        : 'bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-focus)]'
                    }`}
                  >
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
