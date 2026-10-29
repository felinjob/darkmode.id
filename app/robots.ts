import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/orcamento-boutique-ne',
        '/*/orcamento-boutique-ne',
        '/proposta-boutique-ne.pdf',
        '/orcamento-aw-bikes',
        '/*/orcamento-aw-bikes',
        '/proposta-aw-bikes.pdf',
      ],
    },
    sitemap: 'https://darkmode.id/sitemap.xml',
  };
}
