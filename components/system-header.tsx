'use client';

import { useState } from 'react';
import { DynamicLogo } from './dynamic-logo';

interface SystemHeaderProps {
  locale?: string;
}

export function SystemHeader({ locale = 'pt' }: SystemHeaderProps) {
  const [lightModeError, setLightModeError] = useState(false);

  const handleLightModeClick = () => {
    setLightModeError(true);
    setTimeout(() => setLightModeError(false), 3000);
  };

  const openContact = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-drawer', { detail: { cal: false } }));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md px-4 md:px-8 lg:px-12 xl:px-16 py-3">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        {/* Identidade */}
        <div className="flex items-center gap-3 md:gap-4">
          <DynamicLogo />
          <span className="hidden lg:inline-block font-mono text-[11px] text-[var(--text-muted)] border-l border-[var(--border-subtle)] pl-3 md:pl-4 select-none">
            Felipe Teles // Software &amp; Dados
          </span>
        </div>

        {/* Navegação Rápida Desktop */}
        <nav
          aria-label="Navegação Principal"
          className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
        >
          <a href="#works" className="hover:text-[var(--text-primary)] transition-colors">
            {locale === 'en' ? 'Projects' : 'Projetos'}
          </a>
          <a href="#trajectory" className="hover:text-[var(--text-primary)] transition-colors">
            {locale === 'en' ? 'About' : 'Sobre'}
          </a>
          <a href="#capabilities" className="hover:text-[var(--text-primary)] transition-colors">
            {locale === 'en' ? 'Stack' : 'Ferramentas'}
          </a>
          <a href="#lab" className="hover:text-[var(--text-primary)] transition-colors">
            {locale === 'en' ? 'Lab' : 'Lab'}
          </a>
        </nav>

        {/* Controles & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Botão Status / Contato Rápido */}
          <button
            type="button"
            onClick={openContact}
            className="hidden sm:inline-flex items-center gap-2 border border-[var(--border-subtle)] hover:border-[var(--accent-focus)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
            <span>{locale === 'en' ? 'Available // Contact' : 'Disponível // Contato'}</span>
          </button>

          <div className="flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] border-r border-[var(--border-subtle)] pr-2 mr-0.5">
              <a
                href="/pt"
                className={`transition-colors hover:text-[var(--text-primary)] ${
                  locale === 'pt' ? 'text-[var(--accent-focus)]' : ''
                }`}
                aria-current={locale === 'pt' ? 'page' : undefined}
              >
                PT
              </a>
              <span className="text-[var(--border-subtle)]">/</span>
              <a
                href="/en"
                className={`transition-colors hover:text-[var(--text-primary)] ${
                  locale === 'en' ? 'text-[var(--accent-focus)]' : ''
                }`}
                aria-current={locale === 'en' ? 'page' : undefined}
              >
                EN
              </a>
            </div>

            {/* Light Mode Easter Egg */}
            <button
              onClick={handleLightModeClick}
              className="flex items-center justify-center p-1 hover:bg-[var(--border-subtle)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] relative cursor-pointer"
              aria-label="Toggle Light Mode"
              title="System Theme"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>

              {lightModeError && (
                <span className="absolute right-0 top-8 whitespace-nowrap bg-red-600 text-white font-mono font-bold text-[10px] px-2 py-1 shadow-lg animate-pulse border border-red-500 z-50">
                  [ {locale === 'en' ? 'DARK MODE ONLY' : 'APENAS DARK MODE POR AQUI'} ]
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
