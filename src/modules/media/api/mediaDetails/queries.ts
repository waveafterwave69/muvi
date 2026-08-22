import { useQuery } from '@tanstack/react-query'
import { getMediaById, getMovieCollection, getTVSeason } from './index'
import type { MediaType } from '../media/types'

export const mediaKeys = {
  all: () => ['media'] as const,
  details: () => [...mediaKeys.all(), 'detail'] as const,
  detail: (id: number, mediaType: MediaType = 'movie') =>
    ['media', mediaType, 'detail', id] as const,
  actors: (id: number, mediaType: MediaType) => [...mediaKeys.detail(id, mediaType), 'actors'] as const,
  collection: (id: number) => [...mediaKeys.all(), 'movie', 'collection', id] as const,
  season: (id: number, seasonNumber: number) =>
    [...mediaKeys.detail(id, 'tv'), 'season', seasonNumber] as const,
}

export const useTVSeasonQuery = (mediaId: number, seasonNumber: number, enabled = true) => {
  return useQuery({
    queryKey: mediaKeys.season(mediaId, seasonNumber),
    queryFn: ({ signal }) => getTVSeason(mediaId, seasonNumber, signal),
    enabled: enabled && mediaId > 0 && seasonNumber >= 0,
    staleTime: 30 * 60 * 1000,
  })
}

export const useMediaDetailsQuery = (mediaId: number, mediaType: MediaType = 'movie') => {
  return useQuery({
    queryKey: mediaKeys.detail(mediaId, mediaType),
    queryFn: ({ signal }) => getMediaById(mediaId, mediaType, signal),
    enabled: !isNaN(mediaId) && mediaId > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useMovieCollectionQuery = (collectionId?: number) => {
  return useQuery({
    queryKey: mediaKeys.collection(collectionId ?? 0),
    queryFn: ({ signal }) => getMovieCollection(collectionId!, signal),
    enabled: Boolean(collectionId),
    staleTime: 30 * 60 * 1000,
  })
}
