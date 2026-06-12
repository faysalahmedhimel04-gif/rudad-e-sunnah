import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

/**
 * Production-ready MongoDB connection.
 * Uses connection caching (important for serverless / Vercel).
 * Throws in production if MONGODB_URI is missing.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production. Please set it in Vercel environment variables.");
    }
    // In development without DB, callers should handle fallback to local store
    console.warn("⚠️ MONGODB_URI not set. Falling back to local demo data (Zustand).");
    return null as any;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export const isMongoConnected = () => !!cached.conn || !!MONGODB_URI;
