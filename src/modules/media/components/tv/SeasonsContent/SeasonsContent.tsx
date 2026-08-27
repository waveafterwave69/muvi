import {
  Check,
  CheckCheck,
  Circle,
  LoaderCircle,
  Tv,
} from 'lucide-react'
import { Button, Select } from '@/shared/ui'
import type { TVEpisode, TVSeasonSummary } from '../../../api/mediaDetails/types'
import styles from './SeasonsContent.module.scss'

interface SeasonsContentProps {
  isStatusLoading: boolean
  isExpanded: boolean
  seasons: readonly TVSeasonSummary[]
  selectedSeason: number
  onSeasonChange: (seasonNumber: number) => void
  episodes: readonly TVEpisode[]
  watchedInSeason: number
  isWholeSeasonWatched: boolean
  isEpisodeWatched: (episodeNumber: number) => boolean
  onToggleEpisode: (episodeNumber: number) => void
  onToggleWholeSeason: () => void
  isLoading: boolean
  isSaving: boolean
  error: unknown
}

const airDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const formatAirDate = (date: string | null) => {
  if (!date) return 'Дата неизвестна'
  return airDateFormatter.format(new Date(`${date}T00:00:00`))
}

const SeasonsContent = ({
  isStatusLoading,
  isExpanded,
  seasons,
  selectedSeason,
  onSeasonChange,
  episodes,
  watchedInSeason,
  isWholeSeasonWatched,
  isEpisodeWatched,
  onToggleEpisode,
  onToggleWholeSeason,
  isLoading,
  isSaving,
  error,
}: SeasonsContentProps) => {
  if (isStatusLoading) {
    return (
      <div className={styles.state}>
        <LoaderCircle className={styles.spinner} /> Загружаем прогресс…
      </div>
    )
  }

  if (seasons.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>
          <Tv />
        </span>
        <div>
          <strong>Список серий пока недоступен</strong>
          <p>В каталоге ещё нет информации о сезонах этого сериала.</p>
        </div>
      </div>
    )
  }

  if (!isExpanded) return null

  return (
    <div id="episode-tracker-content">
      <div className={styles.controls}>
        <Select
          label="Сезон"
          icon={<Tv />}
          value={selectedSeason}
          options={seasons.map((season) => ({
            value: season.season_number,
            label: `Сезон ${season.season_number}`,
            description: `${season.episode_count} серий`,
          }))}
          onChange={onSeasonChange}
        />
        <div className={styles.seasonSummary}>
          {watchedInSeason} из {episodes.length}
        </div>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={isWholeSeasonWatched ? <CheckCheck /> : <Check />}
          onClick={onToggleWholeSeason}
          disabled={isLoading || isSaving || episodes.length === 0}
        >
          {isWholeSeasonWatched ? 'Снять отметки' : 'Отметить весь сезон'}
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.state}>
          <LoaderCircle className={styles.spinner} /> Загружаем серии…
        </div>
      ) : error ? (
        <div className={styles.state}>Не удалось загрузить серии. Попробуйте ещё раз.</div>
      ) : (
        <div className={styles.episodes}>
          {episodes.map((episode) => {
            const isWatched = isEpisodeWatched(episode.episode_number)

            return (
              <button
                key={episode.id}
                type="button"
                className={`${styles.episode} ${isWatched ? styles.episodeWatched : ''}`}
                aria-pressed={isWatched}
                onClick={() => onToggleEpisode(episode.episode_number)}
                disabled={isSaving}
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
  )
}

export default SeasonsContent
