import type { Metadata, Viewport } from 'next';
import { AwBikesProposalView } from '@/components/orcamento/aw-bikes-proposal-view';

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Proposta Comercial & Especificação Técnica // AW Bikes — darkmode.id',
  description:
    'Desenvolvimento de Landing Page de Alta Conversão — Venda de Bicicletas Elétricas & Assistência Técnica para a AW Bikes. Technical Lead: Felipe Teles.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://darkmode.id/orcamento-aw-bikes',
    title: 'Proposta Comercial & Especificação Técnica // AW Bikes',
    description:
      'Desenvolvimento de Landing Page de Alta Conversão — Venda de Bicicletas Elétricas & Assistência Técnica. Technical Lead: Felipe Teles.',
    siteName: 'darkmode.id',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proposta Comercial & Especificação Técnica // AW Bikes',
    description:
      'Desenvolvimento de Landing Page de Alta Conversão — Venda de Bicicletas Elétricas & Assistência Técnica. Technical Lead: Felipe Teles.',
  },
};

export default function OrcamentoAwBikesPage() {
  return <AwBikesProposalView />;
}

