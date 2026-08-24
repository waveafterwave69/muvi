'use client'

import styles from './MediaList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCurrentUser } from '@/modules/auth'
import { getMediaKey, Media } from '@/modules/media/api/media/types'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { MediaCardSkeleton } from '../MediaCardSkeleton/MediaCardSkeleton'
import { MediaCard } from '../MediaCard/MediaCard'
import { useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { MediaActionModals } from '../MediaActionModals/MediaActionModals'
import type { Variant } from '@/modules/media/api/couple/types'
import { MediaType } from '@/shared/domain/media'

interface MediaListProps {
  media: Media[]
  isPending: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  mediaType?: MediaType
  statusVariant?: Variant
}

export const MediaList = ({
  media,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPending,
  mediaType,
  statusVariant = 'solo',
}: MediaListProps) => {
  const {
    addMedia,
    coupleComments,
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
  } = useAddMedia({
    addMedia,
    removeMedia,
    removeCoupleMedia,
    isUpdating,
    defaultVariant: statusVariant,
  })

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
          const soloStatus = statuses.get(mediaKey)
          const coupleStatus = coupleStatuses.get(mediaKey)
          const status = statusVariant === 'couple' ? coupleStatus : soloStatus
          const coupleMediaId = coupleMediaIds.get(mediaKey)

          return (
            <MediaCard
              media={item}
              comment={coupleComments.get(mediaKey) ?? item.comment}
              key={mediaKey}
              coupleStatus={coupleStatus}
              handleFavorite={() => handleFavoriteClick(item, status, coupleMediaId)}
              handleWatched={() => handleWatchedClick(item, status, coupleMediaId)}
              handleToggleTVModal={() => handleOpenTVModal(item, status, coupleMediaId)}
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
              detailsVariant={statusVariant === 'couple' ? 'couple' : undefined}
            />
          )
        })}
      </InfiniteScroll>
      <MediaActionModals {...modalProps} />
    </>
  )
}
