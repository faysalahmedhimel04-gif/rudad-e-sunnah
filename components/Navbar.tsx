"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import UserMenu from './UserMenu';

interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export default function Navbar({ searchTerm = '', onSearchChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const cartCount = getTotalItems();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#categories', label: 'Categories' },
    { href: '#products', label: 'Shop' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <nav className="navbar sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo - Exact from resources */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Rudad E Sunnah Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-2xl tracking-[-0.5px] text-[#2C2522] group-hover:text-[#9C2A2A] transition-colors">
              Rudad E Sunnah
            </div>
            <div className="text-[10px] text-[#5C5248] -mt-1 tracking-[2px] uppercase">Est. 2018</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-9 text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link text-[#2C2522] hover:text-[#9C2A2A]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search + Cart + Mobile Menu */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Elegant Search Bar */}
          <div className="hidden md:block relative w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5248]">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products..."
              className="search-input w-full pl-11 pr-4 py-2.5 rounded-full text-sm placeholder:text-[#5C5248]"
              aria-label="Search products"
            />
          </div>

          {/* Cart Icon with Badge */}
          <button
            onClick={toggleCart}
            className="cart-icon flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F5EDE0] transition-colors"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Google Auth - User Avatar / Login Button */}
          <UserMenu />

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center text-[#2C2522]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden border-t border-[#D9CBB8] bg-[#FDF9F3] px-6 py-8">
          <div className="flex flex-col gap-5 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#2C2522] py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="mt-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5248]">
              <Search size={17} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search our collection..."
              className="search-input w-full pl-11 pr-4 py-3 rounded-full text-sm"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
