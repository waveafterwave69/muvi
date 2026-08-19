import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/media',
  '/api/media',
  '/movies',
  '/api/movies',
])

const PUBLIC_MEDIA_API_ROUTE = /^\/api\/media\/(movie|tv)\/\d+$/
const PUBLIC_LEGACY_MOVIE_API_ROUTE = /^\/api\/movies\/\d+$/

const PUBLIC_PROFILE_ROUTE =
  /^\/profile\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const PUBLIC_MEDIA_ROUTE = /^\/media\/(movie|tv)\/\d+$/
const PUBLIC_LEGACY_MEDIA_ROUTE = /^\/(movies|series)\/\d+$/

const isPublicRoute = (pathname: string) => {
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  return (
    PUBLIC_ROUTES.has(normalizedPathname) ||
    PUBLIC_PROFILE_ROUTE.test(normalizedPathname) ||
    PUBLIC_MEDIA_ROUTE.test(normalizedPathname) ||
    PUBLIC_MEDIA_API_ROUTE.test(normalizedPathname) ||
    PUBLIC_LEGACY_MEDIA_ROUTE.test(normalizedPathname) ||
    PUBLIC_LEGACY_MOVIE_API_ROUTE.test(normalizedPathname)
  )
}

const copySessionState = (source: NextResponse, target: NextResponse) => {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie)
  })

  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = source.headers.get(header)

    if (value) {
      target.headers.set(header, value)
    }
  }

  return target
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value)
          })
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const isAuthenticated = Boolean(data?.claims)
  const pathname = request.nextUrl.pathname

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.search = ''

    return copySessionState(supabaseResponse, NextResponse.redirect(redirectUrl))
  }

  return supabaseResponse
}
