import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { AddMovieOptions, Movie } from '../api/movies/types'
import { useAddMovie, useMovieStatuses, useRemoveMovie } from '../api/movies/queries'
import { FullMovieDetail } from '../api/moviePage/types'

export const useMovieStatus = (movies: Movie[] | Movie | FullMovieDetail | FullMovieDetail[]) => {
  const movieArray = Array.isArray(movies) ? movies : [movies]
  const external_ids = movieArray.map((movie) => movie?.id).filter(Boolean)

  const { data } = useCurrentUser()
  const userId = data?.id
  const addMovieToCollection = useAddMovie(userId ?? '')
  const removeMovieFromCollection = useRemoveMovie(userId ?? '')

  const {
    statuses,
    isPending: isStatusesPending,
    isFetching: isStatusesFetching,
  } = useMovieStatuses({
    userId: userId ?? '',
    externalIds: external_ids,
  })

  const addMovie = (movie: Movie, options: AddMovieOptions) => {
    return addMovieToCollection.mutateAsync({
      movie,
      options,
    })
  }

  const removeMovie = (externalMovieId: number) => {
    return removeMovieFromCollection.mutateAsync(externalMovieId)
  }

  return {
    addMovie,
    removeMovie,
    statuses,
    isUpdating:
      addMovieToCollection.isPending ||
      removeMovieFromCollection.isPending ||
      isStatusesPending ||
      isStatusesFetching,
  }
}
