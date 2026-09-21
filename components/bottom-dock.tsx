'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ActionDrawer } from './action-drawer';

export function BottomDock() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSandbox(pathname?.includes('/sandbox') || false);
  }, [pathname]);

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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max bg-[var(--bg-elevated)]/40 backdrop-blur-xl border border-[var(--border-subtle)]/60 flex items-center justify-between p-1 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        aria-label="Navegação Tátil Inferior"
      >
        <div className="flex items-center space-x-1 px-2">
          <button 
            onClick={() => scrollTo('practice')}
            className="px-3 md:px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-2xl transition-colors"
          >
            Practice
          </button>
          <button 
            onClick={() => scrollTo('works')}
            className="px-3 md:px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-2xl transition-colors"
          >
            Works
          </button>
          <button 
            onClick={() => scrollTo('capabilities')}
            className="px-3 md:px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-2xl transition-colors"
          >
            Cap
          </button>
          <button 
            onClick={() => scrollTo('lab')}
            className="px-3 md:px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-2xl transition-colors"
          >
            Lab
          </button>
        </div>
        
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="h-[40px] px-6 flex items-center justify-center bg-[#FF5712] text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-3xl transition-colors hover:brightness-110 active:brightness-90 shrink-0 shadow-[0_0_15px_rgba(255,87,18,0.3)]"
        >
          Contato
        </button>
      </nav>

      <ActionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
}
