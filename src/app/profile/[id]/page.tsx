'use client'

import { useParams } from 'next/navigation'
import ProfilePage from '@/modules/profile/pages/ProfilePage/ProfilePage'

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>()

  return <ProfilePage id={id} />
}

export default UserProfilePage
