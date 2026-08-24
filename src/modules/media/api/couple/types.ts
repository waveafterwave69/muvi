import { MediaWatchStatus } from '@/shared/domain/media'

export type Variant = 'solo' | 'couple'

export interface CoupleMediaStatus {
  mediaId: number
  status: MediaWatchStatus
  comment: string | null
}

export type CoupleMediaStatusMap = Map<string, CoupleMediaStatus>
