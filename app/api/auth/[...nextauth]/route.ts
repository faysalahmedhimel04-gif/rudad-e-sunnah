import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import User from "@/models/User"; // Our custom User model
import { connectDB } from "@/lib/mongodb"; // Existing mongoose connection

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // On first Google login, ensure our custom User document exists
        if (account?.provider === "google") {
          await connectDB(); // Ensure Mongoose is connected

          const email = user.email;
          if (!email) return false; // Email is required

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Auto-create user profile in MongoDB on first login
            await User.create({
              name: user.name || "Unknown User",
              email,
              image: user.image ?? undefined,
              googleId: (profile as any)?.sub || account.providerAccountId,
              role: "user",
              cart: [],
              orders: [],
            });
            console.log(`New user created via Google: ${email}`);
          } else if (!existingUser.googleId) {
            // Link Google ID if user existed (e.g. from admin seed)
            existingUser.googleId = (profile as any)?.sub || account.providerAccountId;
            await existingUser.save();
          }
        }
        return true; // Allow sign in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session, user }) {
      // Add custom fields to session (id, role, etc.)
      if (session.user) {
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
          (session.user as any).role = dbUser.role;
          (session.user as any).googleId = dbUser.googleId;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
});

export const { GET, POST } = handlers;