import { useState } from 'react'
import { AddMediaOptions, Media } from '../api/media/types'

export type AddMediaHandler = (media: Media, options: AddMediaOptions) => Promise<void>

export const useAddMedia = (media: Media, addMedia: AddMediaHandler) => {
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  const addToWatched = async () => {
    if (stars === null) return

    try {
      await addMedia(media, {
        status: 'watched',
        rating: stars,
        comment: null,
      })

      setStars(null)
      setIsStarsModalOpen(false)
    } catch {
      return
    }
  }

  const addToFavorite = async () => {
    try {
      await addMedia(media, {
        status: 'planned',
        rating: null,
        comment,
      })

      setComment(null)
      setIsCommentModalOpen(false)
    } catch {
      return
    }
  }

  return {
    addToWatched,
    addToFavorite,
    isCommentModalOpen,
    isStarsModalOpen,
    setIsCommentModalOpen,
    setIsStarsModalOpen,
    setComment,
    setStars,
    stars,
    comment,
  }
}
