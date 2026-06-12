"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Cookie is set by the server (httpOnly). Just redirect.
        router.replace("/admin");
        router.refresh(); // ensure middleware + layout see the new cookie
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Unable to connect. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121010] p-6">
      <div className="w-full max-w-md">
        {/* Logo + Header */}
        <div className="flex flex-col items-center mb-9">
          <div className="mb-4 h-16 w-16 rounded-xl overflow-hidden ring-1 ring-[#D4AF37]/30 bg-black/50 p-1">
            <img
              src="/images/logo.png"
              alt="Rudad E Sunnah Logo"
              className="h-full w-full object-contain brightness-0 invert"
            />
          </div>
          <div className="font-serif text-4xl tracking-[-1px] text-[#D4AF37]">Rudad E Sunnah</div>
          <div className="text-[#A89E8F] tracking-[3px] text-xs mt-1">ADMIN PORTAL</div>
        </div>

        <div className="admin-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#D4AF37] rounded-md text-[#121010]">
              <Lock size={19} />
            </div>
            <div>
              <div className="font-medium text-lg text-[#EDE4D7]">Secure Access</div>
              <div className="text-xs text-[#A89E8F]">Authorized personnel only</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="text-sm bg-[#3A3332] border border-[#5C3838] text-[#E07A7A] px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="admin-btn admin-btn-gold w-full py-[13px] mt-2 text-base disabled:opacity-70"
            >
              {isLoading ? "VERIFYING..." : "SIGN IN TO ADMIN"}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-[#3A3332] text-center">
            <p className="text-[11px] text-[#A89E8F] leading-relaxed">
              Demo credentials: <span className="font-mono text-[#D4AF37]">admin / rudad2025</span>
              <br />
              <span className="text-[#6C6358]">Set ADMIN_PASSWORD and ADMIN_USER in Vercel environment variables for production.</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-[10px] tracking-widest text-[#5C5248]">
          © {new Date().getFullYear()} RUDAD E SUNNAH — ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
}
