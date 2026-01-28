import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ CRITICAL FIX: Allow all NextAuth API routes (OAuth callbacks)
  // This MUST be checked BEFORE calling auth() to prevent blocking OAuth flow
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth();
  const { nextUrl } = req;
  const isLoggedIn = !!session;
  const userRole = session?.user?.role;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Redirect logged-in users away from auth pages based on role
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
      }
      if (userRole === "VOLUNTEER") {
        return NextResponse.redirect(new URL("/portal/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Admin route protection
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Portal route protection (volunteer + admin access)
  if (isPortalRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "VOLUNTEER" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
