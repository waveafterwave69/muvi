'use client'

import { Check, MessageSquareText } from 'lucide-react'
import { useId, type FormEvent } from 'react'
import { Button, Modal, Tabs } from '@/shared/ui'
import styles from './CommentModal.module.scss'

export interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  comment: string
  onCommentChange: (comment: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

const viewingModes = [
  { id: 'solo', label: 'Соло' },
  { id: 'pair', label: 'Пара' },
]

const MAX_COMMENT_LENGTH = 600

export const CommentModal = ({
  isOpen,
  onClose,
  comment,
  onCommentChange,
  onSubmit,
  isSubmitting = false,
}: CommentModalProps) => {
  const titleId = useId()
  const textareaId = useId()
  const hintId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" ariaLabelledBy={titleId}>
      <form className={styles.content} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            <MessageSquareText />
          </span>

          <div className={styles.heading}>
            <h2 className={styles.title} id={titleId}>
              Оставь комментарий
            </h2>
          </div>
        </header>

        <Tabs
          className={styles.tabs}
          tabs={viewingModes}
          value="solo"
          variant="primary"
          size="sm"
          onChange={() => undefined}
        />

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor={textareaId}>
              Твой комментарий
            </label>
            <span className={styles.modeHint} id={hintId}>
              Можно оставить короткую заметку
            </span>
          </div>

          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              id={textareaId}
              value={comment}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="Почему хотите посмотреть?"
              aria-describedby={hintId}
              onChange={(event) => onCommentChange(event.target.value)}
            />
            <span className={styles.counter} aria-live="polite">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </span>
          </div>
        </div>

        <Button
          className={styles.submitButton}
          type="submit"
          rightIcon={<Check aria-hidden="true" />}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Сохраняем...' : 'Сохранить комментарий'}
        </Button>
      </form>
    </Modal>
  )
}
