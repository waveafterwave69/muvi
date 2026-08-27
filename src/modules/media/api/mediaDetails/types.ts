import type { Media, MediaResponse } from '../media/types'

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

export interface TVSeasonSummary {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

export interface TVEpisode {
  air_date: string | null
  episode_number: number
  id: number
  name: string
  overview: string
  runtime: number | null
  season_number: number
  still_path: string | null
}

export interface TVSeasonDetails {
  air_date: string | null
  episodes: TVEpisode[]
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

export interface MediaDetails extends Media {
  belongs_to_collection: MovieCollection | null
  runtime: number
  number_of_episodes?: number
  number_of_seasons?: number
  seasons?: TVSeasonSummary[]
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
