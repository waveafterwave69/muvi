import { useQuery } from '@tanstack/react-query'
import { getMovieById } from './index'

export const movieKeys = {
  all: () => ['media', 'movie'] as const,
  details: () => [...movieKeys.all(), 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  actors: (id: number) => [...movieKeys.detail(id), 'actors'] as const,
}

export const useMovieDetailQuery = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: ({ signal }) => getMovieById(movieId, signal),
    enabled: !isNaN(movieId) && movieId > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useMovieActorsQuery = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.actors(movieId),
    queryFn: ({ signal }) => getMovieById(movieId, signal),
    enabled: !isNaN(movieId) && movieId > 0,
    staleTime: 5 * 60 * 1000,
    select: (data) => data?.credits?.cast ?? [],
  })
}
