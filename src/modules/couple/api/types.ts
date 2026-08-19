import type { Profile } from '@/modules/profile/types/profileTypes'

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
