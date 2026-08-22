import { LogInPage } from '@/modules/auth/pages/LogInPage/LogInPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Войдите в MUVI и отслеживайте новинки, любимые и желаемые к просмотру фильмы',
}

const Page = () => {
  return <LogInPage />
}

export default Page
