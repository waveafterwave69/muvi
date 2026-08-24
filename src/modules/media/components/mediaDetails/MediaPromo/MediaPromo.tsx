'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './MediaPromo.module.scss'
import { Button } from '@/shared/ui'
import {
  Calendar,
  Check,
  CircleX,
  Clock2,
  LibraryBig,
  ListChecks,
  MoveLeft,
  Play,
  Plus,
  Star,
} from 'lucide-react'
import { getMediaKey, Media } from '@/modules/media/api/media/types'
import { MediaActionModals } from '../../media/MediaActionModals/MediaActionModals'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { MediaDetails, Genre } from '@/modules/media/api/mediaDetails/types'
import { formatRuntime } from '@/shared/helpers/formatters'
import { MediaType } from '@/shared/domain/media'

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
  const { addMedia, removeCoupleMedia, removeMedia, isUpdating, statuses } = useMediaStatus(media)

  const status = statuses.get(getMediaKey(media))
  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'
  const hasTVStatus = status === 'watched' || status === 'watching' || status === 'dropped'
  const tvStatusIcon =
    status === 'watched' ? (
      <Check aria-hidden="true" />
    ) : status === 'watching' ? (
      <Play aria-hidden="true" />
    ) : status === 'dropped' ? (
      <CircleX aria-hidden="true" />
    ) : (
      <ListChecks aria-hidden="true" />
    )

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

  const { handleFavoriteClick, handleWatchedClick, handleOpenTVModal, modalProps } = useAddMedia({
    addMedia,
    removeMedia,
    removeCoupleMedia,
    isUpdating,
  })

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
                onClick={() => handleFavoriteClick(mappedMedia, status)}
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
                onClick={() => handleWatchedClick(mappedMedia, status)}
              >
                <span className={styles.watchedButtonLabel}>
                  {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
                </span>
              </Button>
            </div>
          ) : (
            <div className={styles.actionButtons}>
              <Button
                size="sm"
                variant={isFavorite ? 'primary' : 'secondary'}
                className={styles.watchedButton}
                leftIcon={isFavorite ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                aria-label={isFavorite ? 'Убрать сериал из избранного' : 'Добавить сериал в избранное'}
                disabled={isUpdating}
                onClick={() => handleFavoriteClick(mappedMedia, status)}
              >
                <span className={styles.watchedButtonLabel}>
                  {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                </span>
              </Button>

              <Button
                size="sm"
                variant={hasTVStatus ? 'primary' : 'secondary'}
                className={styles.watchedButton}
                leftIcon={tvStatusIcon}
                aria-label={
                  status === 'watching'
                    ? 'Текущий статус: смотрю сейчас'
                    : status === 'watched'
                      ? 'Текущий статус: просмотрено'
                      : status === 'dropped'
                        ? 'Текущий статус: заброшено'
                        : 'Выбрать статус сериала'
                }
                disabled={isUpdating}
                onClick={() => handleOpenTVModal(mappedMedia, status)}
              >
                {status === 'watching'
                  ? 'Смотрю сейчас'
                  : status === 'watched'
                    ? 'Просмотрено'
                    : status === 'dropped'
                      ? 'Заброшено'
                      : 'Выбрать статус'}
              </Button>
            </div>
          ))}
      </div>

      <MediaActionModals {...modalProps} />
    </section>
  )
}

export default MediaPromo
