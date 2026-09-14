import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'darkmode.id',
    short_name: 'darkmode',
    description: 'Creative Technology & Software Engineering Studio',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0B0D',
    theme_color: '#0A0B0D',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
