import { supabase } from '@/shared/api/supabase'
import type { ProfileMedia } from '../../types/profileTypes'

export const fetchProfile = async (userId: string | null) => {
  try {
    const {
      data: { user: myProfile },
    } = await supabase.auth.getUser()

    const targetId = userId || myProfile?.id

    if (!targetId) {
      return null
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', targetId).single()

    if (error) throw error

    return {
      ...data,
      isOwn: myProfile?.id === data?.id,
    }
  } catch (error) {
    console.error('Ошибка при получении профиля:', error)
    throw error
  }
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
  return true
}

export const fetchUserMedia = async (userId: string | null) => {
  let targetUserId = userId

  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    targetUserId = user?.id || null
  }

  if (!targetUserId) return []

  const { data, error } = await supabase
    .from('user_media')
    .select(
      `
      status, 
      comment, 
      rating, 
      watched_at, 
      media ( id, external_id, type, title, overview, poster_path, release_date, vote_average )
    `,
    )
    .eq('user_id', targetUserId)
    .overrideTypes<ProfileMedia[], { merge: false }>()

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}
