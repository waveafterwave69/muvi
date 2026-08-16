import { Input, Tabs } from '@/shared/ui'
import type { FiltersType } from '@/modules/movies/api/movies/types'
import styles from './filters.module.scss'

interface FiltersProps {
  filters: FiltersType
  handleChange: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void
}

type MovieCategory = FiltersType['type']

const tabsValues: Array<{ label: string; id: MovieCategory }> = [
  { label: 'Популярное', id: 'popular' },
  { label: 'Лучшие', id: 'top_rated' },
  { label: 'Скоро в кино', id: 'upcoming' },
]

const isMovieCategory = (value: string | number): value is MovieCategory => {
  return tabsValues.some((tab) => tab.id === value)
}

export const Filters = ({ filters, handleChange }: FiltersProps) => {
  return (
    <div className={styles.root}>
      <Input
        placeholder="Поиск..."
        value={filters.search}
        size={'sm'}
        onChange={(e) => handleChange('search', e.target.value)}
      />
      <div className={styles.title}>
        <h3>Фильмы для вечера</h3>
        {!filters.search.trim() && (
          <Tabs
            tabs={tabsValues}
            value={filters.type}
            className={styles.tab}
            variant={'secondary'}
            size={'sm'}
            onChange={(value) => {
              if (isMovieCategory(value)) {
                handleChange('type', value)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
