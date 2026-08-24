import styles from './Filters.module.scss'
import { Tabs } from '@/shared/ui'
import type { CoupleMediaFilters } from '@/modules/couple/api/types'

const StatusesTabs: Array<{
  id: CoupleMediaFilters['status']
  label: string
}> = [
  { id: null, label: 'Все' },
  { id: 'planned', label: 'Избранные' },
  { id: 'watching', label: 'В процессе' },
  { id: 'watched', label: 'Просмотренные' },
  { id: 'dropped', label: 'Заброшенные' },
]

interface FiltersProps {
  filters: CoupleMediaFilters
  onChangeFilter: <K extends keyof CoupleMediaFilters>(
    key: K,
    value: CoupleMediaFilters[K],
  ) => void
}

export const Filters = ({ filters, onChangeFilter }: FiltersProps) => {
  return (
    <div className={styles.root}>
      <Tabs
        variant="secondary"
        tabs={StatusesTabs}
        value={filters.status}
        onChange={(value) => onChangeFilter('status', value)}
      />
    </div>
  )
}
