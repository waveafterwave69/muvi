import type { Profile } from '@/modules/profile/types/profileTypes'
import { MediaType, MediaWatchStatus, Pagination } from '@/shared/domain/media'

export interface CoupleData {
  id: string
  created_at?: string
  together_since?: string
  partner?: Profile
  stats?: {
    total_count: number
    planned_count: number
    watched_count: number
    taste_match_percent: number | null
    common_ratings_count: number
    ratings_needed: number
  }
  members?: Array<
    Profile & {
      joined_at?: string
      is_me?: boolean
    }
  >
}

export interface CouplePageData {
  state: 'unpaired' | 'active'
  outgoing_invite: {
    id: string
    type: 'link' | 'direct'
    expires_at: string
    invitee?: Profile
  } | null
  incoming_invites: Array<{
    id: string
    inviter: Profile
    expires_at: string
  }>
  couple: CoupleData | null
}

export interface CoupleInvitePreview {
  id: string
  type: 'link' | 'direct'
  expires_at: string
  inviter: Profile
}

export type CoupleInviteResponse = 'accept' | 'decline'




export interface CoupleMediaFilters {
  mediaType: MediaType| null
  status: MediaWatchStatus | null
  search: string
}

export interface DbMedia {
  id: number
  external_id: number
  source: string
  type: MediaType
  backdrop_path: string | null
  poster_path: string | null
  title: string
  vote_average: number
  created_at: string
  updated_at: string
}

export interface CoupleMediaItem {
  couple_id: string
  media_id: number
  status: MediaWatchStatus
  created_at: string
  media: DbMedia
  rating: number
  added_by: string
  comment: string | null
}

export interface CoupleMediaResponse {
  items: CoupleMediaItem[]
  pagination: Pagination
}

export interface UpdateCoupleMediaParams {
  coupleId: string
  mediaId: number
  status: MediaWatchStatus
  comment: string | null
  rating: number | null
}

export interface UpdateCoupleMediaResult {
  couple_id: string
  media_id: number
  added_by: string
  status: MediaWatchStatus
  comment: string | null
  rating: number | null
  created_at: string
}
