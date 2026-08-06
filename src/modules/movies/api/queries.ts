import { useInfiniteQuery } from '@tanstack/react-query'
import { getMovies } from '.'
import type { MoviesCategory } from './types'

interface InfiniteMoviesQueryParams {
  category?: MoviesCategory
  search?: string
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
