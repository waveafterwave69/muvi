'use client'

import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { getMediaKey, type Media, type MediaType } from '@/modules/media/api/media/types'
import { useHorizontalSlider } from '@/modules/media/hooks/useHorizontalSlider'
import { useMediaStatus } from '@/modules/media/hooks/useMediaStatus'
import { useCurrentUser } from '@/modules/auth'
import styles from './SimilarMedia.module.scss'
import { MediaCard } from '../../media/MediaCard/MediaCard'

interface SimilarMediaProps {
  media: Media[]
  mediaType?: MediaType
}

const SimilarMedia = ({ media, mediaType = 'movie' }: SimilarMediaProps) => {
  const visibleMedia = media.slice(0, 30)
  const mediaLabel = mediaType === 'tv' ? 'сериалы' : 'фильмы'
  const { data: user } = useCurrentUser()
  const { addMedia, isUpdating, removeMedia, statuses } = useMediaStatus(visibleMedia)
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
            return (
              <li className={styles.mediaItem} key={getMediaKey(item)}>
                <MediaCard
                  media={item}
                  status={statuses.get(getMediaKey(item))}
                  isUpdating={isUpdating}
                  showActions={Boolean(user)}
                  addMedia={addMedia}
                  removeMedia={removeMedia}
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
    </section>
  )
}

export default SimilarMedia
