'use client'

import styles from './FavoriteFilters.module.scss'
import { Input, Tabs } from '@/shared/ui'
import { Search } from 'lucide-react'
import { FavoriteFiltersType, MediaType } from '../../api/media/types'

type FavoriteStatus = FavoriteFiltersType['status']

const mediaTypeTabs: Array<{ label: string; id: MediaType }> = [
  { label: 'ФИЛЬМЫ', id: 'movie' },
  { label: 'СЕРИАЛЫ', id: 'tv' },
]

const statusTabs: Array<{ label: string; id: FavoriteStatus }> = [
  { label: 'ИЗБРАННОЕ', id: 'planned' },
  { label: 'ПРОСМОТРЕННЫЕ', id: 'watched' },
  { label: 'В ПРОЦЕССЕ', id: 'watching' },
  { label: 'ЗАБРОШЕННЫЕ', id: 'dropped' },
]

const isMediaType = (value: string | number): value is MediaType => {
  return mediaTypeTabs.some((tab) => tab.id === value)
}

const isFavoriteStatus = (value: string | number): value is FavoriteStatus => {
  return statusTabs.some((tab) => tab.id === value)
}

interface FavoriteFiltersProps {
  filters: FavoriteFiltersType
  onChange: <K extends keyof FavoriteFiltersType>(key: K, value: FavoriteFiltersType[K]) => void
}

export const FavoriteFilters = ({ filters, onChange }: FavoriteFiltersProps) => {
  const visibleStatusTabs =
    filters.mediaType === 'movie'
      ? statusTabs.filter((tab) => tab.id === 'planned' || tab.id === 'watched')
      : statusTabs

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <h3>Моя полка</h3>
        <Input
          size="sm"
          rootClassName={styles.search}
          placeholder={'Найти в своей коллекции...'}
          icon={<Search />}
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      <div className={styles.filters}>
        <Tabs
          className={styles.mediaTypeTabs}
          tabs={mediaTypeTabs}
          variant="secondary"
          value={filters.mediaType}
          onChange={(value) => {
            if (isMediaType(value)) {
              onChange('mediaType', value)

              if (value === 'movie' && !['planned', 'watched'].includes(filters.status)) {
                onChange('status', 'planned')
              }
            }
          }}
          size="sm"
        />

        <Tabs
          className={`${styles.tabs} ${filters.mediaType === 'tv' ? styles.tvStatusTabs : ''}`}
          tabs={visibleStatusTabs}
          value={filters.status}
          onChange={(value) => {
            if (isFavoriteStatus(value)) {
              onChange('status', value)
            }
          }}
          variant="secondary"
          size="sm"
        />
      </div>
    </div>
  )
}
