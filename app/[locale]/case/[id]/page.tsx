import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface CaseStudyProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const cases = ['case-01', 'case-02', 'case-03'];
  const locales = ['pt', 'en'];
  
  const params: { locale: string; id: string }[] = [];
  
  for (const locale of locales) {
    for (const id of cases) {
      params.push({ locale, id });
    }
  }
  
  return params;
}

export default async function CaseStudy({ params }: CaseStudyProps) {
  const { locale, id } = await params;
  
  // Build the file path
  const filePath = path.join(process.cwd(), 'content', 'cases', locale, `${id}.md`);
  
  let markdownContent = '';
  try {
    markdownContent = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative">
      {/* Navbar / Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 md:p-6 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          // CASE STUDY: {id}
        </div>
        <Link 
          href={`/${locale}#works`}
          className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] bg-[var(--bg-elevated)] transition-colors px-4 py-2 focus:outline-none"
        >
          FECHAR ✕
        </Link>
      </header>

      {/* Content Area */}
      <article className="container mx-auto px-4 md:px-8 py-12 md:py-24 max-w-4xl">
        <div className="prose prose-invert prose-p:font-sans prose-p:text-[var(--text-secondary)] prose-headings:font-display prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-focus)] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[var(--bg-surface)] prose-pre:border prose-pre:border-[var(--border-subtle)] prose-pre:leading-tight prose-blockquote:border-l-[var(--accent-focus)] prose-blockquote:bg-[var(--bg-surface)] prose-blockquote:py-1 prose-blockquote:pr-4 prose-hr:border-[var(--border-subtle)] prose-li:text-[var(--text-secondary)] max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </article>
      
      {/* Bottom CTA */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12">
        <div className="container mx-auto px-4 text-center flex flex-col items-center gap-6">
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
            [ END OF REPORT ]
          </div>
          <Link 
            href={`/${locale}#works`}
            className="inline-flex font-mono text-xs uppercase tracking-widest text-black bg-[var(--accent-focus)] hover:brightness-110 transition-colors px-8 py-4 focus:outline-none font-bold"
          >
            VOLTAR AO PORTFÓLIO
          </Link>
        </div>
      </footer>
    </main>
  );
}
