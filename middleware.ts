import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "./lib/auth";

/**
 * Protects all /admin routes (except login page).
 * This is the real security layer — even if client-side guard is bypassed.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin area
  if (pathname.startsWith("/admin")) {
    // Allow the login page itself
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const session = await verifyAdminToken(token);
    if (!session || session.role !== "admin") {
      // Invalid or expired token → force re-login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

// Only run middleware on admin routes (performance)
export const config = {
  matcher: ["/admin/:path*"],
};
