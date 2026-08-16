import { useState } from 'react'
import { Movie } from '../api/movies/types'
import { useMovieStatus } from './useMovieStatus'

export const useAddMovie = (movie: Movie) => {
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  const { addMovie } = useMovieStatus(movie)

  const addToWatched = () => {
    void addMovie(movie, {
      status: 'watched',
      rating: stars,
      comment: null,
    })
    setStars(null)
    setIsStarsModalOpen(false)
  }

  const addToFavorite = () => {
    void addMovie(movie, {
      status: 'planned',
      rating: null,
      comment: comment,
    })
    setComment(null)
    setIsCommentModalOpen(false)
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
