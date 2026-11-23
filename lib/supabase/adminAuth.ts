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

  // 1. Owner Master Credentials (Instant verification)
  if (
    (cleanEmail === "jayamvenkatesh1982@gmail.com" && cleanPassword === "@Jayam4489") ||
    (cleanEmail === "9505609865" && cleanPassword === "@Jayam4489")
  ) {
    return {
      success: true,
      user: {
        email: "jayamvenkatesh1982@gmail.com",
        role: "superadmin",
        fullName: "Venkatesh Kunde",
      },
    };
  }

  // 2. Optional Supabase Auth fallback
  try {
    const supabase = createAdminClient();
    if (supabase) {
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
            fullName: data.user.user_metadata?.full_name || "Admin",
          },
        };
      }
    }
  } catch (e) {
    console.error("Supabase Auth fallback error:", e);
  }

  return {
    success: false,
    error: "Invalid admin email or password. Please check your credentials.",
  };
}
