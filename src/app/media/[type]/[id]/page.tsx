import { MediaDetailsPage } from '@/modules/media'
import type { MediaType } from '@/modules/media/api/media/types'
import { notFound } from 'next/navigation'

interface MediaDetailsRouteProps {
  params: Promise<{
    id: string
    type: string
  }>
}

export default async function Page({ params }: MediaDetailsRouteProps) {
  const { type } = await params

  if (type !== 'movie' && type !== 'tv') {
    notFound()
  }

  return <MediaDetailsPage mediaType={type as MediaType} />
}
