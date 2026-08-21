'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  CircleX,
  EyeOff,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Tv,
} from 'lucide-react'
import { Button } from '@/shared/ui'
import { getMediaKey } from '../../api/media/types'
import type { MediaDetails } from '../../api/mediaDetails/types'
import { useTVSeasonQuery } from '../../api/mediaDetails/queries'
import { useEpisodeProgress } from '../../api/episodeProgress/queries'
import { useMediaStatus } from '../../hooks/useMediaStatus'
import styles from './EpisodeTracker.module.scss'

interface EpisodeTrackerProps {
  media: MediaDetails
  userId: string
}

const formatAirDate = (date: string | null) => {
  if (!date) return 'Дата неизвестна'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const EpisodeTracker = ({ media, userId }: EpisodeTrackerProps) => {
  const seasons = useMemo(
    () =>
      (media.seasons ?? [])
        .filter((season) => season.season_number > 0 && season.episode_count > 0)
        .sort((a, b) => a.season_number - b.season_number),
    [media.seasons],
  )
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number ?? 1)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSeasonMenuOpen, setIsSeasonMenuOpen] = useState(false)
  const seasonSelectRef = useRef<HTMLDivElement>(null)
  const { statuses, isUpdating: isStatusLoading } = useMediaStatus(media)
  const status = statuses.get(getMediaKey(media))
  const isInCollection = Boolean(status)
  const canEditProgress = status === 'watching' || status === 'watched'
  const {
    data: progress = [],
    isLoading: isProgressLoading,
    setWatched,
    isSaving,
  } = useEpisodeProgress(userId, media.id, isInCollection)
  const {
    data: season,
    isLoading: isSeasonLoading,
    error: seasonError,
  } = useTVSeasonQuery(media.id, selectedSeason, seasons.length > 0 && isExpanded)

  const watchedKeys = useMemo(
    () => new Set(progress.map((item) => `${item.season_number}:${item.episode_number}`)),
    [progress],
  )
  const regularSeasonNumbers = useMemo(
    () => new Set(seasons.map((item) => item.season_number)),
    [seasons],
  )
  const watchedCount = progress.filter((item) =>
    regularSeasonNumbers.has(item.season_number),
  ).length
  const totalEpisodes =
    media.number_of_episodes ?? seasons.reduce((total, item) => total + item.episode_count, 0)
  const progressPercent =
    totalEpisodes > 0 ? Math.min((watchedCount / totalEpisodes) * 100, 100) : 0
  const roundedProgressPercent = Math.round(progressPercent)
  const seasonEpisodes = season?.episodes ?? []
  const watchedInSeason = seasonEpisodes.filter((episode) =>
    watchedKeys.has(`${selectedSeason}:${episode.episode_number}`),
  ).length
  const isWholeSeasonWatched =
    seasonEpisodes.length > 0 && watchedInSeason === seasonEpisodes.length
  const selectedSeasonSummary = seasons.find((item) => item.season_number === selectedSeason)

  useEffect(() => {
    if (!isSeasonMenuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!seasonSelectRef.current?.contains(event.target as Node)) {
        setIsSeasonMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSeasonMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSeasonMenuOpen])

  const toggleEpisode = (episodeNumber: number) => {
    if (!canEditProgress) return

    const isWatched = watchedKeys.has(`${selectedSeason}:${episodeNumber}`)
    setWatched({
      mediaId: media.id,
      seasonNumber: selectedSeason,
      episodeNumbers: [episodeNumber],
      watched: !isWatched,
    })
  }

  const toggleWholeSeason = () => {
    if (!canEditProgress || !seasonEpisodes.length) return
    setWatched({
      mediaId: media.id,
      seasonNumber: selectedSeason,
      episodeNumbers: seasonEpisodes.map((episode) => episode.episode_number),
      watched: !isWholeSeasonWatched,
    })
  }

  const toggleExpanded = () => {
    setIsExpanded((current) => !current)
  }

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

      {isStatusLoading ? (
        <div className={styles.state}>
          <LoaderCircle className={styles.spinner} /> Загружаем прогресс…
        </div>
      ) : !isInCollection ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <LockKeyhole />
          </span>
          <div>
            <strong>Сначала добавьте сериал в свою коллекцию</strong>
            <p>Выберите статус выше — после этого здесь можно будет отмечать серии.</p>
          </div>
        </div>
      ) : seasons.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <Tv />
          </span>
          <div>
            <strong>Список серий пока недоступен</strong>
            <p>В каталоге ещё нет информации о сезонах этого сериала.</p>
          </div>
        </div>
      ) : !isExpanded ? null : (
        <div id="episode-tracker-content">
          {!canEditProgress && (
            <div className={styles.readOnlyNotice} role="note">
              {status === 'planned' ? <Heart aria-hidden="true" /> : <CircleX aria-hidden="true" />}
              <div>
                <strong>
                  {status === 'planned'
                    ? 'Сериал находится в избранном'
                    : 'Сериал отмечен как заброшенный'}
                </strong>
                <p>
                  {status === 'planned'
                    ? 'Чтобы отмечать серии, измените статус на «Смотрю сейчас».'
                    : 'Предыдущий прогресс сохранён. Чтобы снова менять отметки, возобновите просмотр.'}
                </p>
              </div>
            </div>
          )}

          <div className={styles.controls}>
            <div className={styles.seasonSelect} ref={seasonSelectRef}>
              <span id="season-select-label">Сезон</span>
              <button
                type="button"
                className={`${styles.selectControl} ${isSeasonMenuOpen ? styles.selectControlOpen : ''}`}
                aria-labelledby="season-select-label"
                aria-haspopup="listbox"
                aria-expanded={isSeasonMenuOpen}
                aria-controls="season-select-options"
                onClick={() => setIsSeasonMenuOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setIsSeasonMenuOpen(true)
                  }
                }}
              >
                <Tv aria-hidden="true" />
                <span className={styles.selectValue}>
                  Сезон {selectedSeasonSummary?.season_number ?? selectedSeason}
                  <small>· {selectedSeasonSummary?.episode_count ?? 0} серий</small>
                </span>
                <ChevronDown
                  className={`${styles.selectChevron} ${isSeasonMenuOpen ? styles.selectChevronOpen : ''}`}
                  aria-hidden="true"
                />
              </button>
              {isSeasonMenuOpen && (
                <div
                  id="season-select-options"
                  className={styles.selectMenu}
                  role="listbox"
                  aria-labelledby="season-select-label"
                >
                  {seasons.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.selectOption} ${item.season_number === selectedSeason ? styles.selectOptionActive : ''}`}
                      role="option"
                      aria-selected={item.season_number === selectedSeason}
                      onClick={() => {
                        setSelectedSeason(item.season_number)
                        setIsSeasonMenuOpen(false)
                      }}
                    >
                      <span className={styles.optionSeason}>Сезон {item.season_number}</span>
                      <span className={styles.optionCount}>{item.episode_count} серий</span>
                      {item.season_number === selectedSeason && <Check aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.seasonSummary}>
              {watchedInSeason} из {seasonEpisodes.length}
            </div>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={isWholeSeasonWatched ? <CheckCheck /> : <Check />}
              onClick={toggleWholeSeason}
              disabled={
                !canEditProgress ||
                isSeasonLoading ||
                isProgressLoading ||
                isSaving ||
                !seasonEpisodes.length
              }
            >
              {!canEditProgress
                ? 'Изменение недоступно'
                : isWholeSeasonWatched
                  ? 'Снять отметки'
                  : 'Отметить весь сезон'}
            </Button>
          </div>

          {isSeasonLoading || isProgressLoading ? (
            <div className={styles.state}>
              <LoaderCircle className={styles.spinner} /> Загружаем серии…
            </div>
          ) : seasonError ? (
            <div className={styles.state}>Не удалось загрузить серии. Попробуйте ещё раз.</div>
          ) : (
            <div className={styles.episodes}>
              {seasonEpisodes.map((episode) => {
                const isWatched = watchedKeys.has(`${selectedSeason}:${episode.episode_number}`)
                return (
                  <button
                    key={episode.id}
                    type="button"
                    className={`${styles.episode} ${isWatched ? styles.episodeWatched : ''} ${!canEditProgress ? styles.episodeReadOnly : ''}`}
                    aria-pressed={isWatched}
                    onClick={() => toggleEpisode(episode.episode_number)}
                    disabled={isSaving || !canEditProgress}
                  >
                    <span className={styles.episodeCheck}>
                      {isWatched ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                    </span>
                    <span className={styles.episodeNumber}>{episode.episode_number}</span>
                    <span className={styles.episodeContent}>
                      <strong>{episode.name || `Серия ${episode.episode_number}`}</strong>
                      <span>
                        {formatAirDate(episode.air_date)}
                        {episode.runtime ? ` · ${episode.runtime} мин` : ''}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default EpisodeTracker
