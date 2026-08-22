import { LoaderCircle, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/shared/ui'
import pageStyles from '../../CouplePage.module.scss'
import styles from './CouplePageError.module.scss'

interface CouplePageErrorProps {
  isFetching: boolean
  onRetry: () => void
}

export const CouplePageError = ({ isFetching, onRetry }: CouplePageErrorProps) => (
  <div className={pageStyles.root}>
    <Card className={styles.errorCard}>
      <RefreshCw aria-hidden />
      <Button
        leftIcon={isFetching ? <LoaderCircle className={styles.spinner} /> : undefined}
        disabled={isFetching}
        onClick={onRetry}
      >
        {isFetching ? 'Загружаем…' : 'Попробовать снова'}
      </Button>
    </Card>
  </div>
)
