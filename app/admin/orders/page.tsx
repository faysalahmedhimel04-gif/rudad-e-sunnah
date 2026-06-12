"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";
import AdminModal from "@/components/admin/AdminModal";

const STATUS_OPTIONS: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { orders: storeOrders, setStatusFilter, statusFilter, searchTerm, setSearchTerm } = useAdminStore();
  const [orders, setOrders] = React.useState<any[]>(storeOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Load real orders from Mongo
  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch {
        setOrders(storeOrders);
      }
    }
    load();
  }, [storeOrders]);

  const updateOrderStatus = async (id: string, status: any) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Refresh list
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch {}
  };

  // Apply both text search + status filter
  const filteredOrders = orders
    .filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="text-[#D4AF37] uppercase tracking-[3px] text-xs">FULFILLMENT</div>
        <h1 className="font-serif text-4xl tracking-[-1.1px]">Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order #, customer, email..."
          className="admin-input w-full max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="admin-select w-auto min-w-[160px]"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table min-w-[1080px]">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th className="text-right pr-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium text-[#D4AF37] font-mono text-sm">{order.orderNumber}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div className="text-xs text-[#A89E8F]">{order.customerEmail}</div>
                  </td>
                  <td className="text-sm text-[#A89E8F]">{formatDate(order.createdAt)}</td>
                  <td className="text-sm">{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                  <td className="font-medium tabular-nums">{formatPrice(order.total)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="status-badge border-0 bg-transparent cursor-pointer text-xs font-semibold"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#1F1C1B] text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-right pr-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="admin-btn admin-btn-outline text-xs px-5 py-1.5"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#A89E8F]">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <AdminModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber}`}
        maxWidth="720px"
        footer={
          selectedOrder && (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 text-xs text-[#A89E8F]">Update status using the dropdown on the table row</div>
              <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-gold">Close</button>
            </div>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <div className="text-xs text-[#A89E8F]">CUSTOMER</div>
                <div className="font-medium mt-px">{selectedOrder.customerName}</div>
                <div>{selectedOrder.customerEmail}</div>
              </div>
              <div>
                <div className="text-xs text-[#A89E8F]">SHIPPING TO</div>
                <div className="mt-px text-[#EDE4D7]">{selectedOrder.shippingAddress}</div>
              </div>
            </div>

            <div>
              <div className="text-xs tracking-widest mb-2 text-[#A89E8F]">ITEMS</div>
              <div className="divide-y divide-[#3A3332] border border-[#3A3332] rounded-lg">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between px-4 py-[11px]">
                    <div>
                      {item.name} × {item.quantity}
                    </div>
                    <div className="tabular-nums font-medium text-[#D4AF37]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-base pt-1 border-t border-[#3A3332]">
              <div className="font-medium">Order Total</div>
              <div className="font-medium tabular-nums text-[#D4AF37] text-xl">{formatPrice(selectedOrder.total)}</div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-[#161413] border border-[#3A3332] p-4 rounded-lg text-[#A89E8F]">
                <span className="text-xs tracking-widest">ORDER NOTES</span>
                <div className="text-[#EDE4D7] mt-1">{selectedOrder.notes}</div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
