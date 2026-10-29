import Image from 'next/image';

interface FounderModuleProps {
  dict: {
    role: string;
    status: string;
    name: string;
    subtitle?: string;
    description?: string;
    coreStack?: string[];
  };
}

export function FounderModule({ dict }: FounderModuleProps) {
  return (
    <aside className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] md:col-span-5 lg:col-span-4 self-start">
      {/* Barra Superior */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60">
        <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-widest uppercase">
          {dict.role}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--signal-state)] font-semibold uppercase tracking-wider">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
          {dict.status}
        </span>
      </div>

      {/* Retrato — object-[50%_85%] corta a parede vazia do topo e sobe o rosto no enquadramento */}
      <div className="relative w-full aspect-[4/5] bg-[var(--bg-base)] overflow-hidden">
        <Image
          src="/founder_v2.jpg"
          alt="Felipe Teles — Engenheiro de Software e Dados"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 42vw, 32vw"
          className="object-cover object-[50%_85%]"
          quality={90}
        />

        {/* Vinheta sutil apenas para integrar com as bordas escuras */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/60 via-transparent to-transparent pointer-events-none" />

        {/* Marcadores discretos de viewfinder */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-white/20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-white/20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-white/20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-white/20 pointer-events-none" />
      </div>

      {/* Identificação limpa abaixo da foto (sem texto cobrindo o queixo) */}
      <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight leading-none">
              {dict.name}
            </div>
            {dict.subtitle && (
              <div className="font-mono text-[11px] text-[var(--text-secondary)] mt-1">
                {dict.subtitle}
              </div>
            )}
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)]">
            RJ // BR
          </span>
        </div>

        {dict.coreStack && dict.coreStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]/60">
            {dict.coreStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
