import styles from './SkeletonMovieList.module.scss'
import { Card } from '@/shared/ui'

const SkeletonMovieList = () => {
  const skeletonItems = Array.from({ length: 8 })

  return (
    <Card className={styles.wrapper_card}>
      <div className={styles.movies__grid}>
        {skeletonItems.map((_, index) => (
          <div key={index} className={styles.movie__card}>
            <div className={styles.poster__wrapper} />

            <div className={styles.info}>
              <div className={styles.title_row}>
                <div className={styles.title} />
              </div>
              <div className={styles.comment} />
            </div>

            <div className={styles.meta}>
              <div className={styles.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SkeletonMovieList
