import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/shared/hooks/redux'
import { Button } from '@/shared/ui'
import { Check, LogOut, Pencil, X } from 'lucide-react'
import { signOutAction } from '../../slices/profileSlice'
import { Profile } from '../../types/profileTypes'
import ProfileCard from '../ProfileCard/ProfileCard'
import { useProfile } from '../../hooks/useProfile'

interface MyProfileProps {
  profile: Profile
}

const MyProfile: FC<MyProfileProps> = ({ profile }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { handleUpdateProfile, handleUploadAvatar } = useProfile()

  const [isEditing, setIsEditing] = useState(false)
  const [draftUsername, setDraftUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const displayUsername = isEditing ? draftUsername : profile?.user_metadata?.username || ''

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
      const { error: uploadError, publicUrl } = await handleUploadAvatar(avatarFile, profile.id)
      if (uploadError) {
        alert('Ошибка при загрузке аватара: ' + uploadError.message)
        setIsLoading(false)
        return
      }
      if (publicUrl) finalAvatarUrl = publicUrl
    }

    const { error: updateError } = await handleUpdateProfile(draftUsername.trim(), finalAvatarUrl)
    setIsLoading(false)

    if (!updateError) {
      handleCancel()
    } else {
      alert('Не удалось обновить профиль: ' + updateError.message)
    }
  }

  const renderButtons = () => {
    if (isEditing) {
      return (
        <>
          <Button onClick={onSave} disabled={isLoading || !draftUsername.trim()}>
            <Check size={18} />
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
            <X size={18} />
            Отмена
          </Button>
        </>
      )
    }

    return (
      <>
        <Button
          onClick={() => {
            setDraftUsername(profile?.user_metadata?.username || '')
            setIsEditing(true)
          }}
        >
          <Pencil size={18} />
          Редактировать
        </Button>

        <Button
          onClick={() => {
            dispatch(signOutAction())
            router.push('/')
          }}
          variant="secondary"
        >
          <LogOut size={18} />
          Выйти
        </Button>
      </>
    )
  }

  return (
    <ProfileCard
      title="Мой Профиль"
      subtitle="Профиль, история просмотров и ваши оценки."
      profile={profile}
      username={displayUsername}
      isEditing={isEditing}
      avatarPreview={avatarPreview}
      setDraftUsername={setDraftUsername}
      setAvatarFile={setAvatarFile}
      setAvatarPreview={setAvatarPreview}
      isLoading={isLoading}
      actions={renderButtons()}
    />
  )
}

export default MyProfile
