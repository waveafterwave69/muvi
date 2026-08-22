import { Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './TVModal.module.scss'
import { Button, Modal, Tabs } from '@/shared/ui'
import { Tab } from '@/shared/types/tab'
import { Check, Trash2 } from 'lucide-react'
import { MediaWatchStatus } from '../../../api/media/types'
import { Variant } from '@/modules/media/api/couple/types'
import { useCurrentProfile } from '@/modules/auth'

interface TVModalProps {
  isOpen: boolean
  onClose: () => void
  onClick: (type: MediaWatchStatus) => void
  onRemove: () => void
  currentStatus?: MediaWatchStatus
  isSubmitting?: boolean
  variant: Variant
  setVariant: Dispatch<SetStateAction<Variant>>
}

type TVWatchStatus = Exclude<MediaWatchStatus, 'planned'>

const TVTabs: Tab[] = [
  { id: 'watched', label: 'Просмотрен' },
  { id: 'watching', label: 'Смотрю сейчас' },
  { id: 'dropped', label: 'Заброшено' },
]

const viewingModes = [
  { id: 'solo', label: 'Соло' },
  { id: 'couple', label: 'Пара' },
]

const isTVWatchStatus = (status: number | string | undefined): status is TVWatchStatus =>
  status === 'watched' || status === 'watching' || status === 'dropped'

const getTVWatchStatus = (status?: MediaWatchStatus): TVWatchStatus =>
  isTVWatchStatus(status) ? status : 'watched'

const TVModal: FC<TVModalProps> = ({
  isOpen,
  onClose,
  onClick,
  onRemove,
  currentStatus,
  isSubmitting = false,
  variant,
  setVariant,
}) => {
  const [selectedTab, setSelectedTab] = useState<TVWatchStatus | null>(null)
  const currentTab = selectedTab ?? getTVWatchStatus(currentStatus)
  const { data } = useCurrentProfile()

  const handleClose = () => {
    setSelectedTab(null)
    onClose()
  }

  const handleTVModal = () => {
    onClick(currentTab)
  }

  const handleRemove = () => {
    setSelectedTab(null)
    onRemove()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h4 className={styles.title}>Выберите статус сериала</h4>
      <p className={styles.subtitle}>
        Статус сериала, который будет отображаться в вашей коллекции
      </p>
      {data?.in_couple && (
        <Tabs
          tabs={viewingModes}
          value={variant}
          variant="primary"
          size="sm"
          onChange={(value) => {
            if (value === 'solo' || value === 'couple') {
              setVariant(value)
            }
          }}
        />
      )}
      <Tabs
        className={styles.tabs}
        tabs={TVTabs}
        size="sm"
        value={currentTab}
        onChange={(id) => {
          if (isTVWatchStatus(id)) {
            setSelectedTab(id)
          }
        }}
      />
      <div className={styles.actions}>
        <Button
          onClick={handleTVModal}
          leftIcon={<Check />}
          className={styles.button}
          disabled={isSubmitting}
          size="sm"
        >
          Выбрать
        </Button>
        {currentStatus && (
          <Button
            onClick={handleRemove}
            leftIcon={<Trash2 />}
            variant="outline"
            className={styles.removeButton}
            disabled={isSubmitting}
            size="sm"
          >
            Убрать статус
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default TVModal
