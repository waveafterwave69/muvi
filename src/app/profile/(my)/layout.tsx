import ProfileNav from '@/modules/profile/components/ProfileNav/ProfileNav'

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
