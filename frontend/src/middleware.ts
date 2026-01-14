import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale prefix for consistency
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a locale-prefixed route
  const isLocaleRoute = locales.some(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  
  // For root path or locale-prefixed routes, apply i18n middleware
  if (pathname === '/' || isLocaleRoute) {
    return intlMiddleware(request);
  }
  
  // For all other routes, just pass through
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization files (_next/image)
  // - Favicon and other static assets
  matcher: [
    // Match all pathnames except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ]
};

