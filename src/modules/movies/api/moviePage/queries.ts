import { useQuery } from '@tanstack/react-query'
import { getMovieById } from './index'

export const movieDetailKeys = {
  all: () => ['media', 'movie', 'detail'] as const,
  id: (id: number) => [...movieDetailKeys.all(), id] as const,
}

export const useMovieDetailQuery = (movieId: number) => {
  return useQuery({
    queryKey: movieDetailKeys.id(movieId),
    queryFn: ({ signal }) => getMovieById(movieId, signal),
    enabled: !isNaN(movieId) && movieId > 0,
    staleTime: 5 * 60 * 1000,
  })
}
