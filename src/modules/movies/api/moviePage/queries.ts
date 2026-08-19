import { useQuery } from '@tanstack/react-query'
import { getMovieById, getMovieCollection } from './index'

export const movieKeys = {
  all: () => ['media', 'movie'] as const,
  details: () => [...movieKeys.all(), 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  actors: (id: number) => [...movieKeys.detail(id), 'actors'] as const,
  collection: (id: number) => [...movieKeys.all(), 'collection', id] as const,
}

export const useMovieDetailQuery = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: ({ signal }) => getMovieById(movieId, signal),
    enabled: !isNaN(movieId) && movieId > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useMovieCollectionQuery = (collectionId?: number) => {
  return useQuery({
    queryKey: movieKeys.collection(collectionId ?? 0),
    queryFn: ({ signal }) => getMovieCollection(collectionId!, signal),
    enabled: Boolean(collectionId),
    staleTime: 30 * 60 * 1000,
  })
}
