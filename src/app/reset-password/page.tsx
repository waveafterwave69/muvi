import { ResetPasswordPage } from '@/modules/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Смена пароля',
  description: 'Придумай новый пароль для своего MUVI',
}

export default function Page() {
  return <ResetPasswordPage />
}
