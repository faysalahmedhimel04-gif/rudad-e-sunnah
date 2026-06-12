// Type definitions for Rudad E Sunnah e-commerce
// Prepared for future MongoDB integration (models/)

export interface Product {
  id: number | string;   // number for legacy seed, string for MongoDB _id
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock?: boolean;
  stock?: number;
  _id?: string;          // raw Mongo id when needed
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  _id?: string;
}

// ============================================
// ADMIN PANEL TYPES
// ============================================

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: number | string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  _id?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string;
}

export interface AdminSettings {
  siteName: string;
  contactEmail: string;
  phone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
}

// For Mongoose ready — future use (string ids from DB)
export interface MongoProduct extends Omit<Product, "id"> {
  _id: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

