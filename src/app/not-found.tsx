'use client'

import Link from 'next/link'
import { motion, MotionConfig } from 'framer-motion'
import {
  Bookmark,
  Clapperboard,
  Film,
  Heart,
  ListVideo,
  Search,
  Star,
  Tv,
  type LucideIcon,
} from 'lucide-react'

import styles from './styles/not-found.module.scss'

interface FloatingIcon {
  Icon: LucideIcon
  className: string
  rotate: number
  tone: 'accent' | 'muted'
}

const floatingIcons: FloatingIcon[] = [
  { Icon: Film, className: styles.film, rotate: 14, tone: 'accent' },
  { Icon: Tv, className: styles.tv, rotate: -9, tone: 'muted' },
  { Icon: Heart, className: styles.heart, rotate: -9, tone: 'accent' },
  { Icon: Star, className: styles.star, rotate: -13, tone: 'accent' },
  { Icon: Search, className: styles.search, rotate: 9, tone: 'accent' },
  { Icon: Bookmark, className: styles.bookmark, rotate: 10, tone: 'muted' },
  { Icon: Clapperboard, className: styles.clapperboard, rotate: -14, tone: 'muted' },
  { Icon: ListVideo, className: styles.list, rotate: 1, tone: 'muted' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
} as const

export default function NotFound() {
  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <motion.div
          className={styles.icons}
          aria-hidden="true"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {floatingIcons.map(({ Icon, className, rotate, tone }, index) => (
            <motion.div
              className={`${styles.iconCard} ${styles[tone]} ${className}`}
              variants={itemVariants}
              style={{ rotate }}
              key={index}
            >
              <Icon strokeWidth={2.2} />
            </motion.div>
          ))}
        </motion.div>

        <motion.section
          className={styles.content}
          aria-labelledby="not-found-title"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={styles.code} variants={itemVariants}>
            404
          </motion.p>
          <motion.h1 className={styles.title} id="not-found-title" variants={itemVariants}>
            Страница не существует
          </motion.h1>
          <motion.p className={styles.description} variants={itemVariants}>
            Проверь ссылку или вернись к своим фильмам.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link className={styles.homeLink} href="/movies">
              К фильмам
              <Film aria-hidden="true" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </motion.section>
      </main>
    </MotionConfig>
  )
}
