'use client'

import { useMemo, useState } from 'react'
import { useInfiniteCoupleMediaQuery } from '../../api/queries'
import type { CoupleMediaFilters } from '../../api/types'
import styles from './CoupleMediaCollection.module.scss'
import { Filters } from '../Filters/Filters'
import { MediaList } from '../MediaList/MediaList'
import type { Profile } from '@/modules/profile'

const initialFilters: CoupleMediaFilters = {
  mediaType: null,
  status: null,
  search: '',
}

interface CoupleMediaCollectionProps {
  profiles?: Array<Profile | null | undefined>
  coupleId: string
}

export const CoupleMediaCollection = ({ coupleId, profiles }: CoupleMediaCollectionProps) => {
  const [filters, setFilters] = useState<CoupleMediaFilters>(initialFilters)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteCoupleMediaQuery({
      coupleId,
      mediaType: null,
      status: filters.status,
      search: '',
    })

  const mediaItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.items);
  }, [data])

  const onChangeFilter = <K extends keyof CoupleMediaFilters>(
    key: K,
    value: CoupleMediaFilters[K],
  ) => {
    setFilters((previousFilters) => ({ ...previousFilters, [key]: value }))
  }

  return (
    <section className={styles.root} aria-label="Коллекция пары">
      <Filters filters={filters} onChangeFilter={onChangeFilter} />
      <MediaList
        isPending={isPending}
        mediaItems={mediaItems}
        fetchNextPage={fetchNextPage}
        filters={filters}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        coupleId={coupleId}
        profiles={profiles}
      />
    </section>
  )
}
