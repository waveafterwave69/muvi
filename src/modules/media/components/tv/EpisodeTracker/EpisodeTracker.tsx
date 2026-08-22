'use client'

import { ChevronDown, EyeOff } from 'lucide-react'
import { getMediaKey } from '../../../api/media/types'
import type { MediaDetails } from '../../../api/mediaDetails/types'
import { useEpisodeTracker } from '../../../hooks/tv/useEpisodeTracker'
import { useMediaStatus } from '../../../hooks/useMediaStatus'
import SeasonsContent from '../SeasonsContent/SeasonsContent'
import styles from './EpisodeTracker.module.scss'

interface EpisodeTrackerProps {
  media: MediaDetails
  userId: string
}

const EpisodeTracker = ({ media, userId }: EpisodeTrackerProps) => {
  const { statuses, isUpdating: isStatusLoading } = useMediaStatus(media)
  const status = statuses.get(getMediaKey(media))
  const isInCollection = Boolean(status)
  const canEditProgress = status === 'watching' || status === 'watched'
  const {
    seasons,
    selectedSeason,
    selectSeason,
    isExpanded,
    toggleExpanded,
    watchedCount,
    totalEpisodes,
    progressPercent,
    roundedProgressPercent,
    seasonEpisodes,
    watchedInSeason,
    isWholeSeasonWatched,
    isEpisodeWatched,
    toggleEpisode,
    toggleWholeSeason,
    isEpisodesLoading,
    isSaving,
    seasonError,
  } = useEpisodeTracker({ media, userId, isInCollection, canEditProgress })

  return (
    <section className={styles.tracker} aria-labelledby="episode-tracker-title">
      <div className={styles.header}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Мой сериал</p>
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

      {!isStatusLoading && isInCollection && seasons.length > 0 && (
        <button
          type="button"
          className={styles.collapseButton}
          aria-expanded={isExpanded}
          aria-controls="episode-tracker-content"
          onClick={toggleExpanded}
        >
          {isExpanded ? <EyeOff aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
          <span className={styles.collapseLabelDesktop}>
            {isExpanded ? 'Скрыть серии' : 'Показать серии'}
          </span>
          <span className={styles.collapseLabelMobile} aria-hidden="true">
            {isExpanded ? 'Скрыть серии' : 'Показать серии'}
          </span>
        </button>
      )}

      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <SeasonsContent
        status={status}
        isInCollection={isInCollection}
        isStatusLoading={isStatusLoading}
        canEditProgress={canEditProgress}
        isExpanded={isExpanded}
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={selectSeason}
        episodes={seasonEpisodes}
        watchedInSeason={watchedInSeason}
        isWholeSeasonWatched={isWholeSeasonWatched}
        isEpisodeWatched={isEpisodeWatched}
        onToggleEpisode={toggleEpisode}
        onToggleWholeSeason={toggleWholeSeason}
        isLoading={isEpisodesLoading}
        isSaving={isSaving}
        error={seasonError}
      />
    </section>
  )
}

export default EpisodeTracker
