import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Full User model for Google OAuth authentication + e-commerce features
// Matches Rudad E Sunnah luxury requirements

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  googleId?: string;           // For Google OAuth
  createdAt: Date;
  updatedAt: Date;

  // E-commerce fields
  cart: ICartItem[];           // Array of product references with quantity
  orders: Types.ObjectId[];    // References to Order documents
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1, 
      default: 1 
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true 
    },
    image: { 
      type: String, 
      trim: true 
    },
    googleId: { 
      type: String, 
      unique: true, 
      sparse: true,   // Allows multiple nulls
      index: true 
    },

    // Shopping features
    cart: {
      type: [CartItemSchema],
      default: [],
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
      default: [],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

// Virtual for cart item count
UserSchema.virtual("cartCount").get(function (this: IUser) {
  return this.cart.reduce((sum, item) => sum + item.quantity, 0);
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
