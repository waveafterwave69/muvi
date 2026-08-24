export type MediaWatchStatus = 'planned' | 'watched' | 'watching' | 'dropped'

export type MediaType = 'movie' | 'tv'

export interface MediaIdentity {
  id: number
  type: MediaType
}
