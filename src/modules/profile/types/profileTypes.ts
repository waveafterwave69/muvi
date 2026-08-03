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
    id: string
    aud: string
    role: string
    email: string
    email_confirmed_at: string
    created_at: string
    last_sign_in_at: string
    updated_at: string
    is_anonymous: boolean
    phone: string
    app_metadata: AppMetadata
    user_metadata: ProfileMetadata
    identities: ProfileIdentity[]
}
