import EpisodeProgressModeSelector from './EpisodeProgressModeSelector'
import styles from './EpisodeTracker.module.scss'
import { MediaActionTarget } from '@/shared/domain/media'

interface EpisodeTrackerHeaderProps {
  variant: MediaActionTarget
  watchedCount: number
  totalEpisodes: number
  roundedProgressPercent: number
  showModeSelector: boolean
  isStatusLoading: boolean
  onModeChange: (variant: MediaActionTarget) => void
}

const EpisodeTrackerHeader = ({
  variant,
  watchedCount,
  totalEpisodes,
  roundedProgressPercent,
  showModeSelector,
  isStatusLoading,
  onModeChange,
}: EpisodeTrackerHeaderProps) => (
  <>
    <div className={styles.header}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          {variant === 'couple' ? 'Наш сериал' : 'Мой сериал'}
        </p>
        <h3 id="episode-tracker-title" className={styles.title}>
          Прогресс просмотра
        </h3>
      </div>
      <div className={styles.headerActions}>
        <div
          className={styles.counter}
          aria-label={`Сериал просмотрен на ${roundedProgressPercent} процентов: ${watchedCount} из ${totalEpisodes} серий`}
        >
          <strong>{roundedProgressPercent}%</strong>
          <span>
            {watchedCount} из {totalEpisodes} серий
          </span>
        </div>
      </div>
    </div>

    {!isStatusLoading && showModeSelector && (
      <EpisodeProgressModeSelector variant={variant} onChange={onModeChange} />
    )}
  </>
)

export default EpisodeTrackerHeader
