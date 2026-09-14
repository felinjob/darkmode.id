export function CapabilitiesGrid({ dict }: { dict: any }) {
  return (
    <section id="capabilities" className="py-16 md:py-24">
      {/* Cabeçalho */}
      <header className="mb-10 md:mb-16 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold uppercase tracking-tight text-[var(--text-primary)]">
            {dict.title}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {dict.tag}
          </span>
        </div>
        <div className="w-full h-px bg-[var(--border-subtle)]" />
      </header>

      {/* Matriz 2x2 em Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
        {dict.categories.map((cap: any) => (
          <div 
            key={cap.index} 
            className="flex flex-col bg-[var(--bg-surface)] p-8 md:p-10 hover:bg-[var(--bg-elevated)] transition-colors"
          >
            {/* Indicador Numérico */}
            <div className="font-mono text-xs text-[var(--accent-focus)] mb-6">
              {cap.index} // 04
            </div>
            
            {/* Título e Lead */}
            <div className="flex flex-col space-y-3 mb-8">
              <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {cap.title}
              </h3>
              <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
                {cap.lead}
              </p>
            </div>

            {/* Lista de Entregáveis */}
            <ul className="mt-auto flex flex-col divide-y divide-[var(--border-subtle)]/50 border-t border-[var(--border-subtle)]/50">
              {cap.deliverables.map((item: any, idx: number) => (
                <li 
                  key={idx} 
                  className="py-3 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] flex items-start gap-2"
                >
                  <span className="text-[var(--text-secondary)]">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
