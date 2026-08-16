import { useMovieActorsQuery, useMovieDetailQuery } from '../api/moviePage/queries'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { useGetUserMovies } from '@/modules/profile/api/profile/queries'
import { useMovieStatuses } from '../api/movies/queries'

interface MoviePageUserMovie {
  status: 'watched' | 'planned' | string
  comment: string | null
  rating: number | null
  watched_at: string | null
  movies: {
    id: number
    external_id: number
    title: string
    overview: string
  }
}

export const useMoviePage = (movieId: number, currentUserId: string) => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()

  const { data: userMoviesData = [], isLoading: isMoviesLoading } = useGetUserMovies(
    currentUser?.id ?? '',
    !!currentUser?.id,
  )
  const userMovies = userMoviesData as unknown as MoviePageUserMovie[]
  const favMovies = userMovies.filter((movie) => {
    return movie.status === 'planned'
  })
  const watchedMovies = userMovies.filter((movie) => {
    return movie.status === 'watched'
  })

  const parsedMovieId = Array.isArray(movieId) ? Number(movieId[0]) : Number(movieId)
  const isValidId = !isNaN(parsedMovieId) && parsedMovieId > 0

  const {
    data: movie,
    isLoading: isMovieLoading,
    error: movieError,
  } = useMovieDetailQuery(parsedMovieId)

  const { isPending: isStatusesLoading } = useMovieStatuses({
    userId: currentUserId,
    externalIds: isValidId ? [parsedMovieId] : [],
  })

  const { data: actors } = useMovieActorsQuery(movieId)

  return {
    movie,
    actors,
    favMovies,
    watchedMovies,
    isUserLoading,
    isMoviesLoading,
    isValidId,
    isMovieLoading,
    movieError,
    isStatusesLoading,
  }
}
