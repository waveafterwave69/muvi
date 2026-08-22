import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSettings, updateSettings } from '.'
import { toast } from 'sonner'

export const useGetSettings = () => {
  return useQuery({
    queryFn: () => fetchSettings(),
    queryKey: ['settings'],
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Данные успешно обновлены!')
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении: ${error.message}`)
    },
  })
}
