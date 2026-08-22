import { Card } from '@/shared/ui'
import styles from './SkeletonMediaPage.module.scss'
import type { MediaType } from '../../../api/media/types'

const ACTORS_COUNT = 6

interface SkeletonMediaPageProps {
  mediaType?: MediaType
}

const SkeletonMediaPage = ({ mediaType = 'movie' }: SkeletonMediaPageProps) => {
  return (
    <div className={styles.media} role="status" aria-label="Загрузка страницы медиа">
      <Card className={styles.promoCard}>
        <div className={styles.promo}>
          <div className={`${styles.backlink} ${styles.skeletonSurface}`} />

          <div className={styles.badges}>
            <div className={`${styles.badge} ${styles.skeletonSurface}`} />
            <div className={`${styles.badge} ${styles.skeletonSurface}`} />
            <div className={`${styles.badgeWide} ${styles.skeletonSurface}`} />
          </div>

          <div className={`${styles.mediaTitle} ${styles.skeletonSurface}`} />
          <div className={`${styles.genres} ${styles.skeletonSurface}`} />

          <div className={styles.overview}>
            <div className={`${styles.overviewLine} ${styles.skeletonSurface}`} />
            <div
              className={`${styles.overviewLine} ${styles.overviewLineShort} ${styles.skeletonSurface}`}
            />
          </div>

          <div className={styles.actions}>
            <div className={`${styles.action} ${styles.skeletonSurface}`} />
            <div className={`${styles.actionWide} ${styles.skeletonSurface}`} />
          </div>
        </div>
      </Card>

      {mediaType === 'tv' && (
        <Card>
          <div className={styles.tracker}>
            <div className={styles.trackerHeader}>
              <div>
                <div className={`${styles.trackerEyebrow} ${styles.skeletonSurface}`} />
                <div className={`${styles.trackerTitle} ${styles.skeletonSurface}`} />
              </div>
              <div className={styles.trackerStats}>
                <div className={`${styles.trackerPercent} ${styles.skeletonSurface}`} />
                <div className={`${styles.trackerCount} ${styles.skeletonSurface}`} />
              </div>
            </div>
            <div className={`${styles.progressTrack} ${styles.skeletonSurface}`} />
            <div className={styles.trackerControls}>
              <div className={`${styles.seasonSelect} ${styles.skeletonSurface}`} />
              <div className={`${styles.seasonAction} ${styles.skeletonSurface}`} />
            </div>
            <div className={styles.episodes}>
              {Array.from({ length: 4 }, (_, index) => (
                <div className={`${styles.episode} ${styles.skeletonSurface}`} key={index} />
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className={styles.sectionHeader}>
          <div>
            <div className={`${styles.sectionTitle} ${styles.skeletonSurface}`} />
            <div className={`${styles.sectionSubtitle} ${styles.skeletonSurface}`} />
          </div>
          <div className={styles.sliderControls}>
            <div className={`${styles.sliderControl} ${styles.skeletonSurface}`} />
            <div className={`${styles.sliderControl} ${styles.skeletonSurface}`} />
          </div>
        </div>

        <div className={styles.actors}>
          {Array.from({ length: ACTORS_COUNT }, (_, index) => (
            <div className={styles.actor} key={index}>
              <div className={`${styles.actorPhoto} ${styles.skeletonSurface}`} />
              <div className={`${styles.actorName} ${styles.skeletonSurface}`} />
              <div className={`${styles.actorRole} ${styles.skeletonSurface}`} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className={styles.sectionHeader}>
          <div>
            <div className={`${styles.sectionTitle} ${styles.skeletonSurface}`} />
            <div className={`${styles.trailerSubtitle} ${styles.skeletonSurface}`} />
          </div>
        </div>
        <div className={`${styles.trailer} ${styles.skeletonSurface}`}>
          <div className={styles.play} />
        </div>
      </Card>

      <span className={styles.screenReaderOnly}>Загружаем информацию…</span>
    </div>
  )
}

export default SkeletonMediaPage
