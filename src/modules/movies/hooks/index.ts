'use client'

import { Movie, MovieWatchStatus } from '../api/types'
import { supabase } from '@/shared/api/supabase'
import { useEffect, useState } from 'react'

export type CollectionEntry = {
  movieId: number
  status: MovieWatchStatus
}

type MovieStatusRow = {
  movie_id: number
  status: MovieWatchStatus
  movie: {
    external_id: number
  }
}

export interface AddMovieOptions {
  status: MovieWatchStatus
  comment?: string | null
  rating?: number | null
}

export const useMovieStatus = (movies: Movie[]) => {
  const [statuses, setStatuses] = useState<Map<number, CollectionEntry>>(() => new Map())
  const [collectionError, setCollectionError] = useState<string | null>(null)
  const [pendingMovieIds, setPendingMovieIds] = useState<Set<number>>(() => new Set())

  async function getMovieStatuses(externalIds: number[]): Promise<Map<number, CollectionEntry>> {
    if (!externalIds.length) {
      return new Map<number, CollectionEntry>()
    }

    const { data, error } = await supabase
      .from('user_movies')
      .select(
        `
      movie_id,
      status,
      movie:movies!inner(external_id)
    `,
      )
      .in('movie.external_id', externalIds)
      .overrideTypes<MovieStatusRow[], { merge: false }>()

    if (error) throw error

    return new Map(
      data.map((item) => [
        item.movie.external_id,
        {
          movieId: item.movie_id,
          status: item.status,
        },
      ]),
    )
  }

  useEffect(() => {
    let shouldIgnoreResult = false

    const loadStatuses = async () => {
      try {
        const externalIds = movies.map((movie) => movie.id)
        const nextStatuses = await getMovieStatuses(externalIds)

        if (!shouldIgnoreResult) {
          setStatuses(nextStatuses)
        }
      } catch (error) {
        if (!shouldIgnoreResult) {
          setCollectionError(getErrorMessage(error, 'Не удалось загрузить статусы коллекции'))
        }
      }
    }

    void loadStatuses()

    return () => {
      shouldIgnoreResult = true
    }
  }, [movies])

  const addMovieToCollection = async (movie: Movie, options: AddMovieOptions) => {
    const { status, comment, rating } = options
    setCollectionError(null)
    setMoviePending(movie.id, true)

    try {
      const { error } = await supabase
        .rpc('add_movie_to_collection', {
          p_external_id: movie.id,

          p_adult: movie.adult,
          p_backdrop_path: movie.backdrop_path,
          p_genre_ids: movie.genre_ids,

          p_original_language: movie.original_language,
          p_original_title: movie.original_title,

          p_overview: movie.overview,
          p_popularity: movie.popularity,

          p_poster_path: movie.poster_path,

          p_release_date: movie.release_date || null,

          p_title: movie.title,
          p_video: movie.video,

          p_vote_average: movie.vote_average,
          p_vote_count: movie.vote_count,

          p_status: status,

          p_comment: comment?.trim() || null,

          p_rating: rating ?? null,
        })
        .single()

      if (error) {
        throw error
      }

      setStatuses((prev) => {
        const next = new Map(prev)
        next.set(movie.id, {
          movieId: movie.id,
          status,
        })

        return next
      })
    } catch (error) {
      setCollectionError(getErrorMessage(error, 'Не удалось добавить фильм в коллекцию'))
    } finally {
      setMoviePending(movie.id, false)
    }
  }

  const removeMovieFromCollection = async (externalMovieId: number): Promise<void> => {
    setCollectionError(null)
    setMoviePending(externalMovieId, true)

    try {
      const { data: deletedMovieId, error } = await supabase.rpc('remove_movie_from_collection', {
        p_external_id: externalMovieId,
      })

      if (error) {
        throw error
      }

      if (deletedMovieId === null) {
        throw new Error(`Фильм с external_id=${externalMovieId} не найден в коллекции`)
      }

      setStatuses((prev) => {
        const next = new Map(prev)
        next.delete(externalMovieId)

        return next
      })
    } catch (error) {
      setCollectionError(getErrorMessage(error, 'Не удалось удалить фильм из коллекции'))
    } finally {
      setMoviePending(externalMovieId, false)
    }
  }

  const setMoviePending = (movieId: number, isPending: boolean) => {
    setPendingMovieIds((prev) => {
      const next = new Set(prev)

      if (isPending) {
        next.add(movieId)
      } else {
        next.delete(movieId)
      }

      return next
    })
  }

  return {
    addMovieToCollection,
    collectionError,
    pendingMovieIds,
    removeMovieFromCollection,
    statuses,
  }

  function getErrorMessage(error: unknown, fallback: string) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message
    }

    return fallback
  }
}
