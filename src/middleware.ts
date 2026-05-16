import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const DEFAULT_SECRET = "notesspace-sanctuary-secret-key-12345";
const secretKey = process.env.AUTH_SECRET || DEFAULT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/notes');
  const isAuthRoute = pathname === '/auth';

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthRoute && session) {
    try {
      await jwtVerify(session, key);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (e) {
      // Invalid session, let user stay on auth page
    }
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
