import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  successResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit")) || 50;

    const where = {};
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { campaigns: true, donations: true } },
      },
    });

    return successResponse(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}
