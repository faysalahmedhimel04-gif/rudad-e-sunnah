"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAdminStore, getDashboardStats } from "@/lib/admin-store";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowRight,
  Calendar,
} from "lucide-react";

// Import recharts for beautiful sales chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const { orders, products, users, loadProducts } = useAdminStore();

  React.useEffect(() => {
    loadProducts?.();
  }, [loadProducts]);

  const { totalSales, totalOrders, totalProducts, totalUsers, recentOrders } =
    getDashboardStats(orders, products, users);

  // Generate simple 7-day sales chart data (demo)
  const salesData = React.useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const base = 420 + idx * 37;
      const variance = Math.floor(Math.random() * 180) - 60;
      return {
        day,
        sales: Math.max(280, base + variance),
      };
    });
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => (p.stock ?? 0) < 6).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="uppercase tracking-[3px] text-[#D4AF37] text-xs mb-1">OVERVIEW</div>
            <h1 className="font-serif text-4xl tracking-[-1.2px] text-[#EDE4D7]">
              Welcome back, Admin
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-[#A89E8F] bg-[#1F1C1B] px-4 py-2 rounded-lg border border-[#3A3332]">
            <Calendar size={14} /> {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats Grid - Beautiful luxury cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="admin-stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-widest text-[#A89E8F] mb-2">TOTAL SALES</div>
              <div className="admin-stat-value text-4xl font-medium tabular-nums">
                {formatPrice(totalSales)}
              </div>
            </div>
            <div className="p-3 bg-[#9C2A2A]/30 text-[#D4AF37] rounded-xl">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="text-emerald-400 text-xs mt-4 flex items-center gap-1">
            +18% from last week
          </div>
        </div>

        <div className="admin-stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-widest text-[#A89E8F] mb-2">TOTAL ORDERS</div>
              <div className="admin-stat-value text-4xl font-medium tabular-nums">{totalOrders}</div>
            </div>
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl">
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="text-[#A89E8F] text-xs mt-4">
            {pendingOrders} awaiting fulfillment
          </div>
        </div>

        <div className="admin-stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-widest text-[#A89E8F] mb-2">TOTAL PRODUCTS</div>
              <div className="admin-stat-value text-4xl font-medium tabular-nums">{totalProducts}</div>
            </div>
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl">
              <Package size={22} />
            </div>
          </div>
          <div className="text-[#A89E8F] text-xs mt-4">
            {lowStock} items running low
          </div>
        </div>

        <div className="admin-stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-widest text-[#A89E8F] mb-2">CUSTOMERS</div>
              <div className="admin-stat-value text-4xl font-medium tabular-nums">{totalUsers}</div>
            </div>
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl">
              <Users size={22} />
            </div>
          </div>
          <div className="text-emerald-400 text-xs mt-4">+2 new this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Sales Chart */}
        <div className="admin-card p-6 xl:col-span-3">
          <div className="flex justify-between items-center mb-5">
            <div>
              <div className="font-medium text-lg tracking-tight">Sales Overview</div>
              <div className="text-xs text-[#A89E8F]">Last 7 days (demo data)</div>
            </div>
            <Link href="/admin/orders" className="text-xs flex items-center gap-1 text-[#D4AF37] hover:underline">
              View all orders <ArrowRight size={14} />
            </Link>
          </div>

          <div className="h-72 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3332" />
                <XAxis dataKey="day" stroke="#6C6358" />
                <YAxis stroke="#6C6358" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F1C1B",
                    border: "1px solid #3A3332",
                    color: "#EDE4D7",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="natural"
                  dataKey="sales"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: "#D4AF37", r: 3.5 }}
                  activeDot={{ r: 6, fill: "#E8C97A" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card p-6 xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium tracking-tight">Recent Orders</div>
            <Link
              href="/admin/orders"
              className="text-xs px-3 py-1 rounded-md border border-[#3A3332] hover:border-[#D4AF37] text-[#D4AF37] flex items-center gap-1"
            >
              All Orders <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-1 text-sm flex-1">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between py-3 px-3.5 rounded-lg hover:bg-[#24201F] border border-transparent hover:border-[#3A3332] transition group"
                >
                  <div>
                    <div className="font-medium text-[#EDE4D7] group-hover:text-[#D4AF37]">
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-[#A89E8F]">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium tabular-nums">{formatPrice(order.total)}</div>
                    <div className="text-[10px] text-[#A89E8F]">{formatDate(order.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="admin-empty flex-1">No orders yet</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/products" className="admin-card p-5 flex items-center justify-between group">
          <div>
            <div className="font-medium">Manage Products</div>
            <div className="text-xs text-[#A89E8F]">Add, edit, or remove inventory</div>
          </div>
          <ArrowRight className="text-[#D4AF37] group-hover:translate-x-0.5 transition" />
        </Link>
        <Link href="/admin/orders" className="admin-card p-5 flex items-center justify-between group">
          <div>
            <div className="font-medium">Fulfill Orders</div>
            <div className="text-xs text-[#A89E8F]">{pendingOrders} pending orders need attention</div>
          </div>
          <ArrowRight className="text-[#D4AF37] group-hover:translate-x-0.5 transition" />
        </Link>
        <Link href="/admin/categories" className="admin-card p-5 flex items-center justify-between group">
          <div>
            <div className="font-medium">Edit Categories</div>
            <div className="text-xs text-[#A89E8F]">Organize your collections</div>
          </div>
          <ArrowRight className="text-[#D4AF37] group-hover:translate-x-0.5 transition" />
        </Link>
      </div>
    </div>
  );
}
