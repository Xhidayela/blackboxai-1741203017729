import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/signup']

// List of authentication routes
const authRoutes = ['/auth/login', '/auth/signup']

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname
  
  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.includes(path)
  const isAuthRoute = authRoutes.includes(path)
  
  // Get the token from the session
  const token = request.cookies.get('auth_token')

  // If trying to access auth pages while logged in, redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // If it's not a public route and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    // Match all routes except static files and api
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
