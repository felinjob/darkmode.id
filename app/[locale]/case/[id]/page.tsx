import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDictionary } from '@/lib/dictionaries';

interface CaseStudyProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const ALLOWED_LOCALES = new Set(['pt', 'en']);
const ALLOWED_CASES = new Set(['case-01', 'case-02', 'case-03']);

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];

  for (const locale of ALLOWED_LOCALES) {
    for (const id of ALLOWED_CASES) {
      params.push({ locale, id });
    }
  }

  return params;
}

export default async function CaseStudy({ params }: CaseStudyProps) {
  const { locale, id } = await params;

  // Validação estrita contra Path Traversal (CWE-22) antes de acessar o sistema de arquivos
  if (!ALLOWED_LOCALES.has(locale) || !ALLOWED_CASES.has(id)) {
    notFound();
  }

  const casesBaseDir = path.resolve(process.cwd(), 'content', 'cases');
  const filePath = path.resolve(casesBaseDir, locale, `${id}.md`);

  if (!filePath.startsWith(casesBaseDir + path.sep)) {
    notFound();
  }

  let markdownContent = '';
  try {
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } catch {
    notFound();
  }

  const dict = await getDictionary(locale);
  const cases = dict.works?.cases || [];
  const currentIndex = cases.findIndex((c: any) => c.id === id);
  const currentCase = currentIndex >= 0 ? cases[currentIndex] : null;
  const nextCase =
    cases.length > 0 ? cases[(currentIndex + 1) % cases.length] : null;

  // Link para testar o sistema / abrir o site em produção (segunda ação do card)
  const liveAction = currentCase?.actions?.find((a: any) => !a.isPrimary) || currentCase?.actions?.[1];
  const isLiveExternal = liveAction?.url?.startsWith('http');

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative">
      {/* Barra Superior Fixa */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md px-4 md:px-8 lg:px-12 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}#works`}
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
            >
              <span>←</span>
              <span>{locale === 'en' ? 'Back to projects' : 'Voltar aos projetos'}</span>
            </Link>
            {currentCase && (
              <>
                <span className="text-[var(--border-strong)] hidden sm:inline">/</span>
                <span className="font-mono text-xs text-[var(--accent-focus)] font-bold hidden sm:inline tabular-nums">
                  {currentCase.index} / 03
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)] hidden md:inline truncate max-w-xs">
                  {currentCase.title.split('—')[0].trim()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {liveAction && (
              <Link
                href={liveAction.url}
                target={isLiveExternal ? '_blank' : undefined}
                rel={isLiveExternal ? 'noopener noreferrer' : undefined}
                className="font-mono text-[11px] uppercase tracking-wider text-white bg-[var(--accent-focus)] hover:brightness-110 transition-all px-3.5 py-1.5 font-bold"
              >
                {liveAction.label}
              </Link>
            )}
            <Link
              href={`/${locale}#works`}
              className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] transition-colors px-3 py-1.5"
            >
              {locale === 'en' ? 'Close ✕' : 'Fechar ✕'}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16 space-y-10">
        {/* Painel de Contexto do Projeto (Imagem + Resultados + Stack) */}
        {currentCase && (
          <section className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="px-5 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-focus)] font-bold tabular-nums">
                  {locale === 'en' ? 'PROJECT' : 'PROJETO'} {currentCase.index} / 03
                </span>
                <span className="text-[var(--border-strong)]">•</span>
                <span className="text-[var(--text-secondary)]">{currentCase.category}</span>
              </div>
              {currentCase.location && (
                <span className="text-[var(--text-muted)]">{currentCase.location}</span>
              )}
            </div>

            {currentCase.media?.src && (
              <div className="relative w-full aspect-video md:aspect-[21/9] border-b border-[var(--border-subtle)] bg-[var(--bg-base)] overflow-hidden">
                <Image
                  src={currentCase.media.src}
                  alt={currentCase.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  quality={90}
                />
              </div>
            )}

            {/* Faixa de Métricas */}
            {currentCase.metrics && currentCase.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x divide-[var(--border-subtle)] border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/40">
                {currentCase.metrics.map((metric: any, idx: number) => (
                  <div key={idx} className="p-4 flex flex-col justify-center">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                      {metric.value}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stack e Resumo Rápido */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-surface)]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mr-1">
                  Stack:
                </span>
                {currentCase.architecture?.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {liveAction && (
                <Link
                  href={liveAction.url}
                  target={isLiveExternal ? '_blank' : undefined}
                  rel={isLiveExternal ? 'noopener noreferrer' : undefined}
                  className="font-mono text-xs text-[var(--accent-focus)] hover:underline underline-offset-4 font-semibold"
                >
                  {liveAction.label}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Corpo do Estudo */}
        <article className="prose prose-invert prose-p:font-sans prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[var(--text-primary)] prose-headings:tracking-tight prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:border-b prose-h2:border-[var(--border-subtle)] prose-h2:pb-2 prose-a:text-[var(--accent-focus)] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[var(--bg-surface)] prose-pre:border prose-pre:border-[var(--border-subtle)] prose-pre:leading-snug prose-blockquote:border-l-[var(--accent-focus)] prose-blockquote:bg-[var(--bg-surface)] prose-blockquote:py-1 prose-blockquote:pr-4 prose-hr:border-[var(--border-subtle)] prose-li:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-th:font-mono prose-th:text-xs prose-th:uppercase prose-th:text-[var(--text-primary)] prose-td:text-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
        </article>

        {/* Bloco Final: Próximo Estudo & Ações */}
        <footer className="border border-[var(--border-strong)] bg-[var(--bg-surface)] relative overflow-hidden">
          <div className="h-1 w-full led-border-flow" />

          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--signal-state)] font-semibold block">
                {locale === 'en' ? '// CONTINUE READING' : '// PRÓXIMO PROJETO'}
              </span>
              {nextCase ? (
                <>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                    {nextCase.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
                    {nextCase.summary}
                  </p>
                </>
              ) : (
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  {locale === 'en' ? 'Back to main portfolio' : 'Voltar para a página principal'}
                </h3>
              )}
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              {nextCase && (
                <Link
                  href={`/${locale}/case/${nextCase.id}`}
                  className="min-h-[44px] px-5 py-2.5 bg-[var(--accent-focus)] text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center text-center"
                >
                  {locale === 'en'
                    ? `Read Project ${nextCase.index} ↗`
                    : `Ler Projeto ${nextCase.index} ↗`}
                </Link>
              )}

              <Link
                href={`/${locale}#works`}
                className="min-h-[44px] px-5 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] hover:border-[var(--accent-focus)] text-[var(--text-primary)] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center text-center"
              >
                {locale === 'en' ? '← All Projects' : '← Ver todos os projetos'}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
