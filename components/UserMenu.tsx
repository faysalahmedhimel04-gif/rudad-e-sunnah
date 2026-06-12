"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { User, ShoppingCart, Package, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-[#EDE4D7] animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#9C2A2A] text-white rounded-full hover:bg-[#7A1F1F] transition-all active:scale-[0.985]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.34z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2">
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || "User"} 
            className="h-8 w-8 rounded-full object-cover ring-2 ring-[#D4AF37]/30" 
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#9C2A2A] flex items-center justify-center text-white text-xs font-medium ring-2 ring-[#D4AF37]/30">
            {session.user?.name?.[0] || "U"}
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium text-[#2C2522]">
          {session.user?.name?.split(" ")[0]}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#D9CBB8] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1">
          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#FDF9F3] rounded-lg">
            <User size={16} className="text-[#9C2A2A]" /> My Profile
          </Link>
          <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#FDF9F3] rounded-lg">
            <Package size={16} className="text-[#9C2A2A]" /> My Orders
          </Link>
          <Link href="/cart" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#FDF9F3] rounded-lg">
            <ShoppingCart size={16} className="text-[#9C2A2A]" /> My Cart
          </Link>
          <hr className="my-1 border-[#EDE4D7]" />
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
