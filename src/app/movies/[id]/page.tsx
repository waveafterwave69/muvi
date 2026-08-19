import { redirect } from 'next/navigation'

interface LegacyMovieRouteProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: LegacyMovieRouteProps) {
  const { id } = await params
  redirect(`/media/movie/${id}`)
}
