import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { sanitizeString } from "@/lib/utils/sanitize";
import {
  successResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api-response";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const data = await req.json();

    if (!data.title || !data.description || !data.volunteerId) {
      return errorResponse("Missing required fields", 400);
    }

    const task = await prisma.volunteerTask.create({
      data: {
        title: sanitizeString(data.title),
        description: sanitizeString(data.description),
        type: data.type || "general",
        priority: data.priority || "medium",
        status: "pending",
        volunteerId: data.volunteerId,
        campaignId: data.campaignId || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return successResponse(task, "Task created successfully", 201);
  } catch (error) {
    console.error("Create task error:", error);
    return errorResponse("Failed to create task", 500);
  }
}
