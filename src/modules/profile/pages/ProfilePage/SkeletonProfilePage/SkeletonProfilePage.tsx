import { FC } from 'react'
import styles from './SkeletonProfilePage.module.scss'
import SkeletonProfileCard from '@/modules/profile/components/ProfileCard/SkeletonProfileCard/SkeletonProfileCard'

interface SkeletonProfilePage {
  isOwn: boolean
}

const SkeletonProfilePage: FC<SkeletonProfilePage> = ({ isOwn }) => {
  return (
    <section className={styles.profile}>
      <div className={styles.profile__card}>
        <SkeletonProfileCard isOwn={isOwn} />
      </div>
    </section>
  )
}

export default SkeletonProfilePage
