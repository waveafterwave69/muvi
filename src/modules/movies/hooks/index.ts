import type { AddMovieOptions, Movie } from '../api/types'
import { useMemo } from 'react'
import { useAddMovie, useMovieStatuses, useRemoveMovie } from '../api/queries'
import { useCurrentUser } from '@/modules/auth'

export const useMovieStatus = (movies: Movie[]) => {
  const external_ids = useMemo(() => {
    return movies.map((movie) => movie.id)
  }, [movies])
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
