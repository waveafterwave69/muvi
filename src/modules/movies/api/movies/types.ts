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

export interface DbMovie {
  id: number;
  external_id: number;
  source: string;

  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];

  original_language: string;
  original_title: string;

  overview: string;
  popularity: number;

  poster_path: string | null;
  release_date: string | null;

  title: string;
  video: boolean;

  vote_average: number;
  vote_count: number;

  created_at: string;
  updated_at: string;
}

export interface FiltersType {
  search: string
  type: MoviesCategory
}

export type MovieWatchStatus = 'planned' | 'watched'

export interface AddMovieOptions {
  status: MovieWatchStatus
  comment?: string | null
  rating?: number | null
}

export type MovieStatuses = Map<number, MovieWatchStatus>

export interface MovieStatusRow {
  status: MovieWatchStatus
  movie: {
    external_id: number
  }
}

export interface GetMovieStatusesParams {
  userId: string
  externalIds: number[]
}

export interface UserMovie {
  user_id: string;
  movie_id: number;

  status: MovieWatchStatus;

  rating: number | null;
  comment: string | null;

  watched_at: string | null;
  created_at: string;
  updated_at: string;

  movie: DbMovie;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserMoviesResponse {
  items: UserMovie[];
  pagination: Pagination;
}

export interface  FavoriteFiltersType {
  status: 'planned' | 'watched'
  search: string;
}
