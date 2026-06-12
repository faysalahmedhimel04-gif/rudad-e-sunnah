import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product as ProductModel } from "@/models/product.model";
import { products as seedProducts } from "@/lib/products"; // original curated data

/**
 * GET /api/products
 * Returns all active products. Seeds initial data on first run if DB is empty.
 */
export async function GET() {
  try {
    const conn = await connectDB();

    // If no Mongo connection (dev without DB), return the current in-memory/demo data
    if (!conn) {
      const { useAdminStore } = await import("@/lib/admin-store");
      // Note: This path is rarely hit in real prod. Admin store is client-only.
      // For public site fallback we still have the static import in page for now.
      return NextResponse.json({ products: seedProducts, source: "fallback" });
    }

    let docs = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    // Auto-seed on first run (very useful for fresh Mongo Atlas)
    if (docs.length === 0) {
      const seedDocs = seedProducts.map((p) => ({
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        description: p.description,
        stock: p.stock ?? 12,
        isActive: true,
      }));

      await ProductModel.insertMany(seedDocs);
      docs = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    }

    // Map Mongo docs to frontend Product shape (id = _id)
    const products = docs.map((doc: any) => ({
      id: doc._id.toString(),
      _id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      image: doc.image,
      category: doc.category,
      description: doc.description,
      stock: doc.stock,
      inStock: doc.stock > 0,
    }));

    return NextResponse.json({ products, source: "mongodb" });
  } catch (error: any) {
    console.error("GET /api/products error", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product (used by admin)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const newProduct = await ProductModel.create({
      name: body.name,
      price: body.price,
      image: body.image,
      category: body.category,
      description: body.description,
      stock: body.stock ?? 0,
      isActive: true,
    });

    return NextResponse.json(
      {
        product: {
          id: newProduct._id.toString(),
          ...newProduct.toObject(),
          inStock: newProduct.stock > 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 400 });
  }
}
