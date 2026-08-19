import {
  AddMovieOptions,
  GetMovieStatusesParams,
  Movie,
  MoviesCategory,
  MoviesResponse,
  MovieStatuses,
  MovieStatusRow,
  MovieWatchStatus,
  UserMovie,
  UserMoviesResponse,
} from './types'
import { supabase } from '@/shared/api/supabase'

export const getMovies = async ({
  page = 1,
  category = 'popular',
  search = '',
  collectionId,
  signal,
}: {
  page?: number
  category?: MoviesCategory
  search?: string
  collectionId?: number
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

  if (collectionId) {
    params.set('collection', String(collectionId))
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

  const { error } = await supabase.rpc('add_movie_to_collection', {
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

  if (error) {
    throw new Error(`Не удалось добавить фильм: ${error.message}`, { cause: error })
  }
}

export const removeMovieFromCollection = async (externalMovieId: number): Promise<void> => {
  const { data: deletedMovieId, error } = await supabase.rpc('remove_movie_from_collection', {
    p_external_id: externalMovieId,
  })

  if (error) {
    throw new Error(`Не удалось удалить фильм: ${error.message}`, { cause: error })
  }

  if (deletedMovieId === null) {
    throw new Error(`Фильм с external_id=${externalMovieId} не найден в коллекции`)
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

export interface GetMoviesParams {
  page?: number
  limit?: number
  status?: MovieWatchStatus
  search: string
}

export const getAllUserMovies = async ({
  page = 1,
  limit = 20,
  status,
  search,
}: GetMoviesParams): Promise<UserMoviesResponse> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from('user_movies')
    .select(
      `
        user_id,
        movie_id,
        status,
        rating,
        comment,
        watched_at,
        created_at,
        updated_at,
        movie:movies!inner (*)
      `,
      {
        count: 'exact',
      },
    )
    .eq('user_id', user?.id)
    .ilike('movies.title', `%${search}%`)
    .order('created_at', {
      ascending: false,
    })
    .range(from, to)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query.overrideTypes<UserMovie[], { merge: false }>()

  if (error) {
    throw error
  }

  const total = count ?? 0

  return {
    items: data ?? [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  }
}
