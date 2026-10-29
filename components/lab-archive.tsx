function getStatusStyle(status: string) {
  const normalized = status.toUpperCase();
  if (
    normalized.includes('ESTUDO') ||
    normalized.includes('DESENVOLVIMENTO') ||
    normalized.includes('ACTIVE') ||
    normalized.includes('R&D')
  ) {
    return {
      text: 'text-[var(--accent-focus)]',
      dot: 'bg-[var(--accent-focus)] animate-pulse',
      border: 'border-[var(--accent-focus)]/40 bg-[var(--accent-focus)]/10',
    };
  }
  if (normalized.includes('ARQUIVADO') || normalized.includes('ARCHIVED')) {
    return {
      text: 'text-[var(--text-muted)]',
      dot: 'bg-[var(--text-muted)]',
      border: 'border-[var(--border-subtle)] bg-[var(--bg-base)]',
    };
  }
  return {
    text: 'text-[var(--signal-state)]',
    dot: 'bg-[var(--signal-state)]',
    border: 'border-[var(--signal-state)]/30 bg-[var(--signal-state)]/10',
  };
}

export function LabArchive({ dict }: { dict: any }) {
  return (
    <section className="py-14 md:py-20">
      {/* Cabeçalho */}
      <header className="mb-8 md:mb-10 flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {dict.title}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {dict.tag}
          </span>
        </div>
        {dict.subtitle && (
          <p className="font-sans text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {dict.subtitle}
          </p>
        )}
      </header>

      {/* Lista Compacta de Experimentos e Repositórios */}
      <div className="flex flex-col border border-[var(--border-subtle)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)]">
        {dict.experiments.map((exp: any) => {
          const statusStyle = getStatusStyle(exp.status);
          const scopeTags = exp.scope
            ? exp.scope.split('/').map((s: string) => s.trim())
            : [];

          return (
            <div
              key={exp.id}
              className="p-4 sm:p-5 lg:px-6 lg:py-4.5 transition-colors hover:bg-[var(--bg-elevated)] group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-center">
                {/* Título + Descrição Curta */}
                <div className="lg:col-span-6 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      {exp.id}
                    </span>
                    <h3 className="font-display text-base font-bold text-[var(--text-primary)] tracking-tight">
                      {exp.title}
                    </h3>
                  </div>
                  <p className="font-sans text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="lg:col-span-3 flex flex-wrap gap-1.5">
                  {scopeTags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Status + Link */}
                <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-3 pt-1 lg:pt-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[10px] uppercase font-medium ${statusStyle.border} ${statusStyle.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                    {exp.status}
                  </span>

                  <a
                    href={exp.targetUrl || '#'}
                    target={exp.targetUrl && exp.targetUrl !== '#' ? '_blank' : undefined}
                    rel={
                      exp.targetUrl && exp.targetUrl !== '#'
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="px-3 py-1.5 bg-[var(--bg-base)] border border-[var(--border-strong)] group-hover:border-[var(--accent-focus)] font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-focus)] transition-colors whitespace-nowrap"
                  >
                    Código ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
