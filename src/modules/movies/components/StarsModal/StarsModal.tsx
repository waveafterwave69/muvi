'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'
import { Button, Modal } from '@/shared/ui'
import styles from './StarsModal.module.scss'

interface Props {
  isOpen: boolean
  onClose: () => void
  setStars: (value: number) => void
  stars: number | null
  onSubmit: () => void
}

const ratings = Array.from({ length: 10 }, (_, index) => index + 1)

export const StarsModal = ({ isOpen, onClose, stars, setStars, onSubmit }: Props) => {
  const [hover, setHover] = useState(0)
  const activeRating = hover || stars || 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" ariaLabel="Оценка фильма">
      <div className={styles.container}>
        <h3 className={styles.title}>Как тебе фильм?</h3>
        <p className={styles.description}>{stars ? `${stars}/10` : 'Поставь оценку от 1 до 10'}</p>

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

        <Button className={styles.button} onClick={onSubmit}>
          Сохранить
        </Button>
      </div>
    </Modal>
  )
}
