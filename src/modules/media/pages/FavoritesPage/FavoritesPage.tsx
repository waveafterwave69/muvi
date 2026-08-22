'use client'

import styles from './FavoritesPage.module.scss'
import { FavoriteFilters } from '../../components/FavoriteFilters/FavoriteFilters'
import { useMemo, useState } from 'react'
import { useDebounce } from '@/modules/media/hooks/useDebounce'
import { FavoriteFiltersType, Media } from '../../api/media/types'
import { useInfiniteFavoriteMediaQuery } from '../../api/media/queries'
import { MediaList } from '../../components/media/MediaList/MediaList'

const initialFilters: FavoriteFiltersType = {
  mediaType: 'movie',
  status: 'planned',
  search: '',
}

export const FavoritesPage = () => {
  const [filters, setFilters] = useState<FavoriteFiltersType>(initialFilters)
  const debouncedSearch = useDebounce(filters.search, 400)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteFavoriteMediaQuery({
      mediaType: filters.mediaType,
      status: filters.status,
      search: debouncedSearch,
    })

  const media = useMemo(() => {
    const mediaItems: Media[] = []

    data?.pages.forEach((page) => {
      page.items.forEach((item) => {
        const { external_id, release_date, ...media } = item.media

        mediaItems.push({
          ...media,
          id: external_id,
          release_date: release_date ?? '',
          vote_average: item.media.vote_average ?? 0,
          rating: item.rating ?? 0,
        })
      })
    })

    return mediaItems
  }, [data])

  const onChangeFilter = <K extends keyof FavoriteFiltersType>(
    key: K,
    value: FavoriteFiltersType[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={styles.root}>
      <FavoriteFilters filters={filters} onChange={onChangeFilter} />
      <MediaList
        media={media}
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  )
}
