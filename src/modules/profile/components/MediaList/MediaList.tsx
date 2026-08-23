'use client'

import { useMemo, useState, type FC } from 'react'
import { MediaCard } from '@/modules/media'
import type { Media, MediaType, MediaWatchStatus } from '@/modules/media/api/media/types'
import { Card, Tabs } from '@/shared/ui'
import type { ProfileMedia } from '../../types/profileTypes'
import styles from './MediaList.module.scss'

interface MediaListProps {
  media: ProfileMedia[]
}

const mediaTypeTabs: Array<{ id: MediaType; label: string }> = [
  { id: 'movie', label: 'ФИЛЬМЫ' },
  { id: 'tv', label: 'СЕРИАЛЫ' },
]

const moviesStatusTabs: Array<{ id: MediaWatchStatus; label: string }> = [
  { id: 'planned', label: 'ИЗБРАННЫЕ' },
  { id: 'watched', label: 'ПРОСМОТРЕННЫЕ' },
]

const tvStatusTabs: Array<{ id: MediaWatchStatus; label: string }> = [
  { id: 'planned', label: 'ИЗБРАННЫЕ' },
  { id: 'watched', label: 'ПРОСМОТРЕННЫЕ' },
  { id: 'watching', label: 'В ПРОЦЕССЕ' },
  { id: 'dropped', label: 'ЗАБРОШЕННЫЕ' },
]

const isMediaType = (value: string | number): value is MediaType => {
  return mediaTypeTabs.some((tab) => tab.id === value)
}

const isMovieStatus = (value: string | number): value is MediaWatchStatus => {
  return moviesStatusTabs.some((tab) => tab.id === value)
}

const isTvStatus = (value: string | number): value is MediaWatchStatus => {
  return tvStatusTabs.some((tab) => tab.id === value)
}

const toMediaCardData = (item: ProfileMedia): Media | null => {
  if (!item.media) return null

  return {
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: item.media.external_id,
    original_language: '',
    original_title: item.media.title,
    overview: item.media.overview,
    popularity: 0,
    poster_path: item.media.poster_path,
    rating: item.rating ?? undefined,
    release_date: item.media.release_date ?? '',
    title: item.media.title,
    type: item.media.type,
    video: false,
    vote_average: item.media.vote_average,
    vote_count: 0,
  }
}

const MediaList: FC<MediaListProps> = ({ media }) => {
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('movie')
  const [activeStatus, setActiveStatus] = useState<MediaWatchStatus>('planned')

  const filteredMedia = useMemo(() => {
    return media.filter(
      (item) => item.media?.type === activeMediaType && item.status === activeStatus,
    )
  }, [activeMediaType, activeStatus, media])

  return (
    <Card className={styles.wrapperCard}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <Tabs
            className={styles.mediaTypeTabs}
            size="sm"
            tabs={mediaTypeTabs}
            value={activeMediaType}
            onChange={(value) => {
              if (!isMediaType(value)) return

              setActiveMediaType(value)

              if (value === 'movie' && !isMovieStatus(activeStatus)) {
                setActiveStatus('planned')
              }
            }}
            variant="secondary"
          />
        </div>

        <div className={`${styles.filterGroup} ${styles.statusGroup}`}>
          {activeMediaType === 'movie' ? (
            <Tabs
              className={styles.statusTabs}
              size="sm"
              tabs={moviesStatusTabs}
              value={activeStatus}
              onChange={(value) => {
                if (isMovieStatus(value)) setActiveStatus(value)
              }}
              variant="secondary"
            />
          ) : (
            <Tabs
              className={`${styles.statusTabs} ${styles.tvStatusTabs}`}
              size="sm"
              tabs={tvStatusTabs}
              value={activeStatus}
              onChange={(value) => {
                if (isTvStatus(value)) setActiveStatus(value)
              }}
              variant="secondary"
            />
          )}
        </div>
      </div>

      {filteredMedia.length ? (
        <div className={styles.mediaGrid}>
          {filteredMedia.map((item) => {
            const mediaItem = toMediaCardData(item)
            if (!mediaItem) return null

            return (
              <MediaCard
                key={`${mediaItem.type}:${mediaItem.id}`}
                media={mediaItem}
                comment={item.comment}
                status={item.status}
                coupleStatus={undefined}
                isUpdating={false}
                showActions={false}
                handleFavorite={() => undefined}
                handleWatched={() => undefined}
                handleToggleTVModal={() => undefined}
              />
            )
          })}
        </div>
      ) : (
        <p className={styles.empty}>Ничего не найдено</p>
      )}
    </Card>
  )
}

export default MediaList
