import { supabase } from '@/shared/api/supabase'
import { Profile } from '../types/profileTypes'

export const profileService = {
  async fetchProfileById(id: string): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()

    if (error || !data) return { data: null, error }

    const normalizedProfile = {
      id: data.id,
      created_at: data.created_at,
      user_metadata: {
        username: data.username || '',
        avatar_url: data.avatar_url || null,
      },
    } as unknown as Profile

    return { data: normalizedProfile, error: null }
  },

  async updateProfile(username: string, avatarUrl?: string) {
    const updateData: { username: string; avatar_url?: string } = { username }
    if (avatarUrl) updateData.avatar_url = avatarUrl

    const { data, error } = await supabase.auth.updateUser({
      data: updateData,
    })
    return { data: data.user as unknown as Profile | null, error }
  },

  async uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) return { error: uploadError, publicUrl: null }

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    return { error: null, publicUrl: data.publicUrl }
  },
}
