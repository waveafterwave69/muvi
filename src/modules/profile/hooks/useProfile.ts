import { supabase } from '@/shared/api/supabase'

export const useProfile = () => {
  const handleError = (error: unknown, contextMessage: string) => {
    console.error(`[Profile Service Error] ${contextMessage}:`, error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }

  const getMyProfile = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error
      return user
    } catch (err) {
      handleError(err, 'Failed to fetch current user profile')
      return null
    }
  }

  const getUserId = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error
      return user?.id || null
    } catch (err) {
      handleError(err, 'Failed to get user ID')
      return null
    }
  }

  const getUserDataById = async (userId: string) => {
    if (!userId) {
      console.warn('[Profile Service] getUserDataById called without userId')
      return null
    }

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      if (error) throw error
      return data
    } catch (err) {
      handleError(err, `Failed to fetch profile data for ID: ${userId}`)
      return null
    }
  }

  return {
    getMyProfile,
    getUserId,
    getUserDataById,
  }
}
