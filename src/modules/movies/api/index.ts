import type { MoviesCategory, MoviesResponse } from './types'

export async function getMovies({
  page = 1,
  category = 'popular',
  search = '',
  signal,
}: {
  page?: number
  category?: MoviesCategory
  search?: string
  signal?: AbortSignal
}): Promise<MoviesResponse> {
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
