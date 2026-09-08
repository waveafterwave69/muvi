import { useCallback, useMemo, useState } from 'react'
import { useTVSeasonQuery } from '../../api/mediaDetails/queries'
import type { MediaDetails } from '../../api/mediaDetails/types'
import type { MediaActionTarget, MediaWatchStatus } from '@/shared/domain/media'
import { useEpisodeProgress } from '@/features/episode-progress'

interface UseEpisodeTrackerParams {
  media: MediaDetails
  userId: string
  variant: MediaActionTarget
  status?: MediaWatchStatus
  onStatusChange: (
    status: 'watching' | 'watched' | 'dropped',
    options?: { syncEpisodeProgress?: boolean },
  ) => Promise<void>
}

interface SeasonSelection {
  mediaId: number
  seasonNumber: number
}

export const useEpisodeTracker = ({
  media,
  userId,
  variant,
  status,
  onStatusChange,
}: UseEpisodeTrackerParams) => {
  const seasons = useMemo(
    () =>
      (media.seasons ?? [])
        .filter((season) => season.season_number > 0 && season.episode_count > 0)
        .sort((a, b) => a.season_number - b.season_number),
    [media.seasons],
  )
  const seasonNumbers = useMemo(
    () => new Set(seasons.map((season) => season.season_number)),
    [seasons],
  )
  const defaultSeason = seasons[0]?.season_number ?? 1
  const [selection, setSelection] = useState<SeasonSelection>(() => ({
    mediaId: media.id,
    seasonNumber: defaultSeason,
  }))
  const [isExpanded, setIsExpanded] = useState(true)
  const selectedSeason =
    selection.mediaId === media.id && seasonNumbers.has(selection.seasonNumber)
      ? selection.seasonNumber
      : defaultSeason

  const {
    data: progress = [],
    isLoading: isProgressLoading,
    setWatchedAsync,
    isSaving,
  } = useEpisodeProgress(userId, media.id, variant, true)
  const {
    data: season,
    isLoading: isSeasonLoading,
    error: seasonError,
  } = useTVSeasonQuery(media.id, selectedSeason, seasons.length > 0 && isExpanded)

  const seasonEpisodes = useMemo(() => season?.episodes ?? [], [season?.episodes])
  const watchedKeys = useMemo(
    () => new Set(progress.map((item) => `${item.season_number}:${item.episode_number}`)),
    [progress],
  )
  const watchedCount = useMemo(
    () => progress.filter((item) => seasonNumbers.has(item.season_number)).length,
    [progress, seasonNumbers],
  )
  const totalEpisodes = useMemo(
    () =>
      media.number_of_episodes ??
      seasons.reduce((total, seasonSummary) => total + seasonSummary.episode_count, 0),
    [media.number_of_episodes, seasons],
  )
  const progressPercent =
    totalEpisodes > 0 ? Math.min((watchedCount / totalEpisodes) * 100, 100) : 0
  const roundedProgressPercent = Math.round(progressPercent)
  const watchedInSeason = useMemo(
    () =>
      seasonEpisodes.filter((episode) =>
        watchedKeys.has(`${selectedSeason}:${episode.episode_number}`),
      ).length,
    [seasonEpisodes, selectedSeason, watchedKeys],
  )
  const isWholeSeasonWatched =
    seasonEpisodes.length > 0 && watchedInSeason === seasonEpisodes.length
  const isEpisodesLoading = isSeasonLoading || isProgressLoading

  const selectSeason = useCallback(
    (seasonNumber: number) => {
      setSelection({ mediaId: media.id, seasonNumber })
    },
    [media.id],
  )

  const isEpisodeWatched = useCallback(
    (episodeNumber: number) => watchedKeys.has(`${selectedSeason}:${episodeNumber}`),
    [selectedSeason, watchedKeys],
  )

  const toggleEpisode = useCallback(
    async (episodeNumber: number) => {
      const watched = !isEpisodeWatched(episodeNumber)
      const nextWatchedCount = watched ? watchedCount + 1 : Math.max(watchedCount - 1, 0)
      const nextStatus =
        watched && totalEpisodes > 0 && nextWatchedCount >= totalEpisodes
          ? 'watched'
          : 'watching'

      try {
        let effectiveStatus = status

        if (watched && status !== 'watching' && status !== 'watched') {
          await onStatusChange('watching', { syncEpisodeProgress: false })
          effectiveStatus = 'watching'
        }

        await setWatchedAsync({
          mediaId: media.id,
          variant,
          seasonNumber: selectedSeason,
          episodeNumbers: [episodeNumber],
          watched,
        })

        if (watched && effectiveStatus !== nextStatus) {
          await onStatusChange(nextStatus, { syncEpisodeProgress: false })
        } else if (!watched && effectiveStatus === 'watched') {
          await onStatusChange('watching', { syncEpisodeProgress: false })
        }
      } catch {
        return
      }
    },
    [
      isEpisodeWatched,
      media.id,
      onStatusChange,
      selectedSeason,
      setWatchedAsync,
      status,
      totalEpisodes,
      variant,
      watchedCount,
    ],
  )

  const toggleWholeSeason = useCallback(async () => {
    if (seasonEpisodes.length === 0) return

    const watched = !isWholeSeasonWatched
    const nextWatchedCount = watched
      ? watchedCount + seasonEpisodes.length - watchedInSeason
      : Math.max(watchedCount - watchedInSeason, 0)
    const nextStatus =
      watched && totalEpisodes > 0 && nextWatchedCount >= totalEpisodes
        ? 'watched'
        : 'watching'

    try {
      let effectiveStatus = status

      if (watched && status !== 'watching' && status !== 'watched') {
        await onStatusChange('watching', { syncEpisodeProgress: false })
        effectiveStatus = 'watching'
      }

      await setWatchedAsync({
        mediaId: media.id,
        variant,
        seasonNumber: selectedSeason,
        episodeNumbers: seasonEpisodes.map((episode) => episode.episode_number),
        watched,
      })

      if (watched && effectiveStatus !== nextStatus) {
        await onStatusChange(nextStatus, { syncEpisodeProgress: false })
      } else if (!watched && effectiveStatus === 'watched') {
        await onStatusChange('watching', { syncEpisodeProgress: false })
      }
    } catch {
      return
    }
  }, [
    isWholeSeasonWatched,
    media.id,
    onStatusChange,
    seasonEpisodes,
    selectedSeason,
    setWatchedAsync,
    status,
    totalEpisodes,
    variant,
    watchedCount,
    watchedInSeason,
  ])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((current) => !current)
  }, [])

  return {
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
  }
}
