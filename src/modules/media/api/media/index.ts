import {
  AddMediaOptions,
  GetMediaStatusesParams,
  Media,
  MediaCategory,
  MediaResponse,
  MediaStatuses,
  MediaStatusRow,
  UserMedia,
  UserMediaResponse,
  getMediaKey,
} from './types'
import { supabase } from '@/shared/api/supabase'
import { MediaType, MediaWatchStatus, normalizeMediaComment } from '@/shared/domain/media'

export const getMedia = async ({
  page = 1,
  category = 'popular',
  mediaType = 'movie',
  search = '',
  collectionId,
  signal,
}: {
  page?: number
  category?: MediaCategory
  mediaType?: MediaType
  search?: string
  collectionId?: number
  signal?: AbortSignal
}): Promise<MediaResponse> => {
  const normalizedSearch = search.trim()

  const params = new URLSearchParams({
    page: String(page),
    category,
    type: mediaType,
  })

  if (normalizedSearch) {
    params.set('search', normalizedSearch)
  }

  if (collectionId) {
    params.set('collection', String(collectionId))
  }

  const response = await fetch(`/api/media?${params}`, { signal })

  if (!response.ok) {
    throw new Error('Не удалось загрузить каталог')
  }

  return response.json()
}

export const addMediaToCollection = async (
  media: Media,
  options: AddMediaOptions,
): Promise<void> => {
  const { status, comment, rating } = options

  const { error } = await supabase.rpc('add_media_to_collection', {
    p_external_id: media.id,
    p_type: media.type,

    p_adult: media.adult,
    p_backdrop_path: media.backdrop_path,
    p_genre_ids: media.genre_ids,

    p_original_language: media.original_language,
    p_original_title: media.original_title,

    p_overview: media.overview,
    p_popularity: media.popularity,

    p_poster_path: media.poster_path,

    p_release_date: media.release_date || null,

    p_title: media.title,
    p_video: media.video,

    p_vote_average: media.vote_average,
    p_vote_count: media.vote_count,

    p_status: status,

    p_comment: normalizeMediaComment(comment),

    p_rating: rating ?? null,
  })

  if (error) {
    throw new Error(`Не удалось добавить медиа: ${error.message}`, { cause: error })
  }
}

export const removeMediaFromCollection = async ({
  id,
  type,
}: Pick<Media, 'id' | 'type'>): Promise<void> => {
  const { data: deletedMediaId, error } =
    type === 'tv'
      ? await supabase.rpc('clear_tv_status', {
          p_external_id: id,
        })
      : await supabase.rpc('remove_media_from_collection', {
          p_external_id: id,
          p_type: type,
        })

  if (error) {
    throw new Error(`Не удалось удалить медиа: ${error.message}`, { cause: error })
  }

  if (deletedMediaId === null) {
    throw new Error(`Медиа с type=${type} и external_id=${id} не найдено в коллекции`)
  }
}

export const getMediaStatuses = async ({
  userId,
  media,
}: GetMediaStatusesParams): Promise<MediaStatuses> => {
  if (!media.length) {
    return new Map()
  }

  const externalIds = Array.from(new Set(media.map((item) => item.id)))
  const requestedKeys = new Set(media.map(getMediaKey))

  const { data, error } = await supabase
    .from('user_media')
    .select(
      `
      status,
      media:media!inner(external_id, type)
    `,
    )
    .eq('user_id', userId)
    .in('media.external_id', externalIds)
    .overrideTypes<MediaStatusRow[], { merge: false }>()

  if (error) throw error

  return new Map(
    data
      .map(
        (row) =>
          [getMediaKey({ id: row.media.external_id, type: row.media.type }), row.status] as const,
      )
      .filter(([key]) => requestedKeys.has(key)),
  )
}

export interface GetMediaParams {
  page?: number
  limit?: number
  mediaType?: MediaType
  status?: MediaWatchStatus
  search: string
}

export const getAllUserMedia = async ({
  page = 1,
  limit = 20,
  mediaType,
  status,
  search,
}: GetMediaParams): Promise<UserMediaResponse> => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from('user_media')
    .select(
      `
        user_id,
        media_id,
        status,
        rating,
        comment,
        watched_at,
        created_at,
        updated_at,
        media:media!inner (*)
      `,
      {
        count: 'exact',
      },
    )
    .eq('user_id', user?.id)
    .ilike('media.title', `%${search}%`)
    .order('created_at', {
      ascending: false,
    })
    .range(from, to)

  if (status) {
    query = query.eq('status', status)
  }

  if (mediaType) {
    query = query.eq('media.type', mediaType)
  }

  const { data, error, count } = await query.overrideTypes<UserMedia[], { merge: false }>()

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
