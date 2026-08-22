'use client'

import { useSyncExternalStore } from 'react'

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
const subscribe = () => () => undefined

export const useInviteUrl = (inviteId: string) => {
  const browserOrigin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => '',
  )

  return `${publicSiteUrl || browserOrigin}/couple/join/${encodeURIComponent(inviteId)}`
}
