'use client'

import { useMemo, useState } from 'react'
import { useInfiniteCoupleMediaQuery } from '@/modules/couple/api/queries'
import type { CoupleMediaFilters } from '@/modules/couple/api/types'
import type { Media } from '@/modules/media/api/media/types'
import { FavoriteFilters } from '@/modules/media/components/FavoriteFilters/FavoriteFilters'
import { MediaList } from '@/modules/media/components/media/MediaList/MediaList'
import { useDebounce } from '@/modules/media/hooks/useDebounce'
import styles from './CoupleMediaCollection.module.scss'

const initialFilters: CoupleMediaFilters = {
  mediaType: 'movie',
  status: 'planned',
  search: '',
}

interface CoupleMediaCollectionProps {
  coupleId: string
}

export const CoupleMediaCollection = ({ coupleId }: CoupleMediaCollectionProps) => {
  const [filters, setFilters] = useState<CoupleMediaFilters>(initialFilters)
  const debouncedSearch = useDebounce(filters.search, 400)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteCoupleMediaQuery({
      coupleId,
      mediaType: filters.mediaType,
      status: filters.status,
      search: debouncedSearch,
    })

  const media = useMemo(() => {
    const items: Media[] = []

    data?.pages.forEach((page) => {
      page.items.forEach((item) => {
        const { external_id, release_date, ...mediaItem } = item.media

        items.push({
          ...mediaItem,
          id: external_id,
          release_date: release_date ?? '',
        })
      })
    })

    return items
  }, [data])

  const onChangeFilter = <K extends keyof CoupleMediaFilters>(
    key: K,
    value: CoupleMediaFilters[K],
  ) => {
    setFilters((previousFilters) => ({ ...previousFilters, [key]: value }))
  }

  return (
    <section className={styles.root} aria-label="Коллекция пары">
      <FavoriteFilters
        filters={filters}
        onChange={onChangeFilter}
        title="Наша полка"
        searchPlaceholder="Найти в коллекции пары..."
      />
      <MediaList
        media={media}
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        mediaType={filters.mediaType}
        statusVariant="couple"
      />
    </section>
  )
}
