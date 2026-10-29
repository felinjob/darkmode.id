'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ActionDrawer } from './action-drawer';

export function BottomDock() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialShowCal, setInitialShowCal] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSandbox(pathname?.includes('/sandbox') || pathname?.includes('/orcamento') || false);
  }, [pathname]);

  useEffect(() => {
    const handleOpenDrawer = (event: Event) => {
      const customEvent = event as CustomEvent<{ cal?: boolean }>;
      setInitialShowCal(Boolean(customEvent.detail?.cal));
      setIsDrawerOpen(true);
    };

    window.addEventListener('open-contact-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-contact-drawer', handleOpenDrawer);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isSandbox) return null;

  return (
    <>
      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-max bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-strong)] flex items-center justify-between p-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
        aria-label="Navegação Rápida Inferior"
      >
        <div className="flex items-center space-x-0.5 sm:space-x-1 px-1.5">
          <button
            onClick={() => scrollTo('works')}
            className="px-3 md:px-4 h-[38px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            Projetos
          </button>
          <button
            onClick={() => scrollTo('trajectory')}
            className="px-3 md:px-4 h-[38px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            Sobre
          </button>
          <button
            onClick={() => scrollTo('capabilities')}
            className="px-3 md:px-4 h-[38px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            Stack
          </button>
          <button
            onClick={() => scrollTo('lab')}
            className="px-3 md:px-4 h-[38px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            Lab
          </button>
        </div>

        <button
          onClick={() => {
            setInitialShowCal(false);
            setIsDrawerOpen(true);
          }}
          className="h-[38px] px-5 sm:px-6 flex items-center justify-center bg-[var(--accent-focus)] text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-full transition-all hover:brightness-110 active:brightness-90 shrink-0 shadow-[0_0_18px_rgba(255,85,0,0.3)] cursor-pointer"
        >
          Contato
        </button>
      </nav>

      <ActionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialShowCal={initialShowCal}
      />
    </>
  );
}
