import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  forbiddenResponse,
} from "@/lib/api-response";

export async function DELETE(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;

    await prisma.newsletter.delete({
      where: { id },
    });

    return successResponse(null, "Subscriber removed successfully");
  } catch (error) {
    console.error("Delete newsletter error:", error);
    return errorResponse("Failed to remove subscriber");
  }
}
