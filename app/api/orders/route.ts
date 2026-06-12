import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order as OrderModel } from "@/models/order.model";

/**
 * GET /api/orders - for admin
 */
export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(100).lean();

    const mapped = orders.map((o: any) => ({
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      shippingAddress: o.shippingAddress,
      items: o.items,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      notes: o.notes,
    }));

    return NextResponse.json({ orders: mapped });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

/**
 * POST /api/orders - create order (used by cart checkout)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const newOrder = await OrderModel.create({
      customerName: body.customerName || "Guest Customer",
      customerEmail: body.customerEmail || "guest@example.com",
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress || "Address not provided",
      items: body.items || [],
      total: body.total || 0,
      status: "Pending",
      notes: body.notes,
    });

    return NextResponse.json({ order: { id: newOrder._id.toString(), ...newOrder.toObject() } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 400 });
  }
}
