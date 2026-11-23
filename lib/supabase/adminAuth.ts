import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";

export interface AdminSession {
  email: string;
  role: "superadmin" | "manager";
  fullName: string;
}

// In-memory or cookie-backed admin session token
export const ADMIN_COOKIE_NAME = "jayam_admin_token";

export async function verifyAdminCredentials(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminSession }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const supabase = createAdminClient() || createServerSupabaseClient();
  
  // 1. Try Supabase Auth signIn if Supabase is connected
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data?.user) {
        return {
          success: true,
          user: {
            email: data.user.email || cleanEmail,
            role: "superadmin",
            fullName: data.user.user_metadata?.full_name || "Venkatesh Kunde",
          },
        };
      }
    } catch (e) {
      console.error("Supabase Auth error:", e);
    }
  }

  // 2. Administrator credentials for owner access:
  // Owner: jayamvenkatesh1982@gmail.com / @Jayam4489 (or via phone 9505609865)
  if (
    (cleanEmail === "jayamvenkatesh1982@gmail.com" && cleanPassword === "@Jayam4489") ||
    (cleanEmail === "9505609865" && cleanPassword === "@Jayam4489")
  ) {
    // If Supabase admin client is connected, ensure this user also exists in Supabase Auth
    if (supabase) {
      try {
        await supabase.auth.admin.createUser({
          email: "jayamvenkatesh1982@gmail.com",
          password: "@Jayam4489",
          email_confirm: true,
          user_metadata: { full_name: "Venkatesh Kunde" },
        });
      } catch (err) {
        // User may already exist in Supabase auth
      }
    }

    return {
      success: true,
      user: {
        email: "jayamvenkatesh1982@gmail.com",
        role: "superadmin",
        fullName: "Venkatesh Kunde",
      },
    };
  }

  return {
    success: false,
    error: "Invalid admin email or password. Please check your credentials.",
  };
}
