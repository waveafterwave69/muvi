import { NextResponse } from 'next/server'

const TMDB_URL = 'https://api.themoviedb.org/3'

interface TVDetailsResponse {
  number_of_episodes?: number
  seasons?: Array<{ episode_count?: number; season_number?: number }>
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const token = process.env.TMDB_API_KEY
  const resolvedParams = 'then' in params ? await params : params
  const mediaId = Number(resolvedParams.id)

  if (!token) {
    return NextResponse.json({ error: 'Сервис каталога не настроен' }, { status: 500 })
  }

  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return NextResponse.json({ error: 'Некорректный идентификатор сериала' }, { status: 400 })
  }

  try {
    const response = await fetch(`${TMDB_URL}/tv/${mediaId}?language=ru-RU`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 1800 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Не удалось загрузить данные сериала' }, { status: 502 })
    }

    const data = (await response.json()) as TVDetailsResponse
    const seasons = (data.seasons ?? [])
      .filter(
        (season) =>
          (season.season_number ?? 0) > 0 && (season.episode_count ?? 0) > 0,
      )
      .map((season) => ({
        season_number: season.season_number!,
        episode_numbers: Array.from(
          { length: season.episode_count! },
          (_, index) => index + 1,
        ),
      }))
    const fallbackTotal = seasons.reduce(
      (total, season) => total + season.episode_numbers.length,
      0,
    )

    return NextResponse.json({
      total: data.number_of_episodes ?? fallbackTotal,
      seasons,
    })
  } catch (error) {
    console.error('Ошибка при загрузке количества серий из TMDB:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 502 })
  }
}
