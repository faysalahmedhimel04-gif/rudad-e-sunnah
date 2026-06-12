"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AdminModal, { FormField } from "@/components/admin/AdminModal";

export default function AdminCategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image: "" });
    setIsOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image || "",
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description.trim(),
      image: form.image.trim() || undefined,
    };

    if (editing) {
      updateCategory(editing.id, payload);
    } else {
      addCategory(payload as any);
    }
    setIsOpen(false);
  };

  // Count products per category
  const getProductCount = (catName: string) =>
    products.filter((p) => p.category.toLowerCase() === catName.toLowerCase()).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[#D4AF37] text-xs tracking-[3px] mb-1">ORGANIZATION</div>
          <h1 className="font-serif text-4xl tracking-[-1.1px]">Categories</h1>
        </div>
        <button onClick={openCreate} className="admin-btn admin-btn-gold flex gap-2 items-center">
          <Plus size={17} /> New Category
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card p-6 flex gap-5">
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#161413] border border-[#3A3332]">
              {cat.image ? (
                <img src={cat.image} alt="" className="object-cover w-full h-full" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#D4AF37] text-xs">No Image</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-xl tracking-tight">{cat.name}</div>
                  <div className="text-xs uppercase tracking-widest text-[#D4AF37] mt-px">/{cat.slug}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="admin-btn-icon admin-btn-outline">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => deleteCategory(cat.id as number)} className="admin-btn-icon admin-btn-danger">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-[#A89E8F] line-clamp-2">{cat.description}</p>

              <div className="mt-4 text-xs">
                <span className="px-2.5 py-px bg-[#3A3332] rounded text-[#D4AF37] font-medium">
                  {getProductCount(cat.name)} products
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editing ? "Edit Category" : "Create New Category"}
        footer={
          <>
            <button onClick={() => setIsOpen(false)} className="admin-btn admin-btn-outline">Cancel</button>
            <button onClick={handleSave} className="admin-btn admin-btn-gold">Save Category</button>
          </>
        }
      >
        <FormField label="Category Name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="admin-input"
            placeholder="Thobes"
          />
        </FormField>
        <FormField label="Slug (URL)">
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="admin-input font-mono text-sm"
            placeholder="thobes"
          />
        </FormField>
        <FormField label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="admin-textarea"
          />
        </FormField>
        <FormField label="Image URL (optional)">
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="admin-input"
            placeholder="https://..."
          />
        </FormField>
      </AdminModal>
    </div>
  );
}
