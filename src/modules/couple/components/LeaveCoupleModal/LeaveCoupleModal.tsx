'use client'

import { useId } from 'react'
import { HeartCrack } from 'lucide-react'
import { Button, Modal } from '@/shared/ui'
import styles from './LeaveCoupleModal.module.scss'

interface LeaveCoupleModalProps {
  isOpen: boolean
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export const LeaveCoupleModal = ({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: LeaveCoupleModalProps) => {
  const titleId = useId()
  const descriptionId = useId()

  const handleClose = () => {
    if (!isPending) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      showCloseButton={!isPending}
      closeOnOverlayClick={!isPending}
      ariaLabelledBy={titleId}
      ariaDescribedBy={descriptionId}
    >
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden>
          <HeartCrack />
        </span>

        <div className={styles.copy}>
          <h2 id={titleId}>Выйти из пары?</h2>
          <p id={descriptionId}>
            Текущая пара будет завершена. Общая коллекция и статистика пары станут недоступны.
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            className={styles.actionButton}
            variant="primary"
            disabled={isPending}
            autoFocus
            onClick={handleClose}
          >
            Остаться
          </Button>
          <Button
            variant="secondary"
            className={styles.actionButton}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Выходим…' : 'Выйти из пары'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
