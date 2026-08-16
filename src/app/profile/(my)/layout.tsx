import ProfileNav from '@/modules/profile/components/ProfileNav/ProfileNav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профиль',
  description: 'Просматривайте свои любимые и просмотренные фильмы, управляйте списками и следите за киноактивностью.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <ProfileNav profileHref="/profile" settingsHref="/profile/settings" />
      {children}
    </div>
  )
}
