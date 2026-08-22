import type { MediaWatchStatus } from '../media/types'

export type Variant = 'solo' | 'couple'

export interface CoupleMediaStatus {
  mediaId: number
  status: MediaWatchStatus
}

export type CoupleMediaStatusMap = Map<string, CoupleMediaStatus>
