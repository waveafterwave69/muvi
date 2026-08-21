import { Clapperboard, Film, Gauge } from 'lucide-react'
import type { CoupleData } from '@/modules/couple/api/types'
import { Card } from '@/shared/ui'
import styles from './CoupleStats.module.scss'

interface CoupleStatsProps {
  stats: NonNullable<CoupleData['stats']>
}

export const CoupleStats = ({ stats }: CoupleStatsProps) => {
  const tasteMatchPercent = Math.min(100, Math.max(0, stats.taste_match_percent ?? 0))

  return (
    <section className={styles.statsGrid} aria-label="Статистика пары">
      <Card className={styles.statCard}>
        <span className={styles.statIcon} aria-hidden>
          <Film />
        </span>
        <strong className={styles.statValue}>{stats.planned_count}</strong>
        <span className={styles.statLabel}>Хотим посмотреть</span>
        <span className={styles.statMeta}>Всего в коллекции: {stats.total_count}</span>
      </Card>

      <Card className={styles.statCard}>
        <span className={styles.statIcon} aria-hidden>
          <Clapperboard />
        </span>
        <strong className={styles.statValue}>{stats.watched_count}</strong>
        <span className={styles.statLabel}>Посмотрели вместе</span>
      </Card>

      <Card className={`${styles.statCard} ${styles.tasteCard}`}>
        <span className={styles.statIcon} aria-hidden>
          <Gauge />
        </span>
        <strong className={styles.statValue}>
          {stats.taste_match_percent === null ? '—' : `${stats.taste_match_percent}%`}
        </strong>
        <span className={styles.statLabel}>Совпадение вкусов</span>
        <div className={styles.tasteProgress} aria-hidden>
          <span style={{ width: `${tasteMatchPercent}%` }} />
        </div>
        <div className={styles.tasteMeta}>
          <span>Общих оценок: {stats.common_ratings_count}</span>
          {stats.ratings_needed > 0 && <span>Нужно ещё: {stats.ratings_needed}</span>}
        </div>
      </Card>
    </section>
  )
}
