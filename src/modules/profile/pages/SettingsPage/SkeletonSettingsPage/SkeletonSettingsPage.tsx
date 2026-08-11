import { Card } from '@/shared/ui'
import styles from './SkeletonSettingsPage.module.scss'

const SkeletonSettingsPage = () => {
  return (
    <div className={styles.settings}>
      <Card className={styles.settings__content}>
        <form className={styles.content__form}>
          <div className={styles.avatar__container}>
            <div className={styles.left__avatar} />
          </div>

          <div className={styles.input} />

          <div className={styles.input} />

          <div className={styles.input} />

          <div className={styles.button} />
        </form>
      </Card>
    </div>
  )
}

export default SkeletonSettingsPage
