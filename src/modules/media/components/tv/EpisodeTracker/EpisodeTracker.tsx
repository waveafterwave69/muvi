'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, EyeOff, UserRound, UsersRound } from 'lucide-react'
import { Button, Modal } from '@/shared/ui'
import { useCurrentProfile } from '@/modules/auth'
import type { Variant } from '../../../api/couple/types'
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

type PendingProgressAction =
  | { type: 'episode'; episodeNumber: number; variant?: Variant }
  | { type: 'season'; variant?: Variant }

const EpisodeTracker = ({ media, userId }: EpisodeTrackerProps) => {
  const {
    variant,
    status,
    updateStatus,
    isStatusLoading,
    hasSoloCollection,
    hasCoupleCollection,
    showModeSelector,
    selectVariant,
  } = useEpisodeProgressMode(media)
  const { data: currentProfile } = useCurrentProfile()
  const [pendingAction, setPendingAction] = useState<PendingProgressAction | null>(null)
  const executedAction = useRef<PendingProgressAction | null>(null)

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
  } = useEpisodeTracker({
    media,
    userId,
    variant,
    status,
    onStatusChange: updateStatus,
  })

  const shouldAskForVariant =
    watchedCount === 0 &&
    !hasSoloCollection &&
    !hasCoupleCollection &&
    Boolean(currentProfile?.in_couple)

  const handleToggleEpisode = (episodeNumber: number) => {
    if (shouldAskForVariant && !isEpisodeWatched(episodeNumber)) {
      setPendingAction({ type: 'episode', episodeNumber })
      return
    }

    void toggleEpisode(episodeNumber)
  }

  const handleToggleWholeSeason = () => {
    if (shouldAskForVariant && !isWholeSeasonWatched) {
      setPendingAction({ type: 'season' })
      return
    }

    void toggleWholeSeason()
  }

  const chooseProgressVariant = (nextVariant: Variant) => {
    if (!pendingAction) return

    executedAction.current = null
    setPendingAction({ ...pendingAction, variant: nextVariant })
    selectVariant(nextVariant)
  }

  useEffect(() => {
    if (!pendingAction?.variant || pendingAction.variant !== variant) return
    if (executedAction.current === pendingAction) return

    executedAction.current = pendingAction
    setPendingAction(null)

    if (pendingAction.type === 'episode') {
      void toggleEpisode(pendingAction.episodeNumber)
    } else {
      void toggleWholeSeason()
    }
  }, [pendingAction, toggleEpisode, toggleWholeSeason, variant])

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

      {!isStatusLoading && seasons.length > 0 && (
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
        isStatusLoading={isStatusLoading}
        isExpanded={isExpanded}
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={selectSeason}
        episodes={seasonEpisodes}
        watchedInSeason={watchedInSeason}
        isWholeSeasonWatched={isWholeSeasonWatched}
        isEpisodeWatched={isEpisodeWatched}
        onToggleEpisode={handleToggleEpisode}
        onToggleWholeSeason={handleToggleWholeSeason}
        isLoading={isEpisodesLoading}
        isSaving={isSaving}
        error={seasonError}
      />

      <Modal
        isOpen={Boolean(pendingAction && !pendingAction.variant)}
        onClose={() => setPendingAction(null)}
        size="sm"
        ariaLabel="Выбор коллекции для сериала"
      >
        <div className={styles.variantPrompt}>
          <h3>Куда добавить сериал?</h3>
          <p>Выберите, чей прогресс будет учитываться для отмеченных серий.</p>
          <div className={styles.variantPromptActions}>
            <Button
              variant="secondary"
              leftIcon={<UserRound aria-hidden="true" />}
              onClick={() => chooseProgressVariant('solo')}
            >
              Соло
            </Button>
            <Button
              leftIcon={<UsersRound aria-hidden="true" />}
              onClick={() => chooseProgressVariant('couple')}
            >
              В пару
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default EpisodeTracker
