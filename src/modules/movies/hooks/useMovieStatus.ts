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

  const { statuses, isPending } = useMovieStatuses({
    userId: userId ?? '',
    externalIds: external_ids,
  })

  const addMovie = async (movie: Movie, options: AddMovieOptions) => {
    addMovieToCollection.mutate({
      movie,
      options,
    })
  }

  const removeMovie = async (externalMovieId: number): Promise<void> => {
    removeMovieFromCollection.mutate(externalMovieId)
  }

  return {
    addMovie,
    removeMovie,
    statuses,
    isPending,
  }
}
