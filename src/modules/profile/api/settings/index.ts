import { supabase } from '@/shared/api/supabase'
import type { UserAttributes } from '@supabase/supabase-js'

const AVATAR_BUCKET = 'avatars'
const AVATAR_PATH_PREFIX = 'avatars/'

const getOwnedAvatarPath = (avatarUrl: unknown, userId: string): string | null => {
  if (typeof avatarUrl !== 'string' || !avatarUrl) return null

  try {
    const url = new URL(avatarUrl)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!supabaseUrl || url.origin !== new URL(supabaseUrl).origin) return null

    const publicObjectPrefix = `/storage/v1/object/public/${AVATAR_BUCKET}/`
    const prefixIndex = url.pathname.indexOf(publicObjectPrefix)

    if (prefixIndex === -1) return null

    const objectPath = decodeURIComponent(
      url.pathname.slice(prefixIndex + publicObjectPrefix.length),
    )

    return objectPath.startsWith(`${AVATAR_PATH_PREFIX}${userId}-`) ? objectPath : null
  } catch {
    return null
  }
}

const removeAvatar = async (path: string): Promise<void> => {
  const { error } = await supabase.storage.from(AVATAR_BUCKET).remove([path])

  if (error) throw error
}

const removeStaleAvatars = async (userId: string, currentPath: string): Promise<void> => {
  const folder = AVATAR_PATH_PREFIX.slice(0, -1)
  const { data, error: listError } = await supabase.storage.from(AVATAR_BUCKET).list(folder, {
    limit: 1000,
    search: `${userId}-`,
  })

  if (listError) throw listError

  const stalePaths = (data ?? [])
    .filter((file) => file.id && file.name.startsWith(`${userId}-`))
    .map((file) => `${AVATAR_PATH_PREFIX}${file.name}`)
    .filter((path) => path !== currentPath)

  if (stalePaths.length === 0) return

  const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove(stalePaths)

  if (removeError) throw removeError
}

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
  let avatarUrl: string | undefined
  let uploadedAvatarPath: string | null = null
  let previousAvatarPath: string | null = null
  let avatarOwnerId: string | null = null

  if (avatarFile) {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) throw new Error('Пользователь не найден')

    avatarOwnerId = currentUser.id

    const fileExt = avatarFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '')
    const fileName = `${currentUser.id}-${crypto.randomUUID()}.${fileExt || 'jpg'}`
    const filePath = `avatars/${fileName}`
    previousAvatarPath = getOwnedAvatarPath(
      currentUser.user_metadata?.avatar_url,
      currentUser.id,
    )

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, avatarFile)

    if (uploadError) {
      throw new Error(`Ошибка загрузки аватара: ${uploadError.message}`)
    }

    uploadedAvatarPath = filePath

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)

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
    if (uploadedAvatarPath) {
      try {
        await removeAvatar(uploadedAvatarPath)
      } catch {
        // Не маскируем исходную ошибку обновления профиля ошибкой очистки файла.
      }
    }

    throw new Error(error.message)
  }

  if (previousAvatarPath && previousAvatarPath !== uploadedAvatarPath) {
    try {
      await removeAvatar(previousAvatarPath)
    } catch {
      // Новый аватар уже сохранён: ошибка очистки старого файла не отменяет обновление профиля.
    }
  }

  if (avatarOwnerId && uploadedAvatarPath) {
    try {
      await removeStaleAvatars(avatarOwnerId, uploadedAvatarPath)
    } catch {
      // Очистка накопленных старых файлов не должна отменять успешное обновление профиля.
    }
  }

  return data.user
}
