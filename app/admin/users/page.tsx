"use client";

import React from "react";
import { useAdminStore } from "@/lib/admin-store";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const { users, orders } = useAdminStore();

  // Enrich a bit with latest order date if missing
  const sortedUsers = [...users].sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div>
      <div className="mb-8">
        <div className="text-[#D4AF37] text-xs tracking-[3px]">RELATIONSHIPS</div>
        <h1 className="font-serif text-4xl tracking-[-1px]">Customers</h1>
        <p className="text-[#A89E8F] mt-1">Your valued community of buyers</p>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => {
              const last = user.lastOrderAt ? formatDate(user.lastOrderAt) : "—";
              return (
                <tr key={user.id}>
                  <td className="font-medium">{user.name}</td>
                  <td className="text-[#A89E8F] text-sm">{user.email}</td>
                  <td>
                    <span className="font-medium tabular-nums">{user.totalOrders}</span>
                    <span className="text-[#A89E8F]"> orders</span>
                  </td>
                  <td className="font-medium text-[#D4AF37] tabular-nums">{formatPrice(user.totalSpent)}</td>
                  <td className="text-sm text-[#A89E8F]">{formatDate(user.joinedAt)}</td>
                  <td className="text-sm text-[#A89E8F]">{last}</td>
                </tr>
              );
            })}
            {sortedUsers.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xs text-[#6C6358]">
        Customer data is generated from orders. Full CRM integration (Mailchimp / Klaviyo) can be added later.
      </div>
    </div>
  );
}
