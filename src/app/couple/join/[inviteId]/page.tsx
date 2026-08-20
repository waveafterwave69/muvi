import type { Metadata } from 'next'
import { CoupleJoinPage } from '@/modules/couple'

export const metadata: Metadata = {
  title: 'Приглашение в пару',
  description: 'Примите приглашение и создайте общий киноуголок в MUVI.',
}

interface PageProps {
  params: Promise<{
    inviteId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { inviteId } = await params

  return <CoupleJoinPage inviteId={inviteId} />
}
