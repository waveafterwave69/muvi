import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Variant } from '../../api/couple/types'
import type { MediaDetails } from '../../api/mediaDetails/types'
import { getMediaKey } from '../../api/media/types'
import { useMediaStatus } from '../useMediaStatus'

export const useEpisodeProgressMode = (media: MediaDetails) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestedVariant = searchParams.get('mode')
  const initialVariant: Variant = requestedVariant === 'couple' ? 'couple' : 'solo'
  const [selection, setSelection] = useState(() => ({
    mediaId: media.id,
    sourceVariant: initialVariant,
    variant: initialVariant,
  }))
  const preferredVariant =
    selection.mediaId === media.id && selection.sourceVariant === initialVariant
      ? selection.variant
      : initialVariant

  const {
    statuses,
    coupleStatuses,
    isUpdating: isStatusLoading,
  } = useMediaStatus(media)
  const mediaKey = getMediaKey(media)
  const soloStatus = statuses.get(mediaKey)
  const coupleStatus = coupleStatuses.get(mediaKey)
  const hasSoloCollection = soloStatus !== undefined
  const hasCoupleCollection = coupleStatus !== undefined
  const variant: Variant =
    (preferredVariant === 'solo' && hasSoloCollection) ||
    (preferredVariant === 'couple' && hasCoupleCollection)
      ? preferredVariant
      : hasSoloCollection
        ? 'solo'
        : hasCoupleCollection
          ? 'couple'
          : preferredVariant
  const status = variant === 'couple' ? coupleStatus : soloStatus

  const selectVariant = (nextVariant: Variant) => {
    setSelection({
      mediaId: media.id,
      sourceVariant: initialVariant,
      variant: nextVariant,
    })

    const nextSearchParams = new URLSearchParams(searchParams.toString())
    nextSearchParams.set('mode', nextVariant)
    router.replace(`${pathname}?${nextSearchParams.toString()}`, { scroll: false })
  }

  return {
    variant,
    status,
    isStatusLoading,
    isInCollection: status !== undefined,
    canEditProgress: status === 'watching' || status === 'watched',
    showModeSelector: hasSoloCollection && hasCoupleCollection,
    selectVariant,
  }
}
