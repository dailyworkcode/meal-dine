import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DailyDine',
    short_name: 'DailyDine',
    description: 'Get daily Indian meal suggestions based on your preferences.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5DC',
    theme_color: '#FF8C00',
    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
