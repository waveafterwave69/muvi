import { useMediaDetailsQuery, useMovieCollectionQuery } from '../api/mediaDetails/queries'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import type { MediaType } from '../api/media/types'

export const useMediaDetailsPage = (mediaId: number, mediaType: MediaType = 'movie') => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()

  const parsedMediaId = Array.isArray(mediaId) ? Number(mediaId[0]) : Number(mediaId)
  const isValidId = !isNaN(parsedMediaId) && parsedMediaId > 0

  const {
    data: media,
    isLoading: isMediaLoading,
    error: mediaError,
  } = useMediaDetailsQuery(parsedMediaId, mediaType)

  const actors = media?.credits?.cast || []

  const collectionId = mediaType === 'movie' ? media?.belongs_to_collection?.id : undefined
  const { data: collection, isLoading: isCollectionLoading } = useMovieCollectionQuery(collectionId)

  return {
    media,
    actors,
    isUserLoading,
    isValidId,
    isMediaLoading,
    mediaError,
    similarMedia: media?.similar?.results ?? [],
    collectionMedia: collection?.results ?? [],
    isCollectionLoading,
    currentUser,
  }
}
