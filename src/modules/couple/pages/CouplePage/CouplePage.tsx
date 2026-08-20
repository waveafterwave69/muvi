'use client'

import { useCouplePageData } from '../../api/queries'
import { CouplePageContent } from './CouplePageContent'
import { CouplePageError } from './states/CouplePageError'
import { CouplePageSkeleton } from './states/CouplePageSkeleton'
import styles from './CouplePage.module.scss'

const CouplePage = () => {
  const { data, isPending, isError, refetch, isFetching } = useCouplePageData()

  if (isPending) return <CouplePageSkeleton />

  if (isError || !data) {
    return (
      <CouplePageError
        isFetching={isFetching}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className={styles.root}>
      <CouplePageContent data={data} />
    </div>
  )
}

export default CouplePage
