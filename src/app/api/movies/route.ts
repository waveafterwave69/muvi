import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const sourceUrl = new URL(request.url)
  const targetUrl = new URL('/api/media', sourceUrl.origin)
  targetUrl.search = sourceUrl.search
  return NextResponse.redirect(targetUrl, 307)
}
