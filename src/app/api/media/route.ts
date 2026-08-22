import {
  MediaType,
  Media,
  MediaCategory,
  MediaResponse,
} from '@/modules/media/api/media/types'
import { NextResponse } from 'next/server'

const TMDB_URL = 'https://api.themoviedb.org/3'
const MEDIA_CATEGORIES = new Set<MediaCategory>(['popular', 'top_rated', 'upcoming'])
const MEDIA_TYPES = new Set<MediaType>(['movie', 'tv'])

const isMediaCategory = (value: string): value is MediaCategory => {
  return MEDIA_CATEGORIES.has(value as MediaCategory)
}

interface CollectionResponse {
  parts: TmdbMedia[]
}

interface TmdbMedia {
  adult?: boolean
  backdrop_path?: string | null
  genre_ids?: number[]
  id: number
  name?: string
  original_language?: string
  original_name?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string | null
  first_air_date?: string
  release_date?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

interface TmdbMediaResponse {
  page: number
  results: TmdbMedia[]
  total_pages: number
  total_results: number
}

const normalizeMedia = (media: TmdbMedia, type: MediaType): Media => {
  return {
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
  }
}

export async function GET(request: Request) {
  const token = process.env.TMDB_API_KEY

  if (!token) {
    console.error('TMDB_API_KEY is not configured')
    return NextResponse.json({ error: 'Сервис каталога не настроен' }, { status: 500 })
  }

  const requestUrl = new URL(request.url)
  const category = requestUrl.searchParams.get('category') ?? 'popular'
  const typeParam = requestUrl.searchParams.get('type') ?? 'movie'
  const search = requestUrl.searchParams.get('search')?.trim() ?? ''
  const collectionParam = requestUrl.searchParams.get('collection')
  const collectionId = collectionParam ? Number(collectionParam) : undefined
  const page = Number(requestUrl.searchParams.get('page') ?? '1')

  if (!MEDIA_TYPES.has(typeParam as MediaType)) {
    return NextResponse.json({ error: 'Неизвестный тип медиа' }, { status: 400 })
  }

  const mediaType = typeParam as MediaType

  if (!isMediaCategory(category)) {
    return NextResponse.json({ error: 'Неизвестная категория медиа' }, { status: 400 })
  }

  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return NextResponse.json({ error: 'Некорректный номер страницы' }, { status: 400 })
  }

  if (collectionId !== undefined && (!Number.isInteger(collectionId) || collectionId < 1)) {
    return NextResponse.json({ error: 'Некорректный ID коллекции' }, { status: 400 })
  }

  if (collectionId && mediaType !== 'movie') {
    return NextResponse.json({ error: 'Коллекции доступны только для фильмов' }, { status: 400 })
  }

  const endpointCategory = mediaType === 'tv' && category === 'upcoming' ? 'on_the_air' : category

  const endpoint = collectionId
    ? `${TMDB_URL}/collection/${collectionId}`
    : search
      ? `${TMDB_URL}/search/${mediaType}`
      : `${TMDB_URL}/${mediaType}/${endpointCategory}`
  const params = new URLSearchParams({
    language: 'ru-RU',
  })

  if (!collectionId) {
    params.set('page', String(page))
    params.set('include_adult', 'false')
  }

  if (search && !collectionId) {
    params.set('query', search)
  }

  try {
    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 60,
      },
    })

    if (!response.ok) {
      console.error(`TMDB request failed with status ${response.status}`)
      return NextResponse.json({ error: 'Не удалось загрузить каталог' }, { status: 502 })
    }

    if (collectionId) {
      const collection: CollectionResponse = await response.json()
      const media: MediaResponse = {
        page: 1,
        results: collection.parts.map((item) => normalizeMedia(item, 'movie')),
        total_pages: 1,
        total_results: collection.parts.length,
      }

      return NextResponse.json(media)
    }

    const mediaResponse: TmdbMediaResponse = await response.json()
    const normalizedResponse: MediaResponse = {
      ...mediaResponse,
      results: mediaResponse.results.map((item) => normalizeMedia(item, mediaType)),
    }
    return NextResponse.json(normalizedResponse)
  } catch (error) {
    console.error('TMDB request failed', error)
    return NextResponse.json({ error: 'Не удалось загрузить каталог' }, { status: 502 })
  }
}
