import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public API routes that don't need authentication
  const publicRoutes = [
    "/api/users/login",
    "/api/fb/fetch",
    "/api/contact",
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isPublicRoute && pathname.startsWith("/api/")) {
    // Check for session cookie
    const sessionCookie = request.cookies.get("admin_session");
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse session to check role for admin-only routes
    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Admin-only routes
      const adminOnlyRoutes = [
        "/api/users",
        "/api/backup",
        "/api/export",
        "/api/activity",
      ];

      if (adminOnlyRoutes.some((route) => pathname.startsWith(route)) && session.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Forbidden: Admin access required" },
          { status: 403 }
        );
      }
    } catch {
      // Invalid session
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};

