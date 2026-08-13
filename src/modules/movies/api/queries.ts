import { useInfiniteQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { addMovieToCollection, getAllUserMovies, getMovies, getMovieStatuses, removeMovieFromCollection } from '.'
import  { AddMovieOptions, Movie, MoviesCategory, MovieStatuses, MovieWatchStatus } from './types'
import { useMemo } from 'react'

interface InfiniteMoviesQueryParams {
  category?: MoviesCategory
  search?: string
}

interface AddMovieVariables {
  movie: Movie
  options: AddMovieOptions
}

export function useInfiniteMoviesQuery({
  category = 'popular',
  search = '',
}: InfiniteMoviesQueryParams = {}) {
  const normalizedSearch = search.trim()

  return useInfiniteQuery({
    queryKey: ['media', 'movie', normalizedSearch ? 'search' : category, normalizedSearch],

    initialPageParam: 1,

    queryFn: ({ pageParam, signal }) => {
      return getMovies({
        page: pageParam,
        category,
        search: normalizedSearch,
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

export const useAddMovie = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AddMovieVariables>({
    mutationFn: ({ movie, options }) => addMovieToCollection(movie, options),
    mutationKey: ['user-movies', 'add'],
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: movieStatusKeys.all(userId),
      })
    },
  })
}

export const useRemoveMovie = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: (movieId) => removeMovieFromCollection(movieId),
    mutationKey: ['user-movies', 'remove'],
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: movieStatusKeys.all(userId),
      })
    },
  })
}

export const movieStatusKeys = {
  all: (userId: string) => ['user-movies', userId, 'statuses'] as const,

  batch: (userId: string, externalIds: number[]) =>
    [...movieStatusKeys.all(userId), externalIds] as const,
}

const splitIntoBatches = <T>(items: T[], batchSize: number): T[][] => {
  const batches: T[][] = []

  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize))
  }

  return batches
}

export const useMovieStatuses = ({
  userId,
  externalIds,
}: {
  userId: string
  externalIds: number[]
}) => {
  const batches = useMemo(() => {
    const uniqueIds = Array.from(new Set(externalIds))
    return splitIntoBatches(uniqueIds, 20)
  }, [externalIds])

  return useQueries({
    queries: batches.map((batch) => ({
      queryKey: movieStatusKeys.batch(userId, batch),

      queryFn: () =>
        getMovieStatuses({
          userId,
          externalIds: batch,
        }),

      staleTime: 60_000,
    })),

    combine: (results) => {
      const statuses: MovieStatuses = new Map()

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

export const useInfiniteFavoriteMoviesQuery = ({
  status,
  search,
}: {
  status: MovieWatchStatus;
  search: string;
}) => {
  return useInfiniteQuery({
    queryKey: ['user-movies', status, search],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getAllUserMovies({
        page: pageParam,
        limit: 20,
        status,
        search,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });
};

