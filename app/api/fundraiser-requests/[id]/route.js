import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import {
  updateRequestStatus,
  deleteRequest,
} from "@/lib/services/fundraiser-request.service";
import { createCampaign } from "@/lib/services/campaign.service";
import {
  logActivity,
  AuditAction,
  EntityType,
} from "@/lib/services/audit.service";
import {
  sendFundraiserApprovedEmail,
  sendFundraiserRejectedEmail,
} from "@/lib/email";
import { APIError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const request = await prisma.fundraiserRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return notFoundResponse("Request not found");
    }

    return successResponse(request);
  } catch (error) {
    console.error("Failed to fetch request:", error);
    return errorResponse("Failed to fetch request", 500);
  }
}

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const data = await req.json();

    if (!data.status || !["approved", "rejected"].includes(data.status)) {
      return errorResponse("Invalid status", 400);
    }

    const request = await prisma.fundraiserRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return notFoundResponse("Request not found");
    }

    if (request.status !== "pending") {
      return errorResponse("Request already processed", 400);
    }

    // APPROVE: Create campaign
    if (data.status === "approved") {
      // Use values from original request if not provided
      const endDate = data.endDate || request.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const story = data.story || request.story || request.description;
      const image = data.image || request.image;
      const location = data.location || request.location;

      if (!image) {
        return errorResponse("Campaign image is required", 400);
      }

      let user = await prisma.user.findUnique({
        where: { email: request.email },
      });

      const userId = user?.id || session.user.id;

      const campaign = await createCampaign(
        {
          title: request.title,
          category: request.category,
          goalAmount: request.goalAmount,
          endDate: endDate,
          description: request.description,
          story: story,
          image: image,
          organizerName: request.name,
          organizerEmail: request.email,
          organizerPhone: request.phone || "",
          location: location || "India",
          featured: data.featured || false,
        },
        userId,
      );

      const result = await updateRequestStatus(id, { status: "approved" });

      sendFundraiserApprovedEmail({
        email: request.email,
        name: request.name,
        campaignTitle: campaign.title,
        campaignSlug: campaign.slug,
      }).catch((err) => console.error("Failed to send approval email:", err));

      logActivity({
        userId: session.user.id,
        action: AuditAction.FUNDRAISER_APPROVED,
        entityType: EntityType.CAMPAIGN,
        entityId: campaign.id,
        details: {
          requestId: id,
          campaignTitle: campaign.title,
          requesterEmail: request.email,
        },
        req,
      });

      return successResponse(
        { campaign, request: result.request },
        "Request approved and campaign created!",
      );
    }

    // REJECT: Just update status
    if (data.status === "rejected") {
      const result = await updateRequestStatus(id, {
        status: "rejected",
        rejectionReason: data.rejectionReason,
      });

      sendFundraiserRejectedEmail({
        email: request.email,
        name: request.name,
        campaignTitle: request.title,
        reason: data.rejectionReason || "Does not meet our guidelines",
      }).catch((err) => console.error("Failed to send rejection email:", err));

      logActivity({
        userId: session.user.id,
        action: AuditAction.FUNDRAISER_REJECTED,
        entityType: EntityType.USER,
        entityId: id,
        details: {
          requestTitle: request.title,
          requesterEmail: request.email,
          reason: data.rejectionReason,
        },
        req,
      });

      return successResponse(result.request, "Request rejected");
    }
  } catch (error) {
    console.error("Failed to update request:", error);

    if (error instanceof APIError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Failed to update request", 500);
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
    const result = await deleteRequest(id);

    logActivity({
      userId: session.user.id,
      action: AuditAction.FUNDRAISER_DELETED,
      entityType: EntityType.USER,
      entityId: id,
      details: {
        deletedEmail: result.deletedEmail,
        deletedTitle: result.deletedTitle,
      },
      req,
    });

    return successResponse(null, "Request deleted successfully");
  } catch (error) {
    console.error("Failed to delete request:", error);

    if (error instanceof APIError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Failed to delete request", 500);
  }
}
