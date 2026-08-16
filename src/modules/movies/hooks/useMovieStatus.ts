import { useMemo } from 'react'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { AddMovieOptions, Movie } from '../api/movies/types'
import { useAddMovie, useMovieStatuses, useRemoveMovie } from '../api/movies/queries'
import { FullMovieDetail } from '../api/singleMovie/types'

export const useMovieStatus = (movies: Movie[] | Movie | FullMovieDetail | FullMovieDetail[]) => {
  const movieArray = Array.isArray(movies) ? movies : [movies]

  const movieIdsKey = movieArray.map((m) => m?.id).join(',')

  const external_ids = useMemo(() => {
    return movieArray.map((movie) => movie?.id).filter(Boolean)
  }, [movieIdsKey])

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
