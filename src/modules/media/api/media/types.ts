export type MediaType = 'movie' | 'tv'

export interface MediaIdentity {
  id: number
  type: MediaType
}

export const getMediaKey = ({ id, type }: MediaIdentity): string => `${type}:${id}`

export const getMediaHref = ({ id, type }: MediaIdentity): string => `/media/${type}/${id}`

export type MediaCategory = 'popular' | 'top_rated' | 'upcoming'

export interface MediaResponse {
  page: number
  results: Media[]
  total_pages: number
  total_results: number
}

export interface Media {
  type: MediaType
  adult: boolean
  backdrop_path: string | null
  comment?: string | null
  rating?: number
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface DbMedia {
  id: number
  external_id: number
  source: string

  type: MediaType

  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]

  original_language: string
  original_title: string

  overview: string
  popularity: number

  poster_path: string | null
  release_date: string | null

  title: string
  video: boolean

  vote_average: number
  vote_count: number

  created_at: string
  updated_at: string
}

export interface FiltersType {
  search: string
  category: MediaCategory
  mediaType: MediaType
}

export type MediaWatchStatus = 'planned' | 'watched' | 'watching' | 'dropped'

export interface AddMediaOptions {
  status: MediaWatchStatus
  comment?: string | null
  rating?: number | null
}

export type MediaStatuses = Map<string, MediaWatchStatus>

export interface MediaStatusRow {
  status: MediaWatchStatus
  media: {
    external_id: number
    type: MediaType
  }
}

export interface GetMediaStatusesParams {
  userId: string
  media: MediaIdentity[]
}

export interface UserMedia {
  user_id: string
  media_id: number

  status: MediaWatchStatus

  rating: number | null
  comment: string | null

  watched_at: string | null
  created_at: string
  updated_at: string

  media: DbMedia
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserMediaResponse {
  items: UserMedia[]
  pagination: Pagination
}

export interface FavoriteFiltersType {
  mediaType: MediaType
  status: MediaWatchStatus
  search: string
}
