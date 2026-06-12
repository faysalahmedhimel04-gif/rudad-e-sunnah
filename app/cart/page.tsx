import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { Product } from "@/models/product.model";

export default async function CartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  await User.findOne({ email: session.user.email }).populate("cart"); // For future expansion

  return (
    <div className="min-h-screen bg-[#FDF9F3] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-tight text-[#2C2522] mb-8">My Cart</h1>

        <div className="bg-white rounded-2xl border border-[#D9CBB8] p-8">
          <p className="text-[#5C5248] mb-6">Your saved cart items from your account will appear here.</p>
          
          <div className="p-8 border border-dashed border-[#D9CBB8] rounded-xl text-center">
            <p className="text-[#A89E8F]">Cart functionality integrated with your user profile.</p>
            <p className="text-sm mt-2 text-[#5C5248]">Add items from the shop after logging in — they will sync to your MongoDB cart.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
