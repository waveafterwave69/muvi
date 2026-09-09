import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { MediaDetails } from '../../api/mediaDetails/types'
import { getMediaKey } from '../../api/media/types'
import { useMediaStatus } from '../useMediaStatus'
import { MediaActionTarget } from '@/shared/domain/media'

interface UpdateStatusOptions {
  syncEpisodeProgress?: boolean
}

export const useEpisodeProgressMode = (media: MediaDetails) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedVariant = searchParams.get('mode')
  const initialVariant: MediaActionTarget = requestedVariant === 'couple' ? 'couple' : 'solo'
  const [selection, setSelection] = useState(() => ({
    mediaId: media.id,
    sourceVariant: initialVariant,
    variant: initialVariant,
    isExplicit: requestedVariant === 'solo' || requestedVariant === 'couple',
  }))
  const isExplicitSelection =
    selection.mediaId === media.id &&
    selection.sourceVariant === initialVariant &&
    selection.isExplicit
  const preferredVariant =
    selection.mediaId === media.id && selection.sourceVariant === initialVariant
      ? selection.variant
      : initialVariant

  const { addMedia, statuses, coupleStatuses, isUpdating: isStatusLoading } = useMediaStatus(media)
  const mediaKey = getMediaKey(media)
  const soloStatus = statuses.get(mediaKey)
  const coupleStatus = coupleStatuses.get(mediaKey)
  const hasSoloCollection = soloStatus !== undefined
  const hasCoupleCollection = coupleStatus !== undefined
  const variant: MediaActionTarget =
    isExplicitSelection ||
    (preferredVariant === 'solo' && hasSoloCollection) ||
    (preferredVariant === 'couple' && hasCoupleCollection)
      ? preferredVariant
      : hasSoloCollection
        ? 'solo'
        : hasCoupleCollection
          ? 'couple'
          : preferredVariant
  const status = variant === 'couple' ? coupleStatus : soloStatus

  const updateStatus = (
    nextStatus: 'watching' | 'watched' | 'dropped',
    { syncEpisodeProgress = true }: UpdateStatusOptions = {},
  ) =>
    addMedia(
      media,
      {
        status: nextStatus,
        rating: null,
        comment: null,
      },
      variant,
      true,
      syncEpisodeProgress,
    )

  const selectVariant = (nextVariant: MediaActionTarget) => {
    setSelection({
      mediaId: media.id,
      sourceVariant: initialVariant,
      variant: nextVariant,
      isExplicit: true,
    })

    const nextSearchParams = new URLSearchParams(searchParams.toString())
    nextSearchParams.set('mode', nextVariant)
    router.replace(`${pathname}?${nextSearchParams.toString()}`, { scroll: false })
  }

  return {
    variant,
    status,
    updateStatus,
    isStatusLoading,
    hasSoloCollection,
    hasCoupleCollection,
    showModeSelector: hasSoloCollection && hasCoupleCollection,
    selectVariant,
  }
}
