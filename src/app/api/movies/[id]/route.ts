import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const { id } = 'then' in params ? await params : params
  const sourceUrl = new URL(request.url)
  const type = sourceUrl.searchParams.get('type') === 'tv' ? 'tv' : 'movie'
  return NextResponse.redirect(new URL(`/api/media/${type}/${id}`, sourceUrl.origin), 307)
}
