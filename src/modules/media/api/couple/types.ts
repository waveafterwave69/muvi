import { MediaWatchStatus } from '@/shared/domain/media'

export interface CoupleMediaStatus {
  mediaId: number
  status: MediaWatchStatus
  comment: string | null
}

export type CoupleMediaStatusMap = Map<string, CoupleMediaStatus>
