"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useAdminStore } from '@/lib/admin-store';

export default function RudadESunnahHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [liveCategories, setLiveCategories] = useState<any[]>([]);

  const { products: storeProducts, categories: storeCategories, loadProducts } = useAdminStore();

  // Fetch live products from MongoDB API (or fallback)
  useEffect(() => {
    async function loadLiveData() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products?.length) {
          setLiveProducts(data.products);
        } else {
          setLiveProducts(storeProducts);
        }
      } catch {
        setLiveProducts(storeProducts);
      }
      // categories still come from the store (or could add /api/categories later)
      setLiveCategories(storeCategories);
    }
    loadLiveData();
    // Also trigger admin store load in case admin was used
    loadProducts?.();
  }, [storeProducts, storeCategories, loadProducts]);

  // Only show products that are in stock on the public site
  const availableProducts = (liveProducts.length ? liveProducts : storeProducts).filter((p: any) => p.inStock !== false);

  // Filter products client-side by search term
  const filteredProducts = availableProducts.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = liveCategories.length ? liveCategories : storeCategories;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Premium Navbar */}
      <Navbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Hero with exact background + gold crescent + copy */}
      <Hero />

      {/* === Featured Categories (4 elegant cards exactly as specified) === */}
      <section id="categories" className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-block mb-3 text-xs font-medium tracking-[3px] text-[#D4AF37] uppercase">Discover</div>
          <h2 className="section-title text-5xl md:text-[56px] tracking-[-1.5px] text-[#2C2522]">Featured Categories</h2>
          <p className="mt-4 text-[#5C5248] text-lg max-w-md mx-auto">Curated collections for the modern Muslim home and lifestyle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* === Shop Now / Featured Products Section === */}
      <section id="products" className="bg-white py-16 border-y border-[#EDE4D7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-y-3">
            <div>
              <div className="uppercase text-xs tracking-[3.5px] text-[#D4AF37] mb-2">Curated Collection</div>
              <h2 className="section-title text-5xl md:text-[56px] tracking-[-1.6px] text-[#2C2522]">Featured Products</h2>
            </div>
            <p className="text-[#5C5248] max-w-sm md:text-right text-[15px]">
              Premium halal products chosen for quality, craftsmanship, and adherence to the Sunnah.
            </p>
          </div>

          {/* Product Grid - 8 products, responsive, beautiful cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-[#5C5248] text-lg">No products match your search. Try a different term.</p>
            </div>
          )}

          {/* View All hint */}
          <div className="mt-14 text-center">
            <a 
              href="#categories" 
              className="inline-flex items-center text-sm uppercase tracking-[2px] text-[#9C2A2A] hover:text-[#D4AF37] transition-colors border-b border-[#9C2A2A] pb-px"
            >
              Browse All Categories
            </a>
          </div>
        </div>
      </section>

      {/* === Values / Trust Bar (luxury boutique finishing touch) === */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          <div>
            <div className="text-[#D4AF37] text-sm tracking-[3px] mb-3">SINCERE CRAFTSMANSHIP</div>
            <div className="font-serif text-2xl tracking-tight mb-2 text-[#2C2522]">Ethically Sourced</div>
            <p className="text-[#5C5248] text-[15px]">Every item is selected with intention and care from trusted artisans and makers.</p>
          </div>
          <div>
            <div className="text-[#D4AF37] text-sm tracking-[3px] mb-3">100% HALAL &amp; SUNNAH</div>
            <div className="font-serif text-2xl tracking-tight mb-2 text-[#2C2522]">Authentic &amp; Pure</div>
            <p className="text-[#5C5248] text-[15px]">Products designed to help you live the deen beautifully in your daily life.</p>
          </div>
          <div>
            <div className="text-[#D4AF37] text-sm tracking-[3px] mb-3">WORLDWIDE DELIVERY</div>
            <div className="font-serif text-2xl tracking-tight mb-2 text-[#2C2522]">Carefully Packed</div>
            <p className="text-[#5C5248] text-[15px]">Discreet, secure shipping with love. Every order includes a handwritten dua card.</p>
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="footer mt-auto pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-y-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 relative flex-shrink-0">
                <img src="/images/logo.png" alt="Rudad E Sunnah" className="h-9 w-9 object-contain brightness-0 invert" />
              </div>
              <span className="font-serif text-3xl tracking-tight text-white">Rudad E Sunnah</span>
            </div>
            <p className="max-w-sm text-[#C9B9A3] leading-relaxed">
              Follow the Sunnah in every purchase. Premium Islamic products for the modern believer.
            </p>
          </div>

          <div className="md:col-span-3 text-sm">
            <div className="font-medium text-white mb-4 tracking-wider text-xs">SHOP</div>
            <div className="space-y-[9px] text-[#C9B9A3]">
              <a href="#products" className="block hover:text-[#D4AF37] transition">All Products</a>
              <a href="#categories" className="block hover:text-[#D4AF37] transition">Categories</a>
              <a href="#products" className="block hover:text-[#D4AF37] transition">New Arrivals</a>
            </div>
          </div>

          <div className="md:col-span-4 text-sm">
            <div className="font-medium text-white mb-4 tracking-wider text-xs">EXPLORE</div>
            <div className="space-y-[9px] text-[#C9B9A3]">
              <a href="/about" className="block hover:text-[#D4AF37] transition">Our Story</a>
              <a href="/contact" className="block hover:text-[#D4AF37] transition">Contact Us</a>
              <a href="#" className="block hover:text-[#D4AF37] transition">Shipping &amp; Returns</a>
              <a href="#" className="block hover:text-[#D4AF37] transition">Care Guide</a>
            </div>
            <div className="mt-8 text-xs text-[#8A7B65]">© {new Date().getFullYear()} Rudad E Sunnah. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Global Cart Drawer (controlled by Zustand) */}
      <CartDrawer />
    </div>
  );
}
