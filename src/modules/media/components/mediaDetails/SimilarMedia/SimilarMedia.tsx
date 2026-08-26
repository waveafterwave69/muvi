'use client'

import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { getMediaKey, type Media } from '@/modules/media/api/media/types'
import { useHorizontalSlider } from '@/modules/media/hooks/useHorizontalSlider'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { useAddMedia } from '@/modules/media/hooks/useAddMedia'
import { useCurrentUser } from '@/modules/auth'
import styles from './SimilarMedia.module.scss'
import { MediaCard } from '../../media/MediaCard/MediaCard'
import { MediaType } from '@/shared/domain/media'
import { MediaActionModals } from '@/features/media-actions'

interface SimilarMediaProps {
  media: Media[]
  mediaType?: MediaType
}

const SimilarMedia = ({ media, mediaType = 'movie' }: SimilarMediaProps) => {
  const visibleMedia = media.slice(0, 30)
  const mediaLabel = mediaType === 'tv' ? 'сериалы' : 'фильмы'
  const { data: user } = useCurrentUser()
  const {
    addMedia,
    coupleComments,
    coupleMediaIds,
    coupleStatuses,
    isUpdating,
    removeCoupleMedia,
    removeMedia,
    statuses,
  } = useMediaStatus(visibleMedia)
  const {
    handleFavoriteClick,
    handleWatchedClick,
    handleOpenTVModal,
    handleRemoveCoupleMedia,
    modalProps,
  } = useAddMedia({ addMedia, removeMedia, removeCoupleMedia, isUpdating })
  const { listRef, canScrollBack, canScrollForward, scroll } = useHorizontalSlider(
    visibleMedia.length,
  )

  return (
    <section className={styles.section} aria-labelledby="similar-media-title">
      <div className={styles.header}>
        <div>
          <h3 id="similar-media-title" className={styles.title}>
            Похожие {mediaLabel}
          </h3>
          <p className={styles.subtitle}>Истории с похожими жанрами, темами и настроением</p>
        </div>
        {visibleMedia.length > 0 && (
          <div className={styles.controls} aria-label={`Навигация: похожие ${mediaLabel}`}>
            <button
              type="button"
              className={styles.control}
              aria-label={`Предыдущие похожие ${mediaLabel}`}
              disabled={!canScrollBack}
              onClick={() => scroll(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label={`Следующие похожие ${mediaLabel}`}
              disabled={!canScrollForward}
              onClick={() => scroll(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {visibleMedia.length ? (
        <ul ref={listRef} className={styles.list}>
          {visibleMedia.map((item) => {
            const mediaKey = getMediaKey(item)
            const status = statuses.get(mediaKey)
            const coupleMediaId = coupleMediaIds.get(mediaKey)
            const coupleStatus = coupleStatuses.get(mediaKey)

            return (
              <li className={styles.mediaItem} key={mediaKey}>
                <MediaCard
                  media={item}
                  comment={coupleComments.get(mediaKey)}
                  status={status}
                  coupleStatus={coupleStatus}
                  isUpdating={isUpdating}
                  showActions={Boolean(user)}
                  userId={user?.id}
                  handleFavorite={() =>
                    handleFavoriteClick(item, status, coupleMediaId, coupleStatus)
                  }
                  handleWatched={() =>
                    handleWatchedClick(item, status, coupleMediaId, coupleStatus)
                  }
                  handleToggleTVModal={() =>
                    handleOpenTVModal(item, status, coupleMediaId, coupleStatus)
                  }
                  handleRemoveFromCouple={
                    coupleMediaId !== undefined
                      ? () => {
                          void handleRemoveCoupleMedia(coupleMediaId)
                        }
                      : undefined
                  }
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <SearchX aria-hidden="true" />
          <div>
            <h4>Похожие {mediaLabel} не найдены</h4>
            <p>TMDB пока не подготовил рекомендации.</p>
          </div>
        </div>
      )}
      <MediaActionModals {...modalProps} />
    </section>
  )
}

export default SimilarMedia
