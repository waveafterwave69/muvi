import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProfile, fetchUserMedia, logoutUser } from '.'
import { toast } from 'sonner'

export const useGetProfile = (userId: string | null) => {
  return useQuery({
    queryFn: () => fetchProfile(userId),
    queryKey: ['profile', userId],
  })
}

export const useGetUserMedia = (userId: string | null, enabled: boolean) => {
  return useQuery({
    queryFn: () => fetchUserMedia(userId),
    queryKey: ['userMedia', userId],
    enabled: enabled,
    staleTime: 0,
    gcTime: 0,
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()

      window.location.href = '/'
    },
    onError: (error) => {
      toast.error('Не удалось выйти из профиля' + error.message)
    },
  })
}
