interface HeroManifestoProps {
  dict: {
    tag: string;
    title: string;
    description: string;
    stack: string;
  };
}

export function HeroManifesto({ dict }: HeroManifestoProps) {
  return (
    <div className="flex flex-col justify-start py-6 md:py-12 space-y-6 w-full max-w-5xl">
      <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-[var(--accent-focus)] font-bold">
        {dict.tag}
      </div>
      
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[var(--text-primary)] leading-[0.92] whitespace-pre-line">
        {dict.title}
      </h1>
      
      <p className="font-sans text-[15px] md:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mt-2 font-normal">
        {dict.description}
      </p>

      <div className="pt-2 font-mono text-[10px] md:text-xs text-[var(--text-muted)] tracking-wider tabular-nums uppercase">
        {dict.stack}
      </div>
    </div>
  );
}
