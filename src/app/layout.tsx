import type { Metadata, Viewport } from 'next'
import '@/app/styles/index.scss'

import { Roboto } from 'next/font/google'
import { Providers } from '@/app/providers/queryProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { Dock } from '@/widgets'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const title = 'MUVI — трекер фильмов для себя и двоих'
const description =
  'Сохраняйте фильмы, отмечайте просмотренное, собирайте избранное и планируйте кинопросмотры — самостоятельно или вдвоём.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | MUVI',
  },
  description,
  applicationName: 'MUVI',
  keywords: [
    'трекер фильмов',
    'список фильмов',
    'совместный просмотр',
    'фильмы для двоих',
    'избранные фильмы',
    'дневник кино',
  ],
  category: 'entertainment',
  creator: 'MUVI',
  publisher: 'MUVI',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/brand/logo.png', type: 'image/png', sizes: '1024x1024' }],
    shortcut: '/brand/logo.png',
    apple: [{ url: '/brand/logo.png', type: 'image/png', sizes: '1024x1024' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'MUVI',
    title,
    description,
    images: [
      {
        url: '/brand/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Логотип MUVI',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/brand/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#080609' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${roboto.variable}`}>
      <body>
        <ThemeProvider>
          <Providers>
            <div className="container">{children}</div>
            <Dock />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
