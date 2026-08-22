'use client'

import { useEpisodeProgress, useTVEpisodeCount } from '../../../api/episodeProgress/queries'
import styles from './TVCardProgress.module.scss'

interface TVCardProgressProps {
  mediaId: number
  userId: string
  hasCoupleBadge?: boolean
}

const TVCardProgress = ({ mediaId, userId, hasCoupleBadge = false }: TVCardProgressProps) => {
  const { data: episodeCount } = useTVEpisodeCount(mediaId, true)
  const { data: progress } = useEpisodeProgress(userId, mediaId, true)
  const total = episodeCount?.total ?? 0

  if (!total || !progress) return null

  const watched = progress.filter((item) => item.season_number > 0).length
  const percent = Math.min(Math.round((watched / total) * 100), 100)

  return (
    <div
      className={`${styles.progress} ${hasCoupleBadge ? styles.withCoupleBadge : ''}`}
      aria-label={`Сериал просмотрен на ${percent} процентов: ${watched} из ${total} серий`}
    >
      <div className={styles.label}>
        <span>Прогресс</span>
        <strong>{percent}%</strong>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.count}>
        {watched} из {total} серий
      </span>
    </div>
  )
}

export default TVCardProgress
