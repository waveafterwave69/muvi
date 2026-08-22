import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLeaveCouple } from '@/modules/couple/api/queries'
import type { CoupleData } from '@/modules/couple/api/types'
import { CoupleMediaCollection } from '@/modules/couple/components/CoupleMediaCollection'
import { CoupleStats } from '@/modules/couple/components/CoupleStats'
import { LeaveCoupleModal } from '@/modules/couple/components/LeaveCoupleModal'
import { ProfilePreview } from '@/modules/couple/components/ProfilePreview'
import { Button, Card, Link } from '@/shared/ui'
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
  const togetherSince = formatTogetherSince(couple?.together_since ?? couple?.created_at)
  const stats = couple?.stats
  const leaveCouple = useLeaveCouple()

  return (
    <div className={styles.content}>
      <Card size="sm" className={styles.coupleCard}>
        <div className={styles.activeCard}>
          <ProfilePreview profiles={profiles} size="sm" />

          <div className={styles.activeCopy}>
            <div className={styles.title}>
              {profiles.map((profile, index)  => {
                const isLast = index === profiles.length - 1
                return (
                  <Link key={profile.id} href={`/profile/${profile.id}`}>
                    <h1 className={styles.sub_title}>
                      {isLast && <span>^_^</span>}
                      {profile.username}
                    </h1>
                  </Link>
                )
              })}
            </div>
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
