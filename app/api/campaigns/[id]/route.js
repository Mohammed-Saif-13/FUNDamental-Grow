import { NextResponse } from "next/server";
import {
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "@/lib/services/campaign.service";
import { withAuth } from "@/lib/middleware/auth";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { auth } from "@/lib/auth";
import {
  sendCampaignApprovedEmail,
  sendCampaignRejectedEmail,
} from "@/lib/email";
import {
  logActivity,
  AuditAction,
  EntityType,
} from "@/lib/services/audit.service";

export async function GET(req, { params }) {
  const rateLimitError = checkRateLimit(req, "general", "campaign-detail");
  if (rateLimitError) return rateLimitError;

  try {
    const { id } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 },
      );
    }

    const session = await auth();
    const isOwner = session?.user?.id === campaign.userId;
    const isAdmin = session?.user?.role === "ADMIN";

    if (!campaign.isPublic && !isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, campaign },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch campaign" },
      { status: 500 },
    );
  }
}

const putHandler = async (req, { params }) => {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const { id } = await params;
    const data = await req.json();

    const result = await updateCampaign(id, data, req.session);

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status },
      );
    }

    if (result.statusChanged && req.session.user.role === "ADMIN") {
      const { campaign, oldStatus } = result;

      if (oldStatus !== "active" && data.status === "active") {
        sendCampaignApprovedEmail(campaign, campaign.user).catch((err) =>
          console.error("Failed to send approval email:", err),
        );
        logActivity({
          userId: req.session.user.id,
          action: AuditAction.CAMPAIGN_APPROVED,
          entityType: EntityType.CAMPAIGN,
          entityId: id,
          details: { campaignTitle: campaign.title, oldStatus },
          req,
        });
      } else if (oldStatus !== "rejected" && data.status === "rejected") {
        sendCampaignRejectedEmail(
          campaign,
          campaign.user,
          data.rejectionReason || "Campaign policy violation",
        ).catch((err) => console.error("Failed to send rejection email:", err));
        logActivity({
          userId: req.session.user.id,
          action: AuditAction.CAMPAIGN_REJECTED,
          entityType: EntityType.CAMPAIGN,
          entityId: id,
          details: {
            campaignTitle: campaign.title,
            oldStatus,
            reason: data.rejectionReason || "Campaign policy violation",
          },
          req,
        });
      }
    }

    return NextResponse.json({ success: true, campaign: result.campaign });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update campaign" },
      { status: 500 },
    );
  }
};

const deleteHandler = async (req, { params }) => {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const { id } = await params;

    const campaign = await getCampaignById(id);
    const campaignTitle = campaign?.title;

    const result = await deleteCampaign(id, req.session);

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status },
      );
    }

    logActivity({
      userId: req.session.user.id,
      action: AuditAction.CAMPAIGN_DELETED,
      entityType: EntityType.CAMPAIGN,
      entityId: id,
      details: { campaignTitle },
      req,
    });

    return NextResponse.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete campaign" },
      { status: 500 },
    );
  }
};

export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
