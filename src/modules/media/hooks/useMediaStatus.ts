import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { AddMediaOptions, Media } from '../api/media/types'
import { useAddMedia, useMediaStatuses, useRemoveMedia } from '../api/media/queries'
import { MediaDetails } from '../api/mediaDetails/types'

export const useMediaStatus = (items: Media[] | Media | MediaDetails | MediaDetails[]) => {
  const mediaArray = Array.isArray(items) ? items : [items]
  const media = mediaArray
    .filter((item): item is Media | MediaDetails => Boolean(item))
    .map((item) => ({ id: item.id, type: item.type }))

  const { data } = useCurrentUser()
  const userId = data?.id
  const addMediaToCollection = useAddMedia(userId ?? '')
  const removeMediaFromCollection = useRemoveMedia(userId ?? '')

  const {
    statuses,
    isPending: isStatusesPending,
    isFetching: isStatusesFetching,
  } = useMediaStatuses({
    userId: userId ?? '',
    media,
  })

  const addMedia = (media: Media, options: AddMediaOptions) => {
    return addMediaToCollection.mutateAsync({
      media,
      options,
    })
  }

  const removeMedia = (media: Pick<Media, 'id' | 'type'>) => {
    return removeMediaFromCollection.mutateAsync(media)
  }

  return {
    addMedia,
    removeMedia,
    statuses,
    isUpdating:
      addMediaToCollection.isPending ||
      removeMediaFromCollection.isPending ||
      isStatusesPending ||
      isStatusesFetching,
  }
}
