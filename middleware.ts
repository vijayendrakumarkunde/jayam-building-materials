import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("jayam_admin_token")?.value;

    // Login page handling
    if (pathname === "/admin/login") {
      if (adminToken) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Exact /admin redirect
    if (pathname === "/admin") {
      if (adminToken) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Guard all other /admin/* routes
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
