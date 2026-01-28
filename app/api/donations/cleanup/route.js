import { auth } from "@/lib/auth";
import { cleanupStalePendingDonations } from "@/lib/services/donation.service";
import { checkCsrf } from "@/lib/middleware";
import {
  successResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api-response";

export async function DELETE(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const result = await cleanupStalePendingDonations();

    return successResponse(
      { deletedCount: result.deletedCount },
      `Cleaned up ${result.deletedCount} stale pending donations`,
    );
  } catch (error) {
    console.error("Cleanup error:", error);
    return errorResponse("Failed to cleanup donations", 500);
  }
}
