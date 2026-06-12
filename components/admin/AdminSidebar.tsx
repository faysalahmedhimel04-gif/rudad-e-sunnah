"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/lib/admin-store";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/categories", label: "Categories", icon: <FolderTree size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { href: "/admin/users", label: "Customers", icon: <Users size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { logout, adminName } = useAdminStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    // Hard redirect (clears client state too)
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={cn(
        "admin-sidebar w-72 lg:w-64 flex-shrink-0 flex flex-col h-full lg:h-auto",
        isOpen && "open"
      )}
    >
      {/* Brand header in sidebar */}
      <div className="px-6 py-6 border-b border-[#3A3332]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md overflow-hidden ring-1 ring-[#D4AF37]/30 bg-black/40">
            <img
              src="/images/logo.png"
              alt="Rudad E Sunnah"
              className="h-full w-full object-contain brightness-0 invert"
            />
          </div>
          <div>
            <div className="font-serif text-xl tracking-[-0.4px] text-[#D4AF37]">Rudad E Sunnah</div>
            <div className="text-[10px] uppercase tracking-[2px] text-[#A89E8F] -mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "admin-sidebar-link",
                isActive && "active"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer area */}
      <div className="p-4 border-t border-[#3A3332] mt-auto">
        <div className="px-3 py-2 text-xs text-[#A89E8F] mb-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          Signed in as <span className="font-medium text-[#EDE4D7]">{adminName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="admin-sidebar-link w-full text-[#E07A7A] hover:bg-[#3A3332] hover:text-[#E07A7A]"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
