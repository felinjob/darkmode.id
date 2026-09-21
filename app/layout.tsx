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
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'darkmode.id // Information Design & Software Engineering',
  description: 'Prática técnica independente de engenharia de software e design da informação. Interfaces táteis de baixa latência, arquitetura de dados e sistemas de alto desempenho.',
  metadataBase: new URL('https://darkmode.id'),
  keywords: [
    'Information Design',
    'Software Engineering',
    'Complex Systems',
    'MES Industrial',
    'Next.js',
    'Tactile Interfaces',
    'Data Architecture',
    'OLED Ergonomics',
    'Felipe Teles',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://darkmode.id',
    title: 'darkmode.id // Information Design & Software Engineering',
    description: 'Prática técnica independente de engenharia de software e design da informação. Interfaces táteis de baixa latência, arquitetura de dados e sistemas de alto desempenho.',
    siteName: 'darkmode.id',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'darkmode.id // Information Design & Software Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'darkmode.id // Information Design & Software Engineering',
    description: 'Prática técnica independente de engenharia de software e design da informação. Interfaces táteis de baixa latência, arquitetura de dados e sistemas de alto desempenho.',
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
        
        {/* Sprint 06: Ergonomia Tátil */}
        <BottomDock />
        <FilmGrain />
      </body>
    </html>
  );
}
