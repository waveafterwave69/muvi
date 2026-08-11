'use client'

import type { FC } from 'react'
import { usePathname } from 'next/navigation'
import styles from './ProfileNav.module.scss'
import { Link } from '@/shared/ui'

interface ProfileNavProps {
  profileHref: string
  settingsHref: string
}

const ProfileNav: FC<ProfileNavProps> = ({ profileHref, settingsHref }) => {
  const pathname = usePathname()

  return (
    <div className={styles.nav}>
      <Link
        href={profileHref}
        className={`${styles.link} ${pathname === profileHref ? styles.active : ''}`}
      >
        Профиль
      </Link>
      <Link
        href={settingsHref}
        className={`${styles.link} ${pathname === settingsHref ? styles.active : ''}`}
      >
        Настройки
      </Link>
    </div>
  )
}

export default ProfileNav
