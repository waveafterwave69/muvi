import { useState } from 'react'
import { useAppDispatch } from '@/shared/hooks/redux'
import { setMyProfile } from '../slices/profileSlice'
import { supabase } from '@/shared/api/supabase'
import { Profile } from '../types/profileTypes'
import { profileService } from '../services/profileServices'

export const useProfile = () => {
  const dispatch = useAppDispatch()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateProfile = async (username: string, avatarUrl?: string) => {
    setIsUpdating(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setIsUpdating(false)
      return { error: new Error('Пользователь не найден'), user: null }
    }

    const updateData: { username: string; avatar_url?: string } = { username }
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl
    }

    const { error: dbError } = await supabase.from('profiles').update(updateData).eq('id', user.id)

    if (dbError) {
      setIsUpdating(false)
      return { error: dbError, user: null }
    }

    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: updateData,
    })

    setIsUpdating(false)

    if (!authError && authData.user) {
      const normalizedProfile = {
        id: authData.user.id,
        created_at: authData.user.created_at,
        user_metadata: {
          username: username,
          avatar_url: avatarUrl || null,
        },
      } as unknown as Profile

      dispatch(setMyProfile(normalizedProfile))
      return { error: null, user: normalizedProfile }
    }

    return { error: authError, user: null }
  }

  const handleUploadAvatar = async (file: File, userId: string) => {
    return await profileService.uploadAvatar(file, userId)
  }

  return {
    handleUpdateProfile,
    handleUploadAvatar,
    isUpdating,
  }
}
