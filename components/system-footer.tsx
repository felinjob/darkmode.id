'use client';
import { usePathname } from 'next/navigation';

export function SystemFooter() {
  const pathname = usePathname();
  if (pathname.includes('/sandbox')) return null;

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-base)] py-8 px-4 md:px-8 lg:px-12 xl:px-16 mt-auto">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest text-center md:text-left flex flex-col gap-1 tabular-nums">
          <span>© {new Date().getFullYear()} darkmode.id // Felipe Teles. Todos os direitos reservados.</span>
          <span className="text-[10px] text-[var(--text-secondary)]">Information Design & Software Engineering // Direct Execution</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[10px] text-[var(--text-primary)] uppercase tracking-widest">
          <a 
            href="https://www.linkedin.com/in/felinjob/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-focus)] transition-colors"
          >
            LinkedIn ↗
          </a>
          <a 
            href="https://www.instagram.com/darkmode.id_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-focus)] transition-colors"
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
