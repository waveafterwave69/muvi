'use client'

import Image from 'next/image'
import { Check, Film, Heart, Plus, Star } from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import styles from './MediaCard.module.scss'
import { getMediaHref, Media, MediaWatchStatus } from '@/modules/media/api/media/types'
import { type AddMediaHandler, useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { StarsModal } from '../StarsModal/StarsModal'
import { CommentModal } from '../CommentModal/CommentModal'

interface MediaCardProps {
  media: Media
  status: MediaWatchStatus | undefined
  isUpdating: boolean
  showActions: boolean
  addMedia: AddMediaHandler
  removeMedia: (media: Pick<Media, 'id' | 'type'>) => Promise<void>
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

  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'

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

  const posterUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null

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

        {showActions && (
          <Button
            variant={isWatched ? 'primary' : 'secondary'}
            size="sm"
            className={`${styles.watchedButton}`}
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
        )}
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
    </Card>
  )
}
