import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * TEMPORARY BYPASS for development / testing
 * 
 * Admin auth is temporarily disabled so you can access /admin immediately
 * without being stuck on "VERIFYING ACCESS...".
 * 
 * Real JWT + middleware protection will be re-enabled later.
 * 
 * Note: The "middleware" deprecation warning is from Next.js 16 and is
 * non-blocking. The file still functions for route protection.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TEMPORARY bypass for admin (as per dev request)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Protect user routes - require login
  const protectedRoutes = ["/cart", "/profile", "/orders"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get("next-auth.session-token") || 
                  request.cookies.get("__Secure-next-auth.session-token");

    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

// Still keep the matcher so we can easily restore logic later
export const config = {
  matcher: ["/admin/:path*"],
};
