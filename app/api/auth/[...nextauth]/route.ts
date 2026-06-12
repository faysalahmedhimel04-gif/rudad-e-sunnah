import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import User from "@/models/User"; // Our custom User model
import { connectDB } from "@/lib/mongodb"; // Existing mongoose connection

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
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

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Auto-create user profile in MongoDB on first login
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: profile?.sub, // Google's unique ID
              role: "user",
              cart: [],
              orders: [],
            });
            console.log(`New user created via Google: ${user.email}`);
          } else if (!existingUser.googleId) {
            // Link Google ID if user existed (e.g. from admin seed)
            existingUser.googleId = profile?.sub;
            await existingUser.save();
          }
        }
        return true; // Allow sign in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Returning false will show the Callback error page
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
    strategy: "jwt", // Use JWT for sessions (works well with adapter)
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  debug: true, // Temporarily enable for better error logs in the terminal
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };