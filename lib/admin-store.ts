"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Order, AdminUser, AdminSettings, OrderStatus, Category } from "./types";
import { products as seedProducts, categories as seedCategories } from "./products";
import { generateId, formatPrice } from "./utils";

// ============================================
// ADMIN STORE (Zustand) — Powers entire admin panel
// Persisted to localStorage for realistic demo experience
// Easy to swap with real API calls later
// ============================================

interface AdminState {
  // Auth (simple but effective for now)
  isAuthenticated: boolean;
  adminName: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Products (full CRUD, now backed by MongoDB via API when available)
  products: Product[];
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string | number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string | number) => Promise<void>;
  toggleProductStock: (id: string | number) => Promise<void>;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrderNote: (id: string, note: string) => void;

  // Users (customers)
  users: AdminUser[];

  // Settings
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;

  // UI helpers
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: OrderStatus | "All";
  setStatusFilter: (status: OrderStatus | "All") => void;
}

// Seed realistic demo orders
const seedOrders: Order[] = [
  {
    id: "ord_1",
    orderNumber: "RUD-240610-4821",
    customerName: "Ahmed Al-Mansouri",
    customerEmail: "ahmed.mansouri@email.com",
    customerPhone: "+1 (718) 555-0192",
    shippingAddress: "2147 5th Avenue, Apt 3B, New York, NY 10035, USA",
    items: [
      { productId: 1, name: "Classic White Thobe", price: 89, quantity: 1 },
      { productId: 3, name: "Damascus Prayer Mat", price: 65, quantity: 1 },
    ],
    total: 154,
    status: "Pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "ord_2",
    orderNumber: "RUD-240609-3394",
    customerName: "Fatima Zahra",
    customerEmail: "fatima.zahra@gmail.com",
    shippingAddress: "78 Al-Madinah Road, London, UK",
    items: [
      { productId: 6, name: "The Noble Quran - Gold Edition", price: 72, quantity: 1 },
      { productId: 7, name: "Royal Oud Attar", price: 95, quantity: 1 },
    ],
    total: 167,
    status: "Processing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "ord_3",
    orderNumber: "RUD-240607-8817",
    customerName: "Yusuf Rahman",
    customerEmail: "yusuf.rahman@outlook.com",
    customerPhone: "+1 (310) 555-7721",
    shippingAddress: "452 Oak Street, Dearborn, MI 48126, USA",
    items: [
      { productId: 2, name: "Embroidered Midnight Thobe", price: 129, quantity: 2 },
    ],
    total: 258,
    status: "Shipped",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "ord_4",
    orderNumber: "RUD-240605-1129",
    customerName: "Aisha Karim",
    customerEmail: "aisha.karim@yahoo.com",
    shippingAddress: "19 Crescent Lane, Toronto, ON M5V 2T6, Canada",
    items: [
      { productId: 4, name: "Saffron Gold Prayer Mat", price: 78, quantity: 1 },
      { productId: 8, name: "Amber Rose Attar", price: 68, quantity: 1 },
      { productId: 5, name: "Leather-Bound Sahih Bukhari", price: 54, quantity: 1 },
    ],
    total: 200,
    status: "Delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

const seedUsers: AdminUser[] = [
  {
    id: "usr_1",
    name: "Ahmed Al-Mansouri",
    email: "ahmed.mansouri@email.com",
    phone: "+1 (718) 555-0192",
    totalOrders: 3,
    totalSpent: 487,
    joinedAt: "2024-01-12",
    lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "usr_2",
    name: "Fatima Zahra",
    email: "fatima.zahra@gmail.com",
    totalOrders: 1,
    totalSpent: 167,
    joinedAt: "2024-03-05",
    lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(),
  },
  {
    id: "usr_3",
    name: "Yusuf Rahman",
    email: "yusuf.rahman@outlook.com",
    phone: "+1 (310) 555-7721",
    totalOrders: 5,
    totalSpent: 1240,
    joinedAt: "2023-09-18",
    lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "usr_4",
    name: "Aisha Karim",
    email: "aisha.karim@yahoo.com",
    totalOrders: 2,
    totalSpent: 312,
    joinedAt: "2024-02-22",
    lastOrderAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

const defaultSettings: AdminSettings = {
  siteName: "Rudad E Sunnah",
  contactEmail: "hello@rudad-e-sunnah.com",
  phone: "+1 (347) 555-0198",
  shippingFee: 12,
  freeShippingThreshold: 150,
  lowStockThreshold: 5,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // AUTH
      isAuthenticated: false,
      adminName: "Admin",

      login: (username: string, password: string) => {
        // Simple secure-ish gate for demo.
        // In production: Replace with real NextAuth / JWT / API call
        const validUsername = "admin";
        const validPassword = "rudad2025"; // CHANGE THIS IN PRODUCTION

        if (username.trim().toLowerCase() === validUsername && password === validPassword) {
          set({ isAuthenticated: true, adminName: "Admin" });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      // PRODUCTS — loaded from MongoDB via /api/products when available
      products: [],

      loadProducts: async () => {
        try {
          const res = await fetch("/api/products");
          const data = await res.json();
          if (data.products) {
            set({ products: data.products });
          }
        } catch (e) {
          console.warn("Failed to load products from API, using seed fallback");
          // fallback to seed if API fails
          const fallback = seedProducts.map((p, index) => ({
            ...p,
            id: p.id || index + 1,
            stock: p.stock ?? 12,
            inStock: true,
          }));
          set({ products: fallback });
        }
      },

      addProduct: async (newProduct) => {
        try {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newProduct,
              stock: newProduct.stock ?? 10,
            }),
          });
          const data = await res.json();
          if (data.product) {
            set((state) => ({ products: [...state.products, data.product] }));
          } else {
            // refetch on failure
            await get().loadProducts();
          }
        } catch (e) {
          console.error("Failed to add product via API");
          await get().loadProducts();
        }
      },

      updateProduct: async (id, updates) => {
        try {
          await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          await get().loadProducts();
        } catch (e) {
          console.error("Failed to update product");
        }
      },

      deleteProduct: async (id) => {
        try {
          await fetch(`/api/products/${id}`, { method: "DELETE" });
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        } catch (e) {
          console.error("Failed to delete");
          await get().loadProducts();
        }
      },

      toggleProductStock: async (id) => {
        const current = get().products.find((p) => p.id === id);
        const newStock = current && current.inStock ? 0 : 12;
        await get().updateProduct(id, { stock: newStock });
      },

      // CATEGORIES
      categories: [...seedCategories],

      addCategory: (cat) => {
        const maxId = Math.max(0, ...get().categories.map((c) => Number(c.id) || 0));
        const newCat: Category = { ...cat, id: maxId + 1 };
        set((state) => ({ categories: [...state.categories, newCat] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCategory: (id) => {
        // Prevent deleting if products still use it (soft guard)
        const productsUsing = get().products.filter((p) => p.category === get().categories.find((c) => c.id === id)?.name);
        if (productsUsing.length > 0) {
          alert(`Cannot delete: ${productsUsing.length} product(s) still use this category.`);
          return;
        }
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
      },

      // ORDERS
      orders: seedOrders,

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      addOrderNote: (id, note) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, notes: note, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      // USERS
      users: seedUsers,

      // SETTINGS
      settings: defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // FILTERS (used across pages)
      searchTerm: "",
      setSearchTerm: (term) => set({ searchTerm: term }),

      statusFilter: "All",
      setStatusFilter: (status) => set({ statusFilter: status }),
    }),
    {
      name: "rudad-admin-store",
      partialize: (state) => ({
        // Only persist meaningful data, not transient filters
        products: state.products,
        categories: state.categories,
        orders: state.orders,
        users: state.users,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
        adminName: state.adminName,
      }),
    }
  )
);

// Helper: Get filtered products for Products page
export const getFilteredProducts = (products: Product[], search: string) => {
  if (!search.trim()) return products;
  const q = search.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};

// Helper: Compute dashboard stats
export const getDashboardStats = (orders: Order[], products: Product[], users: AdminUser[]) => {
  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return { totalSales, totalOrders, totalProducts, totalUsers, recentOrders };
};
