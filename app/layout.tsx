import type { Metadata, Viewport } from 'next';
import { Syne, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SystemFooter } from '@/components/system-footer';
import { BottomDock } from '@/components/bottom-dock';
import { FilmGrain } from '@/components/film-grain';

const fontDisplay = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['700', '800'],
  display: 'swap',
});

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500'],
  display: 'swap',
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Felipe Teles // darkmode.id — Software Engineering, Data & Product Systems',
  description:
    'Engenheiro de Software e Cientista de Dados. Desenvolvimento de sistemas operacionais de manufatura (MES), plataformas full-stack de alta conversão, pipelines analíticos em Python e modelos de Machine Learning.',
  metadataBase: new URL('https://darkmode.id'),
  keywords: [
    'Felipe Teles',
    'Software Engineering',
    'Data Science',
    'Product Systems',
    'MES Industrial',
    'Next.js',
    'Python',
    'Machine Learning',
    'PyTorch',
    'RPA',
    'Full-Stack Engineer',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://darkmode.id',
    title: 'Felipe Teles // darkmode.id — Software Engineering, Data & Product Systems',
    description:
      'Aplicações full-stack, pipelines de dados e automações que tiram operações críticas do papel e escalam negócios.',
    siteName: 'darkmode.id',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Felipe Teles // darkmode.id — Software Engineering, Data & Product Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Felipe Teles // darkmode.id — Software Engineering, Data & Product Systems',
    description:
      'Aplicações full-stack, pipelines de dados e automações que tiram operações críticas do papel e escalam negócios.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="font-sans antialiased bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen">
        {/* Contêiner Fluido Responsivo */}
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col border-x border-[var(--border-subtle)] bg-[var(--bg-base)] pb-28 md:pb-32">
          {children}
          <SystemFooter />
        </div>

        {/* Navegação Rápida Inferior & Grão Óptico */}
        <BottomDock />
        <FilmGrain />
      </body>
    </html>
  );
}
