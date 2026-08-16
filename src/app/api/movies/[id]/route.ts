import { NextResponse } from 'next/server'

const TMDB_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const token = process.env.TMDB_API_KEY

  if (!token) {
    console.error('TMDB_API_KEY is not configured в .env')
    return NextResponse.json({ error: 'Сервис фильмов не настроен' }, { status: 500 })
  }

  const resolvedParams = 'then' in params ? await params : params
  const movieId = Number(resolvedParams.id)

  if (isNaN(movieId) || movieId <= 0) {
    return NextResponse.json({ error: 'Некорректный идентификатор фильма' }, { status: 400 })
  }

  const urlParams = new URLSearchParams({
    language: 'ru-RU',
    append_to_response: 'credits,reviews,videos',
    include_image_language: 'ru,en,null',
    include_video_language: 'ru,en,null',
  })

  try {
    const response = await fetch(`${TMDB_URL}/movie/${movieId}?${urlParams}`, {
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
        return NextResponse.json({ error: 'Фильм не найден в базе TMDB' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Не удалось загрузить данные от TMDB' }, { status: 502 })
    }

    const movieDetail = await response.json()
    return NextResponse.json(movieDetail)
  } catch (error) {
    console.error('Ошибка на сервере при запросе к TMDB:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 502 })
  }
}
