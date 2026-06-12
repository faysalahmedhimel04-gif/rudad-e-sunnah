"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending (ready to plug into Resend / API route later)
    setTimeout(() => {
      toast.success("Message received", {
        description: "Thank you. We will reply within 24 hours, inshaAllah.",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 650);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-10">
          <div className="text-[#D4AF37] text-xs tracking-[3.5px] uppercase mb-2">We are here for you</div>
          <h1 className="font-serif text-6xl tracking-[-1.6px]">Contact Us</h1>
          <p className="mt-4 text-lg text-[#5C5248]">Questions about an order, product, or our collections? We would love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
            <div>
              <label className="text-sm text-[#5C5248] block mb-1.5">Your Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="search-input w-full rounded-xl px-5 py-3 text-base" 
              />
            </div>
            <div>
              <label className="text-sm text-[#5C5248] block mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="search-input w-full rounded-xl px-5 py-3 text-base" 
              />
            </div>
            <div>
              <label className="text-sm text-[#5C5248] block mb-1.5">How can we help?</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows={6} 
                className="search-input w-full rounded-2xl px-5 py-4 text-base resize-y" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-gold w-full py-4 rounded-2xl text-base disabled:opacity-75"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            <p className="text-xs text-center text-[#8A7B65]">We reply within one business day, inshaAllah.</p>
          </form>

          {/* Contact Info */}
          <div className="md:col-span-2 text-sm space-y-8 pt-2">
            <div>
              <div className="font-medium text-[#2C2522] mb-1">Email</div>
              <a href="mailto:hello@rudadesunnah.com" className="text-[#9C2A2A] hover:underline">hello@rudadesunnah.com</a>
            </div>
            <div>
              <div className="font-medium text-[#2C2522] mb-1">Phone</div>
              <div className="text-[#5C5248]">+1 (888) 472-8832</div>
            </div>
            <div>
              <div className="font-medium text-[#2C2522] mb-1">Studio &amp; Showroom</div>
              <div className="text-[#5C5248] leading-relaxed">
                148 Crescent Lane<br />
                Brooklyn, NY 11201<br />
                United States
              </div>
            </div>
            <div className="pt-4 border-t border-[#D9CBB8] text-[#5C5248]">
              For wholesale or collaboration inquiries, please mention it in your message.
            </div>
          </div>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}
