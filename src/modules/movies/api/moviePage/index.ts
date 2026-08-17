import type { CastMember, FullMovieDetail } from './types'
import type { MoviesResponse } from '../movies/types'

interface MovieDetailResponse extends FullMovieDetail {
  credits?: {
    cast?: CastMember[]
    crew?: Array<{ job?: string; name?: string }>
  }
}

export const getMovieById = async (
  movieId: number,
  signal?: AbortSignal,
): Promise<MovieDetailResponse> => {
  const response = await fetch(`/api/movies/${movieId}`, { signal })

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const rawData = (await response.json()) as MovieDetailResponse

  return {
    ...rawData,
    director:
      rawData.credits?.crew?.find((member) => member.job === 'Director')?.name || 'Неизвестно',
  }
}

export const getMovieCollection = async (
  collectionId: number,
  signal?: AbortSignal,
): Promise<MoviesResponse> => {
  const params = new URLSearchParams({
    collection: String(collectionId),
    page: '1',
  })
  const response = await fetch(`/api/movies?${params}`, { signal })

  if (!response.ok) {
    throw new Error('Не удалось загрузить фильмы коллекции')
  }

  return response.json()
}
