import type { FC } from 'react'
import { Profile } from '../../types/profileTypes'
import ProfileCard from '../ProfileCard/ProfileCard'

interface UserProfileProps {
  profile: Profile
}

const UserProfile: FC<UserProfileProps> = ({ profile }) => {
  const username = profile?.user_metadata?.username || (profile as any)?.username || 'Пользователь'

  return (
    <ProfileCard
      title={`Профиль ${username}`}
      subtitle="Профиль, история просмотров и оценки пользователя."
      profile={profile}
      username={username}
      isEditing={false}
    />
  )
}

export default UserProfile
