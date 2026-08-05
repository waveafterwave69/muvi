'use client'

import type { FC } from 'react'
import { useRef } from 'react'
import styles from './ProfileInfo.module.scss'
import { Calendar, Camera } from 'lucide-react'
import { formatDate } from '@/shared/helpers/formatters'
import Image from 'next/image'
import { Profile } from '../../types/profileTypes'

interface ProfileInfoProps {
  profile: Profile
  isEditing: boolean
  username: string
  setUsername: (value: string) => void
  avatarPreview: string | null
  setAvatarFile: (file: File | null) => void
  setAvatarPreview: (url: string | null) => void
  disabled?: boolean
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  profile,
  isEditing,
  username,
  setUsername,
  avatarPreview,
  setAvatarFile,
  setAvatarPreview,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentAvatarUrl = avatarPreview || profile?.user_metadata.avatar_url

  const firstLetter = (username || profile?.user_metadata.username || 'U').charAt(0).toUpperCase()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => {
    if (isEditing && !disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={styles.profile__info}>
      <div
        className={`${styles.avatar_wrapper} ${isEditing ? styles.avatar_wrapper_editable : ''}`}
        onClick={triggerFileInput}
      >
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt={profile?.user_metadata.username || 'Профиль'}
            className={styles.profile__img}
            width={100}
            height={100}
            unoptimized
          />
        ) : (
          <div className={`${styles.profile__img} ${styles.profile__img_placeholder}`}>
            {firstLetter}
          </div>
        )}

        {isEditing && (
          <div className={styles.avatar_overlay}>
            <Camera size={24} color="#fff" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <div className={styles.profile__left}>
        <div className={styles.profile__name_container}>
          {isEditing ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.profile__input}
              disabled={disabled}
              placeholder="Имя пользователя"
              autoFocus
            />
          ) : (
            <h3 className={styles.profile__name}>{profile.user_metadata.username}</h3>
          )}
        </div>

        <div className={styles.user__date}>
          <div className={styles.date__text}>
            <p className={styles.date__text__info}>
              <Calendar size={18} />
              Дата создания:
            </p>
            <p className={styles.date__text__date}>{formatDate(profile.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo
