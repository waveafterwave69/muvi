import { NextResponse } from 'next/server'
import type { Media } from '@/modules/media/api/media/types'
import { MediaType } from '@/shared/domain/media'

const TMDB_URL = 'https://api.themoviedb.org/3'
const MEDIA_TYPES = new Set<MediaType>(['movie', 'tv'])

interface RawMediaItem {
  adult?: boolean
  backdrop_path?: string | null
  first_air_date?: string
  genre_ids?: number[]
  id: number
  name?: string
  original_language?: string
  original_name?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string | null
  release_date?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

interface RawMediaDetail extends RawMediaItem {
  belongs_to_collection?: unknown
  episode_run_time?: number[]
  last_episode_to_air?: {
    runtime?: number | null
  } | null
  runtime?: number
  similar?: {
    page: number
    results: RawMediaItem[]
    total_pages: number
    total_results: number
  }
}

const normalizeMediaItem = (media: RawMediaItem, type: MediaType): Media => ({
  type,
  adult: media.adult ?? false,
  backdrop_path: media.backdrop_path ?? null,
  genre_ids: media.genre_ids ?? [],
  id: media.id,
  original_language: media.original_language ?? '',
  original_title: media.original_title ?? media.original_name ?? media.title ?? media.name ?? '',
  overview: media.overview ?? '',
  popularity: media.popularity ?? 0,
  poster_path: media.poster_path ?? null,
  release_date: media.release_date ?? media.first_air_date ?? '',
  title: media.title ?? media.name ?? '',
  video: media.video ?? false,
  vote_average: media.vote_average ?? 0,
  vote_count: media.vote_count ?? 0,
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; type: string }> | { id: string; type: string } },
) {
  const token = process.env.TMDB_API_KEY

  if (!token) {
    console.error('TMDB_API_KEY is not configured в .env')
    return NextResponse.json({ error: 'Сервис каталога не настроен' }, { status: 500 })
  }

  const resolvedParams = 'then' in params ? await params : params
  const mediaId = Number(resolvedParams.id)
  const typeParam = resolvedParams.type

  if (!MEDIA_TYPES.has(typeParam as MediaType)) {
    return NextResponse.json({ error: 'Неизвестный тип медиа' }, { status: 400 })
  }

  const mediaType = typeParam as MediaType

  if (isNaN(mediaId) || mediaId <= 0) {
    return NextResponse.json({ error: 'Некорректный идентификатор медиа' }, { status: 400 })
  }

  const urlParams = new URLSearchParams({
    language: 'ru-RU',
    append_to_response: 'credits,reviews,videos,similar,external_ids',
    include_image_language: 'ru,en,null',
    include_video_language: 'ru,en,null',
  })

  try {
    const response = await fetch(`${TMDB_URL}/${mediaType}/${mediaId}?${urlParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 300,
      },
    })

    if (!response.ok) {
      console.error(`TMDB API вернул статус: ${response.status}`)
      if (response.status === 404) {
        return NextResponse.json({ error: 'Медиа не найдено в базе TMDB' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Не удалось загрузить данные от TMDB' }, { status: 502 })
    }

    const rawDetail: RawMediaDetail = await response.json()
    const normalizedDetail = {
      ...rawDetail,
      ...normalizeMediaItem(rawDetail, mediaType),
      belongs_to_collection: mediaType === 'movie' ? (rawDetail.belongs_to_collection ?? null) : null,
      runtime:
        rawDetail.runtime ??
        rawDetail.episode_run_time?.[0] ??
        rawDetail.last_episode_to_air?.runtime ??
        0,
      similar: rawDetail.similar
        ? {
            ...rawDetail.similar,
            results: rawDetail.similar.results.map((item) => normalizeMediaItem(item, mediaType)),
          }
        : undefined,
    }
    return NextResponse.json(normalizedDetail)
  } catch (error) {
    console.error('Ошибка на сервере при запросе к TMDB:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 502 })
  }
}
