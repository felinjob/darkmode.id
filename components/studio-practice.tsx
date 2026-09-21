interface StudioPracticeProps {
  dict: any;
}

export function StudioPractice({ dict }: StudioPracticeProps) {
  if (!dict) return null;

  return (
    <section id="practice" className="py-12 md:py-16 border-b border-[var(--border-subtle)] w-full">
      {/* Cabeçalho Enxuto */}
      <header className="mb-8 md:mb-12 flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {dict.title || 'STUDIO // PRACTICE'}
          </h2>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-focus)] font-bold">
            {dict.tag || '[ INDEPENDENT PRACTICE ]'}
          </span>
        </div>
        <div className="w-full h-px bg-[var(--border-subtle)]" />
      </header>

      {/* Dois Blocos Compactos: The Practice & Leadership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)] mb-10 md:mb-12">
        {/* The Practice */}
        <div className="bg-[var(--bg-surface)] p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
            <span className="text-[var(--accent-focus)]">01</span>
            <span>// THE PRACTICE</span>
          </div>
          <p className="font-sans text-sm md:text-[15px] text-[var(--text-primary)] leading-relaxed font-medium">
            {dict.practiceText}
          </p>
        </div>

        {/* Leadership */}
        <div className="bg-[var(--bg-surface)] p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent-focus)]">02</span>
              <span>// LEADERSHIP</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[var(--signal-state)] font-semibold text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
              ACTIVE
            </span>
          </div>
          <p className="font-sans text-sm md:text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {dict.leadershipText}
          </p>
        </div>
      </div>

      {/* Princípios Operacionais (1 Frase Cada) */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
          {dict.principlesTitle || '// PRINCÍPIOS OPERACIONAIS'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
          {dict.principles?.map((principle: any) => (
            <div 
              key={principle.index} 
              className="bg-[var(--bg-surface)] p-5 flex flex-col justify-between space-y-3 hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-[var(--accent-focus)] font-bold tabular-nums">
                <span>{principle.index} // 04</span>
                <span className="text-[var(--text-muted)] font-normal text-[9px]">[STRICT]</span>
              </div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight text-[var(--text-primary)] leading-tight">
                {principle.title}
              </h4>
              <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]/50 pt-2.5">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
