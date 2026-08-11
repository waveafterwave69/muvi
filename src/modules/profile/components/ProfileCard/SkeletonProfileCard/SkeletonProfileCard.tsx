import { FC } from 'react'
import styles from './SkeletonProfileCard.module.scss'
import { Card } from '@/shared/ui'

interface SkeletonProfilePage {
  isOwn: boolean
}

const SkeletonProfileCard: FC<SkeletonProfilePage> = ({ isOwn }) => {
  return (
    <div className={styles.card}>
      <Card size="lg">
        <div className={styles.profile__content}>
          <div className={styles.profile__left}>
            <div className={styles.avatar__container}>
              <div className={styles.left__avatar} />
            </div>

            <div className={styles.left__info}>
              <div className={styles.info__text}>
                <p className={styles.info__name}></p>
                <p className={styles.info__date}></p>
              </div>
              {isOwn && <div className={styles.profile__actions}></div>}
            </div>
          </div>
          <div className={styles.profile__right}>
            <div className={`${styles.right__item} ${!isOwn && styles.is__own}`}></div>
            <div className={styles.bar}></div>
            <div className={`${styles.right__item} ${!isOwn && styles.is__own}`}></div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SkeletonProfileCard
