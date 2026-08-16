import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MUVI — трекер фильмов для себя и двоих',
    short_name: 'MUVI',
    description:
      'Личный и совместный трекер фильмов: сохраняйте, отмечайте просмотренное и планируйте новые кинопросмотры.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080609',
    theme_color: '#ff4f9e',
    lang: 'ru',
    icons: [
      {
        src: '/brand/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/logo.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
