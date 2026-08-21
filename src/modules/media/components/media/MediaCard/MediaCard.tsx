'use client'

import Image from 'next/image'
import { Check, CircleX, Film, Heart, Play, Plus, Star } from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import styles from './MediaCard.module.scss'
import { getMediaHref, Media, MediaWatchStatus } from '@/modules/media/api/media/types'
import { type AddMediaHandler, useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { StarsModal } from '../StarsModal/StarsModal'
import { CommentModal } from '../CommentModal/CommentModal'
import { useState } from 'react'
import TVModal from '../../tv/TVModal'

interface MediaCardProps {
  media: Media
  status: MediaWatchStatus | undefined
  isUpdating: boolean
  showActions: boolean
  addMedia: AddMediaHandler
  removeMedia: (media: Pick<Media, 'id' | 'type'>) => Promise<void>
}

const TV_STATUS_LABELS: Partial<Record<MediaWatchStatus, string>> = {
  watched: 'Просмотрено',
  watching: 'В процессе',
  dropped: 'Заброшено',
}

export const MediaCard = ({
  media,
  status,
  addMedia,
  removeMedia,
  isUpdating,
  showActions,
}: MediaCardProps) => {
  const {
    addToFavorite,
    addToWatched,
    isCommentModalOpen,
    isStarsModalOpen,
    setIsStarsModalOpen,
    setIsCommentModalOpen,
    setComment,
    setStars,
    stars,
    comment,
  } = useAddMedia(media, addMedia)

  const [isOpenModalTV, setIsOpenModalTV] = useState<boolean>(false)

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

  const handleFavoriteClick = () => {
    if (isFavorite) {
      void removeMedia(media)
    } else {
      setIsCommentModalOpen(true)
    }
  }

  const handleWatchedClick = () => {
    if (isWatched) {
      void removeMedia(media)
    } else {
      setIsStarsModalOpen(true)
    }
  }

  const handleToggleTVModal = () => {
    setIsOpenModalTV((prev) => !prev)
  }

  const posterUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null

  const handleTVClick = async (status: MediaWatchStatus) => {
    if (status === 'watched') {
      setIsOpenModalTV(false)
      setIsStarsModalOpen(true)
      return
    }

    try {
      switch (status) {
        case 'dropped':
          await addMedia(media, {
            status: 'dropped',
            rating: stars,
            comment: null,
          })
          break

        case 'watching':
          await addMedia(media, {
            status: 'watching',
            rating: stars,
            comment: null,
          })
          break

        default:
          break
      }

      setStars(null)
      setIsOpenModalTV(false)
    } catch {
      return
    }
  }

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

        {showActions && (
          <Button
            variant="secondary"
            size="sm"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={isFavorite}
            aria-disabled={isUpdating}
            disabled={isUpdating}
            onClick={handleFavoriteClick}
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
              onClick={handleWatchedClick}
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

      <StarsModal
        isOpen={isStarsModalOpen}
        onClose={() => {
          setIsStarsModalOpen(false)
          setStars(null)
        }}
        setStars={setStars}
        stars={stars}
        onSubmit={addToWatched}
        isSubmitting={isUpdating}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false)
          setComment(null)
        }}
        comment={comment ?? ''}
        onCommentChange={setComment}
        onSubmit={addToFavorite}
        isSubmitting={isUpdating}
      />

      <TVModal
        currentStatus={status}
        onClick={handleTVClick}
        isOpen={isOpenModalTV}
        onClose={handleToggleTVModal}
      />
    </Card>
  )
}
