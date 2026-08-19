import type { MediaType } from '@/modules/media/api/media/types'

export interface ProfileIdentity {
  id: string
  Profile_id: string
  identity_data: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  provider: string
  last_sign_in_at: string
  created_at: string
  updated_at: string
}

export interface ProfileMetadata {
  email: string
  email_verified: boolean
  phone_verified: boolean
  sub: string
  username: string
  avatar_url: string
}

export interface AppMetadata {
  provider: string
  providers: string[]
}

export interface Profile {
  avatar_url: string
  created_at: string
  id: string
  username: string
}

interface ProfileMediaDetails {
  id: number
  external_id: number
  type: MediaType
  title: string
  overview: string
  poster_path: string | null
  release_date: string | null
  vote_average: number
}

export interface ProfileMedia {
  comment: null | string
  media: ProfileMediaDetails | null
  rating: number | null
  status: 'watched' | 'planned'
  watched_at: string | null
}
