'use client'

import Image from 'next/image'
import { Check, CircleX, Film, Heart, HeartHandshake, Play, Plus, Star } from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import styles from './MediaCard.module.scss'
import { getMediaHref, Media, MediaWatchStatus } from '@/modules/media/api/media/types'

interface MediaCardProps {
  media: Media
  status: MediaWatchStatus | undefined
  coupleStatus: MediaWatchStatus | undefined
  isUpdating: boolean
  showActions: boolean
  handleFavorite: () => void
  handleWatched: () => void
  handleToggleTVModal: () => void
}

const TV_STATUS_LABELS: Partial<Record<MediaWatchStatus, string>> = {
  watched: 'Просмотрено',
  watching: 'В процессе',
  dropped: 'Заброшено',
}

export const MediaCard = ({
  media,
  status,
  coupleStatus,
  handleFavorite,
  handleWatched,
  handleToggleTVModal,
  isUpdating,
  showActions,
}: MediaCardProps) => {
  const posterUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null

  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'
  const tvStatusText = status ? TV_STATUS_LABELS[status] : undefined
  const tvStatusIcon =
    status === 'watched' ? (
      <Check aria-hidden="true" />
    ) : status === 'watching' ? (
      <Play aria-hidden="true" />
    ) : status === 'dropped' ? (
      <CircleX aria-hidden="true" />
    ) : (
      <Plus aria-hidden="true" />
    )
  return (
    <Card className={styles.card}>
      <div className={styles.posterContainer}>
        <Link href={getMediaHref(media)} variant="secondary" className={styles.posterLink}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Постер ${media.type === 'tv' ? 'сериала' : 'фильма'} «${media.title}»`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 900px) 50vw, 25vw"
              className={styles.poster}
            />
          ) : (
            <div className={styles.posterFallback}>
              <Film aria-hidden="true" />
              <span>Постер недоступен</span>
            </div>
          )}
        </Link>

        <div className={styles.rating} aria-label={`Рейтинг ${media.vote_average.toFixed(1)}`}>
          <Star aria-hidden="true" />
          <span>{media.vote_average.toFixed(1)}</span>
        </div>

        {coupleStatus && (
          <div className={styles.coupleBadge} aria-label="Добавлено в коллекцию пары">
            <HeartHandshake aria-hidden="true" />
            <span>В паре</span>
          </div>
        )}

        {showActions && (
          <Button
            variant="secondary"
            size="sm"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={isFavorite}
            aria-disabled={isUpdating}
            disabled={isUpdating}
            onClick={handleFavorite}
          >
            <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        )}
      </div>

      <div className={styles.content}>
        <Link href={getMediaHref(media)} variant="secondary" className={styles.titleLink}>
          <h3 className={styles.title}>{media.title}</h3>
        </Link>

        {showActions &&
          (media.type === 'movie' ? (
            <Button
              variant={isWatched ? 'primary' : 'secondary'}
              size="sm"
              className={styles.watchedButton}
              leftIcon={isWatched ? <Check aria-hidden="true" /> : <Plus />}
              aria-pressed={isWatched}
              aria-disabled={isUpdating}
              disabled={isUpdating}
              aria-label={isWatched ? 'Удалить из просмотренного' : 'Добавить в просмотренное'}
              onClick={handleWatched}
            >
              <span className={styles.watchedButtonLabel}>
                {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
              </span>
              <span className={styles.watchedButtonLabelMobile} aria-hidden="true">
                {isWatched ? 'Просмотрено' : 'В просмотренное'}
              </span>
            </Button>
          ) : (
            <Button
              variant={tvStatusText ? 'primary' : 'secondary'}
              size="sm"
              className={styles.watchedButton}
              leftIcon={tvStatusIcon}
              aria-pressed={Boolean(tvStatusText)}
              aria-disabled={isUpdating}
              disabled={isUpdating}
              aria-label={tvStatusText ? `Текущий статус: ${tvStatusText}` : 'Выбрать статус'}
              onClick={handleToggleTVModal}
            >
              <span className={styles.watchedButtonLabel}>
                {tvStatusText ?? 'Выбрать статус'}
              </span>
              <span className={styles.watchedButtonLabelMobile} aria-hidden="true">
                {tvStatusText ?? 'Выбрать статус'}
              </span>
            </Button>
          ))}
      </div>
    </Card>
  )
}
