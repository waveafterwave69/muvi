'use client'

import styles from './MediaPage.module.scss'
import { MediaList } from '../../components/media/MediaList/MediaList'
import { MediaFilters } from '../../components/media/MediaFilters/MediaFilters'
import { useInfiniteMediaQuery } from '../../api/media/queries'
import type { FiltersType, Media } from '../../api/media/types'
import { useMemo, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

const initialFilters: FiltersType = {
  search: '',
  category: 'popular',
  mediaType: 'movie',
}

interface MediaPageProps {
  initialSearch?: string
  initialCollectionId?: number
}

export function MediaPage({ initialSearch = '', initialCollectionId }: MediaPageProps) {
  const [filters, setFilters] = useState<FiltersType>({
    ...initialFilters,
    search: initialSearch,
  })
  const [collectionId, setCollectionId] = useState(initialCollectionId)
  const debouncedSearch = useDebounce(filters.search, 400)
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isPending } =
    useInfiniteMediaQuery({
      category: filters.category,
      mediaType: filters.mediaType,
      search: debouncedSearch,
      collectionId,
    })

  const media = useMemo(() => {
    const uniqueMedia = new Map<string, Media>()

    data?.pages.forEach((page) => {
      page.results.forEach((item: Media) => {
          uniqueMedia.set(`${item.type}:${item.id}`, item)
      })
    })

    return Array.from(uniqueMedia.values())
  }, [data])

  const handleChange = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
    if (key === 'search' || key === 'mediaType') {
      setCollectionId(undefined)
    }

    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (isError) {
    return (
      <main className={styles.error} role="alert">
        <p>{error.message}</p>
      </main>
    )
  }

  return (
    <main className={styles.root}>
      <MediaFilters filters={filters} handleChange={handleChange} />
      <MediaList
        media={media}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        mediaType={filters.mediaType}
      />
    </main>
  )
}
