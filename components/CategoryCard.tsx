import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`#products`} 
      className="category-card group block rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      <div className="relative h-64 w-full overflow-hidden bg-[#F5EDE0]">
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-[1.08]"
          />
        )}
        {/* Subtle gold gradient at bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-2xl text-[#2C2522] tracking-tight mb-2 group-hover:text-[#9C2A2A] transition-colors">
              {category.name}
            </h3>
            <p className="text-[#5C5248] text-[15px] leading-relaxed pr-4">
              {category.description}
            </p>
          </div>
          <div className="mt-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#D4AF37] text-[#D4AF37] transition group-hover:bg-[#D4AF37] group-hover:text-[#9C2A2A]">
            <ArrowRight size={17} />
          </div>
        </div>
      </div>
    </Link>
  );
}
