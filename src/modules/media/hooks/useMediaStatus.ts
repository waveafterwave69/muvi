import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { AddMediaOptions, Media } from '../api/media/types'
import { useAddMedia, useMediaStatuses, useRemoveMedia } from '../api/media/queries'
import { MediaDetails } from '../api/mediaDetails/types'
import {
  useAddMediaToCoupleCollection,
  useCoupleMediaStatuses,
} from '@/modules/media/api/couple/queries'
import type { Variant } from '../api/couple/types'

export const useMediaStatus = (items: Media[] | Media | MediaDetails | MediaDetails[]) => {
  const mediaArray = Array.isArray(items) ? items : [items]
  const media = mediaArray
    .filter((item): item is Media | MediaDetails => Boolean(item))
    .map((item) => ({ id: item.id, type: item.type }))

  const { data } = useCurrentUser()
  const userId = data?.id
  const addMediaToCollection = useAddMedia(userId ?? '')
  const removeMediaFromCollection = useRemoveMedia(userId ?? '')
  const addMediaToCouple = useAddMediaToCoupleCollection()

  const {
    statuses,
    isPending: isStatusesPending,
    isFetching: isStatusesFetching,
  } = useMediaStatuses({
    userId: userId ?? '',
    media,
  })

  const {
    statuses: coupleStatuses,
    isPending: isCoupleStatusesPending,
    isFetching: isCoupleStatusesFetching,
  } = useCoupleMediaStatuses({
    userId: userId ?? '',
    media,
  })

  const addMedia = (media: Media, options: AddMediaOptions, variant: Variant) => {
    if (variant === 'couple') {
      return addMediaToCouple.mutateAsync({
        media,
        options,
      })
    }

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
    coupleStatuses,
    isUpdating:
      addMediaToCollection.isPending ||
      addMediaToCouple.isPending ||
      removeMediaFromCollection.isPending ||
      isStatusesPending ||
      isStatusesFetching ||
      isCoupleStatusesPending ||
      isCoupleStatusesFetching,
  }
}
