import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function withAuth(handler) {
  return async (req, context) => {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    req.session = session;
    return handler(req, context);
  };
}

export function withAdminAuth(handler) {
  return async (req, context) => {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 },
      );
    }

    req.session = session;
    return handler(req, context);
  };
}

export function withOwnerOrAdmin(resourceGetter) {
  return (handler) => {
    return async (req, context) => {
      const session = await auth();

      if (!session || !session.user) {
        return NextResponse.json(
          { success: false, message: "Authentication required" },
          { status: 401 },
        );
      }

      const resource = await resourceGetter(req, context);

      if (!resource) {
        return NextResponse.json(
          { success: false, message: "Resource not found" },
          { status: 404 },
        );
      }

      const isOwner = resource.userId === session.user.id;
      const isAdmin = session.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access" },
          { status: 403 },
        );
      }

      req.session = session;
      req.resource = resource;
      req.isOwner = isOwner;
      req.isAdmin = isAdmin;

      return handler(req, context);
    };
  };
}
