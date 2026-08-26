'use client'

import { Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Variant } from '@/modules/media/api/couple/types'
import type { MediaWatchStatus } from '@/modules/media/api/media/types'
import { Button, Modal, Tabs } from '@/shared/ui'
import styles from './StarsModal.module.scss'
import { useCurrentProfile } from '@/modules/auth'

interface Props {
  isOpen: boolean
  onClose: () => void
  setStars: (value: number) => void
  stars: number | null
  onSubmit: () => void
  isSubmitting?: boolean
  currentStatus?: MediaWatchStatus
  onRemove: () => void
  variant: Variant
  setVariant: (variant: Variant) => void
}

const ratings = Array.from({ length: 10 }, (_, index) => index + 1)
const viewingModes = [
  { id: 'solo', label: 'Соло' },
  { id: 'couple', label: 'Пара' },
]

export const StarsModal = ({
  isOpen,
  onClose,
  stars,
  setStars,
  onSubmit,
  isSubmitting = false,
  currentStatus,
  onRemove,
  variant,
  setVariant,
}: Props) => {
  const [hover, setHover] = useState(0)
  const activeRating = hover || stars || 0
  const { data } = useCurrentProfile()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" ariaLabel="Оценка">
      <div className={styles.container}>
        <h3 className={styles.title}>Как тебе?</h3>
        <p className={styles.description}>{stars ? `${stars}/10` : 'Поставь оценку от 1 до 10'}</p>

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

        <div className={styles.stars} role="group" aria-label="Оценка от 1 до 10">
          {ratings.map((rating) => (
            <button
              className={`${styles.star} ${activeRating >= rating ? styles.active : ''}`}
              key={rating}
              type="button"
              aria-label={`${rating} из 10`}
              aria-pressed={stars === rating}
              onClick={() => setStars(rating)}
              onFocus={() => setHover(rating)}
              onBlur={() => setHover(0)}
              onMouseEnter={() => setHover(rating)}
              onMouseLeave={() => setHover(0)}
            >
              <Star aria-hidden="true" />
            </button>
          ))}
        </div>

        <Button
          className={styles.button}
          onClick={onSubmit}
          disabled={stars === null || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
        </Button>
        {currentStatus && (
          <Button
            className={styles.removeButton}
            variant="outline"
            leftIcon={<Trash2 aria-hidden="true" />}
            onClick={onRemove}
            disabled={isSubmitting}
          >
            Убрать статус
          </Button>
        )}
      </div>
    </Modal>
  )
}
