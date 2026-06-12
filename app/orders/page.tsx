import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import User from "@/models/User";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const dbUser = await User.findOne({ email: session.user.email }).populate("orders");

  return (
    <div className="min-h-screen bg-[#FDF9F3] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-tight text-[#2C2522] mb-8">My Orders</h1>

        <div className="bg-white rounded-2xl border border-[#D9CBB8] p-8">
          <p className="text-[#5C5248] mb-6">Track your past orders and delivery status.</p>
          
          {(dbUser?.orders?.length ?? 0) > 0 ? (
            <ul className="space-y-4">
              {(dbUser?.orders || []).map((order: any, i: number) => (
                <li key={i} className="p-4 border border-[#EDE4D7] rounded-lg">
                  Order #{i + 1} — Status: <span className="text-[#9C2A2A] font-medium">Pending</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 border border-dashed border-[#D9CBB8] rounded-xl text-center text-[#5C5248]">
              No orders yet. Start shopping to see your order history here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
