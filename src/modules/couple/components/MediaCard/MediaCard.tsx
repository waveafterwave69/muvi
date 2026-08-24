import Image from 'next/image'
import Link from 'next/link'
import {
  CalendarDays,
  Check,
  CircleX,
  Film,
  Heart,
  Play,
  Plus,
  Quote,
  Star,
} from 'lucide-react'
import { getMediaHref } from '@/modules/media/api/media/types'
import { formatMediaComment } from '@/modules/media/lib/mediaComment'
import { Button, Card } from '@/shared/ui'
import styles from './MediaCard.module.scss'
import type { CoupleMediaItem, MediaWatchStatus } from '@/modules/couple/api/types'
import { DefaultAvatar, type Profile } from '@/modules/profile'
import TVCardProgress from '@/modules/media/components/tv/TVCardProgress/TVCardProgress'

interface MediaCardProps {
  item: CoupleMediaItem
  coupleId: string
  isUpdating: boolean
  onFavoriteClick: () => void
  onWatchedClick: () => void
  addedBy?: Profile | null
}

const STATUS_LABELS: Record<MediaWatchStatus, string> = {
  planned: 'Хотим посмотреть',
  watching: 'Смотрим сейчас',
  watched: 'Уже посмотрели',
  dropped: 'Перестали смотреть',
}

const StatusIcon = ({ status }: { status: MediaWatchStatus }) => {
  if (status === 'watching') return <Play aria-hidden />
  if (status === 'watched') return <Check aria-hidden />
  if (status === 'dropped') return <CircleX aria-hidden />

  return <CalendarDays aria-hidden />
}

export const MediaCard = ({
  item,
  coupleId,
  isUpdating,
  onFavoriteClick,
  onWatchedClick,
  addedBy,
}: MediaCardProps) => {
  const { status, media } = item
  const imagePath = media.backdrop_path ?? media.poster_path
  const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w780${imagePath}` : null
  const mediaLabel = media.type === 'tv' ? 'сериала' : 'фильма'
  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'
  const comment = item.comment ? formatMediaComment(item.comment) : ''
  const detailsHref = `${getMediaHref({ id: media.external_id, type: media.type })}?mode=couple`

  return (
    <Card size="sm" className={styles.card}>
      <div className={styles.visual}>
        <Link
          href={detailsHref}
          className={styles.visualLink}
          aria-label={`Открыть ${mediaLabel} «${media.title}»`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Кадр из ${mediaLabel} «${media.title}»`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`${styles.image} ${!media.backdrop_path ? styles.poster : ''}`}
            />
          ) : (
            <div className={styles.fallback}>
              <Film aria-hidden />
              <span>Изображение недоступно</span>
            </div>
          )}
          <div className={styles.imageShade} aria-hidden />
        </Link>

        <Button
          variant="secondary"
          size="sm"
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
          disabled={isUpdating}
          aria-label={isFavorite ? 'Удалить из избранного пары' : 'Добавить в избранное пары'}
          aria-pressed={isFavorite}
          onClick={onFavoriteClick}
        >
          <Heart aria-hidden fill={isFavorite ? 'currentColor' : 'none'} />
          <span className={styles.visuallyHidden}>
            {isFavorite ? 'В избранном' : 'Добавить в избранное'}
          </span>
        </Button>

        {comment ? (
          <blockquote
            className={`${styles.comment} ${
              media.type === 'tv' ? styles.commentWithProgress : ''
            }`}
            title={comment}
            aria-label={`Комментарий: ${comment}`}
          >
            <Quote aria-hidden />
            <p>{comment}</p>
          </blockquote>
        ) : null}

        {media.type === 'tv' ? (
          <div className={styles.progressOverlay}>
            <TVCardProgress
              mediaId={media.external_id}
              userId={coupleId}
              variant="couple"
              coupleId={coupleId}
              compact
            />
          </div>
        ) : null}
      </div>

      <div className={styles.content}>
        <div className={styles.headingRow}>
          <Link href={detailsHref} className={styles.titleLink}>
            <h3 className={styles.title}>{media.title}</h3>
          </Link>

          {item.rating != null ? (
            <span className={styles.rating} aria-label={`Оценка ${item.rating} из 10`}>
              <Star />
              {item.rating}
            </span>
          ) : null}
        </div>

        <div className={styles.status}>
          <StatusIcon status={status} />
          <span>{STATUS_LABELS[status]}</span>
        </div>

        <div className={styles.addedBy}>
          <span className={styles.addedByAvatar}>
            {addedBy?.avatar_url ? (
              <Image
                src={addedBy.avatar_url}
                alt=""
                width={28}
                height={28}
                className={styles.addedByImage}
              />
            ) : (
              <DefaultAvatar />
            )}
          </span>
          <p>
            Добавил <strong>{addedBy?.username ?? 'пользователь'}</strong>
          </p>
        </div>

        <Button
          variant={isWatched ? 'primary' : 'secondary'}
          size="sm"
          className={styles.watchedButton}
          leftIcon={isWatched ? <Check aria-hidden /> : <Plus aria-hidden />}
          disabled={isUpdating}
          aria-pressed={isWatched}
          onClick={onWatchedClick}
        >
          {isWatched ? 'Просмотрено' : 'В просмотренное'}
        </Button>
      </div>
    </Card>
  )
}
