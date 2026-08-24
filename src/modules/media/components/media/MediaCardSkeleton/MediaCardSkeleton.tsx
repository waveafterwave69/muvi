import { Check, Heart, Star } from 'lucide-react'
import { Button, Card } from '@/shared/ui'
import cardStyles from '../MediaCard/MediaCard.module.scss'
import styles from './MediaCardSkeleton.module.scss'
import { MediaType } from '@/shared/domain/media'

interface MediaCardSkeletonProps {
  count?: number
  mediaType?: MediaType
}

export function MediaCardSkeleton({ count = 8, mediaType = 'movie' }: MediaCardSkeletonProps) {
  const skeletonsCount = Math.max(0, Math.floor(count))

  return Array.from({ length: skeletonsCount }, (_, index) => (
    <Card className={`${cardStyles.card} ${styles.card}`} key={`media-card-skeleton-${index}`}>
      <div className={cardStyles.posterContainer}>
        <div className={`${styles.skeletonSurface} ${styles.poster}`} />

        <div className={`${cardStyles.rating} ${styles.skeletonSurface}`}>
          <Star aria-hidden="true" />
          <span>0.0</span>
        </div>

        {mediaType === 'tv' && (
          <div className={`${styles.tvProgress} ${styles.skeletonSurface}`}>
            <span className={styles.tvProgressLabel} />
            <span className={styles.tvProgressPercent} />
            <span className={styles.tvProgressTrack} />
          </div>
        )}

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
          {mediaType === 'tv' ? 'Выбрать статус' : 'Добавить в просмотренное'}
        </Button>
      </div>
    </Card>
  ))
}
