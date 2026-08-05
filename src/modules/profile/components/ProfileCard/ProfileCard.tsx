import type { FC, ReactNode } from 'react'
import styles from './ProfileCard.module.scss' // Объединяем стили контента сюда
import { Card } from '@/shared/ui'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import { Profile } from '../../types/profileTypes'

interface ProfileCardProps {
  title: string
  subtitle: string
  profile: Profile
  username: string
  isEditing?: boolean
  avatarPreview?: string | null
  setDraftUsername?: (val: string) => void
  setAvatarFile?: (file: File | null) => void
  setAvatarPreview?: (url: string | null) => void
  isLoading?: boolean
  actions?: ReactNode
}

const ProfileCard: FC<ProfileCardProps> = ({
  title,
  subtitle,
  profile,
  username,
  isEditing = false,
  avatarPreview = null,
  setDraftUsername = () => {},
  setAvatarFile = () => {},
  setAvatarPreview = () => {},
  isLoading = false,
  actions,
}) => {
  return (
    <div>
      <h2 className={styles.profile__title}>{title}</h2>
      <p className={`${styles.profile__subtitle} subtitle`}>{subtitle}</p>
      <Card>
        <div className={styles.profile__content}>
          <ProfileInfo
            profile={profile}
            isEditing={isEditing}
            username={username}
            setUsername={setDraftUsername}
            avatarPreview={avatarPreview}
            setAvatarFile={setAvatarFile}
            setAvatarPreview={setAvatarPreview}
            disabled={isLoading}
          />
          {actions && <div className={styles.profile__buttons}>{actions}</div>}
        </div>
      </Card>
    </div>
  )
}

export default ProfileCard
