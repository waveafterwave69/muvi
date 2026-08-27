import type { ComponentProps } from 'react'
import { StarsModal } from '../ui/StarsModal/StarsModal'
import { CommentModal } from '../ui/CommentModal/CommentModal'
import TVModal from '../ui/TVModal/TVModal'

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
