export type MoviesCategory = 'popular' | 'top_rated' | 'upcoming'

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Movie {
  adult: boolean
  backdrop_path: string | null
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

export interface FiltersType {
  search: string
  type: MoviesCategory
}

export type MovieWatchStatus = 'planned' | 'watched'

export interface UserMovie {
  user_id: string
  movie_id: number
  status: MovieWatchStatus
  watched_at: string | null
  created_at: string
  updated_at: string
}
