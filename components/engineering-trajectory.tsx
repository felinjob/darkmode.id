interface TrajectoryPillar {
  index: string;
  title: string;
  text: string;
}

interface EngineeringTrajectoryProps {
  dict: {
    tag: string;
    title: string;
    lead: string;
    body: string;
    pillars: TrajectoryPillar[];
  };
}

export function EngineeringTrajectory({ dict }: EngineeringTrajectoryProps) {
  return (
    <section
      id="trajectory"
      className="py-14 md:py-20 border-b border-[var(--border-subtle)] scroll-mt-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Coluna Esquerda: História real, sem exageros */}
        <div className="lg:col-span-6 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-focus)] block">
            {dict.tag}
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] leading-snug">
            {dict.title}
          </h2>

          <div className="space-y-3.5 font-sans text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed pt-1">
            <p className="text-[var(--text-primary)]">{dict.lead}</p>
            <p>{dict.body}</p>
          </div>
        </div>

        {/* Coluna Direita: 3 pontos práticos de como trabalho */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-3">
          {dict.pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
            >
              <span className="font-mono text-xs text-[var(--accent-focus)] font-bold tabular-nums shrink-0">
                {pillar.index}.
              </span>
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
                  {pillar.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
