import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production-immediately";
const secret = new TextEncoder().encode(JWT_SECRET);

export interface AdminSession {
  user: string;
  role: "admin";
  exp?: number;
}

/**
 * Create a signed JWT for admin session (7 days)
 */
export async function createAdminToken(username: string): Promise<string> {
  return await new SignJWT({ user: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Verify JWT and return session payload
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Get token from request cookies (works in Route Handlers and Middleware)
 */
export function getTokenFromRequest(request: Request | { cookies: any }): string | undefined {
  // @ts-ignore - works for both NextRequest and Request
  const cookieHeader = (request as any).cookies?.get?.("admin-token")?.value;
  if (cookieHeader) return cookieHeader;

  // Fallback for raw headers
  const cookie = (request as Request).headers.get("cookie");
  if (!cookie) return undefined;

  const match = cookie.match(/admin-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}
