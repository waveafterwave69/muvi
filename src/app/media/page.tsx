import { MediaPage } from '@/modules/media'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Фильмы и сериалы',
  description: 'Исследуйте каталог фильмов и сериалов и добавляйте их в свои списки.',
}

interface MediaRouteProps {
  searchParams: Promise<{
    search?: string | string[]
    collection?: string | string[]
  }>
}

export default async function Page({ searchParams }: MediaRouteProps) {
  const params = await searchParams
  const search = Array.isArray(params.search) ? params.search[0] : params.search
  const collectionParam = Array.isArray(params.collection)
    ? params.collection[0]
    : params.collection
  const parsedCollectionId = collectionParam ? Number(collectionParam) : undefined
  const collectionId =
    parsedCollectionId && Number.isInteger(parsedCollectionId) && parsedCollectionId > 0
      ? parsedCollectionId
      : undefined
  const pageKey = collectionId ? `collection-${collectionId}` : `media-${search ?? 'all'}`

  return <MediaPage key={pageKey} initialSearch={search} initialCollectionId={collectionId} />
}
