'use client'

import styles from './MediaList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCurrentUser } from '@/modules/auth'
import { getMediaKey, Media, type MediaType } from '@/modules/media/api/media/types'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { MediaCardSkeleton } from '../MediaCardSkeleton/MediaCardSkeleton'
import { MediaCard } from '../MediaCard/MediaCard'
import { useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { MediaActionModals } from '../MediaActionModals/MediaActionModals'

interface MediaListProps {
  media: Media[]
  isPending: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  mediaType?: MediaType
}

export const MediaList = ({
  media,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPending,
  mediaType,
}: MediaListProps) => {
  const {
    addMedia,
    coupleMediaIds,
    coupleStatuses,
    isUpdating,
    removeCoupleMedia,
    removeMedia,
    statuses,
  } = useMediaStatus(media)
  const { data: user } = useCurrentUser()
  const {
    handleFavoriteClick,
    handleWatchedClick,
    handleOpenTVModal,
    handleRemoveCoupleMedia,
    modalProps,
  } = useAddMedia({ addMedia, removeMedia, removeCoupleMedia, isUpdating })

  if (isPending) {
    return (
      <div className={styles.grid}>
        <MediaCardSkeleton mediaType={mediaType} />
      </div>
    )
  }

  if (!media.length) {
    return <p className={styles.empty}>Ничего не найдено</p>
  }

  return (
    <>
      <InfiniteScroll
        dataLength={media.length}
        hasMore={hasNextPage}
        next={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage()
          }
        }}
        loader={
          isFetchingNextPage ? (
            <MediaCardSkeleton count={4} mediaType={mediaType ?? media[0]?.type} />
          ) : null
        }
        className={styles.grid}
      >
        {media.map((item) => {
          const mediaKey = getMediaKey(item)
          const status = statuses.get(mediaKey)
          const coupleMediaId = coupleMediaIds.get(mediaKey)

          return (
            <MediaCard
              media={item}
              key={mediaKey}
              coupleStatus={coupleStatuses.get(mediaKey)}
              handleFavorite={() => handleFavoriteClick(item, status)}
              handleWatched={() => handleWatchedClick(item, status)}
              handleToggleTVModal={() => handleOpenTVModal(item, status)}
              handleRemoveFromCouple={
                coupleMediaId !== undefined
                  ? () => {
                      void handleRemoveCoupleMedia(coupleMediaId)
                    }
                  : undefined
              }
              isUpdating={isUpdating}
              status={status}
              showActions={!!user}
              userId={user?.id}
            />
          )
        })}
      </InfiniteScroll>
      <MediaActionModals {...modalProps} />
    </>
  )
}
