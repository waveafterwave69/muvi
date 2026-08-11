import { Check, Heart, Star } from 'lucide-react'
import { Button, Card } from '@/shared/ui'
import cardStyles from '../MovieCard/MovieCard.module.scss'
import styles from './MovieCardSkeleton.module.scss'

interface MovieCardSkeletonProps {
  count?: number
}

export function MovieCardSkeleton({ count = 8 }: MovieCardSkeletonProps) {
  const skeletonsCount = Math.max(0, Math.floor(count))

  return Array.from({ length: skeletonsCount }, (_, index) => (
    <Card className={`${cardStyles.card} ${styles.card}`} key={`movie-card-skeleton-${index}`}>
      <div className={cardStyles.posterContainer}>
        <div className={`${styles.skeletonSurface} ${styles.poster}`} />

        <div className={`${cardStyles.rating} ${styles.skeletonSurface}`}>
          <Star aria-hidden="true" />
          <span>0.0</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className={`${cardStyles.favoriteButton} ${styles.skeletonSurface}`}
          aria-hidden="true"
          tabIndex={-1}
        >
          <Heart aria-hidden="true" />
        </Button>
      </div>

      <div className={cardStyles.content}>
        <div className={`${cardStyles.title} ${styles.title}`}>
          <span className={`${styles.titleLine} ${styles.skeletonSurface}`} />
          <span
            className={`${styles.titleLine} ${styles.titleLineShort} ${styles.skeletonSurface}`}
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          className={`${cardStyles.watchedButton} ${styles.skeletonSurface}`}
          leftIcon={<Check aria-hidden="true" />}
          aria-hidden="true"
          tabIndex={-1}
        >
          Добавить в просмотренное
        </Button>
      </div>
    </Card>
  ))
}
