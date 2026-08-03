'use client'

import { useSyncExternalStore, useState } from 'react'
import styles from './profile.module.scss'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { useParams, useRouter } from 'next/navigation'
import MyProfile from '../../components/MyProfile/MyProfile'
import UserProfile from '../../components/UserProfile/UserProfile'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const ProfileContent = () => {
    const data = useAppSelector((state) => state.profile)
    const params = useParams()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { handleUpdateProfile, handleUploadAvatar } = useAuth()

    const profile = data.profile

    const [isEditing, setIsEditing] = useState(false)
    const [draftUsername, setDraftUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const isClient = useSyncExternalStore(
        emptySubscribe,
        getClientSnapshot,
        getServerSnapshot,
    )

    const isMyProfile = profile?.id === params.id

    const displayUsername = isEditing
        ? draftUsername
        : profile?.user_metadata?.username || ''

    if (!isClient) {
        return <section className={styles.profile}>Загрузка</section>
    }

    if (!profile) {
        return <section className={styles.profile}>Загрузка</section>
    }

    return (
        <section className={styles.profile}>
            {isMyProfile ? (
                <MyProfile
                    profile={profile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    draftUsername={draftUsername}
                    setDraftUsername={setDraftUsername}
                    displayUsername={displayUsername}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    avatarFile={avatarFile}
                    setAvatarFile={setAvatarFile}
                    avatarPreview={avatarPreview}
                    setAvatarPreview={setAvatarPreview}
                    handleUpdateProfile={handleUpdateProfile}
                    handleUploadAvatar={handleUploadAvatar}
                    dispatch={dispatch}
                    router={router}
                />
            ) : (
                <UserProfile
                    profile={profile}
                    isEditing={isEditing}
                    displayUsername={displayUsername}
                    setDraftUsername={setDraftUsername}
                    avatarPreview={avatarPreview}
                    setAvatarFile={setAvatarFile}
                    setAvatarPreview={setAvatarPreview}
                    isLoading={isLoading}
                />
            )}
        </section>
    )
}

export default ProfileContent
