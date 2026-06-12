"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

// This is the protected admin shell.
// All /admin routes inherit this layout automatically.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loadProducts } = useAdminStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load live data from MongoDB when entering the admin area
  useEffect(() => {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      loadProducts?.();
    }
  }, [pathname, loadProducts]);

  // Client-side auth sync (middleware is the real gatekeeper)
  React.useEffect(() => {
    // We keep the Zustand flag mostly for UI (the real protection is the httpOnly cookie + middleware)
    if (!isAuthenticated && pathname !== "/admin/login") {
      // Don't hard redirect here anymore — middleware handles it
    }
  }, [isAuthenticated, pathname, router]);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Login page has its own minimal layout (no sidebar)
  if (pathname === "/admin/login") {
    return <div className="admin-layout min-h-screen">{children}</div>;
  }

  // If not authed yet, don't flash the panel
  if (!isAuthenticated) {
    return (
      <div className="admin-layout min-h-screen flex items-center justify-center">
        <div className="text-[#A89E8F] text-sm tracking-widest">VERIFYING ACCESS...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout flex min-h-screen overflow-hidden">
      {/* Sidebar — hidden on mobile until toggled */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Subtle footer credit */}
        <footer className="px-8 py-4 text-center text-[10px] text-[#5C5248] border-t border-[#3A3332]">
          Rudad E Sunnah Admin • Follow the Sunnah in every detail • v1.0
        </footer>
      </div>

      {/* Mobile overlay when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[150] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
