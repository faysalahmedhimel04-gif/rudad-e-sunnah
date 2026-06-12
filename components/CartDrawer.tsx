"use client";

import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalPrice 
  } = useCartStore();

  const total = getTotalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Simple checkout flow for live demo (name, email, address)
    const customerName = prompt("Full name for this order:") || "Guest Customer";
    const customerEmail = prompt("Email address:") || "guest@rudad-e-sunnah.com";
    const shippingAddress = prompt("Shipping address (city, country):") || "Address on file";

    if (!customerName || !customerEmail) {
      toast.error("Name and email are required");
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone: "",
          shippingAddress,
          items: orderItems,
          total,
        }),
      });

      if (res.ok) {
        toast.success("Order placed successfully!", {
          description: `Thank you ${customerName.split(" ")[0]}. Total: $${total}. Check /admin/orders`,
          duration: 5000,
        });
        closeCart();
        // clearCart(); // Uncomment if you want to empty cart after order
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err) {
      toast.error("Could not place order. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]" 
        onClick={closeCart} 
      />

      {/* Slide-in Drawer */}
      <div className="cart-drawer fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[#FDF9F3] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9CBB8] px-6 py-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#9C2A2A]" size={22} />
            <div>
              <div className="font-serif text-2xl tracking-tight">Your Cart</div>
              <div className="text-xs text-[#5C5248]">{items.length} item{items.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button 
            onClick={closeCart} 
            className="rounded-full p-2 text-[#5C5248] hover:bg-[#F5EDE0] hover:text-[#2C2522]"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-[#EDE4D7] pb-6 last:border-0 last:pb-0">
                  {/* Product Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[#D9CBB8] bg-[#F5EDE0]">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="font-medium text-[15px] leading-tight tracking-tight text-[#2C2522] pr-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#5C5248] mt-0.5">{item.category}</div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="font-medium text-lg tracking-tighter text-[#9C2A2A]">
                        ${item.price}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-full border border-[#D9CBB8] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id as number, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#5C5248] hover:text-[#9C2A2A] active:bg-[#F5EDE0] rounded-l-full transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <div className="px-3 text-sm tabular-nums font-medium select-none">{item.quantity}</div>
                        <button
                          onClick={() => updateQuantity(item.id as number, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#5C5248] hover:text-[#9C2A2A] active:bg-[#F5EDE0] rounded-r-full transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeFromCart(item.id as number)} 
                    className="self-start text-[#5C5248] hover:text-[#9C2A2A] transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-[#D9CBB8] bg-white p-6">
              <div className="flex justify-between items-baseline mb-1 text-lg">
                <span className="text-[#5C5248]">Total</span>
                <span className="font-serif text-3xl tracking-tighter text-[#9C2A2A]">${total}</span>
              </div>
              <div className="text-xs text-[#5C5248] mb-6">Shipping calculated at checkout</div>

              <button 
                onClick={handleCheckout}
                className="btn-gold w-full py-[17px] rounded-2xl text-base tracking-[0.3px]"
              >
                PROCEED TO CHECKOUT
              </button>

              <button 
                onClick={clearCart}
                className="mt-3 w-full py-3 text-sm text-[#5C5248] hover:text-[#9C2A2A] transition"
              >
                Clear cart
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 rounded-full bg-[#F5EDE0] p-7">
              <ShoppingBag className="text-[#D4AF37]" size={46} />
            </div>
            <div className="font-serif text-3xl tracking-tight mb-2">Your cart is empty</div>
            <p className="text-[#5C5248] max-w-[240px] text-[15px]">
              Start browsing our collection of premium Islamic products.
            </p>
            <button 
              onClick={closeCart} 
              className="btn-gold-outline mt-8 rounded-full px-9 py-3 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
