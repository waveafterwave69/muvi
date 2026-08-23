import { useCallback, useMemo, useState } from 'react'
import { useEpisodeProgress } from '../../api/episodeProgress/queries'
import { useTVSeasonQuery } from '../../api/mediaDetails/queries'
import type { MediaDetails } from '../../api/mediaDetails/types'
import type { Variant } from '../../api/couple/types'

interface UseEpisodeTrackerParams {
  media: MediaDetails
  userId: string
  variant: Variant
  isInCollection: boolean
  canEditProgress: boolean
}

interface SeasonSelection {
  mediaId: number
  seasonNumber: number
}

export const useEpisodeTracker = ({
  media,
  userId,
  variant,
  isInCollection,
  canEditProgress,
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
    setWatched,
    isSaving,
  } = useEpisodeProgress(userId, media.id, variant, isInCollection)
  const {
    data: season,
    isLoading: isSeasonLoading,
    error: seasonError,
  } = useTVSeasonQuery(
    media.id,
    selectedSeason,
    isInCollection && seasons.length > 0 && isExpanded,
  )

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
    (episodeNumber: number) => {
      if (!canEditProgress) return

      setWatched({
        mediaId: media.id,
        variant,
        seasonNumber: selectedSeason,
        episodeNumbers: [episodeNumber],
        watched: !isEpisodeWatched(episodeNumber),
      })
    },
    [canEditProgress, isEpisodeWatched, media.id, selectedSeason, setWatched, variant],
  )

  const toggleWholeSeason = useCallback(() => {
    if (!canEditProgress || seasonEpisodes.length === 0) return

    setWatched({
      mediaId: media.id,
      variant,
      seasonNumber: selectedSeason,
      episodeNumbers: seasonEpisodes.map((episode) => episode.episode_number),
      watched: !isWholeSeasonWatched,
    })
  }, [
    canEditProgress,
    isWholeSeasonWatched,
    media.id,
    seasonEpisodes,
    selectedSeason,
    setWatched,
    variant,
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
