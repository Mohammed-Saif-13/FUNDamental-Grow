import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import {
  sendVolunteerApprovedEmail,
  sendVolunteerRejectedEmail,
} from "@/lib/email";
import {
  logActivity,
  AuditAction,
  EntityType,
} from "@/lib/services/audit.service";
import {
  successResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        tasks: {
          include: {
            campaign: { select: { id: true, title: true, slug: true } },
          },
        },
      },
    });

    if (!volunteer) {
      return notFoundResponse("Volunteer not found");
    }

    return successResponse(volunteer);
  } catch (error) {
    console.error("Get volunteer error:", error);
    return errorResponse("Failed to fetch volunteer", 500);
  }
}

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const data = await req.json();

    if (
      data.status &&
      !["pending", "approved", "rejected"].includes(data.status)
    ) {
      return errorResponse("Invalid status", 400);
    }

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.skills && { skills: data.skills }),
        ...(data.availability && { availability: data.availability }),
      },
    });

    if (data.status === "approved") {
      if (volunteer.userId) {
        await prisma.user
          .update({
            where: { id: volunteer.userId },
            data: { role: "VOLUNTEER" },
          })
          .catch((err) => console.error("Failed to update user role:", err));
      }

      sendVolunteerApprovedEmail(volunteer).catch((err) =>
        console.error("Failed to send approval email:", err),
      );

      logActivity({
        userId: session.user.id,
        action: AuditAction.VOLUNTEER_APPROVED,
        entityType: EntityType.VOLUNTEER,
        entityId: id,
        details: {
          volunteerEmail: volunteer.email,
          volunteerName: volunteer.name,
        },
        req,
      });
    } else if (data.status === "rejected") {
      sendVolunteerRejectedEmail(volunteer, data.reason || null).catch((err) =>
        console.error("Failed to send rejection email:", err),
      );

      logActivity({
        userId: session.user.id,
        action: AuditAction.VOLUNTEER_REJECTED,
        entityType: EntityType.VOLUNTEER,
        entityId: id,
        details: {
          volunteerEmail: volunteer.email,
          volunteerName: volunteer.name,
          reason: data.reason || null,
        },
        req,
      });
    }

    return successResponse(volunteer, `Volunteer ${data.status} successfully`);
  } catch (error) {
    console.error("Update volunteer error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Volunteer not found");
    }
    return errorResponse("Failed to update volunteer", 500);
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    await prisma.volunteer.delete({ where: { id } });

    return successResponse(null, "Volunteer deleted successfully");
  } catch (error) {
    console.error("Delete volunteer error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Volunteer not found");
    }
    return errorResponse("Failed to delete volunteer", 500);
  }
}
