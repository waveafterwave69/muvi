import { useInfiniteQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import {
  addMediaToCollection,
  getAllUserMedia,
  getMedia,
  getMediaStatuses,
  removeMediaFromCollection,
} from '.'
import {
  AddMediaOptions,
  Media,
  MediaCategory,
  MediaStatuses,
  getMediaKey,
} from './types'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { MediaIdentity, MediaType, MediaWatchStatus } from '@/shared/domain/media'
import { invalidateMediaCardQueries, mediaCardCacheKeys } from '@/shared/api/query-cache/media'

interface InfiniteMediaQueryParams {
  category?: MediaCategory
  mediaType?: MediaType
  search?: string
  collectionId?: number
}

interface AddMediaVariables {
  media: Media
  options: AddMediaOptions
}

const infiniteMediaKeys = {
  catalog: (
    mediaType: MediaType,
    mode: MediaCategory | 'collection' | 'search',
    identifier: number | string,
  ) => ['media', mediaType, 'infinite', mode, identifier] as const,
}

export function useInfiniteMediaQuery({
  category = 'popular',
  mediaType = 'movie',
  search = '',
  collectionId,
}: InfiniteMediaQueryParams = {}) {
  const normalizedSearch = search.trim()
  const queryMode = collectionId ? 'collection' : normalizedSearch ? 'search' : category

  const queryIdentifier = collectionId ?? (normalizedSearch || 'all')

  return useInfiniteQuery({
    queryKey: infiniteMediaKeys.catalog(mediaType, queryMode, queryIdentifier),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => {
      return getMedia({
        page: pageParam,
        category,
        mediaType,
        search: normalizedSearch,
        collectionId,
        signal,
      })
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) {
        return undefined
      }
      return lastPage.page + 1
    },
  })
}

export const useAddMedia = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AddMediaVariables>({
    mutationFn: ({ media, options }) => addMediaToCollection(media, options),
    mutationKey: [...mediaCardCacheKeys.solo, 'add'],
    onSuccess: async () => {
      await invalidateMediaCardQueries(queryClient, userId)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useRemoveMedia = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, MediaIdentity>({
    mutationFn: (media) => removeMediaFromCollection(media),
    mutationKey: [...mediaCardCacheKeys.solo, 'remove'],
    onSuccess: async () => {
      await invalidateMediaCardQueries(queryClient, userId)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const mediaStatusKeys = {
  all: (userId: string) => [...mediaCardCacheKeys.solo, userId, 'statuses'] as const,

  batch: (userId: string, media: MediaIdentity[]) =>
    [...mediaStatusKeys.all(userId), media.map(getMediaKey)] as const,
}

const splitIntoBatches = <T>(items: T[], batchSize: number): T[][] => {
  const batches: T[][] = []

  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize))
  }

  return batches
}

export const useMediaStatuses = ({ userId, media }: { userId: string; media: MediaIdentity[] }) => {
  const batches = useMemo(() => {
    if (!userId) {
      return []
    }

    const uniqueMedia = Array.from(new Map(media.map((item) => [getMediaKey(item), item])).values())
    return splitIntoBatches(uniqueMedia, 20)
  }, [media, userId])

  return useQueries({
    queries: batches.map((batch) => ({
      queryKey: mediaStatusKeys.batch(userId, batch),

      queryFn: () =>
        getMediaStatuses({
          userId,
          media: batch,
        }),

      staleTime: 60_000,
      refetchInterval: 60 * 60 * 1000,
    })),

    combine: (results) => {
      const statuses: MediaStatuses = new Map()

      results.forEach((result) => {
        result.data?.forEach((status, externalId) => {
          statuses.set(externalId, status)
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

export const useInfiniteFavoriteMediaQuery = ({
  mediaType,
  status,
  search,
}: {
  mediaType: MediaType
  status: MediaWatchStatus
  search: string
}) => {
  return useInfiniteQuery({
    queryKey: [...mediaCardCacheKeys.solo, mediaType, status, search],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getAllUserMedia({
        page: pageParam,
        limit: 20,
        mediaType,
        status,
        search,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined
      }

      return lastPage.pagination.page + 1
    },
  })
}
