import type { FC } from 'react'
import styles from './UserProfile.module.scss'
import { Card } from '@/shared/ui'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import { Profile } from '../../types/profileTypes'

interface UserProfileProps {
    profile: Profile | null
    isEditing: boolean
    displayUsername: string
    setDraftUsername: (val: string) => void
    avatarPreview: string | null
    setAvatarFile: (file: File | null) => void
    setAvatarPreview: (url: string | null) => void
    isLoading: boolean
}

const UserProfile: FC<UserProfileProps> = ({
    profile,
    isEditing,
    displayUsername,
    setDraftUsername,
    avatarPreview,
    setAvatarFile,
    setAvatarPreview,
    isLoading,
}) => {
    return (
        <>
            {profile && (
                <div>
                    <h2 className={styles.profile__title}>
                        Профиль {profile.user_metadata.username}
                    </h2>
                    <p className={`${styles.profile__subtitle} subtitle`}>
                        Профиль, история просмотров и оценки пользователя.
                    </p>
                    <Card>
                        <div className={styles.profile__content}>
                            <ProfileInfo
                                profile={profile}
                                isEditing={isEditing}
                                username={displayUsername}
                                setUsername={setDraftUsername}
                                avatarPreview={avatarPreview}
                                setAvatarFile={setAvatarFile}
                                setAvatarPreview={setAvatarPreview}
                                disabled={isLoading}
                            />
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}

export default UserProfile
