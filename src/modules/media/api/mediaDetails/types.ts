import type { Media, MediaResponse, MediaType } from '../media/types'

export interface Genre {
  id: number
  name: string
}

export interface MovieCollection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface CastMember {
  adult: boolean
  cast_id: number
  character: string
  credit_id: string
  gender: number
  id: number
  known_for_department: string
  name: string
  order: number
  original_name: string
  popularity: number
  profile_path: string | null
}

export interface Review {
  id: string
  author: string
  rating: number
  content: string
  created_at: string
}

export interface TimelineEvent {
  id: number
  title: string
  year: number
  description: string
  isActive?: boolean
}

export interface MediaVideo {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  official: boolean
  published_at: string
  site: string
  size: number
  type: string
}

export interface MediaDetails {
  type: MediaType
  id: number
  title: string
  overview: string
  backdrop_path: string | null
  poster_path: string | null
  belongs_to_collection: MovieCollection | null
  release_date: string
  runtime: number
  vote_average: number
  genres: Genre[]
  director: string
  cast: CastMember[]
  reviews: Review[]
  timeline: TimelineEvent[]
  videos?: {
    results: MediaVideo[]
  }
  similar?: MediaResponse
  external_ids?: {
    wikidata_id?: string | null
  }
}

export type { Media }
