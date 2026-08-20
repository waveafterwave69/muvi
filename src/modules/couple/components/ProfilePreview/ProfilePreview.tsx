import Image from 'next/image'
import { Link2 } from 'lucide-react'
import { DefaultAvatar } from '@/modules/profile'
import type { Profile } from '@/modules/profile/types/profileTypes'
import styles from './ProfilePreview.module.scss'

interface ProfilePreviewProps {
  profiles?: Array<Profile | null | undefined>
  size?: 'sm' | 'md'
}

export const ProfilePreview = ({ profiles = [], size = 'md' }: ProfilePreviewProps) => {
  const visibleProfiles = profiles.filter((profile): profile is Profile => Boolean(profile))
  const emptySlots = Math.max(0, 2 - visibleProfiles.length)

  return (
    <div className={`${styles.preview} ${size === 'sm' ? styles.small : ''}`}>
      {visibleProfiles.map((profile) => (
        <div
          className={styles.avatar}
          aria-label={`Аватар пользователя ${profile.username}`}
          key={profile.id}
        >
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt="" width={200} height={200} />
          ) : (
            <DefaultAvatar />
          )}
        </div>
      ))}

      {Array.from({ length: emptySlots }, (_, index) => (
        <span
          className={`${styles.avatar} ${styles.placeholder}`}
          aria-hidden
          key={`empty-avatar-${index}`}
        />
      ))}

      <span className={styles.link} aria-hidden>
        <Link2 />
      </span>
    </div>
  )
}
