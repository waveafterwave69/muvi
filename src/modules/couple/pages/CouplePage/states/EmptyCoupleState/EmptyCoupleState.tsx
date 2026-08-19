'use client'

import { HeartHandshake, Link2, LoaderCircle } from 'lucide-react'
import { useCreateCoupleInvite } from '@/modules/couple/api/queries'
import { Button, Card } from '@/shared/ui'
import styles from './EmptyCoupleState.module.scss'

export const EmptyCoupleState = () => {
  const createInvite = useCreateCoupleInvite()

  return (
    <Card className={styles.emptyCard}>
      <div className={styles.emptyIcon}>
        <HeartHandshake aria-hidden />
      </div>
      <div className={styles.emptyCopy}>
        <h2>Создайте пару</h2>
        <p>Мы подготовим личную ссылку. Друг сможет открыть её и принять приглашение.</p>
      </div>
      <Button
        className={styles.primaryAction}
        size="lg"
        leftIcon={
          createInvite.isPending ? (
            <LoaderCircle className={styles.spinner} aria-hidden />
          ) : (
            <Link2 aria-hidden />
          )
        }
        disabled={createInvite.isPending}
        onClick={() => createInvite.mutate()}
      >
        {createInvite.isPending ? 'Создаём ссылку…' : 'Создать приглашение'}
      </Button>
      <span className={styles.helperText}>Ссылка будет действовать 7 дней</span>
    </Card>
  )
}
