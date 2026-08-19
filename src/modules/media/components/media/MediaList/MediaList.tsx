'use client'

import styles from './MediaList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCurrentUser } from '@/modules/auth'
import { getMediaKey, Media } from '@/modules/media/api/media/types'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { MediaCardSkeleton } from '../MediaCardSkeleton/MediaCardSkeleton'
import { MediaCard } from '../MediaCard/MediaCard'

interface MediaListProps {
  media: Media[]
  isPending: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export const MediaList = ({
  media,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPending,
}: MediaListProps) => {
  const { addMedia, isUpdating, removeMedia, statuses } = useMediaStatus(media)
  const { data: user } = useCurrentUser()

  if (isPending) {
    return (
      <div className={styles.grid}>
        <MediaCardSkeleton />
      </div>
    )
  }

  if (!media.length) {
    return <p className={styles.empty}>Ничего не найдено</p>
  }

  return (
    <InfiniteScroll
      dataLength={media.length}
      hasMore={hasNextPage}
      next={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      }}
      loader={isFetchingNextPage ? <MediaCardSkeleton count={4} /> : null}
      className={styles.grid}
    >
      {media.map((item) => {
        return (
          <MediaCard
            media={item}
            key={getMediaKey(item)}
            addMedia={addMedia}
            removeMedia={removeMedia}
            isUpdating={isUpdating}
            status={statuses.get(getMediaKey(item))}
            showActions={!!user}
          />
        )
      })}
    </InfiniteScroll>
  )
}
