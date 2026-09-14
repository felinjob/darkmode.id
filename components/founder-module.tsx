import Image from 'next/image';

export function FounderModule() {
  return (
    <div className="flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] md:col-span-5 lg:col-span-4 mt-8 md:mt-16">
      {/* Barra Técnica Superior */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
        <span className="font-mono text-[11px] text-[var(--text-secondary)] tracking-widest uppercase">
          Lead Technologist
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--signal-state)] font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
          ACTIVE
        </span>
      </div>

      {/* Retrato / Fotografia */}
      <div className="relative w-full aspect-square md:aspect-[4/5] bg-[var(--bg-base)] flex items-center justify-center overflow-hidden">
        {/* Placeholder Fallback - Substituído quando houver a imagem real */}
        
        <Image 
          src="/founder_v2.jpg" 
          alt="Felipe Teles - Technical Director" 
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top"
        />
        
        {/* Camada de sombra pesada (Vignette) para reforçar o chiaroscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Rodapé Técnico */}
      <div className="flex flex-col p-4 border-t border-[var(--border-subtle)] space-y-2 relative z-20 bg-[var(--bg-surface)]">
        <div className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
          Felipe Teles // Technical Director
        </div>
        <p className="font-sans text-[13px] text-[var(--text-secondary)] leading-relaxed">
          Arquitetura de sistemas convergindo maturidade de design estrutural 
          com rigor absoluto de código em plataformas web.
        </p>
      </div>
    </div>
  );
}
