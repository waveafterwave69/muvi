'use client'

import { Copy, Info, KeyRound, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCancelCoupleInvite } from '@/modules/couple/api/queries'
import type { CouplePageData } from '@/modules/couple/api/types'
import { ProfilePreview } from '@/modules/couple/components/ProfilePreview'
import { useInviteUrl } from '@/modules/couple/hooks/useInviteUrl'
import { getInviteLifetime } from '@/modules/couple/lib/getInviteLifetime'
import { useGetProfile } from '@/modules/profile/api/profile/queries'
import { Button, Card } from '@/shared/ui'
import styles from './OutgoingInviteState.module.scss'
import { getDaysLeft } from '../../../../lib/getDaysLeft'
import { useCallback, useEffect, useRef } from 'react'

interface OutgoingInviteStateProps {
  invite: NonNullable<CouplePageData['outgoing_invite']>
}

export const OutgoingInviteState = ({ invite }: OutgoingInviteStateProps) => {
  const { data: profile } = useGetProfile(null)
  const inviteUrl = useInviteUrl(invite.id)
  const cancelInvite = useCancelCoupleInvite()
  const shortCode = invite.id.split('-')[0].toUpperCase()
  const isLinkInvite = invite.type === 'link'
  const hasCopiedRef = useRef(false)

  const handleCopy = useCallback(async () => {
    console.log(123)
    try {
      await navigator.clipboard.writeText(inviteUrl)
      toast.success('Ссылка скопирована')
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }, [inviteUrl])

  useEffect(() => {
    if (!inviteUrl || hasCopiedRef.current) return

    hasCopiedRef.current = true

    navigator.clipboard.writeText(inviteUrl)
      .then(() => toast.success('Ссылка скопирована'))
      .catch(() => toast.error('Не удалось скопировать ссылку'))
  }, [inviteUrl])

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy()
      return
    }

    try {
      await navigator.share({
        title: 'Приглашение в пару MUVI',
        text: 'Давай выбирать и смотреть фильмы вместе',
        url: inviteUrl,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('Не удалось поделиться приглашением')
    }
  }

  return (
    <Card className={styles.outgoingCard}>
      <div className={styles.outgoingTopline}>
        <span>Приглашение в пару</span>
        <span className={styles.outgoingStatus}>
          {isLinkInvite ? 'ссылка активна' : 'ожидаем ответ'}
        </span>
      </div>

      <ProfilePreview profiles={profile ? [profile] : []} />

      <div className={styles.outgoingCopy}>
        <h3>{isLinkInvite ? 'Ссылка в ваш киноуголок готова' : 'Приглашение отправлено'}</h3>
        <p>
          {isLinkInvite
            ? 'Отправьте ссылку человеку, с которым хотите собирать общую коллекцию фильмов.'
            : 'Мы сообщим, когда пользователь примет приглашение в пару.'}
        </p>
      </div>

      <div className={styles.outgoingCodeRow}>
        <KeyRound aria-hidden />
        <div>
          <span>Код приглашения</span>
          <strong>{shortCode}</strong>
        </div>
        <strong className={styles.outgoingLifetime}>
          {getDaysLeft(invite.expires_at)}
        </strong>
      </div>

      {isLinkInvite && (
        <div className={styles.outgoingActions}>
          <Button
            className={styles.outgoingPrimaryButton}
            leftIcon={<Copy aria-hidden />}
            onClick={handleCopy}
          >
            Скопировать ссылку
          </Button>
          <Button
            className={styles.outgoingSecondaryButton}
            variant="secondary"
            leftIcon={<Share2 aria-hidden />}
            onClick={handleShare}
          >
            Поделиться
          </Button>
        </div>
      )}

      <div className={styles.outgoingNotice}>
        <Info aria-hidden />
        <p>{getInviteLifetime(invite.expires_at)}. Использовать её сможет только один человек.</p>
      </div>

      <button
        className={styles.outgoingCancel}
        type="button"
        disabled={cancelInvite.isPending}
        onClick={() => cancelInvite.mutate(invite.id)}
      >
        {cancelInvite.isPending ? 'Отменяем…' : 'Отменить приглашение'}
      </button>
    </Card>
  )
}
