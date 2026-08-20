'use client'

import { useCoupleInvitePreview } from '@/modules/couple/api/queries'
import { CoupleJoinErrorState } from './states/CoupleJoinErrorState'
import { CoupleJoinInviteState } from './states/CoupleJoinInviteState'
import { CoupleJoinLoadingState } from './states/CoupleJoinLoadingState'
import styles from './CoupleJoinPage.module.scss'

interface CoupleJoinPageProps {
  inviteId: string
}

const CoupleJoinPage = ({ inviteId }: CoupleJoinPageProps) => {
  const inviteQuery = useCoupleInvitePreview(inviteId)

  if (inviteQuery.isPending) {
    return (
      <main className={styles.root}>
        <CoupleJoinLoadingState />
      </main>
    )
  }

  if (inviteQuery.isError || !inviteQuery.data) {
    return (
      <main className={styles.root}>
        <CoupleJoinErrorState
          isFetching={inviteQuery.isFetching}
          onRetry={() => {
            void inviteQuery.refetch()
          }}
        />
      </main>
    )
  }

  return (
    <main className={styles.root}>
      <CoupleJoinInviteState
        invite={inviteQuery.data}
        inviteId={inviteId}
        onResponseError={() => {
          void inviteQuery.refetch()
        }}
      />
    </main>
  )
}

export default CoupleJoinPage
