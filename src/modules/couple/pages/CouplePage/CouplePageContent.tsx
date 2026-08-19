import type { CouplePageData } from '../../api/types'
import { ActiveCoupleState } from './states/ActiveCoupleState'
import { EmptyCoupleState } from './states/EmptyCoupleState'
import { OutgoingInviteState } from './states/OutgoingInviteState'

export const CouplePageContent = ({ data }: { data: CouplePageData }) => {
  if (data.state === 'active') {
    return <ActiveCoupleState couple={data.couple} />
  }

  if (data.outgoing_invite) {
    return <OutgoingInviteState invite={data.outgoing_invite} />
  }

  return <EmptyCoupleState />
}
