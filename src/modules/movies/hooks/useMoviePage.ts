import { useMovieCollectionQuery, useMovieDetailQuery } from '../api/moviePage/queries'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'

export const useMoviePage = (movieId: number) => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()

  const parsedMovieId = Array.isArray(movieId) ? Number(movieId[0]) : Number(movieId)
  const isValidId = !isNaN(parsedMovieId) && parsedMovieId > 0

  const {
    data: movie,
    isLoading: isMovieLoading,
    error: movieError,
  } = useMovieDetailQuery(parsedMovieId)

  const actors = movie?.credits?.cast || []

  const { data: collection, isLoading: isCollectionLoading } = useMovieCollectionQuery(
    movie?.belongs_to_collection?.id,
  )

  return {
    movie,
    actors,
    isUserLoading,
    isValidId,
    isMovieLoading,
    movieError,
    similarMovies: movie?.similar?.results ?? [],
    collectionMovies: collection?.results ?? [],
    isCollectionLoading,
    currentUser,
  }
}
