export function SystemFooter() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-base)] py-8 px-4 md:px-8 lg:px-12 xl:px-16 mt-auto">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} Felipe Teles. Todos os direitos reservados.
        </div>
        <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center md:text-right">
          Desenvolvido por Felipe Teles // Code & Design
        </div>
      </div>
    </footer>
  );
}
