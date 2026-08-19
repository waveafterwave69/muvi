'use client'

import styles from './FavoriteFilters.module.scss'
import { Input, Tabs } from '@/shared/ui'
import { Search } from 'lucide-react'
import { FavoriteFiltersType } from '../../api/media/types'

type FavoriteStatus = FavoriteFiltersType['status']

const tabs: Array<{ label: string; id: FavoriteStatus }> = [
  { label: 'ИЗБРАННОЕ', id: 'planned' },
  { label: 'ПРОСМОТРЕННОЕ', id: 'watched' },
]

const isFavoriteStatus = (value: string | number): value is FavoriteStatus => {
  return tabs.some((tab) => tab.id === value)
}

interface FavoriteFiltersProps {
  filters: FavoriteFiltersType
  onChange: <K extends keyof FavoriteFiltersType>(key: K, value: FavoriteFiltersType[K]) => void
}

export const FavoriteFilters = ({ filters, onChange }: FavoriteFiltersProps) => {
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

      <Tabs
        className={styles.tabs}
        tabs={tabs}
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
  )
}
