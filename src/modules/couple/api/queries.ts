import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  cancelCoupleInvite,
  createCoupleInvite,
  getCoupleInvitePreview,
  getCouplePageData,
  leaveCouple,
  respondToCoupleInvite,
} from '.'
import type { CoupleInviteResponse } from './types'

export const coupleKeys = {
  all: ['couple'] as const,
  page: ['couple', 'page'] as const,
  invite: (inviteId: string) => ['couple', 'invite', inviteId] as const,
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
