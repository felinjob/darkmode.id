export function CapabilitiesGrid({ dict }: { dict: any }) {
  return (
    <section className="py-12 md:py-16">
      {/* Cabeçalho discreto */}
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h2 className="font-display text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
          {dict.title}
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
          {dict.tag}
        </span>
      </header>

      {/* Faixa horizontal sutil (4 colunas enxutas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
        {dict.categories.map((cap: any) => (
          <div
            key={cap.index}
            className="flex flex-col justify-between bg-[var(--bg-surface)] p-5 space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)] uppercase">
                <span>{cap.index}</span>
              </div>
              <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                {cap.title}
              </h3>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed">
                {cap.lead}
              </p>
            </div>

            {/* Tags sutis de ferramentas */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border-subtle)]/60">
              {cap.deliverables.map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
