import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { sanitizeString } from "@/lib/utils/sanitize";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const updates = await prisma.campaignUpdate.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(updates);
  } catch (error) {
    console.error("Fetch updates error:", error);
    return errorResponse("Failed to fetch updates", 500);
  }
}

export async function POST(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("Authentication required");
    }

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, userId: true, title: true },
    });

    if (!campaign) {
      return notFoundResponse("Campaign not found");
    }

    const isOwner = campaign.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return forbiddenResponse(
        "You can only post updates to your own campaigns",
      );
    }

    const data = await req.json();
    const title = sanitizeString(data.title);
    const content = sanitizeString(data.content);

    if (!title || title.length < 5) {
      return errorResponse("Title must be at least 5 characters", 400);
    }

    if (!content || content.length < 20) {
      return errorResponse("Content must be at least 20 characters", 400);
    }

    if (title.length > 100) {
      return errorResponse("Title cannot exceed 100 characters", 400);
    }

    if (content.length > 2000) {
      return errorResponse("Content cannot exceed 2000 characters", 400);
    }

    const update = await prisma.campaignUpdate.create({
      data: {
        title: title,
        content: content,
        campaignId: id,
      },
    });

    return successResponse(update, "Update posted successfully!", 201);
  } catch (error) {
    console.error("Create update error:", error);
    return errorResponse("Failed to create update", 500);
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("Authentication required");
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const updateId = searchParams.get("updateId");

    if (!updateId) {
      return errorResponse("Update ID is required", 400);
    }

    const update = await prisma.campaignUpdate.findUnique({
      where: { id: updateId },
      include: { campaign: { select: { userId: true } } },
    });

    if (!update) {
      return notFoundResponse("Update not found");
    }

    const isOwner = update.campaign.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return forbiddenResponse(
        "You can only delete updates from your own campaigns",
      );
    }

    await prisma.campaignUpdate.delete({ where: { id: updateId } });

    return successResponse(null, "Update deleted successfully");
  } catch (error) {
    console.error("Delete update error:", error);
    return errorResponse("Failed to delete update", 500);
  }
}
