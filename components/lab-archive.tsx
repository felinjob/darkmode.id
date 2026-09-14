import { LabExperimentStatus } from '@/data/lab';

function getStatusColor(status: LabExperimentStatus) {
  if (status === 'ALPHA' || status === 'IN BUILD') return 'text-[var(--accent-focus)]';
  return 'text-[var(--signal-state)]';
}

export function LabArchive({ dict }: { dict: any }) {
  return (
    <section id="lab" className="py-16 md:py-24">
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

      {/* Visão Mobile (Cartões) */}
      <div className="flex flex-col gap-4 md:hidden">
        {dict.experiments.map((exp: any) => (
          <div key={exp.id} className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="text-[var(--text-muted)]">{exp.id}</span>
              <span className={`font-medium ${getStatusColor(exp.status)}`}>[{exp.status}]</span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] tracking-tight">
                {exp.title}
              </h3>
              <p className="font-sans text-xs text-[var(--text-secondary)] mt-1">
                {exp.description}
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border-subtle)]/50 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                {exp.scope}
              </span>
              <a 
                href={exp.targetUrl || '#'} 
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] h-[48px] flex items-center px-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              >
                Acessar ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Visão Desktop (Tabela de Terminal) */}
      <div className="hidden md:flex flex-col border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          <div className="col-span-1">{dict.table.id}</div>
          <div className="col-span-3">{dict.table.experiment}</div>
          <div className="col-span-4">{dict.table.scope}</div>
          <div className="col-span-2">{dict.table.status}</div>
          <div className="col-span-2 text-right">ACESSO</div>
        </div>

        {/* Linhas da Tabela */}
        <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
          {dict.experiments.map((exp: any) => (
            <div 
              key={exp.id} 
              className="grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-[var(--bg-elevated)] group"
            >
              <div className="col-span-1 font-mono text-[11px] text-[var(--text-muted)]">
                {exp.id}
              </div>
              <div className="col-span-3 flex flex-col pr-4">
                <span className="font-sans text-sm font-semibold text-[var(--text-primary)]">
                  {exp.title}
                </span>
              </div>
              <div className="col-span-4 flex flex-col pr-4">
                <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase">
                  {exp.scope}
                </span>
                <span className="font-sans text-xs text-[var(--text-muted)] mt-0.5 truncate">
                  {exp.description}
                </span>
              </div>
              <div className="col-span-2 font-mono text-[11px] uppercase font-medium">
                <span className={`${getStatusColor(exp.status)}`}>[{exp.status}]</span>
              </div>
              <div className="col-span-2 text-right">
                <a 
                  href={exp.targetUrl || '#'}
                  className="inline-flex items-center font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]"
                >
                  ACESSAR ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
