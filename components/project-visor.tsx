import Image from 'next/image';

export interface ProjectMedia {
  type: 'video' | 'image';
  src: string;
  fallbackSrc?: string;
}

interface ProjectVisorProps {
  title: string;
  media: ProjectMedia;
}

export function ProjectVisor({ title, media }: ProjectVisorProps) {
  return (
    <div className="flex flex-col border border-[var(--border-subtle)] bg-[var(--bg-base)]">
      {/* Barra Tática Superior */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest truncate max-w-[60%]">
          {title}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--signal-state)] uppercase tracking-wider font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
          [LIVE PRODUCTION]
        </span>
      </div>

      {/* Área do Visor (16:9) */}
      <div className="relative w-full aspect-video bg-[var(--bg-base)] flex items-center justify-center overflow-hidden">
        {/* Textura de Grid Técnico */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
        
        {media.type === 'video' ? (
          <video
            src={media.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover z-10 grayscale opacity-90 contrast-125"
          >
            {media.fallbackSrc && <img src={media.fallbackSrc} alt={title} className="absolute inset-0 w-full h-full object-cover z-10 grayscale opacity-90 contrast-125" />}
          </video>
        ) : media.src ? (
          <Image 
            src={media.src}
            alt={`Preview do projeto ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover z-10 grayscale opacity-90 contrast-125"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
            {/* Fallback quando não há vídeo/imagem configurada */}
            <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] z-20 bg-[var(--bg-base)] px-2 py-1">
              [VISUAL_DATA_PENDING]
            </span>
          </div>
        )}
        
        {/* Linhas de corte (Crop Marks) decorativas estilo industrial */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[var(--border-subtle)] z-20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[var(--border-subtle)] z-20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[var(--border-subtle)] z-20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[var(--border-subtle)] z-20 pointer-events-none" />
      </div>
    </div>
  );
}
