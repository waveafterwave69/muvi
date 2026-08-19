import { Card } from '@/shared/ui'
import styles from './SkeletonMediaPage.module.scss'

const ACTORS_COUNT = 6

const SkeletonMediaPage = () => {
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
