"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

/**
 * TEMPORARY SIMPLIFIED ADMIN LAYOUT (for development / testing)
 * 
 * Strict JWT verification removed so /admin is immediately accessible.
 * A visible banner indicates this is temporary.
 * 
 * When ready to restore proper auth:
 *   - Re-enable the checks in this file
 *   - Restore logic in middleware.ts
 *   - Ensure login page updates the Zustand store on success
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loadProducts } = useAdminStore();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load live data from MongoDB when entering the admin area (keep this)
  useEffect(() => {
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      loadProducts?.();
    }
  }, [pathname, loadProducts]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Login page has its own minimal layout (no sidebar)
  if (pathname === "/admin/login") {
    return <div className="admin-layout min-h-screen">{children}</div>;
  }

  // TEMP: Always render the admin shell — no more "VERIFYING ACCESS..." block
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

        {/* TEMPORARY DEV BANNER - remove when auth is re-enabled */}
        <div className="bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium">
          ⚠️ TEMPORARY DEV MODE — Admin authentication bypassed for testing. 
          Proper login will be restored soon. Direct access enabled.
        </div>

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
