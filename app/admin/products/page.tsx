"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminStore, getFilteredProducts } from "@/lib/admin-store";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import AdminModal from "@/components/admin/AdminModal";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    loadProducts,
    deleteProduct,
    toggleProductStock,
    searchTerm,
    setSearchTerm,
  } = useAdminStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);

  // Load real data from MongoDB on mount
  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = getFilteredProducts(products, searchTerm);

  const openCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget !== null) {
      deleteProduct(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="text-[#D4AF37] uppercase tracking-[3px] text-xs mb-1">INVENTORY</div>
          <h1 className="font-serif text-4xl tracking-[-1.1px] text-[#EDE4D7]">Products</h1>
          <p className="text-[#A89E8F] mt-1 text-sm">Manage your full catalog of premium Islamic products</p>
        </div>

        <button
          onClick={openCreate}
          className="admin-btn admin-btn-gold flex items-center gap-2 self-start"
        >
          <Plus size={17} /> Add New Product
        </button>
      </div>

      {/* Search + Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A89E8F]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name, category or description..."
            className="admin-input admin-search w-full pl-11 py-3"
          />
        </div>
        <div className="flex items-center gap-3 text-sm px-5 bg-[#1F1C1B] border border-[#3A3332] rounded-lg text-[#A89E8F]">
          Showing <span className="font-medium text-[#D4AF37]">{filtered.length}</span> / {products.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-x-auto">
        <table className="admin-table min-w-[920px]">
          <thead>
            <tr>
              <th className="w-14">Image</th>
              <th>Product</th>
              <th>Category</th>
              <th className="w-24">Price</th>
              <th className="w-20">Stock</th>
              <th className="w-24">Status</th>
              <th className="text-right pr-6 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((product) => {
                const stock = product.stock ?? (product.inStock ? 12 : 0);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="w-11 h-11 rounded-md overflow-hidden border border-[#3A3332] bg-black/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80")
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-[#EDE4D7] pr-2">{product.name}</div>
                      <div className="text-xs text-[#A89E8F] line-clamp-1 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td>
                      <span className="inline-block rounded bg-[#3A3332] px-2.5 py-px text-xs tracking-wide text-[#D4AF37]">
                        {product.category}
                      </span>
                    </td>
                    <td className="font-medium tabular-nums text-[#D4AF37]">
                      {formatPrice(product.price)}
                    </td>
                    <td>
                      <span className={`font-mono text-sm ${stock < 6 ? "text-[#E07A7A]" : ""}`}>
                        {stock}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleProductStock(product.id)}
                        className="status-badge flex items-center gap-1.5 cursor-pointer select-none"
                        style={{
                          backgroundColor: product.inStock
                            ? "rgba(62,140,95,0.15)"
                            : "rgba(185,74,74,0.15)",
                          color: product.inStock ? "#8FD6A4" : "#E07A7A",
                        }}
                      >
                        {product.inStock ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(product)}
                          className="admin-btn-icon admin-btn-outline"
                          title="Edit product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product.id)}
                          className="admin-btn-icon admin-btn-danger"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a
                          href={product.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn-icon admin-btn-outline"
                          title="View image"
                        >
                          <Eye size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-16">
                  <div className="admin-empty">
                    <Search size={42} className="admin-empty-icon mx-auto mb-3" />
                    <div>No products match your search.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="admin-btn admin-btn-outline">
              Cancel
            </button>
            <button onClick={handleDelete} className="admin-btn admin-btn-danger px-7">
              Permanently Delete
            </button>
          </>
        }
      >
        <p className="text-[#A89E8F]">
          This action cannot be undone. The product will be removed from the store and all future order references will lose this item.
        </p>
      </AdminModal>

      {/* Helpful note */}
      <div className="mt-6 text-xs text-[#6C6358] flex items-center gap-2">
        <span>Image uploads ready for Cloudinary integration. Currently using direct URL entry.</span>
        <Link href="/admin/settings" className="text-[#D4AF37] hover:underline">Configure in Settings →</Link>
      </div>
    </div>
  );
}
