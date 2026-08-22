'use client'

import { ChevronDown, EyeOff } from 'lucide-react'
import type { MediaDetails } from '../../../api/mediaDetails/types'
import { useEpisodeTracker } from '../../../hooks/tv/useEpisodeTracker'
import { useEpisodeProgressMode } from '../../../hooks/tv/useEpisodeProgressMode'
import SeasonsContent from '../SeasonsContent/SeasonsContent'
import EpisodeTrackerHeader from './EpisodeTrackerHeader'
import styles from './EpisodeTracker.module.scss'

interface EpisodeTrackerProps {
  media: MediaDetails
  userId: string
}

const EpisodeTracker = ({ media, userId }: EpisodeTrackerProps) => {
  const {
    variant,
    status,
    isStatusLoading,
    isInCollection,
    canEditProgress,
    showModeSelector,
    selectVariant,
  } = useEpisodeProgressMode(media)

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
  } = useEpisodeTracker({ media, userId, variant, isInCollection, canEditProgress })

  return (
    <section className={styles.tracker} aria-labelledby="episode-tracker-title">
      <EpisodeTrackerHeader
        variant={variant}
        watchedCount={watchedCount}
        totalEpisodes={totalEpisodes}
        roundedProgressPercent={roundedProgressPercent}
        showModeSelector={showModeSelector}
        isStatusLoading={isStatusLoading}
        onModeChange={selectVariant}
      />

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
