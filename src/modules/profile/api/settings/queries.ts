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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })

      alert('Данные успешно обновлены!')
    },
    onError: (error) => {
      alert(`Ошибка при обновлении: ${error.message || 'Что-то пошло не так'}`)
    },
  })
}
