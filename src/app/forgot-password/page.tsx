import type { Metadata } from 'next';
import { ForgotPasswordPage } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Восстановление пароля',
  description: 'Укажите электронную почту, чтобы получить ссылку для восстановления доступа к аккаунту MUVI.',
}

export default function Page() {
  return <ForgotPasswordPage />
}
