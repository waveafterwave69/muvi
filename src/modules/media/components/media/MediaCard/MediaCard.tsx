'use client'

import Image from 'next/image'
import {
  Check,
  CircleX,
  Film,
  Heart,
  HeartHandshake,
  Play,
  Plus,
  Quote,
  Star,
  X,
} from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import styles from './MediaCard.module.scss'
import { getMediaHref, Media, MediaWatchStatus } from '@/modules/media/api/media/types'
import { formatMediaComment } from '@/modules/media/lib/mediaComment'
import TVCardProgress from '../../tv/TVCardProgress/TVCardProgress'

interface MediaCardProps {
  media: Media
  comment?: string | null
  status: MediaWatchStatus | undefined
  coupleStatus: MediaWatchStatus | undefined
  isUpdating: boolean
  showActions: boolean
  userId?: string
  handleFavorite: () => void
  handleRemoveFromCouple?: () => void
  handleWatched: () => void
  handleToggleTVModal: () => void
}

const TV_STATUS_LABELS: Partial<Record<MediaWatchStatus, string>> = {
  watched: 'Просмотрено',
  watching: 'В процессе',
  dropped: 'Заброшено',
}

const COUPLE_STATUS_LABELS: Record<MediaWatchStatus, string> = {
  planned: 'Запланировано',
  watched: 'Просмотрено',
  watching: 'В процессе',
  dropped: 'Заброшено',
}

export const MediaCard = ({
  media,
  comment,
  status,
  coupleStatus,
  handleFavorite,
  handleRemoveFromCouple,
  handleWatched,
  handleToggleTVModal,
  isUpdating,
  showActions,
  userId,
}: MediaCardProps) => {
  const posterUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null

  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'
  const hasStatus = status !== undefined
  const hasTVProgress = media.type === 'tv' && hasStatus && Boolean(userId)
  const visibleComment = comment ? formatMediaComment(comment) : ''
  const tvStatusText = status ? TV_STATUS_LABELS[status] : undefined
  const coupleStatusText = coupleStatus ? COUPLE_STATUS_LABELS[coupleStatus] : undefined
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

        {isWatched && media.rating != null ? (
          <div
            className={`${styles.rating} ${styles.my__rating}`}
            aria-label={`Рейтинг ${media.rating}`}
          >
            <Star aria-hidden="true" />

            <span> {media.rating}</span>
          </div>
        ) : (
          <div className={styles.rating} aria-label={`Рейтинг ${media.vote_average.toFixed(1)}`}>
            <Star aria-hidden="true" />

            <span> {media.vote_average.toFixed(1)}</span>
          </div>
        )}

        {(coupleStatus || (media.type === 'tv' && hasStatus && userId)) && (
          <div className={styles.posterMeta}>
            {coupleStatus && (
              <div
                className={styles.coupleBadge}
                aria-label={`Статус в коллекции пары: ${coupleStatusText}`}
              >
                <HeartHandshake aria-hidden="true" />
                <span className={styles.coupleStatusText}>{coupleStatusText}</span>
                {handleRemoveFromCouple && (
                  <button
                    className={styles.coupleRemoveButton}
                    type="button"
                    aria-label={`Удалить «${media.title}» из коллекции пары`}
                    disabled={isUpdating}
                    onClick={handleRemoveFromCouple}
                  >
                    <X aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

        {visibleComment && (
          <blockquote
            className={`${styles.comment} ${hasTVProgress ? styles.commentWithProgress : ''} ${coupleStatus ? styles.commentWithCoupleBadge : ''}`}
            aria-label="Комментарий пользователя"
          >
            <Quote aria-hidden="true" />
            <p>{visibleComment}</p>
          </blockquote>
        )}

        {media.type === 'tv' && hasStatus && userId && (
          <TVCardProgress
            mediaId={media.id}
            userId={userId}
            hasCoupleBadge={Boolean(coupleStatus)}
          />
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
              <span className={styles.watchedButtonLabel}>{tvStatusText ?? 'Выбрать статус'}</span>
              <span className={styles.watchedButtonLabelMobile} aria-hidden="true">
                {tvStatusText ?? 'Выбрать статус'}
              </span>
            </Button>
          ))}
      </div>
    </Card>
  )
}
