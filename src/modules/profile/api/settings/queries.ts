import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSettings, updateSettings } from '.'

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
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['settings'], updatedUser)
      alert('Данные успешно обновлены!')
    },
    onError: (error: any) => {
      alert(`Ошибка при обновлении: ${error.message}`)
    },
  })
}
