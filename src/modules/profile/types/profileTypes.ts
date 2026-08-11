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

export interface ProfileMovie {
  comment: null | string
  movies: any
  rating: number | null
  status: 'watched' | 'planned'
  watched_at: string | null
}
