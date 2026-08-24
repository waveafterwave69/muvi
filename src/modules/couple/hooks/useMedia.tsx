import { useState } from 'react'
import {
  useRemoveMediaFromCoupleCollection,
  useUpdateCoupleMedia,
} from '@/modules/couple/api/queries'
import type { CoupleMediaItem } from '@/modules/couple/api/types'
import { MediaWatchStatus } from '@/shared/domain/media'

type ModalType = 'stars' | 'comment' | 'tv' | null

interface ActiveMedia {
  id: number
  status: MediaWatchStatus
}

type MediaActionItem = Pick<CoupleMediaItem, 'media_id' | 'status'>

export const useMedia = (coupleId: string) => {
  const [modal, setModal] = useState<ModalType>(null)
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const updateCoupleMedia = useUpdateCoupleMedia()
  const removeCoupleMedia = useRemoveMediaFromCoupleCollection()
  const isUpdating = updateCoupleMedia.isPending || removeCoupleMedia.isPending

  const closeModal = () => {
    setModal(null)
    setStars(null)
    setComment('')
    setActiveMedia(null)
  }

  const openModal = (item: MediaActionItem, type: Exclude<ModalType, null>) => {
    setActiveMedia({ id: item.media_id, status: item.status })
    setModal(type)
  }

  const removeMedia = async (mediaId: number) => {
    if (isUpdating) return

    try {
      await removeCoupleMedia.mutateAsync(mediaId)
      closeModal()
    } catch {
      // Ошибка уже отображается в onError мутации.
    }
  }

  const handleFavoriteClick = (item: MediaActionItem) => {
    if (item.status === 'planned') {
      void removeMedia(item.media_id)
      return
    }

    openModal(item, 'comment')
  }

  const handleWatchedClick = (item: MediaActionItem) => {
    if (item.status === 'watched') {
      void removeMedia(item.media_id)
      return
    }

    openModal(item, 'stars')
  }

  const handleOpenTVModal = (item: MediaActionItem) => {
    openModal(item, 'tv')
  }

  const addToWatched = async () => {
    if (!activeMedia || stars === null || isUpdating) return

    try {
      await updateCoupleMedia.mutateAsync({
        coupleId,
        mediaId: activeMedia.id,
        status: 'watched',
        comment: null,
        rating: stars,
      })
      closeModal()
    } catch {
      // Ошибка уже отображается в onError мутации.
    }
  }

  const addToFavorite = async () => {
    if (!activeMedia || isUpdating) return

    try {
      await updateCoupleMedia.mutateAsync({
        coupleId,
        mediaId: activeMedia.id,
        status: 'planned',
        comment: comment.trim() || null,
        rating: null,
      })
      closeModal()
    } catch {
      // Ошибка уже отображается в onError мутации.
    }
  }

  const handleTVStatusChange = async (status: MediaWatchStatus) => {
    if (!activeMedia || status === 'planned' || isUpdating) return

    if (status === 'watched') {
      setActiveMedia((currentMedia) =>
        currentMedia ? { ...currentMedia, status: 'watched' } : null,
      )
      setModal('stars')
      return
    }

    try {
      await updateCoupleMedia.mutateAsync({
        coupleId,
        mediaId: activeMedia.id,
        status,
        comment: null,
        rating: null,
      })
      closeModal()
    } catch {
      // Ошибка уже отображается в onError мутации.
    }
  }

  const handleRemoveTVStatus = () => {
    if (!activeMedia) return
    void removeMedia(activeMedia.id)
  }

  return {
    handleFavoriteClick,
    handleWatchedClick,
    handleOpenTVModal,
    handleRemoveMedia: removeMedia,
    isUpdating,
    modalProps: {
      stars: {
        isOpen: modal === 'stars',
        onClose: closeModal,
        setStars,
        stars,
        onSubmit: addToWatched,
        isSubmitting: isUpdating,
        variant: 'couple' as const,
        setVariant: () => {},
        in_couple: false,
      },
      comment: {
        isOpen: modal === 'comment',
        onClose: closeModal,
        comment,
        onCommentChange: setComment,
        onSubmit: addToFavorite,
        isSubmitting: isUpdating,
        variant: 'couple' as const,
        setVariant: () => {},
        in_couple: false,
      },
      tv: {
        currentStatus: activeMedia?.status,
        onClick: handleTVStatusChange,
        onRemove: handleRemoveTVStatus,
        isOpen: modal === 'tv',
        onClose: closeModal,
        isSubmitting: isUpdating,
        variant: 'couple' as const,
        setVariant: () => {},
        in_couple: false,
      },
    },
  }
}
