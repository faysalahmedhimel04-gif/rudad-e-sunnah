import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

/**
 * POST /api/upload
 * Production-ready image upload for Admin Panel.
 * 
 * - In production on Vercel (when BLOB_READ_WRITE_TOKEN is set): Uses Vercel Blob (persistent, CDN, recommended)
 * - In development / fallback: Saves to public/uploads/products/ (local only)
 * 
 * Returns a public URL that works on both main site and admin.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
    const filename = `${timestamp}-${safeName}`;

    // === PRODUCTION: Vercel Blob (persistent across deployments) ===
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      const blob = await put(`products/${filename}`, buffer, {
        access: "public",
        contentType: file.type,
        token: blobToken,
      });
      return NextResponse.json({ url: blob.url, filename: blob.pathname });
    }

    // === DEVELOPMENT / FALLBACK: Local filesystem ===
    const uploadsDir = join(process.cwd(), "public", "uploads", "products");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/products/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      filename,
      size: file.size,
      note: "Using local storage (set BLOB_READ_WRITE_TOKEN in Vercel for production persistence)",
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
