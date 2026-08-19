import { useState } from 'react'
import { AddMovieOptions, Movie } from '../api/movies/types'

export type AddMovieHandler = (movie: Movie, options: AddMovieOptions) => Promise<void>

export const useAddMovie = (movie: Movie, addMovie: AddMovieHandler) => {
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  const addToWatched = async () => {
    if (stars === null) return

    try {
      await addMovie(movie, {
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
      await addMovie(movie, {
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
