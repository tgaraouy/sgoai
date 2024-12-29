// src/lib/auth/auth-options.ts
import { createClient } from "@supabase/supabase-js";
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user info from Supabase
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      return {
        ...session,
        user: {
          ...session.user,
          ...profile,
        },
      };
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Create or update user in Supabase
      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.name,
          avatar_url: user.image,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving user:", error);
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
