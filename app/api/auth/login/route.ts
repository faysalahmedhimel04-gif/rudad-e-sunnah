import { NextRequest, NextResponse } from "next/server";
import { createAdminToken } from "@/lib/auth";

/**
 * POST /api/auth/login
 * Simple but secure admin login.
 * 
 * In production set ADMIN_PASSWORD in Vercel env vars.
 * Default for dev: admin / rudad2025 (change immediately!)
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "rudad2025";

    if (username === adminUser && password === adminPass) {
      const token = await createAdminToken(username);

      const response = NextResponse.json({ success: true, user: username });

      // HttpOnly cookie = secure against XSS
      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
