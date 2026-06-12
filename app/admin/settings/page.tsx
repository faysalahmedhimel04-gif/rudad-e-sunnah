"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-9">
        <div className="text-[#D4AF37] text-xs tracking-[3px]">CONFIGURATION</div>
        <h1 className="font-serif text-4xl tracking-[-1.1px]">Settings</h1>
      </div>

      <div className="admin-card p-8 space-y-8">
        <div>
          <label className="admin-label">Store Name</label>
          <input
            value={local.siteName}
            onChange={(e) => setLocal({ ...local, siteName: e.target.value })}
            className="admin-input text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Contact Email</label>
            <input
              type="email"
              value={local.contactEmail}
              onChange={(e) => setLocal({ ...local, contactEmail: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Phone Number</label>
            <input
              value={local.phone}
              onChange={(e) => setLocal({ ...local, phone: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Shipping Fee (USD)</label>
            <input
              type="number"
              value={local.shippingFee}
              onChange={(e) => setLocal({ ...local, shippingFee: parseFloat(e.target.value) || 0 })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Free Shipping Threshold</label>
            <input
              type="number"
              value={local.freeShippingThreshold}
              onChange={(e) =>
                setLocal({ ...local, freeShippingThreshold: parseFloat(e.target.value) || 0 })
              }
              className="admin-input"
            />
            <p className="text-xs mt-1 text-[#A89E8F]">Orders over this amount ship free.</p>
          </div>
        </div>

        <div>
          <label className="admin-label">Low Stock Alert Threshold</label>
          <input
            type="number"
            value={local.lowStockThreshold}
            onChange={(e) => setLocal({ ...local, lowStockThreshold: parseInt(e.target.value) || 5 })}
            className="admin-input w-40"
          />
        </div>

        <div className="pt-3 border-t border-[#3A3332] flex items-center gap-4">
          <button onClick={handleSave} className="admin-btn admin-btn-gold px-8">
            Save Changes
          </button>
          {saved && <span className="text-emerald-400 text-sm">Settings saved successfully.</span>}
        </div>
      </div>

      <div className="mt-8 p-5 bg-[#1F1C1B] border border-[#3A3332] rounded-xl text-xs text-[#A89E8F] leading-relaxed">
        <strong className="text-[#D4AF37]">Next steps for production:</strong> Connect a real database (MongoDB + Mongoose),
        replace local Zustand persistence with server API routes, add proper JWT / NextAuth authentication, and implement
        Cloudinary image uploads with signed URLs.
      </div>
    </div>
  );
}
