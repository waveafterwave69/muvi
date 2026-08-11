import { NextResponse } from 'next/server'
import type { MoviesCategory, MoviesResponse } from '@/modules/movies/api/types'

const TMDB_URL = 'https://api.themoviedb.org/3'
const MOVIES_CATEGORIES = new Set<MoviesCategory>(['popular', 'top_rated', 'upcoming'])

const isMoviesCategory = (value: string): value is MoviesCategory => {
  return MOVIES_CATEGORIES.has(value as MoviesCategory)
}

export async function GET(request: Request) {
  const token = process.env.TMDB_API_KEY

  if (!token) {
    console.error('TMDB_API_KEY is not configured')
    return NextResponse.json({ error: 'Сервис фильмов не настроен' }, { status: 500 })
  }

  const requestUrl = new URL(request.url)
  const category = requestUrl.searchParams.get('category') ?? 'popular'
  const search = requestUrl.searchParams.get('search')?.trim() ?? ''
  const page = Number(requestUrl.searchParams.get('page') ?? '1')

  if (!isMoviesCategory(category)) {
    return NextResponse.json({ error: 'Неизвестная категория фильмов' }, { status: 400 })
  }

  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return NextResponse.json({ error: 'Некорректный номер страницы' }, { status: 400 })
  }

  const endpoint = search ? `${TMDB_URL}/search/movie` : `${TMDB_URL}/movie/${category}`
  const params = new URLSearchParams({
    page: String(page),
    language: 'ru-RU',
    include_adult: 'false',
  })

  if (search) {
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
      return NextResponse.json({ error: 'Не удалось загрузить фильмы' }, { status: 502 })
    }

    const movies: MoviesResponse = await response.json()
    return NextResponse.json(movies)
  } catch (error) {
    console.error('TMDB request failed', error)
    return NextResponse.json({ error: 'Не удалось загрузить фильмы' }, { status: 502 })
  }
}
