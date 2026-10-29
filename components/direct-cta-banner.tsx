'use client';

interface DirectCtaBannerProps {
  dict: {
    tag: string;
    title: string;
    description: string;
    primaryButton: string;
    scheduleButton: string;
    whatsappButton: string;
  };
}

export function DirectCtaBanner({ dict }: DirectCtaBannerProps) {
  const triggerDrawer = (cal = false) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-drawer', { detail: { cal } }));
    }
  };

  return (
    <section className="py-14 md:py-20">
      <div className="border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 sm:p-10 md:p-12 relative overflow-hidden">
        {/* Caminho superior de LED animado (Laranja -> Verde -> Transparente caminhando suavemente) */}
        <div className="absolute top-0 left-0 right-0 h-1 led-border-flow z-10" />
        <div className="absolute top-0 left-0 right-0 h-2.5 led-border-glow pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--signal-state)] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[var(--signal-state)] animate-pulse" />
              <span>{dict.tag}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              {dict.title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {dict.description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => triggerDrawer(false)}
              className="w-full min-h-[48px] px-5 py-3 bg-[var(--accent-focus)] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_24px_rgba(255,85,0,0.22)] cursor-pointer"
            >
              {dict.primaryButton}
            </button>

            <button
              type="button"
              onClick={() => triggerDrawer(true)}
              className="w-full min-h-[46px] px-5 py-3 bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--accent-focus)] text-[var(--text-primary)] font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {dict.scheduleButton}
            </button>

            <a
              href="https://wa.me/5521975659408?text=Ol%C3%A1%20Felipe%2C%20vi%20seu%20site%20no%20darkmode.id%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] px-5 py-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--signal-state)] text-[var(--text-secondary)] hover:text-[var(--signal-state)] font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center transition-colors"
            >
              {dict.whatsappButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
