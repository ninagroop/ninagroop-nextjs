import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to admin static files
    if (pathname === '/admin' || pathname === '/admin/') {
      // Redirect to the static HTML version if accessing via Next.js route
      // This ensures compatibility with DecapCMS
      const response = NextResponse.next();
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      response.headers.set('Content-Security-Policy', "frame-ancestors 'self'");
      return response;
    }

    // For admin config and assets, pass through
    if (pathname.startsWith('/admin/config') || pathname.startsWith('/admin/preview')) {
      return NextResponse.next();
    }
  }

  // Handle CMS preview routes
  if (pathname.startsWith('/api/preview')) {
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|img/|.*\\..*|api/auth).*)',
  ],
};
