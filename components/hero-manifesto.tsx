'use client';

interface HeroHighlight {
  value: string;
  label: string;
}

interface HeroManifestoProps {
  dict: {
    tag: string;
    title: string;
    description: string;
    stack: string;
    primaryCta?: string;
    secondaryCta?: string;
    scheduleCta?: string;
    highlights?: HeroHighlight[];
  };
}

export function HeroManifesto({ dict }: HeroManifestoProps) {
  const triggerContactDrawer = (cal = false) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-drawer', { detail: { cal } }));
    }
  };

  return (
    <div className="flex flex-col justify-between py-2 md:py-6 space-y-8 md:col-span-7 lg:col-span-8">
      <div className="space-y-6">
        {/* Kicker Simples */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-fit">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-focus)]" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-primary)] font-semibold">
            {dict.tag}
          </span>
        </div>

        {/* Headline Principal — Forte, humana e direta */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.04] whitespace-pre-line">
          {dict.title}
        </h1>

        {/* Sub-headline Concisa */}
        <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-normal">
          {dict.description}
        </p>

        {/* CTAs Diretos */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => triggerContactDrawer(false)}
            className="min-h-[48px] px-6 py-3 bg-[var(--accent-focus)] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:brightness-95 transition-all shadow-[0_0_24px_rgba(255,85,0,0.22)] cursor-pointer"
          >
            {dict.primaryCta || 'Conversar sobre um projeto ↗'}
          </button>

          <a
            href="#works"
            className="min-h-[48px] px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent-focus)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider flex items-center transition-colors"
          >
            {dict.secondaryCta || 'Ver projetos ↓'}
          </a>
        </div>
      </div>

      {/* Rodapé limpo do Hero: Links diretos + Resumo de foco */}
      <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
          {dict.stack}
        </div>

        <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          <a
            href="https://github.com/felinjob"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-focus)] transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/felinjob/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-focus)] transition-colors"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}
