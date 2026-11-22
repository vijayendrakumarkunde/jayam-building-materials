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
  const supabase = createAdminClient() || createServerSupabaseClient();
  
  // 1. Try Supabase Auth signIn if Supabase is connected
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        return {
          success: true,
          user: {
            email: data.user.email || email,
            role: "superadmin",
            fullName: data.user.user_metadata?.full_name || "Admin",
          },
        };
      }
    } catch (e) {
      console.error("Supabase Auth error:", e);
    }
  }

  // 2. Default administrator master credentials for quick setup / owner access
  // (Owner phone: 9505609865)
  if (
    (email === "admin@jayam.com" && password === "jayam9505609865") ||
    (email === "9505609865" && password === "jayam9505609865") ||
    (email === "admin@jayambuildingmaterials.com" && password === "admin12345")
  ) {
    return {
      success: true,
      user: {
        email: "admin@jayambuildingmaterials.com",
        role: "superadmin",
        fullName: "Jayam Master Administrator",
      },
    };
  }

  return {
    success: false,
    error: "Invalid admin email or password. Please check your credentials.",
  };
}
