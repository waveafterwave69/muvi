import type { ComponentProps } from 'react'
import { StarsModal } from '../StarsModal/StarsModal'
import { CommentModal } from '../CommentModal/CommentModal'
import TVModal from '../../tv/TVModal'

interface MediaActionModalsProps {
  stars: ComponentProps<typeof StarsModal>
  comment: ComponentProps<typeof CommentModal>
  tv: ComponentProps<typeof TVModal>
}

export const MediaActionModals = ({ stars, comment, tv }: MediaActionModalsProps) => {
  return (
    <>
      <StarsModal {...stars} />
      <CommentModal {...comment} />
      <TVModal {...tv} />
    </>
  )
}
