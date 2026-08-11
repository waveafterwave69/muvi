import type {
  AddMovieOptions,
  GetMovieStatusesParams,
  Movie,
  MoviesCategory,
  MoviesResponse,
  MovieStatuses,
  MovieStatusRow,
} from './types'
import { supabase } from '@/shared/api/supabase'

export const getMovies = async ({
  page = 1,
  category = 'popular',
  search = '',
  signal,
}: {
  page?: number
  category?: MoviesCategory
  search?: string
  signal?: AbortSignal
}): Promise<MoviesResponse> => {
  const normalizedSearch = search.trim()

  const params = new URLSearchParams({
    page: String(page),
    category,
  })

  if (normalizedSearch) {
    params.set('search', normalizedSearch)
  }

  const response = await fetch(`/api/movies?${params}`, { signal })

  if (!response.ok) {
    throw new Error('Не удалось загрузить фильмы')
  }

  return response.json()
}

export const addMovieToCollection = async (
  movie: Movie,
  options: AddMovieOptions,
): Promise<void> => {
  const { status, comment, rating } = options

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
  } catch (error) {
    throw new Error('Не удалось добавить фильм', { cause: error })
  }
}

export const removeMovieFromCollection = async (externalMovieId: number): Promise<void> => {
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
  } catch (error) {
    throw new Error('Не удалось удалить фильм', { cause: error })
  }
}

export const getMovieStatuses = async ({
  userId,
  externalIds,
}: GetMovieStatusesParams): Promise<MovieStatuses> => {
  if (!externalIds.length) {
    return new Map()
  }

  const { data, error } = await supabase
    .from('user_movies')
    .select(
      `
      status,
      movie:movies!inner(external_id)
    `,
    )
    .eq('user_id', userId)
    .in('movie.external_id', externalIds)
    .overrideTypes<MovieStatusRow[], { merge: false }>()

  if (error) throw error

  return new Map(data.map((row) => [row.movie.external_id, row.status]))
}
