import { MediaDetailsPage } from '@/modules/media'
import { notFound } from 'next/navigation'
import { MediaType } from '@/shared/domain/media'

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
