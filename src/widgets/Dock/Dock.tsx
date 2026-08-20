'use client'

import {
  Bookmark,
  Clapperboard,
  HeartHandshake,
  House,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import Card from '../../shared/ui/Card/Card'
import Link from '../../shared/ui/Link/Link'
import styles from './Dock.module.scss'
import { ThemeSwitcher } from '@/shared/ui/ThemeSwitcher/ThemeSwitcher'

interface DockRoute {
  id: string
  path: string
  label: string
  icon: LucideIcon
  isCurrent: (pathname: string) => boolean
}

const routes: DockRoute[] = [
  {
    id: 'home-page',
    path: '/',
    label: 'Главная',
    icon: House,
    isCurrent: (pathname) => pathname === '/',
  },
  {
    id: 'all-movies',
    path: '/movies',
    label: 'Фильмы',
    icon: Clapperboard,
    isCurrent: (pathname) => pathname.startsWith('/movies'),
  },
  {
    id: 'favorite-movies',
    path: '/favorites',
    label: 'Избранное',
    icon: Bookmark,
    isCurrent: (pathname) => pathname.startsWith('/favorite'),
  },
  {
    id: 'couple',
    path: '/couple',
    label: 'Пара',
    icon: HeartHandshake,
    isCurrent: (pathname) => pathname.startsWith('/couple'),
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Профиль',
    icon: UserRound,
    isCurrent: (pathname) => pathname.startsWith('/profile'),
  },
]

export const Dock = () => {
  const pathname = usePathname()

  return (
    <Card className={styles.root}>
      <nav className={styles.navContainer} aria-label="Основная навигация">
        {routes.map((route) => {
          const Icon = route.icon
          const isCurrent = route.isCurrent(pathname)

          return (
            <Link
              href={route.path}
              className={styles.link}
              key={route.id}
              variant={isCurrent ? 'primary' : 'secondary'}
            >
              <Icon aria-hidden />
              <span className={styles.visuallyHidden}>{route.label}</span>
            </Link>
          )
        })}
        <ThemeSwitcher />
      </nav>
    </Card>
  )
}
