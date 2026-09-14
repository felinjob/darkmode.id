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
    <div className="flex flex-col justify-start py-8 md:py-16 space-y-6 md:col-span-7 lg:col-span-8">
      <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
        {dict.tag}
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-[var(--text-primary)] leading-[0.95]">
        {dict.title}
      </h1>
      
      <p className="font-sans text-[15px] md:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mt-4">
        {dict.description}
      </p>

      <div className="pt-4 font-mono text-[10px] md:text-xs text-[var(--text-muted)] tracking-wider">
        {dict.stack}
      </div>
    </div>
  );
}
