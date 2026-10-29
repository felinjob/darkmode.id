import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const privateNoIndexHeaders = [
  {
    key: 'X-Robots-Tag',
    value: 'noindex, nofollow, noarchive, nosnippet',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Cabeçalhos de segurança globais em todas as rotas
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Propostas comerciais privadas e PDFs: bloquear indexação por crawlers
        source: '/proposta-boutique-ne.pdf',
        headers: privateNoIndexHeaders,
      },
      {
        source: '/proposta-aw-bikes.pdf',
        headers: privateNoIndexHeaders,
      },
      {
        source: '/orcamento-boutique-ne',
        headers: privateNoIndexHeaders,
      },
      {
        source: '/orcamento-aw-bikes',
        headers: privateNoIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
