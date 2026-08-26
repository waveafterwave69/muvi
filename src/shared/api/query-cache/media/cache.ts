import type { QueryClient } from '@tanstack/react-query'

export const mediaCardCacheKeys = {
  solo: ['user-media'] as const,
  couple: ['couple-media'] as const,
  profile: ['userMedia'] as const,
  profileByUser: (userId: string) => ['userMedia', userId] as const,
}

export const invalidateMediaCardQueries = async (
  queryClient: QueryClient,
  userId?: string,
): Promise<void> => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: mediaCardCacheKeys.solo }),
    queryClient.invalidateQueries({ queryKey: mediaCardCacheKeys.couple }),
    queryClient.invalidateQueries({
      queryKey: userId
        ? mediaCardCacheKeys.profileByUser(userId)
        : mediaCardCacheKeys.profile,
    }),
  ])
}
