'use client';

import { useState } from 'react';
import { ActionDrawer } from './action-drawer';

export function BottomDock() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max bg-[var(--bg-elevated)]/40 backdrop-blur-xl border border-[var(--border-subtle)]/60 flex items-center justify-between p-1 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        aria-label="Navegação Tátil Inferior"
      >
        <div className="flex items-center space-x-1 px-2">
          <button 
            onClick={() => scrollTo('works')}
            className="px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors"
          >
            Works
          </button>
          <button 
            onClick={() => scrollTo('lab')}
            className="px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors"
          >
            Lab
          </button>
          <button 
            onClick={() => scrollTo('capabilities')}
            className="px-4 h-[40px] flex items-center justify-center font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] hover:bg-white/5 rounded-full transition-colors"
          >
            Cap
          </button>
        </div>
        
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="h-[40px] px-6 flex items-center justify-center bg-[var(--accent-focus)] text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors hover:brightness-110 active:brightness-90 shrink-0"
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
