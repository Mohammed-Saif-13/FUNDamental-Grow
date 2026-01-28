import { auth } from "@/lib/auth";
import { getAllStats } from "@/lib/services/stats.service";
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

    const stats = await getAllStats();

    return successResponse(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return errorResponse("Failed to fetch stats", 500);
  }
}
