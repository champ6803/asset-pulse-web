import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a simple middleware for demo purposes
  // In production, you would check JWT token validity here
  
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next();
  }

  // For now, allow all other routes
  // In production, check authentication token here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

