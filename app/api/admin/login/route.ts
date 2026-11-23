import { NextResponse } from "next/server";
import { verifyAdminCredentials, ADMIN_COOKIE_NAME } from "@/lib/supabase/adminAuth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/Phone and password are required." },
        { status: 400 }
      );
    }

    const verification = await verifyAdminCredentials(email.trim(), password.trim());

    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { error: verification.error || "Authentication failed." },
        { status: 401 }
      );
    }

    // Set secure cookie for admin session
    const response = NextResponse.json({
      success: true,
      user: verification.user,
    });

    const sessionPayload = Buffer.from(JSON.stringify(verification.user)).toString("base64");

    response.cookies.set(ADMIN_COOKIE_NAME, sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: error?.message || "Server error during authentication." },
      { status: 500 }
    );
  }
}
