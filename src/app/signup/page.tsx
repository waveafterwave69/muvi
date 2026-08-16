import { SignupPage } from '@/modules/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт MUVI, чтобы сохранять фильмы, вести личные списки и планировать совместные просмотры.',
}

export default function Page() {
  return <SignupPage />
}
