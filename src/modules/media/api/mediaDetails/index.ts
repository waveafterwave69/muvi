import type { CastMember, MediaDetails } from './types'
import type { MediaResponse, MediaType } from '../media/types'

interface MediaDetailsResponse extends MediaDetails {
  created_by?: Array<{ name?: string }>
  credits?: {
    cast?: CastMember[]
    crew?: Array<{ job?: string; name?: string }>
  }
}

export const getMediaById = async (
  mediaId: number,
  mediaType: MediaType = 'movie',
  signal?: AbortSignal,
): Promise<MediaDetailsResponse> => {
  const response = await fetch(`/api/media/${mediaType}/${mediaId}`, { signal })

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const rawData = (await response.json()) as MediaDetailsResponse

  return {
    ...rawData,
    director:
      (rawData.type === 'tv'
        ? rawData.created_by?.[0]?.name
        : rawData.credits?.crew?.find((member) => member.job === 'Director')?.name) || 'Неизвестно',
  }
}

export const getMovieCollection = async (
  collectionId: number,
  signal?: AbortSignal,
): Promise<MediaResponse> => {
  const params = new URLSearchParams({
    collection: String(collectionId),
    page: '1',
  })
  const response = await fetch(`/api/media?${params}`, { signal })

  if (!response.ok) {
    throw new Error('Не удалось загрузить фильмы коллекции')
  }

  return response.json()
}
