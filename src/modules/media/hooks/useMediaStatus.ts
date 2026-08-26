import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { AddMediaOptions, Media } from '../api/media/types'
import { useAddMedia, useMediaStatuses, useRemoveMedia } from '../api/media/queries'
import { MediaDetails } from '../api/mediaDetails/types'
import {
  useAddMediaToCoupleCollection,
  useCoupleMediaStatuses,
  useRemoveMediaFromCoupleCollection,
} from '@/modules/media/api/couple/queries'
import type { Variant } from '../api/couple/types'
import { useMarkAllTVEpisodesWatched } from '../api/episodeProgress/queries'

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
  const removeMediaFromCouple = useRemoveMediaFromCoupleCollection()
  const markAllTVEpisodesWatched = useMarkAllTVEpisodesWatched(userId ?? '')

  const {
    statuses,
    isPending: isStatusesPending,
    isFetching: isStatusesFetching,
  } = useMediaStatuses({
    userId: userId ?? '',
    media,
  })

  const {
    comments: coupleComments,
    mediaIds: coupleMediaIds,
    statuses: coupleStatuses,
    isPending: isCoupleStatusesPending,
    isFetching: isCoupleStatusesFetching,
  } = useCoupleMediaStatuses({
    userId: userId ?? '',
    media,
  })

  const addMedia = async (
    media: Media,
    options: AddMediaOptions,
    variant: Variant,
    silent = false,
  ) => {
    if (variant === 'couple') {
      await addMediaToCouple.mutateAsync({
        media,
        options,
        silent,
      })
    } else {
      await addMediaToCollection.mutateAsync({
        media,
        options,
      })
    }

    if (media.type === 'tv' && options.status === 'watched') {
      await markAllTVEpisodesWatched.mutateAsync({ mediaId: media.id, variant })
    }
  }

  const removeMedia = (media: Pick<Media, 'id' | 'type'>) => {
    return removeMediaFromCollection.mutateAsync(media)
  }

  const removeCoupleMedia = (mediaId: number) => {
    return removeMediaFromCouple.mutateAsync(mediaId)
  }

  return {
    addMedia,
    removeMedia,
    removeCoupleMedia,
    statuses,
    coupleStatuses,
    coupleMediaIds,
    coupleComments,
    isUpdating:
      addMediaToCollection.isPending ||
      addMediaToCouple.isPending ||
      markAllTVEpisodesWatched.isPending ||
      removeMediaFromCollection.isPending ||
      removeMediaFromCouple.isPending ||
      isStatusesPending ||
      isStatusesFetching ||
      isCoupleStatusesPending ||
      isCoupleStatusesFetching,
  }
}
