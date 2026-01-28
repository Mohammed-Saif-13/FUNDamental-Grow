export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [], // Providers added in lib/auth.js
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Public routes - always allowed
      const publicRoutes = [
        "/",
        "/campaigns",
        "/about",
        "/contact",
        "/volunteer",
        "/testimonials",
        "/privacy",
        "/terms",
        "/donate",
        "/start-fundraiser",
        "/fundraiser-success",
        "/unsubscribe",
        "/thank-you",
      ];

      const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
      );

      if (isPublicRoute) {
        return true;
      }

      // Auth routes
      if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password") ||
        pathname.startsWith("/verify-email")
      ) {
        return true;
      }

      // Protected routes need login
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/portal") ||
        pathname.startsWith("/profile")
      ) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.role = session.role ?? token.role;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};
