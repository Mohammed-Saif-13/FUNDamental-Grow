import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkCsrf } from "@/lib/middleware";
import { sanitizeString } from "@/lib/utils/sanitize";
import { paiseToRupees } from "@/lib/utils/currency";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        campaigns: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            goalAmount: true,
            raisedAmount: true,
            image: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        donations: {
          select: {
            id: true,
            amount: true,
            createdAt: true,
            campaign: { select: { id: true, title: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { campaigns: true, donations: true } },
      },
    });

    if (!user) {
      return notFoundResponse("User not found");
    }

    const formattedUser = {
      ...user,
      campaigns: user.campaigns.map((c) => ({
        ...c,
        goalAmount: paiseToRupees(c.goalAmount),
        raisedAmount: paiseToRupees(c.raisedAmount),
      })),
      donations: user.donations.map((d) => ({
        ...d,
        amount: paiseToRupees(d.amount),
      })),
    };

    return successResponse(formattedUser);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return errorResponse("Failed to fetch profile", 500);
  }
}

export async function PUT(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    const data = await req.json();
    const updateData = {};

    if (data.name !== undefined) {
      const name = sanitizeString(data.name);
      if (!name || name.length < 2) {
        return errorResponse("Name must be at least 2 characters", 400);
      }
      updateData.name = name;
    }

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    if (data.currentPassword && data.newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user || !user.password) {
        return errorResponse("Cannot change password for OAuth users", 400);
      }

      const isValidPassword = await bcrypt.compare(
        data.currentPassword,
        user.password,
      );
      if (!isValidPassword) {
        return errorResponse("Current password is incorrect", 400);
      }

      if (data.newPassword.length < 8) {
        return errorResponse("New password must be at least 8 characters", 400);
      }

      updateData.password = await bcrypt.hash(data.newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, image: true, role: true },
    });

    return successResponse(updatedUser, "Profile updated successfully");
  } catch (error) {
    console.error("Failed to update profile:", error);
    if (error.code === "P2002") {
      return errorResponse("Email already exists", 400);
    }
    return errorResponse("Failed to update profile", 500);
  }
}
