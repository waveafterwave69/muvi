import { Card } from '@/shared/ui'
import pageStyles from '../../CouplePage.module.scss'
import styles from './CouplePageSkeleton.module.scss'

export const CouplePageSkeleton = () => (
  <div className={pageStyles.root} aria-busy="true" aria-label="Загрузка страницы пары">
    <Card className={styles.skeletonCard}>
      <span className={`${styles.skeleton} ${styles.skeletonIcon}`} />
      <div className={styles.skeletonCopy}>
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <span className={`${styles.skeleton} ${styles.skeletonText}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTextShort}`} />
      </div>
      <span className={`${styles.skeleton} ${styles.skeletonButton}`} />
      <span className={`${styles.skeleton} ${styles.skeletonHelper}`} />
    </Card>
  </div>
)
