import { Tabs } from '@/shared/ui'
import type { Variant } from '../../../api/couple/types'
import styles from './EpisodeTracker.module.scss'

interface EpisodeProgressModeSelectorProps {
  variant: Variant
  onChange: (variant: Variant) => void
}

const progressTabs = [
  { id: 'solo', label: 'Соло' },
  { id: 'couple', label: 'Пара' },
]

const EpisodeProgressModeSelector = ({
  variant,
  onChange,
}: EpisodeProgressModeSelectorProps) => (
  <div className={styles.modeSelector}>
    <span>Чей прогресс отмечаем</span>
    <Tabs
      tabs={progressTabs}
      value={variant}
      variant="secondary"
      size="sm"
      onChange={(value) => {
        if (value === 'solo' || value === 'couple') onChange(value)
      }}
    />
  </div>
)

export default EpisodeProgressModeSelector
