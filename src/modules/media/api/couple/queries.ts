import { useMemo } from 'react'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coupleKeys } from '@/modules/couple/api/queries'
import {
  getMediaKey,
  type AddMediaOptions,
  type Media,
  type MediaIdentity,
  type MediaStatuses,
} from '../media/types'
import { addMediaToCoupleCollection, getCoupleMediaStatuses } from '.'

interface AddMediaToCoupleVariables {
  media: Media
  options: AddMediaOptions
}

export const coupleMediaKeys = {
  all: ['couple-media'] as const,
  add: ['couple-media', 'add'] as const,
  statuses: (userId: string) => ['couple-media', userId, 'statuses'] as const,
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

    const uniqueMedia = Array.from(
      new Map(media.map((item) => [getMediaKey(item), item])).values(),
    )

    return splitIntoBatches(uniqueMedia, 20)
  }, [media, userId])

  return useQueries({
    queries: batches.map((batch) => ({
      queryKey: coupleMediaKeys.statusBatch(userId, batch),
      queryFn: () => getCoupleMediaStatuses(batch),
      staleTime: 60_000,
    })),
    combine: (results) => {
      const statuses: MediaStatuses = new Map()

      results.forEach((result) => {
        result.data?.forEach((status, mediaKey) => {
          statuses.set(mediaKey, status)
        })
      })

      return {
        statuses,
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: coupleMediaKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: coupleKeys.all,
        }),
      ])

      toast.success('Медиа добавлено в коллекцию пары')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
