import { FC, useState } from 'react'
import styles from './TVModal.module.scss'
import { Button, Modal, Tabs } from '@/shared/ui'
import { Tab } from '@/shared/types/tab'
import { Check } from 'lucide-react'
import { MediaWatchStatus } from '../../api/media/types'

interface TVModalProps {
  isOpen: boolean
  onClose: () => void
  onClick: (type: MediaWatchStatus) => void
  currentStatus?: MediaWatchStatus
}

type TVWatchStatus = Exclude<MediaWatchStatus, 'planned'>

const TVTabs: Tab[] = [
  { id: 'watched', label: 'Просмотренно' },
  { id: 'watching', label: 'Смотрю сейчас' },
  { id: 'dropped', label: 'Заброшенно' },
]

const isTVWatchStatus = (status: number | string | undefined): status is TVWatchStatus =>
  status === 'watched' || status === 'watching' || status === 'dropped'

const getTVWatchStatus = (status?: MediaWatchStatus): TVWatchStatus =>
  isTVWatchStatus(status) ? status : 'watched'

const TVModal: FC<TVModalProps> = ({ isOpen, onClose, onClick, currentStatus }) => {
  const [selectedTab, setSelectedTab] = useState<TVWatchStatus | null>(null)
  const currentTab = selectedTab ?? getTVWatchStatus(currentStatus)

  const handleClose = () => {
    setSelectedTab(null)
    onClose()
  }

  const handleTVModal = () => {
    onClick(currentTab)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h4 className={styles.title}>Выберите статус сериала</h4>
      <p className={styles.subtitle}>
        Статус сериала, который будет отображаться в вашей коллекции
      </p>
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
      <Button onClick={handleTVModal} leftIcon={<Check />} className={styles.button}>
        Выбрать
      </Button>
    </Modal>
  )
}

export default TVModal
