import { Input, Tabs } from '@/shared/ui'
import type { FiltersType, MediaCategory } from '@/modules/media/api/media/types'
import styles from './MediaFilters.module.scss'
import { MediaType } from '@/shared/domain/media'

interface FiltersProps {
  filters: FiltersType
  handleChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void
}

const categoryTabs: Array<{ label: string; id: MediaCategory }> = [
  { label: 'Популярное', id: 'popular' },
  { label: 'Лучшие', id: 'top_rated' },
]

const mediaTypeTabs: Array<{ label: string; id: MediaType }> = [
  { label: 'Фильмы', id: 'movie' },
  { label: 'Сериалы', id: 'tv' },
]

const isMediaCategory = (value: string | number): value is MediaCategory => {
  return categoryTabs.some((tab) => tab.id === value)
}

const isMediaType = (value: string | number): value is MediaType => {
  return mediaTypeTabs.some((tab) => tab.id === value)
}

export const MediaFilters = ({ filters, handleChange }: FiltersProps) => {
  const filteredCategories = categoryTabs.filter(
    (tab) => !(filters.mediaType === 'tv' && tab.id === 'upcoming'),
  )

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <Input
          placeholder="Поиск..."
          value={filters.search}
          size={'sm'}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      <Tabs
        tabs={mediaTypeTabs}
        value={filters.mediaType}
        className={styles.mediaTypeTab}
        variant="secondary"
        size="sm"
        onChange={(value) => {
          if (isMediaType(value)) {
            handleChange('mediaType', value)
            if (value === 'tv' && filters.category === 'upcoming') {
              handleChange('category', 'popular')
            }
          }
        }}
      />
      <div className={styles.title}>
        <h3>{filters.mediaType === 'movie' ? 'Фильмы для вечера' : 'Сериалы для вечера'}</h3>
        {!filters.search.trim() && (
          <Tabs
            tabs={filteredCategories}
            value={filters.category}
            className={styles.tab}
            variant={'secondary'}
            size={'sm'}
            onChange={(value) => {
              if (isMediaCategory(value)) {
                handleChange('category', value)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
