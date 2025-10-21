import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const isProtected = req.nextUrl.pathname.startsWith('/products') || req.nextUrl.pathname.startsWith('/analytics');
  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  if (req.nextUrl.pathname === '/') {
    const target = token ? '/products' : '/login';
    return NextResponse.redirect(new URL(target, req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/products/:path*', '/analytics/:path*'] };
