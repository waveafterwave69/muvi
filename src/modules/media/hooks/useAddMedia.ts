import { useState } from 'react'
import type { AddMediaOptions, Media } from '../api/media/types'
import { useCurrentProfile } from '@/modules/auth'
import { MediaWatchStatus, MediaActionTarget } from '@/shared/domain/media'

export type AddMediaHandler = (
  media: Media,
  options: AddMediaOptions,
  variant: MediaActionTarget,
  silent?: boolean,
) => Promise<void>

export type RemoveMediaHandler = (media: Pick<Media, 'id' | 'type'>) => Promise<void>
export type RemoveCoupleMediaHandler = (mediaId: number) => Promise<void>

interface UseAddMediaParams {
  addMedia: AddMediaHandler
  removeMedia: RemoveMediaHandler
  removeCoupleMedia: RemoveCoupleMediaHandler
  isUpdating: boolean
  defaultVariant?: MediaActionTarget
}

interface MediaAction {
  type: 'planned' | 'watched' | 'tv-status'
  media: Media
  status?: MediaWatchStatus
  soloStatus?: MediaWatchStatus
  coupleStatus?: MediaWatchStatus
  coupleMediaId?: number
}

export const useAddMedia = ({
  addMedia,
  removeMedia,
  removeCoupleMedia,
  isUpdating,
  defaultVariant = 'solo',
}: UseAddMediaParams) => {
  const [target, setTarget] = useState<MediaActionTarget>(defaultVariant)
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isTVModalOpen, setIsTVModalOpen] = useState(false)
  const [activeMedia, setActiveMedia] = useState<MediaAction | null>(null)
  const { data } = useCurrentProfile()

  const resetActiveMedia = () => {
    setActiveMedia(null)
  }

  const closeStarsModal = () => {
    setIsStarsModalOpen(false)
    setStars(null)
    resetActiveMedia()
  }

  const closeCommentModal = () => {
    setIsCommentModalOpen(false)
    setComment(null)
    resetActiveMedia()
  }

  const closeTVModal = () => {
    setIsTVModalOpen(false)
    resetActiveMedia()
  }

  const onTargetChange = (newTarget: MediaActionTarget) => {
    setTarget(newTarget)
  }

  const handleFavoriteClick = (
    media: Media,
    soloStatus?: MediaWatchStatus,
    coupleMediaId?: number,
    coupleStatus?: MediaWatchStatus,
  ) => {
    onTargetChange(defaultVariant)
    const status = defaultVariant === 'couple' ? coupleStatus : soloStatus

    if (status === 'planned') {
      if (defaultVariant === 'couple' && coupleMediaId !== undefined) {
        void removeCoupleMedia(coupleMediaId)
      } else {
        void removeMedia(media)
      }
      return
    }

    setActiveMedia({
      type: 'planned',
      media,
      status,
      soloStatus,
      coupleStatus,
      coupleMediaId,
    })
    setIsCommentModalOpen(true)
  }

  const handleWatchedClick = (
    media: Media,
    soloStatus?: MediaWatchStatus,
    coupleMediaId?: number,
    coupleStatus?: MediaWatchStatus,
  ) => {
    onTargetChange(defaultVariant)
    const status = defaultVariant === 'couple' ? coupleStatus : soloStatus

    if (status === 'watched') {
      if (defaultVariant === 'couple' && coupleMediaId !== undefined) {
        void removeCoupleMedia(coupleMediaId)
      } else {
        void removeMedia(media)
      }
      return
    }

    setActiveMedia({
      type: 'watched',
      media,
      status,
      soloStatus,
      coupleStatus,
      coupleMediaId,
    })
    setIsStarsModalOpen(true)
  }

  const handleOpenTVModal = (
    media: Media,
    soloStatus?: MediaWatchStatus,
    coupleMediaId?: number,
    coupleStatus?: MediaWatchStatus,
  ) => {
    onTargetChange(defaultVariant)
    setActiveMedia({
      type: 'tv-status',
      media,
      status: defaultVariant === 'couple' ? coupleStatus : soloStatus,
      soloStatus,
      coupleStatus,
      coupleMediaId,
    })
    setIsTVModalOpen(true)
  }

  const handleRemoveCoupleMedia = async (mediaId: number) => {
    try {
      await removeCoupleMedia(mediaId)
    } catch {
      return
    }
  }

  const addToWatched = async () => {
    if (!activeMedia || stars === null) return

    try {
      await addMedia(
        activeMedia.media,
        {
          status: 'watched',
          rating: stars,
          comment: null,
        },
        target,
      )

      closeStarsModal()
    } catch {
      return
    }
  }

  const addToFavorite = async () => {
    if (!activeMedia) return

    try {
      await addMedia(
        activeMedia.media,
        {
          status: 'planned',
          rating: null,
          comment,
        },
        target,
      )

      closeCommentModal()
    } catch {
      return
    }
  }

  const handleTVStatusChange = async (status: MediaWatchStatus) => {
    if (!activeMedia || status === 'planned') return

    if (status === 'watched') {
      setIsTVModalOpen(false)
      setActiveMedia({
        ...activeMedia,
        type: 'watched',
        status,
      })
      setIsStarsModalOpen(true)
      return
    }

    try {
      await addMedia(
        activeMedia.media,
        {
          status,
          rating: null,
          comment: null,
        },
        target,
      )

      closeTVModal()
    } catch {
      return
    }
  }

  const handleRemoveActiveStatus = async (closeModal: () => void) => {
    if (!activeMedia) return

    try {
      if (target === 'couple') {
        if (activeMedia.coupleMediaId === undefined) return
        await removeCoupleMedia(activeMedia.coupleMediaId)
      } else {
        await removeMedia(activeMedia.media)
      }
      closeModal()
    } catch {
      return
    }
  }

  const activeStatus = target === 'couple' ? activeMedia?.coupleStatus : activeMedia?.soloStatus

  return {
    handleFavoriteClick,
    handleWatchedClick,
    handleOpenTVModal,
    handleRemoveCoupleMedia,
    modalProps: {
      stars: {
        isOpen: isStarsModalOpen,
        onClose: closeStarsModal,
        setStars,
        stars,
        onSubmit: addToWatched,
        isSubmitting: isUpdating,
        currentStatus: activeStatus,
        onRemove: () => handleRemoveActiveStatus(closeStarsModal),
        target,
        onTargetChange,
        allowTargetSelection: data?.in_couple ?? false,
      },
      comment: {
        isOpen: isCommentModalOpen,
        onClose: closeCommentModal,
        comment: comment ?? '',
        onCommentChange: setComment,
        onSubmit: addToFavorite,
        isSubmitting: isUpdating,
        currentStatus: activeStatus,
        onRemove: () => handleRemoveActiveStatus(closeCommentModal),
        target,
        onTargetChange,
        allowTargetSelection: data?.in_couple ?? false,
      },
      tv: {
        currentStatus: activeStatus,
        onClick: handleTVStatusChange,
        onRemove: () => handleRemoveActiveStatus(closeTVModal),
        isOpen: isTVModalOpen,
        onClose: closeTVModal,
        isSubmitting: isUpdating,
        target,
        onTargetChange,
        allowTargetSelection: data?.in_couple ?? false,
      },
    },
  }
}
