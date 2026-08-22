import { useState } from 'react'
import type { AddMediaOptions, Media, MediaWatchStatus } from '../api/media/types'
import type { Variant } from '../api/couple/types'

export type AddMediaHandler = (
  media: Media,
  options: AddMediaOptions,
  variant: Variant,
) => Promise<void>

export type RemoveMediaHandler = (media: Pick<Media, 'id' | 'type'>) => Promise<void>
export type RemoveCoupleMediaHandler = (mediaId: number) => Promise<void>

interface UseAddMediaParams {
  addMedia: AddMediaHandler
  removeMedia: RemoveMediaHandler
  removeCoupleMedia: RemoveCoupleMediaHandler
  isUpdating: boolean
}

interface MediaAction {
  type: 'planned' | 'watched' | 'tv-status'
  media: Media
  status?: MediaWatchStatus
}

export const useAddMedia = ({
  addMedia,
  removeMedia,
  removeCoupleMedia,
  isUpdating,
}: UseAddMediaParams) => {
  const [variant, setVariant] = useState<Variant>('solo')
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isTVModalOpen, setIsTVModalOpen] = useState(false)
  const [activeMedia, setActiveMedia] = useState<MediaAction | null>(null)

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

  const handleFavoriteClick = (media: Media, status?: MediaWatchStatus) => {
    if (status === 'planned') {
      void removeMedia(media)
      return
    }

    setActiveMedia({ type: 'planned', media, status })
    setIsCommentModalOpen(true)
  }

  const handleWatchedClick = (media: Media, status?: MediaWatchStatus) => {
    if (status === 'watched') {
      void removeMedia(media)
      return
    }

    setActiveMedia({ type: 'watched', media, status })
    setIsStarsModalOpen(true)
  }

  const handleOpenTVModal = (media: Media, status?: MediaWatchStatus) => {
    setActiveMedia({ type: 'tv-status', media, status })
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
        variant,
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
        variant,
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
        type: 'watched',
        media: activeMedia.media,
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
        variant,
      )

      closeTVModal()
    } catch {
      return
    }
  }

  const handleRemoveTVStatus = async () => {
    if (!activeMedia) return

    try {
      await removeMedia(activeMedia.media)
      closeTVModal()
    } catch {
      return
    }
  }

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
        variant,
        setVariant,
      },
      comment: {
        isOpen: isCommentModalOpen,
        onClose: closeCommentModal,
        comment: comment ?? '',
        onCommentChange: setComment,
        onSubmit: addToFavorite,
        isSubmitting: isUpdating,
        variant,
        setVariant,
      },
      tv: {
        currentStatus: activeMedia?.status,
        onClick: handleTVStatusChange,
        onRemove: handleRemoveTVStatus,
        isOpen: isTVModalOpen,
        onClose: closeTVModal,
        isSubmitting: isUpdating,
      },
    },
  }
}
