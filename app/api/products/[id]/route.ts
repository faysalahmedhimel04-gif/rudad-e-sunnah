import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product as ProductModel } from "@/models/product.model";
import mongoose from "mongoose";

/**
 * Helper to validate Mongo ObjectId
 */
function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const doc = await ProductModel.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({
      product: {
        id: doc._id.toString(),
        ...doc,
        inStock: (doc as any).stock > 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const updated = await ProductModel.findByIdAndUpdate(
      id,
      {
        name: body.name,
        price: body.price,
        image: body.image,
        category: body.category,
        description: body.description,
        stock: body.stock,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({
      product: {
        id: updated._id.toString(),
        ...updated,
        inStock: (updated as any).stock > 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
