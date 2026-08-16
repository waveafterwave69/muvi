export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
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

export interface FullMovieDetail {
  id: number
  title: string
  overview: string
  backdrop_path: string | null
  poster_path: string | null
  release_date: string
  runtime: number
  vote_average: number
  genres: Genre[]
  director: string
  cast: CastMember[]
  reviews: Review[]
  timeline: TimelineEvent[]
}
