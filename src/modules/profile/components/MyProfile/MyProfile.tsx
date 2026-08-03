import type { FC } from 'react'
import styles from './MyProfile.module.scss'
import { Button, Card } from '@/shared/ui'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import { Check, LogOut, Pencil, X } from 'lucide-react'
import { logOut } from '../../slices/profileSlice'
import { Profile } from '../../types/profileTypes'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { AppDispatch } from '@/app/store/store'

interface MyProfileProps {
    profile: Profile
    isEditing: boolean
    setIsEditing: (val: boolean) => void
    draftUsername: string
    setDraftUsername: (val: string) => void
    displayUsername: string
    isLoading: boolean
    setIsLoading: (val: boolean) => void
    avatarFile: File | null
    setAvatarFile: (file: File | null) => void
    avatarPreview: string | null
    setAvatarPreview: (url: string | null) => void
    handleUpdateProfile: (
        username: string,
        avatarUrl?: string,
    ) => Promise<{ error: Error | null; user: Profile | null }>
    handleUploadAvatar: (
        file: File,
        userId: string,
    ) => Promise<{ error: Error | null; publicUrl: string | null }>
    dispatch: AppDispatch
    router: AppRouterInstance
}

const MyProfile: FC<MyProfileProps> = ({
    profile,
    isEditing,
    setIsEditing,
    draftUsername,
    setDraftUsername,
    displayUsername,
    isLoading,
    setIsLoading,
    avatarFile,
    setAvatarFile,
    avatarPreview,
    setAvatarPreview,
    handleUpdateProfile,
    handleUploadAvatar,
    dispatch,
    router,
}) => {
    const handleCancel = () => {
        setIsEditing(false)
        setDraftUsername('')
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    const onSave = async () => {
        if (!draftUsername.trim() || !profile) return

        setIsLoading(true)
        let finalAvatarUrl = profile.user_metadata.avatar_url

        if (avatarFile) {
            const { error: uploadError, publicUrl } = await handleUploadAvatar(
                avatarFile,
                profile.id,
            )

            if (uploadError) {
                alert('Ошибка при загрузке аватара: ' + uploadError.message)
                setIsLoading(false)
                return
            }

            if (publicUrl) {
                finalAvatarUrl = publicUrl
            }
        }

        const { error: updateError } = await handleUpdateProfile(
            draftUsername.trim(),
            finalAvatarUrl,
        )
        setIsLoading(false)

        if (!updateError) {
            setIsEditing(false)
            setDraftUsername('')
            setAvatarFile(null)
            setAvatarPreview(null)
        } else {
            alert('Не удалось обновить профиль: ' + updateError.message)
        }
    }

    return (
        <div>
            <h2 className={styles.profile__title}>Мой Профиль</h2>
            <p className={`${styles.profile__subtitle} subtitle`}>
                Профиль, история просмотров и ваши оценки.
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

                    <div className={styles.profile__buttons}>
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={onSave}
                                    disabled={
                                        isLoading || !draftUsername.trim()
                                    }
                                >
                                    <Check size={18} />
                                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X size={18} />
                                    Отмена
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        setDraftUsername(
                                            profile?.user_metadata?.username ||
                                                '',
                                        )
                                        setIsEditing(true)
                                    }}
                                >
                                    <Pencil size={18} />
                                    Редактировать
                                </Button>
                                <Button
                                    onClick={() => {
                                        dispatch(logOut())
                                        router.push('/')
                                    }}
                                    variant="secondary"
                                >
                                    <LogOut size={18} />
                                    Выйти
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default MyProfile
