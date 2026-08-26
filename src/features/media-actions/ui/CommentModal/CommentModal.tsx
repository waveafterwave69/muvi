'use client'

import { Check, MessageSquareText } from 'lucide-react'
import { useId, type FormEvent } from 'react'
import { Button, Modal, Tabs } from '@/shared/ui'
import styles from './CommentModal.module.scss'
import { MEDIA_COMMENT_MAX_LENGTH, MediaActionTarget } from '@/shared/domain/media'

export interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  comment: string
  onCommentChange: (comment: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
  target: MediaActionTarget
  onTargetChange?: (value: MediaActionTarget) => void,
  allowTargetSelection: boolean
}

const viewingModes = [
  { id: 'solo', label: 'Соло' },
  { id: 'couple', label: 'Пара' },
]

export const CommentModal = ({
  isOpen,
  onClose,
  comment,
  onCommentChange,
  onSubmit,
  isSubmitting = false,
  target,
  onTargetChange,
  allowTargetSelection,
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

        {allowTargetSelection && <Tabs
          className={styles.tabs}
          tabs={viewingModes}
          value={target}
          variant="primary"
          size="sm"
          onChange={(v) => {
            if(v === 'solo' || v === 'couple') {
              onTargetChange?.(v)
            }
          }}
        />}

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
              maxLength={MEDIA_COMMENT_MAX_LENGTH}
              placeholder="Почему хотите посмотреть?"
              aria-describedby={hintId}
              onChange={(event) =>
                onCommentChange(event.target.value.slice(0, MEDIA_COMMENT_MAX_LENGTH))
              }
            />
            <span className={styles.counter} aria-live="polite">
              {comment.length}/{MEDIA_COMMENT_MAX_LENGTH}
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
