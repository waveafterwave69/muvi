export interface EpisodeProgress {
  season_number: number
  episode_number: number
  watched_at: string
}

export interface SetEpisodesWatchedParams {
  mediaId: number
  seasonNumber: number
  episodeNumbers: number[]
  watched: boolean
}

export interface TVEpisodeCount {
  total: number
  seasons: Array<{
    season_number: number
    episode_numbers: number[]
  }>
}
