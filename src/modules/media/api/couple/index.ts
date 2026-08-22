import { supabase } from '@/shared/api/supabase'
import {
  getMediaKey,
  type AddMediaOptions,
  type Media,
  type MediaIdentity,
  type MediaStatusRow,
  type MediaWatchStatus,
} from '../media/types'
import type { CoupleMediaStatusMap } from './types'
import { normalizeMediaComment } from '../../lib/mediaComment'

export interface AddMediaToCoupleResult {
  couple_id: string
  media_id: number
  added_by: string
  status: MediaWatchStatus
}

export const addMediaToCoupleCollection = async (
  media: Media,
  options: AddMediaOptions,
): Promise<void> => {
  const { status, comment, rating } = options

  const { data, error } = await supabase.rpc('add_media_to_couple_collection', {
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
    throw new Error(`Не удалось добавить медиа в коллекцию пары: ${error.message}`, {
      cause: error,
    })
  }

  if (!data) {
    throw new Error('Сервер не вернул результат добавления медиа в коллекцию пары')
  }
}

export const getCoupleMediaStatuses = async (
  media: MediaIdentity[],
): Promise<CoupleMediaStatusMap> => {
  if (!media.length) {
    return new Map()
  }

  const externalIds = Array.from(new Set(media.map((item) => item.id)))
  const requestedKeys = new Set(media.map(getMediaKey))

  const { data, error } = await supabase
    .from('couple_media')
    .select(
      `
        media_id,
        status,
        media:media!inner(external_id, type)
      `,
    )
    .in('media.external_id', externalIds)
    .overrideTypes<Array<MediaStatusRow & { media_id: number }>, { merge: false }>()

  if (error) {
    throw new Error(`Не удалось получить статусы медиа пары: ${error.message}`, {
      cause: error,
    })
  }

  return new Map(
    data
      .map(
        (row) =>
          [
            getMediaKey({ id: row.media.external_id, type: row.media.type }),
            { mediaId: row.media_id, status: row.status },
          ] as const,
      )
      .filter(([key]) => requestedKeys.has(key)),
  )
}

export const removeMediaFromCoupleCollection = async (mediaId: number): Promise<void> => {
  const { data, error } = await supabase.rpc('remove_media_from_couple_collection', {
    p_media_id: mediaId,
  })

  if (error) {
    throw new Error(`Не удалось удалить медиа из коллекции пары: ${error.message}`, {
      cause: error,
    })
  }

  if (!data) {
    throw new Error('Медиа не найдено в коллекции пары')
  }
}
