"use client";

import { Menu, X, LogOut } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

interface AdminNavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function AdminNavbar({ onMenuToggle, isSidebarOpen }: AdminNavbarProps) {
  const { adminName, logout } = useAdminStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  return (
    <header className="admin-navbar sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A3332] text-[#A89E8F] hover:text-[#D4AF37] hover:border-[#D4AF37]/50"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block font-serif text-[21px] tracking-[-0.4px] text-[#D4AF37]">
            Admin Panel
          </div>
          <div className="text-[11px] font-mono tracking-widest px-2.5 py-px rounded bg-[#D4AF37] text-[#1A1716] font-semibold">
            RUDAD
          </div>
        </div>
      </div>

      {/* Right side: Admin info + logout */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-[#3A3332]">
          <div className="text-right">
            <div className="text-sm font-medium text-[#EDE4D7]">{adminName}</div>
            <div className="text-[10px] text-[#A89E8F] tracking-wide -mt-px">SUPER ADMIN</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-[#9C2A2A] flex items-center justify-center text-[#EDE4D7] text-xs font-semibold ring-1 ring-[#D4AF37]/30">
            {adminName.slice(0, 1)}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-outline flex items-center gap-2 text-sm px-4 py-1.5"
          title="Sign out of admin"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
