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
  // === TEMPORARY: Allow all /admin routes without checks ===
  // To re-enable protection later, restore the original JWT cookie + verify logic.
  return NextResponse.next();
}

// Still keep the matcher so we can easily restore logic later
export const config = {
  matcher: ["/admin/:path*"],
};
