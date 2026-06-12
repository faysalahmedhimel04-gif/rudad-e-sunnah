"use client";

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      toast("Please sign in to add items to your cart", {
        description: "Your cart will be saved to your account",
        action: {
          label: "Sign in",
          onClick: () => signIn("google"),
        },
      });
      return;
    }

    // If logged in, save to database
    try {
      const res = await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (res.ok) {
        toast.success(`Added ${product.name}`, {
          description: `$${product.price} • View in My Cart`,
          action: {
            label: "My Cart",
            onClick: () => window.location.href = "/cart",
          },
        });
      } else {
        throw new Error("Failed to save to cart");
      }
    } catch (error) {
      // Fallback to local Zustand cart
      addToCart(product);
      toast.success(`Added ${product.name}`, {
        description: `$${product.price} • Tap to view cart`,
        action: {
          label: "View Cart",
          onClick: () => openCart(),
        },
      });
    }
  };

  // Support both external images (Unsplash etc.) and locally uploaded admin images (/uploads/...)
  const isLocalUpload = product.image?.startsWith("/uploads");

  return (
    <div className="product-card group flex flex-col rounded-2xl bg-white">
      {/* Image */}
      <div className="product-image-container relative h-80 w-full overflow-hidden rounded-t-2xl">
        {isLocalUpload ? (
          // Regular img for user-uploaded files (simple + reliable)
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Category tag */}
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-medium tracking-wider text-[#5C5248] shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="font-serif text-[21px] leading-tight tracking-[-0.3px] text-[#2C2522] mb-2.5 pr-2">
            {product.name}
          </h3>
          <p className="text-[#5C5248] text-[14.5px] leading-snug line-clamp-2 mb-5">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="price font-medium text-2xl tracking-tighter">
              ${product.price}
            </span>
            <span className="ml-1 text-xs text-[#5C5248]">USD</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn flex items-center gap-2 rounded-full px-6 py-[10px] text-sm active:scale-[0.985]"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
