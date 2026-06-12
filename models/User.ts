import mongoose, { Schema, Document, Model } from "mongoose";

// User model for Google OAuth authentication
// Fields as per requirements: name, email, image, googleId, role, createdAt
// Additional: cart and orders for e-commerce (as referenced in previous requirements)

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  googleId?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  cart: mongoose.Types.ObjectId[]; // References to Product
  orders: mongoose.Types.ObjectId[]; // References to Order
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null for non-Google users
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model overwrite on hot reload in development
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;