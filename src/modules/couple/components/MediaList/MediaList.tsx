import styles from './MediaList.module.scss'
import { MediaCard } from '@/modules/couple/components/MediaCard'
import { Card } from '@/shared/ui'
import { Film } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type {
  CoupleMediaFilters,
  CoupleMediaItem,
} from '@/modules/couple/api/types'
import { useMedia } from '@/modules/couple/hooks/useMedia'
import { MediaActionModals } from '@/modules/media/components/media/MediaActionModals/MediaActionModals'
import type { Profile } from '@/modules/profile'
import { MediaWatchStatus } from '@/shared/domain/media'

interface Props {
  isPending: boolean
  mediaItems: CoupleMediaItem[] | undefined
  filters: CoupleMediaFilters
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  coupleId: string
  profiles?: Array<Profile | null | undefined>
}

const EMPTY_COPY: Record<MediaWatchStatus, string> = {
  planned: 'Добавьте фильмы, которые хотите посмотреть вместе.',
  watching: 'Сейчас вы не смотрите ни одного фильма вместе.',
  watched: 'Здесь появятся фильмы, которые вы посмотрели вместе.',
  dropped: 'У вас нет заброшенных фильмов.',
}

export const MediaList = ({
  isPending,
  mediaItems,
  filters,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  coupleId,
  profiles,
}: Props) => {
  const {
    handleFavoriteClick,
    handleWatchedClick,
    handleOpenTVModal,
    isUpdating,
    modalProps,
  } = useMedia(coupleId)

  return (
    <>
      {isPending ? (
        <div className={styles.grid} aria-label="Загрузка коллекции" aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      ) : mediaItems?.length === 0 ? (
        <Card size="sm" className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>
            <Film />
          </span>
          <div className={styles.emptyCopy}>
            <h3>Здесь пока пусто</h3>
            <p>
              {filters.search
                ? 'Попробуйте изменить запрос или выбрать другой раздел.'
                : filters.status
                  ? EMPTY_COPY[filters.status]
                  : 'В вашей совместной коллекции пока нет фильмов.'}
            </p>
          </div>
        </Card>
      ) : (
        <InfiniteScroll
          dataLength={mediaItems?.length ?? 0}
          next={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage()
            }
          }}
          hasMore={Boolean(hasNextPage)}
          loader={
            isFetchingNextPage ? <p className={styles.loader}>Загружаем ещё…</p> : null
          }
          className={styles.grid}
        >
          {mediaItems?.map((item) => {
            const addedBy = profiles?.find((profile) => profile?.id === item.added_by)

            return (
              <MediaCard
                key={item.media.external_id}
                item={item}
                coupleId={coupleId}
                isUpdating={isUpdating}
                onFavoriteClick={() => handleFavoriteClick(item)}
                onWatchedClick={() => handleWatchedClick(item)}
                onTVStatusClick={() => handleOpenTVModal(item)}
                addedBy={addedBy}
              />
            )
          })}
        </InfiniteScroll>
      )}
      <MediaActionModals {...modalProps} />
    </>
  )
}
