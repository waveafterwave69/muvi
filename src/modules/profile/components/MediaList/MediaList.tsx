'use client'

import { FC, useState, useMemo } from 'react'
import styles from './MediaList.module.scss'
import { ProfileMedia } from '../../types/profileTypes'
import { Card } from '@/shared/ui'
import Image from 'next/image'
import Link from 'next/link'
import Tabs from '@/shared/ui/Tabs/Tabs'
import { Star } from 'lucide-react'
import { getMediaHref } from '@/modules/media/api/media/types'

interface MediaListProps {
  media: ProfileMedia[]
}

const TAB_PLANNED = 1
const TAB_WATCHED = 2

const MediaList: FC<MediaListProps> = ({ media }) => {
  const [activeTab, setActiveTab] = useState<number | string>(TAB_PLANNED)

  const profileTabs = [
    { id: TAB_PLANNED, label: 'В планах' },
    { id: TAB_WATCHED, label: 'Просмотрено' },
  ]

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {
      if (activeTab === TAB_PLANNED) {
        return item.status === 'planned'
      }
      if (activeTab === TAB_WATCHED) {
        return item.status === 'watched'
      }
      return true
    })
  }, [media, activeTab])

  if (!media.length) {
    return <Card className={styles.empty}>Список пока пуст :(</Card>
  }

  return (
    <Card className={styles.wrapper_card}>
      <div className={styles.tabs__container}>
        <Tabs
          size="sm"
          tabs={profileTabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
          variant="secondary"
        />
      </div>

      {!filteredMedia.length ? (
        <div className={styles.empty_tab}>
          {activeTab === TAB_PLANNED && 'Нет запланированных фильмов'}
          {activeTab === TAB_WATCHED && 'Нет просмотренных фильмов'}
        </div>
      ) : (
        <div className={styles.media__grid}>
          {filteredMedia.map((item) => {
            const mediaItem = item.media
            if (!mediaItem) return null

            const posterUrl = mediaItem.poster_path
              ? `https://image.tmdb.org/t/p/w500${mediaItem.poster_path}`
              : null

            return (
              <div key={mediaItem.id}>
                <Link
                  href={getMediaHref({ id: mediaItem.external_id, type: mediaItem.type })}
                  className={styles.media__card}
                >
                  <div className={styles.poster__wrapper}>
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={mediaItem.title}
                        className={styles.poster}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className={styles.poster__placeholder}>
                        <span>🎬</span>
                      </div>
                    )}

                    {item.status === 'watched' && item.rating && (
                      <div className={styles.user__rating}>
                        <Star aria-hidden="true" /> <span>{item.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.title_row}>
                      <h4 className={styles.title} title={mediaItem.title}>
                        {mediaItem.title}
                      </h4>
                    </div>

                    {item.status === 'planned' && item.comment && (
                      <p className={styles.comment} title={item.comment}>
                        {item.comment}
                      </p>
                    )}
                  </div>

                  <div className={styles.meta}>
                    <span className={`${styles.status} ${styles[`status__${item.status}`]}`}>
                      {item.status === 'watched' ? 'Просмотрено' : 'В планах'}
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default MediaList
