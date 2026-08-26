import { Tabs } from '@/shared/ui'
import styles from './EpisodeTracker.module.scss'
import { MediaActionTarget } from '@/shared/domain/media'

interface EpisodeProgressModeSelectorProps {
  variant: MediaActionTarget
  onChange: (variant: MediaActionTarget) => void
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
