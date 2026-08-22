import { Card } from '@/shared/ui'
import styles from './CoupleJoinLoadingState.module.scss'

export const CoupleJoinLoadingState = () => (
  <Card
    className={styles.card}
    aria-busy="true"
    aria-label="Загрузка приглашения"
  >
    <div className={styles.topline}>
      <span className={`${styles.skeleton} ${styles.eyebrow}`} />
      <span className={`${styles.skeleton} ${styles.status}`} />
    </div>

    <div className={styles.inviteVisual} aria-hidden>
      <span className={`${styles.skeleton} ${styles.circleLeft}`} />
      <span className={`${styles.skeleton} ${styles.circleRight}`} />
      <span className={`${styles.skeleton} ${styles.link}`} />
    </div>

    <div className={styles.copy}>
      <span className={`${styles.skeleton} ${styles.titleWide}`} />
      <span className={`${styles.skeleton} ${styles.titleNarrow}`} />
      <span className={`${styles.skeleton} ${styles.textWide}`} />
      <span className={`${styles.skeleton} ${styles.textNarrow}`} />
    </div>

    <div className={styles.codeRow}>
      <span className={`${styles.skeleton} ${styles.codeIcon}`} />
      <div>
        <span className={`${styles.skeleton} ${styles.codeLabel}`} />
        <span className={`${styles.skeleton} ${styles.codeValue}`} />
      </div>
      <span className={`${styles.skeleton} ${styles.expiry}`} />
    </div>

    <div className={styles.actions}>
      <span className={`${styles.skeleton} ${styles.action}`} />
      <span className={`${styles.skeleton} ${styles.action}`} />
    </div>

    <div className={styles.notice}>
      <span className={`${styles.skeleton} ${styles.noticeIcon}`} />
      <div>
        <span className={`${styles.skeleton} ${styles.noticeLine}`} />
        <span className={`${styles.skeleton} ${styles.noticeLineShort}`} />
      </div>
    </div>
  </Card>
)
