"use client";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/passenger', '/rider'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Make request to your PHP backend to validate session
  const sessionCheck = await fetch('https://jbuit.org/check-session.php', {
    method: 'GET',
    headers: {
      Cookie: request.headers.get('cookie') || '', // Forward cookies to PHP
    },
  });

  const result = await sessionCheck.json();

  if (result.status === 'authenticated') {
    return NextResponse.next(); // Allow access
  }

  // Not authenticated: redirect to login page
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/passenger/:path*', '/rider/:path*'], // Protect these folders
};
