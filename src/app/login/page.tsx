import { LogInPage } from '@/modules/auth/pages/LogInPage/LogInPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Войди в muvi и следи за своими просмотрами',
}

const Page = () => {
  return <LogInPage />
}

export default Page
