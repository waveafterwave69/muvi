import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLeaveCouple } from '@/modules/couple/api/queries'
import type { CoupleData } from '@/modules/couple/api/types'
import { CoupleMediaCollection } from '@/modules/couple/components/CoupleMediaCollection'
import { CoupleStats } from '@/modules/couple/components/CoupleStats'
import { LeaveCoupleModal } from '@/modules/couple/components/LeaveCoupleModal'
import { ProfilePreview } from '@/modules/couple/components/ProfilePreview'
import { Button, Card } from '@/shared/ui'
import styles from './ActiveCoupleState.module.scss'

const formatTogetherSince = (value?: string) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(date)
    .replace(/\s*г\.$/, '')
}

export const ActiveCoupleState = ({ couple }: { couple: CoupleData | null }) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const profiles = couple?.members ?? []
  const title = profiles.map((profile) => profile.username).join(' + ')
  const togetherSince = formatTogetherSince(couple?.together_since ?? couple?.created_at)
  const stats = couple?.stats
  const leaveCouple = useLeaveCouple()

  return (
    <div className={styles.content}>
      <Card size="sm" className={styles.coupleCard}>
        <div className={styles.activeCard}>
          <ProfilePreview profiles={profiles} size="sm" />

          <div className={styles.activeCopy}>
            <h1>{title}</h1>
            <p>
              {togetherSince ? `Вместе в Muvi с ${togetherSince}` : 'Вместе в Muvi'}
            </p>
            <div className={styles.activeMood}>
              <Sparkles aria-hidden />
              <span>Сегодня отличный вечер для кино</span>
            </div>
          </div>
        </div>
        <Button
          className={styles.leaveButton}
          disabled={leaveCouple.isPending}
          onClick={() => setIsLeaveModalOpen(true)}
        >
          {leaveCouple.isPending ? 'Выходим…' : 'Выйти из пары'}
        </Button>
      </Card>

      {stats && <CoupleStats stats={stats} />}
      {couple?.id && <CoupleMediaCollection coupleId={couple.id} />}

      <LeaveCoupleModal
        isOpen={isLeaveModalOpen}
        isPending={leaveCouple.isPending}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => {
          leaveCouple.mutate(undefined, {
            onSuccess: () => setIsLeaveModalOpen(false),
          })
        }}
      />
    </div>
  )
}
