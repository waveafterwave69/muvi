'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './MediaPromo.module.scss'
import { Button } from '@/shared/ui'
import { Calendar, Check, Clock2, LibraryBig, MoveLeft, Plus, Star } from 'lucide-react'
import { getMediaKey, Media, MediaType } from '@/modules/media/api/media/types'
import { StarsModal } from '../../media/StarsModal/StarsModal'
import { CommentModal } from '../../media/CommentModal/CommentModal'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { MediaDetails, Genre } from '@/modules/media/api/mediaDetails/types'
import { formatRuntime } from '@/shared/helpers/formatters'

interface MediaPromoProps {
  media: MediaDetails
  isAuthenticated: boolean
  type: MediaType
}

const getImageUrl = (path: string | null | undefined, size: string = 'original'): string => {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const MediaPromo: FC<MediaPromoProps> = ({ media, isAuthenticated, type }) => {
  const { addMedia, removeMedia, isUpdating, statuses } = useMediaStatus(media)

  const status = statuses.get(getMediaKey(media))
  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'

  const mappedMedia: Media = {
    type: media.type,
    id: media.id,
    title: media.title,
    overview: media.overview,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    release_date: media.release_date,
    vote_average: media.vote_average,
    adult: false,
    genre_ids: media.genres?.map((g) => g.id) || [],
    original_language: 'en',
    original_title: media.title,
    popularity: 0,
    video: false,
    vote_count: 0,
  }

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
  } = useAddMedia(mappedMedia, addMedia)

  const backdropUrl = getImageUrl(media.backdrop_path, 'original')
  const collection = media.belongs_to_collection
  const collectionImageUrl = getImageUrl(
    collection?.poster_path ?? collection?.backdrop_path,
    'w185',
  )
  const collectionSearchUrl = collection
    ? `/media?${new URLSearchParams({
        collection: String(collection.id),
        search: collection.name,
      })}`
    : ''

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

  return (
    <section
      className={styles.promo}
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={styles.promo__content}>
        <button className={styles.backlink} onClick={() => window.history.back()}>
          <MoveLeft size={20} />
          Назад
        </button>

        <div className={styles.badge__row}>
          <span className={styles.badge}>
            <Star aria-hidden="true" />
            <span>{media.vote_average.toFixed(1)}</span>
          </span>
          <span className={styles.badge}>
            <Calendar aria-hidden="true" />
            {media.release_date ? new Date(media.release_date).getFullYear() : '----'}
          </span>
          <span className={styles.badge}>
            <Clock2 aria-hidden="true" /> {formatRuntime(media.runtime)}
          </span>
        </div>

        <h3 className={styles.title}>{media.title}</h3>
        <p className={styles.genres}>
          {media.genres &&
            media.genres.length > 0 &&
            media.genres.map((g: Genre, index: number) => (
              <span key={g.id || index} className={styles.genreItem}>
                {g.name}
                {index < media.genres.length - 1 && <span className={styles.separator}>·</span>}
              </span>
            ))}
        </p>

        {collection && (
          <div className={styles.collection}>
            <Link
              href={collectionSearchUrl}
              className={styles.collectionLink}
              aria-label={`Открыть фильмы коллекции «${collection.name}»`}
            >
              <span className={styles.collectionPoster}>
                {collectionImageUrl ? (
                  <Image
                    src={collectionImageUrl}
                    alt={`Постер коллекции «${collection.name}»`}
                    fill
                    sizes="56px"
                  />
                ) : (
                  <LibraryBig aria-hidden="true" />
                )}
              </span>
              <span className={styles.collectionContent}>
                <span className={styles.collectionLabel}>Коллекция</span>
                <span className={styles.collectionName}>{collection.name}</span>
                <span className={styles.collectionHint}>Показать все фильмы</span>
              </span>
            </Link>
          </div>
        )}

        <p className={styles.overview}>{media.overview}</p>

        {isAuthenticated &&
          (type === 'movie' ? (
            <div className={styles.actionButtons}>
              <Button
                size="sm"
                variant={isFavorite ? 'primary' : 'secondary'}
                className={`${styles.watchedButton}`}
                leftIcon={isFavorite ? <Check aria-hidden="true" /> : <Plus />}
                aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                disabled={isUpdating}
                onClick={handleFavoriteClick}
              >
                <span className={styles.watchedButtonLabel}>
                  {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                </span>
              </Button>

              <Button
                size="sm"
                variant={isWatched ? 'primary' : 'secondary'}
                className={`${styles.watchedButton}`}
                leftIcon={isWatched ? <Check aria-hidden="true" /> : <Plus />}
                aria-label={isWatched ? 'Удалить из просмотренного' : 'Добавить в просмотренное'}
                disabled={isUpdating}
                onClick={handleWatchedClick}
              >
                <span className={styles.watchedButtonLabel}>
                  {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
                </span>
              </Button>
            </div>
          ) : (
            <div>TV</div>
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
    </section>
  )
}

export default MediaPromo
