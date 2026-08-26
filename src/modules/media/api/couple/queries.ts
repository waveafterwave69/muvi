import { useMemo } from 'react'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coupleKeys } from '@/modules/couple/api/queries'
import {
  getMediaKey,
  type AddMediaOptions,
  type Media,
  type MediaStatuses,
} from '../media/types'
import {
  addMediaToCoupleCollection,
  getCoupleMediaStatuses,
} from '.'
import { MediaIdentity } from '@/shared/domain/media'
import { invalidateMediaCardQueries, mediaCardCacheKeys } from '@/shared/api/query-cache/media'

interface AddMediaToCoupleVariables {
  media: Media
  options: AddMediaOptions
  silent?: boolean
}

export const coupleMediaKeys = {
  all: mediaCardCacheKeys.couple,
  add: [...mediaCardCacheKeys.couple, 'add'] as const,
  statuses: (userId: string) =>
    [...mediaCardCacheKeys.couple, userId, 'statuses'] as const,
  statusBatch: (userId: string, media: MediaIdentity[]) =>
    [...coupleMediaKeys.statuses(userId), media.map(getMediaKey)] as const,
}

const splitIntoBatches = <T>(items: T[], batchSize: number): T[][] => {
  const batches: T[][] = []

  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize))
  }

  return batches
}

export const useCoupleMediaStatuses = ({
  userId,
  media,
}: {
  userId: string
  media: MediaIdentity[]
}) => {
  const batches = useMemo(() => {
    if (!userId) {
      return []
    }

    const uniqueMedia = Array.from(new Map(media.map((item) => [getMediaKey(item), item])).values())

    return splitIntoBatches(uniqueMedia, 20)
  }, [media, userId])

  return useQueries({
    queries: batches.map((batch) => ({
      queryKey: coupleMediaKeys.statusBatch(userId, batch),
      queryFn: () => getCoupleMediaStatuses(batch),
      staleTime: 60_000,
      refetchInterval: 60 * 60 * 1000,
    })),
    combine: (results) => {
      const statuses: MediaStatuses = new Map()
      const mediaIds = new Map<string, number>()
      const comments = new Map<string, string | null>()

      results.forEach((result) => {
        result.data?.forEach((item, mediaKey) => {
          statuses.set(mediaKey, item.status)
          mediaIds.set(mediaKey, item.mediaId)
          comments.set(mediaKey, item.comment)
        })
      })

      return {
        statuses,
        mediaIds,
        comments,
        isPending: results.some((result) => result.isPending),
        isFetching: results.some((result) => result.isFetching),
        error: results.find((result) => result.error)?.error ?? null,
      }
    },
  })
}

export const useAddMediaToCoupleCollection = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AddMediaToCoupleVariables>({
    mutationFn: ({ media, options }) => addMediaToCoupleCollection(media, options),
    mutationKey: coupleMediaKeys.add,
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateMediaCardQueries(queryClient),
        queryClient.invalidateQueries({
          queryKey: coupleKeys.all,
        }),
      ])

      if (!variables.silent) {
        toast.success('Медиа добавлено в коллекцию пары')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
