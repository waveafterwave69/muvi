import type { Variant } from '../couple/types'

export interface EpisodeProgress {
  season_number: number
  episode_number: number
  watched_at: string
}

export interface SetEpisodesWatchedParams {
  mediaId: number
  variant: Variant
  seasonNumber: number
  episodeNumbers: number[]
  watched: boolean
}

export interface MarkAllTVEpisodesWatchedParams {
  mediaId: number
  variant: Variant
}

export interface TVEpisodeCount {
  total: number
  seasons: Array<{
    season_number: number
    episode_numbers: number[]
  }>
}
