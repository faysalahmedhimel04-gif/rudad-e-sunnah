import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import User from "@/models/User";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch full user from MongoDB for additional fields
  const dbUser = await User.findOne({ email: session.user.email });

  return (
    <div className="min-h-screen bg-[#FDF9F3] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#D9CBB8] p-8">
          <h1 className="text-4xl font-serif tracking-tight text-[#2C2522] mb-2">My Profile</h1>
          <p className="text-[#5C5248] mb-8">Welcome back, {session.user.name}</p>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="w-20 h-20 rounded-full ring-4 ring-[#D4AF37]/20" 
                />
              )}
              <div>
                <h2 className="text-2xl font-medium text-[#2C2522]">{session.user.name}</h2>
                <p className="text-[#5C5248]">{session.user.email}</p>
                {dbUser?.role && (
                  <span className="inline-block mt-1 px-3 py-0.5 text-xs bg-[#D4AF37] text-[#121010] rounded-full font-medium">
                    {dbUser.role}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EDE4D7]">
              <p className="text-sm text-[#5C5248]">
                Account created: {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : "Just now"}
              </p>
              <p className="mt-2 text-xs text-[#A89E8F]">
                Your data is securely stored in MongoDB. Sign in with Google for seamless experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
