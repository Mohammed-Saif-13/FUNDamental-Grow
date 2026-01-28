import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { sanitizeString } from "@/lib/utils/sanitize";
import {
  successResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return forbiddenResponse("Authentication required");
    }

    const { id } = await params;

    const task = await prisma.volunteerTask.findUnique({
      where: { id },
      include: {
        volunteer: { select: { id: true, name: true, email: true } },
        campaign: { select: { id: true, title: true, slug: true } },
      },
    });

    if (!task) {
      return notFoundResponse("Task not found");
    }

    const isAdmin = session.user.role === "ADMIN";
    const isVolunteer = session.user.role === "VOLUNTEER";

    if (!isAdmin && !isVolunteer) {
      return forbiddenResponse("Access denied");
    }

    return successResponse(task);
  } catch (error) {
    console.error("Get task error:", error);
    return errorResponse("Failed to fetch task", 500);
  }
}

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session) {
      return forbiddenResponse("Authentication required");
    }

    const { id } = await params;
    const data = await req.json();

    const task = await prisma.volunteerTask.findUnique({
      where: { id },
      include: { volunteer: { select: { userId: true } } },
    });

    if (!task) {
      return notFoundResponse("Task not found");
    }

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = task.volunteer.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return forbiddenResponse("Access denied");
    }

    const updateData = {};

    // Volunteer can only update status
    if (isOwner && !isAdmin) {
      if (
        data.status &&
        ["pending", "in_progress", "completed"].includes(data.status)
      ) {
        updateData.status = data.status;
      }
    }

    // Admin can update everything
    if (isAdmin) {
      if (data.title) updateData.title = sanitizeString(data.title);
      if (data.description)
        updateData.description = sanitizeString(data.description);
      if (data.status) updateData.status = data.status;
      if (data.priority) updateData.priority = data.priority;
      if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    }

    const updatedTask = await prisma.volunteerTask.update({
      where: { id },
      data: updateData,
    });

    return successResponse(updatedTask, "Task updated successfully");
  } catch (error) {
    console.error("Update task error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Task not found");
    }
    return errorResponse("Failed to update task", 500);
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;

    await prisma.volunteerTask.delete({ where: { id } });

    return successResponse(null, "Task deleted successfully");
  } catch (error) {
    console.error("Delete task error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Task not found");
    }
    return errorResponse("Failed to delete task", 500);
  }
}
