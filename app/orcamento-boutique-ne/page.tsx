import type { Metadata, Viewport } from 'next';
import { ProposalView } from '@/components/orcamento/proposal-view';

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Proposta Comercial & Especificação Técnica // Boutique Nê — darkmode.id',
  description: 'Desenvolvimento de Loja Virtual Própria & Painel Administrativo Sob Medida para a Boutique Nê. Technical Lead: Felipe Teles.',
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
    url: 'https://darkmode.id/orcamento-boutique-ne',
    title: 'Proposta Comercial & Especificação Técnica // Boutique Nê',
    description: 'Desenvolvimento de Loja Virtual Própria & Painel Administrativo Sob Medida. Technical Lead: Felipe Teles.',
    siteName: 'darkmode.id',
    images: [
      {
        url: '/boutique-ne-logo.jpg',
        width: 400,
        height: 400,
        alt: 'Boutique Nê — Proposta Comercial',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Proposta Comercial & Especificação Técnica // Boutique Nê',
    description: 'Desenvolvimento de Loja Virtual Própria & Painel Administrativo Sob Medida. Technical Lead: Felipe Teles.',
    images: ['/boutique-ne-logo.jpg'],
  },
};

export default function OrcamentoBoutiqueNePage() {
  return <ProposalView />;
}
