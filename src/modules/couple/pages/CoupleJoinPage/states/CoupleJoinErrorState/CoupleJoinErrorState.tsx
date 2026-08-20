'use client'

import { Link2, LoaderCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/shared/ui'
import styles from './CoupleJoinErrorState.module.scss'

interface CoupleJoinErrorStateProps {
  isFetching: boolean
  onRetry: () => void
}

export const CoupleJoinErrorState = ({
  isFetching,
  onRetry,
}: CoupleJoinErrorStateProps) => {
  const router = useRouter()

  return (
    <Card className={styles.card}>
      <div className={styles.icon}>
        <Link2 aria-hidden />
      </div>
      <h1>Приглашение недоступно</h1>
      <p>Возможно, ссылка устарела, была отменена или пару уже создал другой пользователь.</p>
      <div className={styles.actions}>
        <Button
          disabled={isFetching}
          onClick={onRetry}
        >
          {isFetching ? 'Проверяем…' : 'Проверить снова'}
        </Button>
        <Button variant="secondary" onClick={() => router.replace('/couple')}>
          Перейти к паре
        </Button>
      </div>
    </Card>
  )
}
