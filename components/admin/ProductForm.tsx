"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/lib/types";
import { useAdminStore } from "@/lib/admin-store";
import AdminModal from "./AdminModal";
import { FormField } from "./AdminModal";
import { Upload, X, Image as ImageIcon } from "lucide-react";

// Zod validation schema - beautiful & strict
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  price: z.coerce.number().min(1, "Price must be at least $1").max(9999),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(15, "Description should be at least 15 characters").max(1200),
  image: z.string().url("Must be a valid image URL").or(z.string().min(3)),
  stock: z.coerce.number().int().min(0).max(999),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null = create mode
}

export default function ProductForm({ isOpen, onClose, product }: ProductFormProps) {
  const { addProduct, updateProduct, categories } = useAdminStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 79,
      category: "Thobes",
      description: "",
      image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80",
      stock: 12,
    },
  });

  const watchedImage = watch("image");

  // Handle real file upload from computer
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();

      // Update the form with the uploaded image path (e.g. /uploads/products/123-xxx.jpg)
      setValue("image", data.url, { shouldValidate: true });

      // Optional: clear any previous error
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again or paste a URL instead.");
    } finally {
      setIsUploading(false);
      // Reset the native file input so same file can be chosen again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearImage = () => {
    setValue("image", "", { shouldValidate: true });
    setUploadError(null);
  };

  // Prefill when editing
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        stock: product.stock ?? 10,
      });
    } else {
      reset({
        name: "",
        price: 79,
        category: categories[0]?.name || "Thobes",
        description: "",
        image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80",
        stock: 12,
      });
    }
  }, [product, reset, isOpen, categories]);

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      name: data.name.trim(),
      price: Number(data.price),
      category: data.category,
      description: data.description.trim(),
      image: data.image.trim(),
      stock: Number(data.stock),
    };

    if (product) {
      await updateProduct(product.id, payload);
    } else {
      await addProduct(payload as any);
    }
    onClose();
    reset();
  };

  const footer = (
    <>
      <button type="button" onClick={onClose} className="admin-btn admin-btn-outline">
        Cancel
      </button>
      <button
        type="submit"
        form="product-form"
        disabled={isSubmitting}
        className="admin-btn admin-btn-gold min-w-[130px]"
      >
        {product ? "Save Changes" : "Add Product"}
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Edit Product" : "Add New Product"}
      footer={footer}
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        {/* Live Image Preview + Upload */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="admin-label mb-0">Product Image</label>
            {watchedImage && (
              <button
                type="button"
                onClick={clearImage}
                className="text-xs flex items-center gap-1 text-[#E07A7A] hover:text-[#E07A7A]/80"
              >
                <X size={13} /> Clear image
              </button>
            )}
          </div>

          {/* Preview Box - clickable to upload */}
          <div
            onClick={!isUploading ? triggerFileSelect : undefined}
            className="product-image-preview group relative cursor-pointer overflow-hidden"
            title="Click to upload a new image"
          >
            {watchedImage ? (
              <img
                src={watchedImage}
                alt="Product preview"
                className="transition-opacity group-hover:opacity-90"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#A89E8F]">
                <ImageIcon size={42} className="mb-3 opacity-60" />
                <div className="text-sm">Click here or use the button below to upload</div>
                <div className="text-[11px] mt-1 text-[#6C6358]">JPG, PNG, WEBP up to 5MB</div>
              </div>
            )}

            {/* Upload overlay when uploading */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="flex flex-col items-center text-[#D4AF37]">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4AF37] border-t-transparent mb-2" />
                  <div className="text-sm tracking-wider">UPLOADING...</div>
                </div>
              </div>
            )}

            {/* Subtle upload hint on hover */}
            {!isUploading && watchedImage && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <div className="flex items-center gap-2 text-white text-sm bg-black/60 px-4 py-1.5 rounded-full">
                  <Upload size={16} /> Change image
                </div>
              </div>
            )}
          </div>

          {/* Upload button + hidden file input */}
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="admin-btn admin-btn-outline flex items-center gap-2 text-sm py-2 px-4 disabled:opacity-50"
            >
              <Upload size={16} />
              {watchedImage ? "Upload replacement photo" : "Upload photo from computer"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            <div className="text-[11px] text-[#A89E8F] flex items-center">
              or paste a URL below
            </div>
          </div>

          {uploadError && (
            <p className="mt-2 text-xs text-[#E07A7A]">{uploadError}</p>
          )}

          <p className="mt-2 text-[11px] text-[#6C6358]">
            Upload real photos directly from your computer. Files are saved locally and will appear on the main site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Product Name" error={errors.name?.message}>
            <input
              {...register("name")}
              className="admin-input"
              placeholder="Classic White Thobe"
            />
          </FormField>

          <FormField label="Price (USD)" error={errors.price?.message}>
            <input type="number" step="1" {...register("price")} className="admin-input" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <FormField label="Category" error={errors.category?.message}>
            <select {...register("category")} className="admin-select">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))
              ) : (
                ["Thobes", "Prayer Mats", "Islamic Books", "Attar"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </FormField>

          <FormField label="Stock Quantity" error={errors.stock?.message}>
            <input type="number" {...register("stock")} className="admin-input" />
          </FormField>
        </div>

        <FormField label="Image URL (optional - used if no photo uploaded)" error={errors.image?.message}>
          <input
            {...register("image")}
            className="admin-input font-mono text-sm"
            placeholder="https://images.unsplash.com/... or leave blank if you uploaded a photo"
          />
        </FormField>

        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={4}
            className="admin-textarea resize-y min-h-[92px]"
            placeholder="Premium Egyptian cotton thobe with subtle embroidery..."
          />
        </FormField>
      </form>
    </AdminModal>
  );
}
