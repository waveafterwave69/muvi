'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabase'
import { useCurrentUser } from './useCurrentUser'

export interface CurrentProfile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
  in_couple: boolean
}

const getCurrentProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at, in_couple')
    .eq('id', userId)
    .single()
    .overrideTypes<CurrentProfile, { merge: false }>()

  if (error) throw error

  return data
}

export const useCurrentProfile = () => {
  const { data: currentUser } = useCurrentUser()

  return useQuery({
    queryKey: ['auth', 'current-profile', currentUser?.id],
    queryFn: () => getCurrentProfile(currentUser!.id),
    enabled: Boolean(currentUser?.id),
  })
}
