import { NextResponse } from 'next/server'

const TMDB_URL = 'https://api.themoviedb.org/3'

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params:
      | Promise<{ id: string; seasonNumber: string }>
      | { id: string; seasonNumber: string }
  },
) {
  const token = process.env.TMDB_API_KEY

  if (!token) {
    return NextResponse.json({ error: 'Сервис каталога не настроен' }, { status: 500 })
  }

  const resolvedParams = 'then' in params ? await params : params
  const mediaId = Number(resolvedParams.id)
  const seasonNumber = Number(resolvedParams.seasonNumber)

  if (!Number.isInteger(mediaId) || mediaId <= 0 || !Number.isInteger(seasonNumber) || seasonNumber < 0) {
    return NextResponse.json({ error: 'Некорректный идентификатор сезона' }, { status: 400 })
  }

  const urlParams = new URLSearchParams({ language: 'ru-RU' })

  try {
    const response = await fetch(
      `${TMDB_URL}/tv/${mediaId}/season/${seasonNumber}?${urlParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 404 ? 'Сезон не найден' : 'Не удалось загрузить сезон' },
        { status: response.status === 404 ? 404 : 502 },
      )
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Ошибка при запросе сезона в TMDB:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 502 })
  }
}
