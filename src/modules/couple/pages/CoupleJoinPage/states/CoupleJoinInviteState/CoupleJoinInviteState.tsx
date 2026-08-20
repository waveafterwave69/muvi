'use client'

import { Info, KeyRound, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRespondToCoupleInviteFromLink } from '@/modules/couple/api/queries'
import type { CoupleInvitePreview } from '@/modules/couple/api/types'
import { ProfilePreview } from '@/modules/couple/components/ProfilePreview'
import { Button, Card } from '@/shared/ui'
import styles from './CoupleJoinInviteState.module.scss'
import { getDaysLeft } from '../../../../lib/getDaysLeft'

interface CoupleJoinInviteStateProps {
  invite: CoupleInvitePreview
  inviteId: string
  onResponseError: () => void
}

export const CoupleJoinInviteState = ({
  invite,
  inviteId,
  onResponseError,
}: CoupleJoinInviteStateProps) => {
  const router = useRouter()
  const responseMutation = useRespondToCoupleInviteFromLink(inviteId, {
    onSuccess: () => {
      router.replace('/couple')
    },
    onError: onResponseError,
  })
  const inviterName = invite.inviter.username
  const shortCode = invite.id.split('-')[0].toUpperCase()
  const pendingResponse = responseMutation.variables

  return (
    <Card className={styles.card}>
      <div className={styles.topline}>
        <span>Приглашение в пару</span>
        <span className={styles.status}>Ссылка активна</span>
      </div>

      <ProfilePreview profiles={[invite.inviter]} />

      <div className={styles.copy}>
        <h2>{inviterName} приглашает тебя в свой киноуголок</h2>
        <p>
          После принятия у вас появятся общая коллекция фильмов, просмотренное и возможность
          сравнивать оценки.
        </p>
      </div>

      <div className={styles.codeRow}>
        <KeyRound aria-hidden />
        <div>
          <span>Код приглашения</span>
          <strong>{shortCode}</strong>
        </div>
        <strong className={styles.expiry}>{getDaysLeft(invite.expires_at)}</strong>
      </div>

      <div className={styles.actions}>
        <Button
          className={styles.acceptButton}
          disabled={responseMutation.isPending}
          leftIcon={
            pendingResponse === 'accept' ? (
              <LoaderCircle className={styles.spinner} aria-hidden />
            ) : undefined
          }
          onClick={() => responseMutation.mutate('accept')}
        >
          {pendingResponse === 'accept' ? 'Принимаем…' : 'Принять приглашение'}
        </Button>
        <Button
          className={styles.declineButton}
          variant="secondary"
          disabled={responseMutation.isPending}
          leftIcon={
            pendingResponse === 'decline' ? (
              <LoaderCircle className={styles.spinner} aria-hidden />
            ) : undefined
          }
          onClick={() => responseMutation.mutate('decline')}
        >
          {pendingResponse === 'decline' ? 'Отклоняем…' : 'Отклонить'}
        </Button>
      </div>

      <div className={styles.notice}>
        <Info aria-hidden />
        <p>
          В Muvi можно состоять только в одной паре. Если ты уже в паре, принять это
          приглашение не получится.
        </p>
      </div>
    </Card>
  )
}
