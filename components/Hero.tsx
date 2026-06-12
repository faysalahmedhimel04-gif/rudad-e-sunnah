"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="hero relative h-[92vh] min-h-[680px] w-full flex items-center justify-center overflow-hidden">
      {/* Hero Background - exact image from Rudad Resources */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-background.jpg')",
        }}
      />
      
      {/* Elegant gradient overlay for readability & premium depth */}
      <div className="hero-overlay absolute inset-0" />

      {/* Very subtle Islamic pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center text-white">
        {/* Large Gold Crescent Moon - signature luxury element */}
        <div className="mb-8 flex justify-center">
          <svg 
            width="92" 
            height="92" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="crescent-moon"
            aria-hidden="true"
          >
            {/* Outer crescent */}
            <path 
              d="M30 18 Q55 32 55 52 Q55 72 30 86 Q42 70 42 52 Q42 34 30 18" 
              fill="#D4AF37" 
            />
            {/* Inner cut to make crescent */}
            <path 
              d="M42 28 Q58 38 58 52 Q58 66 42 76 Q50 66 50 52 Q50 38 42 28" 
              fill="#2C2522" 
              opacity="0.92"
            />
            {/* Delicate star accent */}
            <circle cx="72" cy="34" r="2.8" fill="#D4AF37" />
            <circle cx="78" cy="29" r="1.6" fill="#E8C97A" />
          </svg>
        </div>

        {/* Main Headline - Exactly as specified */}
        <h1 className="font-serif text-[52px] sm:text-[62px] md:text-[72px] leading-[1.05] tracking-[-1.2px] mb-5 text-white drop-shadow-lg">
          Follow the Sunnah<br />in Every Purchase
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-md text-xl md:text-2xl text-[#F5F0E6] tracking-[-0.2px] mb-10">
          Premium Halal &amp; Islamic Products
        </p>

        {/* Golden Shop Now Button */}
        <button
          onClick={scrollToProducts}
          className="btn-gold group inline-flex items-center gap-3 rounded-full px-10 py-4 text-lg shadow-xl"
        >
          Shop Now
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={20} />
        </button>

        <p className="mt-8 text-sm text-[#E8D9B8] tracking-widest uppercase">Curated with love • Ships worldwide</p>
      </div>

      {/* Bottom subtle scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="h-px w-8 bg-[#D4AF37]/60 mx-auto mb-1.5" />
        <div className="text-[10px] tracking-[3px] text-white/70">SCROLL TO EXPLORE</div>
      </div>
    </section>
  );
}
