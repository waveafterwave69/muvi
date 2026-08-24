import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { invalidateMediaCardQueries } from '@/modules/media/api/cache'
import {
  cancelCoupleInvite,
  createCoupleInvite,
  getCoupleInvitePreview,
  getCoupleMedia,
  getCouplePageData,
  leaveCouple,
  removeMediaFromCoupleCollection,
  respondToCoupleInvite,
  updateCoupleMedia,
} from '.'
import type { CoupleInviteResponse, CoupleMediaFilters } from './types'

export const coupleKeys = {
  all: ['couple'] as const,
  page: ['couple', 'page'] as const,
  invite: (inviteId: string) => ['couple', 'invite', inviteId] as const,
  removeMedia: ['couple', 'media', 'remove'] as const,
  mediaAll: (coupleId: string) => ['couple', coupleId, 'media'] as const,
  media: (coupleId: string, filters: CoupleMediaFilters) =>
    ['couple', coupleId, 'media', filters.mediaType, filters.status, filters.search] as const,
}

export const useCouplePageData = () =>
  useQuery({
    queryKey: coupleKeys.page,
    queryFn: getCouplePageData,
  })

export const useCoupleInvitePreview = (inviteId: string) =>
  useQuery({
    queryKey: coupleKeys.invite(inviteId),
    queryFn: () => getCoupleInvitePreview(inviteId),
    retry: false,
  })

export const useInfiniteCoupleMediaQuery = ({
  coupleId,
  mediaType,
  status,
  search,
}: CoupleMediaFilters & { coupleId: string }) => {
  const normalizedSearch = search.trim()

  return useInfiniteQuery({
    queryKey: coupleKeys.media(coupleId, {
      mediaType,
      status,
      search: normalizedSearch,
    }),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      getCoupleMedia({
        coupleId,
        page: pageParam,
        limit: 20,
        mediaType,
        status,
        search: normalizedSearch,
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    enabled: Boolean(coupleId),
  })
}

const useRefreshCouplePage = () => {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: coupleKeys.page })
}

export const useCreateCoupleInvite = () => {
  const refreshCouplePage = useRefreshCouplePage()

  return useMutation({
    mutationFn: createCoupleInvite,
    onSuccess: async () => {
      await refreshCouplePage()
      toast.success('Ссылка-приглашение создана')
    },
    onError: () => toast.error('Не удалось создать приглашение'),
  })
}

export const useUpdateCoupleMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCoupleMedia,
    onSuccess: async (_, { coupleId }) => {
      await Promise.all([
        invalidateMediaCardQueries(queryClient),
        queryClient.invalidateQueries({ queryKey: coupleKeys.mediaAll(coupleId) }),
        queryClient.invalidateQueries({ queryKey: coupleKeys.page }),
      ])
      toast.success('Медиа обновлено')
    },
    onError: () => toast.error('Не удалось обновить медиа'),
  })
}

export const useRemoveMediaFromCoupleCollection = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: removeMediaFromCoupleCollection,
    mutationKey: coupleKeys.removeMedia,
    onSuccess: async () => {
      await Promise.all([
        invalidateMediaCardQueries(queryClient),
        queryClient.invalidateQueries({ queryKey: coupleKeys.all }),
      ])
      toast.success('Медиа удалено из коллекции пары')
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useCancelCoupleInvite = () => {
  const refreshCouplePage = useRefreshCouplePage()

  return useMutation({
    mutationFn: cancelCoupleInvite,
    onSuccess: async () => {
      await refreshCouplePage()
      toast.success('Приглашение отменено')
    },
    onError: () => toast.error('Не удалось отменить приглашение'),
  })
}

interface RespondToCoupleInviteOptions {
  onSuccess?: (response: CoupleInviteResponse) => void
  onError?: () => void
}

export const useRespondToCoupleInvite = (
  options: RespondToCoupleInviteOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      inviteId,
      response,
    }: {
      inviteId: string
      response: CoupleInviteResponse
    }) => respondToCoupleInvite({ inviteId, response }),
    onSuccess: async (_, { response }) => {
      await queryClient.invalidateQueries({ queryKey: coupleKeys.all })
      toast.success(response === 'accept' ? 'Теперь вы смотрите вместе' : 'Приглашение отклонено')
      options.onSuccess?.(response)
    },
    onError: () => {
      toast.error('Не удалось ответить на приглашение')
      options.onError?.()
    },
  })
}

export const useRespondToCoupleInviteFromLink = (
  inviteId: string,
  options: RespondToCoupleInviteOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (response: CoupleInviteResponse) =>
      respondToCoupleInvite({ inviteId, response }),
    onSuccess: async (_, response) => {
      await queryClient.invalidateQueries({ queryKey: coupleKeys.all })
      toast.success(response === 'accept' ? 'Теперь вы смотрите вместе' : 'Приглашение отклонено')
      options.onSuccess?.(response)
    },
    onError: () => {
      toast.error('Не удалось ответить на приглашение')
      options.onError?.()
    },
  })
}

export const useLeaveCouple = () => {
  const refreshCouplePage = useRefreshCouplePage()

  return useMutation({
    mutationFn: leaveCouple,
    onSuccess: async () => {
      await refreshCouplePage()
      toast.success('Пара завершена')
    },
    onError: () => toast.error('Не удалось завершить пару'),
  })
}
