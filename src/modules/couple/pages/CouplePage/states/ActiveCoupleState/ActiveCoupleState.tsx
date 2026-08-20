import { Sparkles } from 'lucide-react'
import { useLeaveCouple } from '@/modules/couple/api/queries'
import type { CoupleData } from '@/modules/couple/api/types'
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
  const profiles = couple?.members ?? []
  const title = profiles.map((profile) => profile.username).join(' + ')
  const togetherSince = formatTogetherSince(couple?.together_since ?? couple?.created_at)
  const leaveCouple = useLeaveCouple()

  return (
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
      <Button disabled={leaveCouple.isPending} onClick={() => leaveCouple.mutate()}>
        {leaveCouple.isPending ? 'Выходим…' : 'Выйти из пары'}
      </Button>
    </Card>
  )
}
