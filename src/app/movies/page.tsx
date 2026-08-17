import { MoviesPage } from '@/modules/movies'

interface MoviesRouteProps {
  searchParams: Promise<{
    search?: string | string[]
    collection?: string | string[]
  }>
}

export default async function Page({ searchParams }: MoviesRouteProps) {
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
  const pageKey = collectionId ? `collection-${collectionId}` : `movies-${search ?? 'all'}`

  return (
    <MoviesPage
      key={pageKey}
      initialSearch={search}
      initialCollectionId={collectionId}
    />
  )
}
