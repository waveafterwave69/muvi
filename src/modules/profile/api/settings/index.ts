import { supabase } from '@/shared/api/supabase'
import type { UserAttributes } from '@supabase/supabase-js'

export const fetchSettings = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error('Ошибка при получении профиля:', error)
  }
}

interface IUpdateSettingsArgs {
  username: string
  email: string
  password?: string
  avatarFile?: File | null
}

export const updateSettings = async ({
  username,
  email,
  password,
  avatarFile,
}: IUpdateSettingsArgs) => {
  let avatarUrl = undefined

  if (avatarFile) {
    const fileExt = avatarFile.name.split('.').pop()
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) throw new Error('Пользователь не найден')

    const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true })

    if (uploadError) {
      throw new Error(`Ошибка загрузки аватара: ${uploadError.message}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)

    avatarUrl = publicUrl
  }

  const updateData: UserAttributes = {
    email,
    data: {
      username,
      ...(avatarUrl && { avatar_url: avatarUrl }),
    },
  }

  if (password && password.trim() !== '') {
    updateData.password = password
  }

  const { data, error } = await supabase.auth.updateUser(updateData)

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}
