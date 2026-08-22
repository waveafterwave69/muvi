'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './SettingsPage.module.scss'
import { Button, Card, Input } from '@/shared/ui'
import { useGetSettings, useUpdateSettings } from '../../api/settings/queries'
import { useForm } from 'react-hook-form'
import { Lock, User, Mail, Camera } from 'lucide-react'
import Image from 'next/image'
import SkeletonSettingsPage from './SkeletonSettingsPage/SkeletonSettingsPage'
import DefaultAvatar from '../../components/DefaultAvatar/DefaultAvatar'

interface ISettingsForm {
  username: string
  email: string
  password?: string
}

interface IUpdatePayload extends ISettingsForm {
  avatarFile?: File | null
}

const SettingsPage = () => {
  const { data: user, isLoading: isUserLoading } = useGetSettings()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateSettings()

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISettingsForm>({
    values: {
      username: user?.user_metadata?.username || '',
      email: user?.email || '',
      password: '',
    },
  })

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc)
    }
  }, [previewSrc])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setPreviewSrc(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = (formData: ISettingsForm) => {
    const payload: IUpdatePayload = { ...formData }

    if (!payload.password || payload.password.trim() === '') {
      delete payload.password
    }

    updateProfile(
      { ...payload, avatarFile },
      {
        onSuccess: () => {
          setAvatarFile(null)
          setPreviewSrc(null)
        },
      },
    )
  }

  if (isUserLoading) {
    return <SkeletonSettingsPage />
  }

  const currentAvatarSrc = previewSrc || user?.user_metadata?.avatar_url

  return (
    <div className={styles.settings}>
      <Card className={styles.settings__content}>
        <form className={styles.content__form} onSubmit={handleSubmit(onSubmit)}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className={styles.avatar__container} onClick={triggerFileInput}>
            {currentAvatarSrc ? (
              <Image
                priority
                src={currentAvatarSrc}
                className={styles.left__avatar}
                width={250}
                height={250}
                alt="Текущий аватар профиля"
              />
            ) : (
              <DefaultAvatar className={styles.left__avatar} />
            )}
            <div className={styles.avatar__overlay}>
              <Camera size={36} color="#fff" />
            </div>
          </div>

          <Input
            {...register('username', { required: 'Имя обязательно' })}
            label="Имя"
            icon={<User size={18} />}
            error={errors.username?.message}
          />

          <Input
            {...register('email', { required: 'Почта обязательна' })}
            label="Почта"
            type="email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
          />

          <Input
            label="Новый пароль"
            type="password"
            placeholder="Минимум 8 символов"
            icon={<Lock size={18} />}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              validate: {
                minLength: (value) =>
                  !value || value.length >= 8 || 'Пароль должен содержать минимум 8 символов',
                uppercase: (value) =>
                  !value ||
                  value !== value.toLowerCase() ||
                  'Добавьте хотя бы одну заглавную букву',
                specialCharacter: (value) =>
                  !value ||
                  /[^\p{L}\p{N}\s]/u.test(value) ||
                  'Добавьте хотя бы один специальный символ',
              },
            })}
          />

          <Button className={styles.button} type="submit" disabled={isUpdating}>
            {isUpdating ? 'Сохранение...' : 'Изменить'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default SettingsPage
