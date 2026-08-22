'use client'

import { X } from 'lucide-react'
import { useEffect, type FC, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '@/shared/helpers/className'
import type { Size } from '@/shared/types/size'
import Card from '@/shared/ui/Card/Card'
import styles from './Modal.module.scss'

export type ModalVariant = 'card' | 'plain'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  variant?: ModalVariant
  size?: Size
  className?: string
  overlayClassName?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  variant = 'card',
  size = 'md',
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  useEffect(() => {
    if (!isOpen) return

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  const content = (
    <>
      {showCloseButton && (
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Закрыть модальное окно"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      )}

      {children}
    </>
  )

  return createPortal(
    <div
      className={classNames(
        styles.modal,
        {
          [styles.opened]: isOpen,
          [styles.plain]: variant === 'plain',
        },
        [overlayClassName],
      )}
      onMouseDown={handleOverlayClick}
    >
      <div
        className={classNames(styles.dialog, {}, [styles[size], className])}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : 'Модальное окно')}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        {variant === 'card' ? (
          <Card className={styles.card} size={size}>
            {content}
          </Card>
        ) : (
          content
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
