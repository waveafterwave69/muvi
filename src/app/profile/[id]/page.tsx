import ProfilePage from '@/modules/profile/pages/ProfilePage/ProfilePage'
import { Metadata } from 'next'
import { FC } from 'react'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Профиль Пользователя',
  description: 'Просматривайте любимые и просмотренные фильмы другого пользователя',
}

const UserProfilePage: FC<UserProfilePageProps> = async ({ params }) => {
  const { id } = await params

  return <ProfilePage id={id} />
}

export default UserProfilePage
