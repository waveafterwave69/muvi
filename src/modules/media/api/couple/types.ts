import type { MediaWatchStatus } from '../media/types'

export type Variant = 'solo' | 'couple'

export interface CoupleMediaStatus {
  mediaId: number
  status: MediaWatchStatus
  comment: string | null
}

export type CoupleMediaStatusMap = Map<string, CoupleMediaStatus>
